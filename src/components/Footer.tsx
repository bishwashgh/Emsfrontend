import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-amber-200/30 bg-gradient-to-r from-amber-50/95 via-orange-50/95 to-amber-50/95">
      <div className="container-app py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative flex h-[46px] w-[46px] items-center justify-center rounded-full bg-gradient-to-br from-red-700 to-amber-600 shadow-lg shadow-red-900/30 ring-2 ring-amber-600/20">
                <div className="absolute inset-1 rounded-full border border-white/25"></div>
                <svg className="h-6 w-6 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C12 2 8 6 8 11C8 16 12 22 12 22C12 22 16 16 16 11C16 6 12 2 12 2ZM9.5 12C9.5 8.5 11 5.5 12 4C13 5.5 14.5 8.5 14.5 12C14.5 15.5 13 18.5 12 20C11 18.5 9.5 15.5 9.5 12Z" />
                  <path d="M7 14C7 14 2 12 2 8C2 4 7 2 7 2C7 2 5.5 5.5 6 9C6.5 12.5 8.5 14.5 10 16C8.5 15.5 7 14 7 14Z" />
                  <path d="M17 14C17 14 22 12 22 8C22 4 17 2 17 2C17 2 18.5 5.5 18 9C17.5 12.5 15.5 14.5 14 16C15.5 15.5 17 14 17 14Z" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="bg-gradient-to-r from-red-800 via-amber-700 to-amber-600 bg-clip-text text-[22px] font-extrabold tracking-tight text-transparent">
                  Eventify
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[2px] text-amber-700/85">
                  Sacred Celebrations
                </span>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-600">
              Find and book the perfect venue for your next event. Conference halls, outdoor spaces, 
              and more — all in one place.
            </p>
            {/* Social Icons */}
            <div className="mt-5 flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-600/20 bg-white/70 text-amber-700 transition-all hover:bg-amber-100 hover:border-amber-600/40 hover:shadow-md">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z"/>
                </svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-600/20 bg-white/70 text-amber-700 transition-all hover:bg-amber-100 hover:border-amber-600/40 hover:shadow-md">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-600/20 bg-white/70 text-amber-700 transition-all hover:bg-amber-100 hover:border-amber-600/40 hover:shadow-md">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-600/20 bg-white/70 text-amber-700 transition-all hover:bg-amber-100 hover:border-amber-600/40 hover:shadow-md">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.19 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-800">
              Explore
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link to="/venues" className="flex items-center gap-2 text-stone-600 transition-colors hover:text-amber-700 hover:translate-x-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Venues
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="flex items-center gap-2 text-stone-600 transition-colors hover:text-amber-700 hover:translate-x-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/profile" className="flex items-center gap-2 text-stone-600 transition-colors hover:text-amber-700 hover:translate-x-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="flex items-center gap-2 text-stone-600 transition-colors hover:text-amber-700 hover:translate-x-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-800">
              Account
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link to="/sign-in" className="flex items-center gap-2 text-stone-600 transition-colors hover:text-amber-700 hover:translate-x-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/sign-up" className="flex items-center gap-2 text-stone-600 transition-colors hover:text-amber-700 hover:translate-x-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create account
                </Link>
              </li>
              <li className="pt-3">
                <div className="rounded-lg bg-gradient-to-r from-red-50 to-amber-50 p-3 border border-amber-200/30">
                  <p className="text-xs font-medium text-amber-800">Need help?</p>
                  <p className="text-xs text-stone-600 mt-1">
                    <a href="mailto:support@eventify.com" className="hover:text-amber-700">
                      support@eventify.com
                    </a>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-amber-200/30 pt-6 text-sm text-stone-400 md:flex-row">
          <span>
            © {new Date().getFullYear()} Eventify. Built for the Event Management System.
          </span>
          <div className="flex items-center gap-6 text-xs">
            <Link to="/privacy" className="hover:text-amber-700 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-amber-700 transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-amber-700 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}