import type { Contact, View, TransferDirection } from './types'

let contactList: Contact[] = $state([])
let query: string = $state('')
let view: View = $state('welcome')
let dir: TransferDirection = $state(null)

export const contacts = {
  get value() {
    return contactList
  },
  set value(v: Contact[]) {
    contactList = v
  }
}

export const searchQuery = {
  get value() {
    return query
  },
  set value(v: string) {
    query = v
  }
}

export const currentView = {
  get value() {
    return view
  },
  set value(v: View) {
    view = v
  }
}

export const transferDirection = {
  get value() {
    return dir
  },
  set value(v: TransferDirection) {
    dir = v
  }
}

export const filteredContacts: { readonly value: Contact[] } = {
  get value() {
    if (!query.trim()) return contactList

    const lower = query.toLowerCase().trim()
    return contactList.filter((c) => {
      const nameMatch = c.fullName.toLowerCase().includes(lower)
      const phoneMatch = c.phones.some((p) => p.number.includes(lower))
      const emailMatch = c.emails.some((e) => e.address.toLowerCase().includes(lower))
      return nameMatch || phoneMatch || emailMatch
    })
  }
}

export const stats: { readonly value: { total: number; selected: number; duplicateCount: number } } =
  {
    get value() {
      const total = contactList.length
      const selected = contactList.filter((c) => c.selected).length
      const duplicateCount = findDuplicates().reduce((sum, group) => sum + group.length - 1, 0)
      return { total, selected, duplicateCount }
    }
  }

export function addContacts(newContacts: Contact[]): void {
  contactList.push(...newContacts)
  view = 'contacts'
}

export function removeContact(id: string): void {
  contactList = contactList.filter((c) => c.id !== id)
}

export function toggleSelect(id: string): void {
  const contact = contactList.find((c) => c.id === id)
  if (contact) {
    contact.selected = !contact.selected
  }
}

export function selectAll(): void {
  for (const contact of contactList) {
    contact.selected = true
  }
}

export function deselectAll(): void {
  for (const contact of contactList) {
    contact.selected = false
  }
}

export function findDuplicates(): Contact[][] {
  const phoneGroups = new Map<string, Contact[]>()
  const nameGroups = new Map<string, Contact[]>()

  for (const contact of contactList) {
    for (const phone of contact.phones) {
      const normalized = phone.number.replace(/\D/g, '')
      if (!normalized) continue
      const group = phoneGroups.get(normalized)
      if (group) {
        if (!group.includes(contact)) {
          group.push(contact)
        }
      } else {
        phoneGroups.set(normalized, [contact])
      }
    }

    const normalizedName = contact.fullName.toLowerCase().trim()
    if (normalizedName) {
      const group = nameGroups.get(normalizedName)
      if (group) {
        if (!group.includes(contact)) {
          group.push(contact)
        }
      } else {
        nameGroups.set(normalizedName, [contact])
      }
    }
  }

  const seen = new Set<string>()
  const result: Contact[][] = []

  for (const group of phoneGroups.values()) {
    if (group.length > 1) {
      const key = group
        .map((c) => c.id)
        .sort()
        .join(',')
      if (!seen.has(key)) {
        seen.add(key)
        result.push(group)
      }
    }
  }

  for (const group of nameGroups.values()) {
    if (group.length > 1) {
      const key = group
        .map((c) => c.id)
        .sort()
        .join(',')
      if (!seen.has(key)) {
        seen.add(key)
        result.push(group)
      }
    }
  }

  return result
}

export function removeDuplicates(): void {
  const duplicateGroups = findDuplicates()
  const idsToRemove = new Set<string>()

  for (const group of duplicateGroups) {
    for (let i = 1; i < group.length; i++) {
      idsToRemove.add(group[i].id)
    }
  }

  contactList = contactList.filter((c) => !idsToRemove.has(c.id))
}

export function updateContact(updated: Contact): void {
  const index = contactList.findIndex((c) => c.id === updated.id)
  if (index !== -1) {
    contactList[index] = updated
  }
}

export function clearContacts(): void {
  contactList = []
  query = ''
  dir = null
  view = 'welcome'
}
