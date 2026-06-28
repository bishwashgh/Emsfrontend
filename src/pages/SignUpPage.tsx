import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { normalizeError } from '../lib/api'

export default function SignUpPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      const result = await signUp(form.name, form.email, form.password, form.confirmPassword)
      // Navigate to OTP verification page with challengeId and email
      navigate('/verify-otp', { 
        state: { 
          challengeId: result.challengeId, 
          email: form.email 
        } 
      })
    } catch (err) {
      setError(normalizeError(err).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8 animate-slide-up">
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-1 text-sm text-slate-500">Start booking venues in minutes.</p>
          </div>
          {error && <div className="mb-4 rounded-lg border border-error-100 bg-error-50 px-4 py-3 text-sm text-error-700">{error}</div>}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="name">Full name</label>
              <input 
                id="name" 
                required 
                minLength={2} 
                value={form.name} 
                onChange={update('name')} 
                className="input" 
                placeholder="Jane Doe" 
              />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input 
                id="email" 
                type="email" 
                required 
                value={form.email} 
                onChange={update('email')} 
                className="input" 
                placeholder="you@example.com" 
              />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input 
                id="password" 
                type="password" 
                required 
                value={form.password} 
                onChange={update('password')} 
                className="input" 
                placeholder="Min. 10 characters" 
              />
              <p className="mt-1 text-xs text-slate-400">At least 10 chars, 1 uppercase, 1 lowercase, 1 number.</p>
            </div>
            <div>
              <label className="label" htmlFor="confirmPassword">Confirm password</label>
              <input 
                id="confirmPassword" 
                type="password" 
                required 
                value={form.confirmPassword} 
                onChange={update('confirmPassword')} 
                className="input" 
                placeholder="Re-enter password" 
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link to="/sign-in" className="font-semibold text-primary-600 hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}