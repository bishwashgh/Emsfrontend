import { api } from './api'
import type { Booking } from '../types'

export interface CreateBookingPayload {
  venueId: number
  startDate: string
  endDate: string
}

export const bookingsApi = {
  create: async (data: CreateBookingPayload) => (await api.post<Booking>('/bookings', data)).data,
  get: async (id: number | string) => (await api.get<Booking>(`/bookings/${id}`)).data,
  listMine: async () => (await api.get<Booking[]>('/bookings')).data,
  cancel: async (id: number | string) => (await api.patch<Booking>(`/bookings/${id}`, { status: 'cancelled' })).data,
}
