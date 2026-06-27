import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { paymentsApi } from '../lib/paymentsApi'
import { normalizeError } from '../lib/api'
import { Spinner } from '../components/Feedback'

interface Props { provider: 'khalti' | 'esewa'; failed?: boolean }

export default function PaymentReturnPage({ provider, failed }: Props) {
  const [params] = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>(failed ? 'failed' : 'verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (failed) return
    let cancelled = false
    const verify = async () => {
      try {
        if (provider === 'khalti') {
          const pidx = params.get('pidx')
          if (!pidx) throw new Error('Missing payment reference.')
          await paymentsApi.verifyKhalti(pidx)
        }
        if (!cancelled) { setStatus('success'); setMessage('Your payment was successful and your booking is confirmed.') }
      } catch (err) {
        if (!cancelled) { setStatus('failed'); setMessage(normalizeError(err).message) }
      }
    }
    verify()
    return () => { cancelled = true }
  }, [provider, failed, params])

  return (
    <div className="container-app flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-md text-center">
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-4">
            <Spinner className="h-10 w-10 text-primary-500" />
            <h1 className="font-display text-xl font-semibold text-slate-900">Verifying your payment…</h1>
            <p className="text-sm text-slate-500">Please wait while we confirm with {provider}.</p>
          </div>
        )}
        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-50 text-success-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Payment successful</h1>
            <p className="text-sm text-slate-500">{message}</p>
            <div className="mt-2 flex gap-3"><Link to="/bookings" className="btn-primary">View my bookings</Link><Link to="/venues" className="btn-secondary">Browse more</Link></div>
          </div>
        )}
        {status === 'failed' && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error-50 text-error-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Payment failed</h1>
            <p className="text-sm text-slate-500">{message || 'Your payment could not be completed. Please try again.'}</p>
            <div className="mt-2 flex gap-3"><Link to="/bookings" className="btn-primary">Go to bookings</Link><Link to="/venues" className="btn-secondary">Browse venues</Link></div>
          </div>
        )}
      </div>
    </div>
  )
}
