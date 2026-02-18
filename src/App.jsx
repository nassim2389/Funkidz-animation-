import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Pricing from './pages/Pricing'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Booking from './pages/Booking'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard from './pages/Dashboard'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ServiceDetail from './pages/ServiceDetail'
import Payment from './pages/Payment'
import PaymentSuccess from './pages/PaymentSuccess'
import RGPDSettings from './pages/RGPDSettings'
import PrivateRoute from './components/PrivateRoute'
import NotificationContainer from './components/NotificationContainer'
// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ServicesManagement from './pages/admin/ServicesManagement'
import BookingsManagement from './pages/admin/BookingsManagement'
import UsersManagement from './pages/admin/UsersManagement'
import PaymentsManagement from './pages/admin/PaymentsManagement'
import GalleryManagement from './pages/admin/GalleryManagement'
import AdminSettings from './pages/admin/AdminSettings'
import DevLoginHelper from './components/DevLoginHelper'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-white text-gray-900">
          <NotificationContainer />
          <DevLoginHelper />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/rgpd-settings" element={<PrivateRoute><RGPDSettings /></PrivateRoute>} />
              <Route path="/service/:id" element={<ServiceDetail />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/services" element={<PrivateRoute adminOnly><ServicesManagement /></PrivateRoute>} />
              <Route path="/admin/bookings" element={<PrivateRoute adminOnly><BookingsManagement /></PrivateRoute>} />
              <Route path="/admin/users" element={<PrivateRoute adminOnly><UsersManagement /></PrivateRoute>} />
              <Route path="/admin/payments" element={<PrivateRoute adminOnly><PaymentsManagement /></PrivateRoute>} />
              <Route path="/admin/gallery" element={<PrivateRoute adminOnly><GalleryManagement /></PrivateRoute>} />
              <Route path="/admin/settings" element={<PrivateRoute adminOnly><AdminSettings /></PrivateRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
