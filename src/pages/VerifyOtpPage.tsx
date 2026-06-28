import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { normalizeError } from '../lib/api'

export default function VerifyOtpPage() {
  const { verifyOtp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [challengeId, setChallengeId] = useState('')
  const [email, setEmail] = useState('')
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [debugOtp, setDebugOtp] = useState('')

  useEffect(() => {
    if (location.state?.challengeId) {
      setChallengeId(location.state.challengeId)
      setEmail(location.state.email || 'your email')
    } else {
      navigate('/sign-up')
    }

    // Check if OTP was logged in console
    // For development, you can manually enter the OTP from backend logs
    console.log('🔑 Check your backend console for the OTP')
    console.log('📧 Or check your email')

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [location, navigate])

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP code')
      return
    }

    setLoading(true)
    try {
      await verifyOtp(challengeId, otp)
      navigate('/sign-in', { state: { message: 'Email verified successfully! Please sign in.' } })
    } catch (err) {
      setError(normalizeError(err).message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = () => {
    setError('Please check your email. If you don\'t see the OTP, check the backend console for the OTP code.')
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(value)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8 animate-slide-up">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
              <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Verify your email</h1>
            <p className="mt-1 text-sm text-slate-500">
              We've sent a 6-digit verification code to <strong className="text-slate-700">{email}</strong>
            </p>
          </div>

          {/* Debug info for development */}
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
            <p className="font-semibold">🔑 Development Mode</p>
            <p className="mt-1">Check your backend console for the OTP code.</p>
            <p className="text-xs mt-1">The email might be in your spam folder or Mailtrap inbox.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-error-100 bg-error-50 px-4 py-3 text-sm text-error-700">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="label" htmlFor="otp">Verification Code</label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={otp}
                onChange={handleOtpChange}
                className="input text-center text-2xl tracking-[0.5em] font-mono"
                placeholder="000000"
                maxLength={6}
                autoFocus
                required
              />
              <p className="mt-1 text-xs text-slate-400">Enter the 6-digit code sent to your email</p>
            </div>

            <button type="submit" disabled={loading || otp.length < 6} className="btn-primary w-full">
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Didn't receive the code?{' '}
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Resend Code
                </button>
              ) : (
                <span className="text-slate-400">Resend available in {timer}s</span>
              )}
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-400">
              <span className="font-medium">Note:</span> Check your spam folder if you don't see the email.
            </p>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4 text-center">
            <Link to="/sign-in" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
              ← Back to Sign In
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link to="/sign-up" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              Didn't receive the code? Try signing up again
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}