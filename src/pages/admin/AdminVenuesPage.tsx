import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { venuesApi, type CreateVenuePayload } from '../../lib/venuesApi'
import { imageUrl, normalizeError } from '../../lib/api'
import type { Venue, VenueType } from '../../types'
import { Modal } from '../../components/Modal'
import { LoadingState, ErrorState, EmptyState } from '../../components/Feedback'

const emptyForm: CreateVenuePayload = { name: '', type: 'conferencehall', capacity: 100, description: '', email: '', phone: '', address: '', basePrice: 1000 }

export default function AdminVenuesPage() {
  const qc = useQueryClient()
  const { data: venues, isLoading, isError, refetch } = useQuery({ queryKey: ['venues'], queryFn: venuesApi.list })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Venue | null>(null)
  const [form, setForm] = useState<CreateVenuePayload>(emptyForm)
  const [images, setImages] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImages([]); setError(''); setModalOpen(true) }
  const openEdit = (v: Venue) => {
    setEditing(v)
    setForm({ name: v.name, type: v.type, capacity: v.capacity, description: v.description ?? '', email: v.email, phone: v.phone, address: v.address, basePrice: v.basePrice })
    setImages([]); setError(''); setModalOpen(true)
  }
  const update = (k: keyof CreateVenuePayload, v: string | number) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      if (editing) await venuesApi.update(editing.id, form)
      else await venuesApi.create(form, images)
      qc.invalidateQueries({ queryKey: ['venues'] })
      setModalOpen(false)
    } catch (err) { setError(normalizeError(err).message) }
    finally { setSaving(false) }
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this venue? This cannot be undone.')) return
    await venuesApi.remove(id)
    qc.invalidateQueries({ queryKey: ['venues'] })
  }

  return (
    <div className="container-app py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Manage venues</h1>
          <p className="mt-2 text-slate-500">Create, edit, and remove venue listings.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          New venue
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <Link to="/admin/venues" className="badge bg-primary-50 text-primary-700">Venues</Link>
        <Link to="/admin/users" className="badge bg-slate-100 text-slate-600 hover:bg-slate-200">Users</Link>
      </div>

      {isLoading ? <LoadingState /> : isError ? <ErrorState message="Could not load venues." onRetry={refetch} /> : !venues?.length ? (
        <div className="card mt-8"><EmptyState title="No venues yet" action={<button onClick={openCreate} className="btn-primary">Create your first venue</button>} /></div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-3 font-semibold">Venue</th><th className="px-4 py-3 font-semibold">Type</th><th className="px-4 py-3 font-semibold">Capacity</th><th className="px-4 py-3 font-semibold">Price/day</th><th className="px-4 py-3 text-right font-semibold">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {venues.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">{v.images?.[0] && <img src={imageUrl(v.images[0])} alt="" className="h-full w-full object-cover" />}</div>
                      <div><div className="font-medium text-slate-900">{v.name}</div><div className="text-xs text-slate-500">{v.address}</div></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600">{v.type === 'conferencehall' ? 'Conference Hall' : 'Outdoor'}</td>
                  <td className="px-4 py-3 text-slate-600">{v.capacity}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">Rs {v.basePrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(v)} className="btn-ghost text-xs">Edit</button>
                      <button onClick={() => remove(v.id)} className="btn-ghost text-xs text-error-600 hover:bg-error-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit venue' : 'New venue'} size="lg">
        {error && <div className="mb-4 rounded-lg border border-error-100 bg-error-50 px-4 py-3 text-sm text-error-700">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Name</label><input required value={form.name} onChange={(e) => update('name', e.target.value)} className="input" /></div>
            <div><label className="label">Type</label><select value={form.type} onChange={(e) => update('type', e.target.value as VenueType)} className="input"><option value="conferencehall">Conference Hall</option><option value="outdoor">Outdoor</option></select></div>
            <div><label className="label">Capacity</label><input type="number" min={1} required value={form.capacity} onChange={(e) => update('capacity', Number(e.target.value))} className="input" /></div>
            <div><label className="label">Base price / day (Rs)</label><input type="number" min={0} required value={form.basePrice} onChange={(e) => update('basePrice', Number(e.target.value))} className="input" /></div>
            <div><label className="label">Email</label><input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="input" /></div>
            <div><label className="label">Phone</label><input required value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input" /></div>
          </div>
          <div><label className="label">Address</label><input required value={form.address} onChange={(e) => update('address', e.target.value)} className="input" /></div>
          <div><label className="label">Description</label><textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} className="input" /></div>
          {!editing && (
            <div><label className="label">Images (max 4, 5MB each)</label><input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files ?? []))} className="input" />{images.length > 0 && <p className="mt-1 text-xs text-slate-400">{images.length} file(s) selected</p>}</div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save venue'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
