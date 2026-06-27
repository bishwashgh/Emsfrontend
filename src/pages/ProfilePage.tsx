import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { api, normalizeError } from '../lib/api'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      await api.patch(`/users/${user?.id}`, { name, email })
      await refreshUser()
      setMessage({ type: 'success', text: 'Profile updated successfully.' })
    } catch (err) {
      setMessage({ type: 'error', text: normalizeError(err).message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container-app py-10">
      <h1 className="font-display text-3xl font-bold text-slate-900">Your profile</h1>
      <p className="mt-2 text-slate-500">Manage your account details.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 font-display text-2xl font-bold text-primary-700">{user?.name?.charAt(0).toUpperCase() ?? 'U'}</div>
            <h2 className="mt-4 font-display text-lg font-semibold text-slate-900">{user?.name}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="badge mt-3 bg-primary-50 text-primary-700 capitalize">{user?.role?.toLowerCase()}</span>
          </div>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-slate-900">Edit details</h2>
          {message && <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${message.type === 'success' ? 'border border-success-50 bg-success-50 text-success-700' : 'border border-error-100 bg-error-50 text-error-700'}`}>{message.text}</div>}
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div><label className="label" htmlFor="name">Full name</label><input id="name" value={name} onChange={(e) => setName(e.target.value)} className="input" /></div>
            <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" /></div>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save changes'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
