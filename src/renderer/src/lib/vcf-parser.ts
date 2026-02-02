import type { Contact, Phone, Email, Address } from './types'

let idCounter = 0

function nextId(): string {
  return `contact-${++idCounter}-${Date.now()}`
}

function unfoldLines(raw: string): string {
  // vCard line folding: a line starting with space or tab is a continuation
  return raw.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '')
}

function extractParam(params: string, key: string): string {
  const regex = new RegExp(`(?:^|;)${key}=([^;:]+)`, 'i')
  const match = params.match(regex)
  return match ? match[1].toUpperCase() : ''
}

function getType(params: string): string {
  const typeVal = extractParam(params, 'TYPE')
  if (typeVal) {
    // TYPE can have comma-separated values like TYPE=CELL,VOICE
    const parts = typeVal.split(',')
    // Prefer meaningful types
    for (const p of parts) {
      const t = p.trim().toUpperCase()
      if (['CELL', 'MOBILE', 'HOME', 'WORK', 'FAX', 'PAGER', 'MAIN'].includes(t)) return t
    }
    return parts[0].trim()
  }
  // Check for old-style TYPE without key (e.g., TEL;CELL:...)
  const parts = params.split(';')
  for (const p of parts) {
    const t = p.trim().toUpperCase()
    if (['CELL', 'MOBILE', 'HOME', 'WORK', 'FAX', 'PAGER', 'MAIN'].includes(t)) return t
  }
  return 'OTHER'
}

function decodeValue(value: string, params: string): string {
  const encoding = extractParam(params, 'ENCODING')
  const charset = extractParam(params, 'CHARSET') || 'UTF-8'

  if (encoding === 'QUOTED-PRINTABLE') {
    try {
      // Remove soft line breaks first
      const cleaned = value.replace(/=\r?\n/g, '')
      // Collect raw bytes then decode as UTF-8
      const bytes: number[] = []
      let i = 0
      while (i < cleaned.length) {
        if (cleaned[i] === '=' && i + 2 < cleaned.length && /[0-9A-Fa-f]{2}/.test(cleaned.substring(i + 1, i + 3))) {
          bytes.push(parseInt(cleaned.substring(i + 1, i + 3), 16))
          i += 3
        } else {
          bytes.push(cleaned.charCodeAt(i))
          i++
        }
      }
      return new TextDecoder('utf-8').decode(new Uint8Array(bytes))
    } catch {
      return value
    }
  }

  if (encoding === 'BASE64' || encoding === 'B') {
    try {
      return atob(value)
    } catch {
      return value
    }
  }

  return value
}

function parseVCard(lines: string[]): Contact | null {
  let firstName = ''
  let lastName = ''
  let fullName = ''
  const phones: Phone[] = []
  const emails: Email[] = []
  const addresses: Address[] = []
  let organization = ''
  let title = ''

  for (const line of lines) {
    // Split property name+params from value
    // Handle lines like: TEL;TYPE=CELL:+1234567890
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue

    const propPart = line.substring(0, colonIdx)
    const value = line.substring(colonIdx + 1).trim()
    const [propName, ...paramParts] = propPart.split(';')
    const params = paramParts.join(';')
    const prop = propName.toUpperCase()

    const decoded = decodeValue(value, params)

    switch (prop) {
      case 'N': {
        // N:LastName;FirstName;MiddleName;Prefix;Suffix
        const parts = decoded.split(';')
        lastName = (parts[0] || '').trim()
        firstName = (parts[1] || '').trim()
        break
      }
      case 'FN':
        fullName = decoded.trim()
        break
      case 'TEL': {
        const num = decoded.trim()
        if (num) {
          phones.push({ type: getType(params), number: num })
        }
        break
      }
      case 'EMAIL': {
        const addr = decoded.trim()
        if (addr) {
          emails.push({ type: getType(params), address: addr })
        }
        break
      }
      case 'ORG':
        organization = decoded.split(';')[0].trim()
        break
      case 'TITLE':
        title = decoded.trim()
        break
      case 'ADR': {
        // ADR:POBox;Extended;Street;City;State;Zip;Country
        const parts = decoded.split(';')
        const addr: Address = {
          type: getType(params),
          street: (parts[2] || '').trim(),
          city: (parts[3] || '').trim(),
          state: (parts[4] || '').trim(),
          zip: (parts[5] || '').trim(),
          country: (parts[6] || '').trim()
        }
        if (addr.street || addr.city || addr.state || addr.zip || addr.country) {
          addresses.push(addr)
        }
        break
      }
    }
  }

  // Derive fullName if not provided
  if (!fullName) {
    fullName = [firstName, lastName].filter(Boolean).join(' ')
  }
  // Derive first/last from fullName if N field was missing
  if (!firstName && !lastName && fullName) {
    const parts = fullName.split(' ')
    firstName = parts[0] || ''
    lastName = parts.slice(1).join(' ')
  }

  // Skip empty contacts
  if (!fullName && phones.length === 0 && emails.length === 0) {
    return null
  }

  return {
    id: nextId(),
    firstName,
    lastName,
    fullName: fullName || 'Unknown',
    phones,
    emails,
    organization,
    title,
    addresses,
    selected: true
  }
}

export function parseVCF(vcfString: string): Contact[] {
  const unfolded = unfoldLines(vcfString)
  const lines = unfolded.split(/\r?\n/)
  const contacts: Contact[] = []
  let currentCard: string[] = []
  let inCard = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.toUpperCase() === 'BEGIN:VCARD') {
      inCard = true
      currentCard = []
    } else if (trimmed.toUpperCase() === 'END:VCARD') {
      if (inCard) {
        const contact = parseVCard(currentCard)
        if (contact) contacts.push(contact)
      }
      inCard = false
      currentCard = []
    } else if (inCard) {
      currentCard.push(trimmed)
    }
  }

  return contacts
}
