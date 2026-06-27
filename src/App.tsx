import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ProtectedRoute } from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import VenuesPage from './pages/VenuesPage'
import VenueDetailPage from './pages/VenueDetailPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import ProfilePage from './pages/ProfilePage'
import BookingsPage from './pages/BookingsPage'
import BookingFlowPage from './pages/BookingFlowPage'
import PaymentReturnPage from './pages/PaymentReturnPage'
import AdminVenuesPage from './pages/admin/AdminVenuesPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/venues" element={<VenuesPage />} />
          <Route path="/venues/:id" element={<VenueDetailPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
          <Route path="/venues/:id/book" element={<ProtectedRoute><BookingFlowPage /></ProtectedRoute>} />
          <Route path="/payments/khalti/return" element={<PaymentReturnPage provider="khalti" />} />
          <Route path="/payments/esewa/success" element={<PaymentReturnPage provider="esewa" />} />
          <Route path="/payments/esewa/failure" element={<PaymentReturnPage provider="esewa" failed />} />
          <Route path="/admin/venues" element={<ProtectedRoute adminOnly><AdminVenuesPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsersPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
