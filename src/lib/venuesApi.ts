import { api } from './api'
import type { Venue } from '../types'

export interface CreateVenuePayload {
  name: string
  type: Venue['type']
  capacity: number
  description?: string
  email: string
  phone: string
  address: string
  basePrice: number
}

export const venuesApi = {
  list: async () => (await api.get<Venue[]>('/venue')).data,
  get: async (id: number | string) => (await api.get<Venue>(`/venue/${id}`)).data,
  create: async (data: CreateVenuePayload, images: File[]) => {
    const form = new FormData()
    Object.entries(data).forEach(([k, v]) => form.append(k, String(v)))
    images.forEach((f) => form.append('images', f))
    return (await api.post<Venue>('/venue', form, { headers: { 'Content-Type': 'multipart/form-data' } })).data
  },
  update: async (id: number | string, data: Partial<CreateVenuePayload>) =>
    (await api.patch<Venue>(`/venue/${id}`, data)).data,
  remove: async (id: number | string) => { await api.delete(`/venue/${id}`) },
}
