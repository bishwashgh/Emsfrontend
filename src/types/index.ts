export type Role = 'CUSTOMER' | 'PROVIDER' | 'MANAGER' | 'ADMIN'

export interface User {
  id: number
  name: string
  email: string
  role: Role
  isTfaEnabled?: boolean
  googleId?: string | null
}

export type VenueType = 'conferencehall' | 'outdoor'

export interface Venue {
  id: number
  name: string
  type: VenueType
  capacity: number
  description?: string | null
  email: string
  phone: string
  address: string
  basePrice: number
  images: string[]
}

export type BookingStatus = 'pending_payment' | 'confirmed' | 'cancelled'

export interface Booking {
  id: number
  user?: User
  venue?: Venue
  venueId?: number
  startDate: string
  endDate: string
  days: number
  amount: number
  status: BookingStatus
  createdAt: string
  updatedAt: string
}

export type PaymentProvider = 'esewa' | 'khalti'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled'

export interface Payment {
  id: number
  booking?: Booking
  user?: User
  provider: PaymentProvider
  amount: number
  status: PaymentStatus
  gatewayRef?: string | null
  createdAt: string
  updatedAt: string
}

export interface ApiError {
  message: string
  statusCode?: number
  error?: string
}
