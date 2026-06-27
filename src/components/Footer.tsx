import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container-app py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </span>
              <span className="font-display text-lg font-bold text-slate-900">Eventify</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-slate-500">Find and book the perfect venue for your next event. Conference halls, outdoor spaces, and more — all in one place.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><Link to="/venues" className="hover:text-primary-600">Venues</Link></li>
              <li><Link to="/bookings" className="hover:text-primary-600">My Bookings</Link></li>
              <li><Link to="/profile" className="hover:text-primary-600">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Account</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><Link to="/sign-in" className="hover:text-primary-600">Sign in</Link></li>
              <li><Link to="/sign-up" className="hover:text-primary-600">Create account</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-100 pt-6 text-sm text-slate-400">© {new Date().getFullYear()} Eventify. Built for the Event Management System.</div>
      </div>
    </footer>
  )
}
