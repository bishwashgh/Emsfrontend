import { api } from './api'
import type { Payment, PaymentProvider } from '../types'

export interface InitializePaymentPayload {
  bookingId: number
  provider: PaymentProvider
}

export interface InitializePaymentResponse {
  paymentUrl?: string
  pidx?: string
  pid?: string
  formData?: Record<string, string>
  payment?: Payment
}

export const paymentsApi = {
  initialize: async (data: InitializePaymentPayload) =>
    (await api.post<InitializePaymentResponse>('/payments/initialize', data)).data,
  verifyKhalti: async (pidx: string) => (await api.post('/payments/khalti/verify', { pidx })).data,
}
