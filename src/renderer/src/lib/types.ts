export interface Phone {
  type: string
  number: string
}

export interface Email {
  type: string
  address: string
}

export interface Address {
  type: string
  street: string
  city: string
  state: string
  zip: string
  country: string
}

export interface Contact {
  id: string
  firstName: string
  lastName: string
  fullName: string
  phones: Phone[]
  emails: Email[]
  organization: string
  title: string
  addresses: Address[]
  selected: boolean
}

export type View = 'welcome' | 'contacts' | 'export'

export type TransferDirection = 'android-to-iphone' | 'iphone-to-android' | null
