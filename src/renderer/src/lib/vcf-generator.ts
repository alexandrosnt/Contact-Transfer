import type { Contact } from './types'

function escapeValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function escapeSemiValue(value: string): string {
  // For structured values (N, ADR) where semicolons are delimiters
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function generateVCard(contact: Contact): string {
  const lines: string[] = []

  lines.push('BEGIN:VCARD')
  lines.push('VERSION:3.0')

  // N: LastName;FirstName;;;
  const lastName = escapeSemiValue(contact.lastName)
  const firstName = escapeSemiValue(contact.firstName)
  lines.push(`N:${lastName};${firstName};;;`)

  // FN
  lines.push(`FN:${escapeValue(contact.fullName)}`)

  // TEL
  for (const phone of contact.phones) {
    const type = phone.type || 'CELL'
    lines.push(`TEL;TYPE=${type}:${phone.number}`)
  }

  // EMAIL
  for (const email of contact.emails) {
    const type = email.type || 'HOME'
    lines.push(`EMAIL;TYPE=${type}:${email.address}`)
  }

  // ORG
  if (contact.organization) {
    lines.push(`ORG:${escapeValue(contact.organization)}`)
  }

  // TITLE
  if (contact.title) {
    lines.push(`TITLE:${escapeValue(contact.title)}`)
  }

  // ADR
  for (const addr of contact.addresses) {
    const type = addr.type || 'HOME'
    const parts = [
      '', // PO Box
      '', // Extended
      escapeSemiValue(addr.street),
      escapeSemiValue(addr.city),
      escapeSemiValue(addr.state),
      escapeSemiValue(addr.zip),
      escapeSemiValue(addr.country)
    ]
    lines.push(`ADR;TYPE=${type}:${parts.join(';')}`)
  }

  lines.push('END:VCARD')

  return lines.join('\r\n')
}

export function generateVCF(contacts: Contact[]): string {
  return contacts.map(generateVCard).join('\r\n')
}
