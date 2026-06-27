import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { venuesApi } from '../lib/venuesApi'
import { imageUrl } from '../lib/api'
import { LoadingState, ErrorState } from '../components/Feedback'

export default function HomePage() {
  const { data: venues, isLoading, isError, refetch } = useQuery({ queryKey: ['venues'], queryFn: venuesApi.list })
  const featured = (venues ?? []).slice(0, 3)

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="container-app relative py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="badge bg-white/15 text-white ring-1 ring-white/20">Event Management System</span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-white md:text-5xl">Book the perfect venue for your next event</h1>
            <p className="mt-4 text-lg text-primary-100">Discover conference halls and outdoor spaces. Check availability, reserve your dates, and pay securely with Khalti or eSewa.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/venues" className="btn bg-white text-primary-700 hover:bg-primary-50 focus:ring-white">
                Browse venues
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <Link to="/sign-up" className="btn border border-white/30 text-white hover:bg-white/10 focus:ring-white">Create account</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-app -mt-10 relative z-10">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card-hover md:grid-cols-4">
          {[
            { label: 'Venues listed', value: venues?.length ?? '—' },
            { label: 'Booking types', value: '2' },
            { label: 'Payment methods', value: '2' },
            { label: 'Secure payments', value: '100%' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-2xl font-bold text-slate-900">{s.value}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-app py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Featured venues</h2>
            <p className="mt-1 text-sm text-slate-500">Handpicked spaces for memorable events.</p>
          </div>
          <Link to="/venues" className="hidden text-sm font-semibold text-primary-600 hover:text-primary-700 sm:block">View all →</Link>
        </div>

        {isLoading ? <LoadingState /> : isError ? <ErrorState message="Could not load venues." onRetry={refetch} /> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v) => (
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
                  <p className="mt-2 text-sm text-slate-500">Capacity: {v.capacity} guests</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white py-16">
        <div className="container-app">
          <h2 className="text-center font-display text-2xl font-bold text-slate-900">How it works</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { step: '1', title: 'Find a venue', text: 'Browse conference halls and outdoor spaces by capacity, location, and price.' },
              { step: '2', title: 'Book your dates', text: 'Pick your event dates. We check for conflicts and calculate the total instantly.' },
              { step: '3', title: 'Pay securely', text: 'Pay a 40% deposit with Khalti or eSewa. Your booking is confirmed on success.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 font-display text-lg font-bold text-primary-700">{s.step}</div>
                <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
