import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="font-display text-7xl font-extrabold text-primary-600">404</div>
      <h1 className="mt-4 font-display text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-500">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  )
}
