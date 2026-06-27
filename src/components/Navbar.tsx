import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export function Navbar() {
  const { isAuthenticated, isAdmin, user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => { await signOut(); navigate('/') }

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-slate-600 hover:text-slate-900'}`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <nav className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </span>
          <span className="font-display text-lg font-bold text-slate-900">Eventify</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <NavLink to="/venues" className={navLink}>Venues</NavLink>
          {isAuthenticated && <NavLink to="/bookings" className={navLink}>My Bookings</NavLink>}
          {isAdmin && <NavLink to="/admin/venues" className={navLink}>Manage</NavLink>}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                  {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                </span>
                <span className="text-sm font-medium text-slate-700">{user?.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={handleSignOut} className="btn-secondary">Sign out</button>
            </div>
          ) : (
            <>
              <Link to="/sign-in" className="btn-ghost">Sign in</Link>
              <Link to="/sign-up" className="btn-primary">Get started</Link>
            </>
          )}
        </div>

        <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <NavLink to="/venues" className={navLink} onClick={() => setMenuOpen(false)}>Venues</NavLink>
            {isAuthenticated && <NavLink to="/bookings" className={navLink} onClick={() => setMenuOpen(false)}>My Bookings</NavLink>}
            {isAdmin && <NavLink to="/admin/venues" className={navLink} onClick={() => setMenuOpen(false)}>Manage</NavLink>}
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="btn-secondary" onClick={() => setMenuOpen(false)}>Profile</Link>
                  <button onClick={handleSignOut} className="btn-secondary">Sign out</button>
                </>
              ) : (
                <>
                  <Link to="/sign-in" className="btn-secondary" onClick={() => setMenuOpen(false)}>Sign in</Link>
                  <Link to="/sign-up" className="btn-primary" onClick={() => setMenuOpen(false)}>Get started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
