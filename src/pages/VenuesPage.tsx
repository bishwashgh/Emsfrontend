import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { venuesApi } from '../lib/venuesApi'
import { imageUrl } from '../lib/api'
import type { VenueType } from '../types'
import { LoadingState, ErrorState, EmptyState } from '../components/Feedback'

type Filter = 'all' | VenueType

export default function VenuesPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const { data: venues, isLoading, isError, refetch } = useQuery({ queryKey: ['venues'], queryFn: venuesApi.list })

  const filtered = useMemo(() => {
    if (!venues) return []
    return venues.filter((v) => {
      const matchType = filter === 'all' || v.type === filter
      const q = search.trim().toLowerCase()
      const matchSearch = !q || v.name.toLowerCase().includes(q) || v.address.toLowerCase().includes(q)
      return matchType && matchSearch
    })
  }, [venues, filter, search])

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All venues' },
    { key: 'conferencehall', label: 'Conference halls' },
    { key: 'outdoor', label: 'Outdoor' },
  ]

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">Find your venue</h1>
        <p className="mt-2 text-slate-500">Browse all available spaces and book the one that fits your event.</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or location…" className="input pl-10" />
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${filter === f.key ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{f.label}</button>
          ))}
        </div>
      </div>

      {isLoading ? <LoadingState /> : isError ? <ErrorState message="Could not load venues." onRetry={refetch} /> : filtered.length === 0 ? (
        <EmptyState title="No venues found" description="Try adjusting your search or filters." action={<button onClick={() => { setFilter('all'); setSearch('') }} className="btn-secondary">Reset filters</button>} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <Link key={v.id} to={`/venues/${v.id}`} className="group card overflow-hidden transition hover:shadow-card-hover">
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                {v.images?.[0] ? (
                  <img src={imageUrl(v.images[0])} alt={v.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="badge bg-primary-50 text-primary-700">{v.type === 'conferencehall' ? 'Conference Hall' : 'Outdoor'}</span>
                  <span className="text-sm font-semibold text-slate-900">Rs {v.basePrice.toLocaleString()}<span className="text-slate-400">/day</span></span>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold text-slate-900 group-hover:text-primary-600">{v.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{v.address}</p>
                <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    {v.capacity}
                  </span>
                  {v.description && <span className="truncate">{v.description}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
