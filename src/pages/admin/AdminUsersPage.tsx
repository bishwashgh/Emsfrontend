import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api, normalizeError } from '../../lib/api'
import type { User } from '../../types'
import { LoadingState, ErrorState, EmptyState } from '../../components/Feedback'

export default function AdminUsersPage() {
  const { data: users, isLoading, isError, refetch } = useQuery<User[]>({ queryKey: ['admin-users'], queryFn: async () => (await api.get('/users')).data })
  const [removing, setRemoving] = useState<number | null>(null)
  const [error, setError] = useState('')

  const remove = async (id: number) => {
    if (!confirm('Delete this user? This cannot be undone.')) return
    setRemoving(id); setError('')
    try { await api.delete(`/users/${id}`); refetch() }
    catch (err) { setError(normalizeError(err).message) }
    finally { setRemoving(null) }
  }

  const roleBadge = (role: string) => {
    const map: Record<string, string> = { ADMIN: 'bg-primary-50 text-primary-700', MANAGER: 'bg-accent-50 text-accent-700', PROVIDER: 'bg-slate-100 text-slate-600', CUSTOMER: 'bg-success-50 text-success-700' }
    return map[role] ?? 'bg-slate-100 text-slate-600'
  }

  return (
    <div className="container-app py-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Manage users</h1>
        <p className="mt-2 text-slate-500">View and manage all registered users.</p>
      </div>
      <div className="mt-4 flex gap-2">
        <Link to="/admin/venues" className="badge bg-slate-100 text-slate-600 hover:bg-slate-200">Venues</Link>
        <Link to="/admin/users" className="badge bg-primary-50 text-primary-700">Users</Link>
      </div>

      {error && <div className="mt-4 rounded-lg border border-error-100 bg-error-50 px-4 py-3 text-sm text-error-700">{error}</div>}

      {isLoading ? <LoadingState /> : isError ? <ErrorState message="Could not load users." onRetry={refetch} /> : !users?.length ? (
        <div className="card mt-8"><EmptyState title="No users found" /></div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-3 font-semibold">User</th><th className="px-4 py-3 font-semibold">Email</th><th className="px-4 py-3 font-semibold">Role</th><th className="px-4 py-3 text-right font-semibold">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">{u.name?.charAt(0).toUpperCase()}</span>
                      <span className="font-medium text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3"><span className={`badge capitalize ${roleBadge(u.role)}`}>{u.role?.toLowerCase()}</span></td>
                  <td className="px-4 py-3 text-right"><button onClick={() => remove(u.id)} disabled={removing === u.id} className="btn-ghost text-xs text-error-600 hover:bg-error-50">{removing === u.id ? 'Deleting…' : 'Delete'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
