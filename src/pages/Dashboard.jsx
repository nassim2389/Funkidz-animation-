import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookingsService } from '../services/api'
import { Calendar, Plus, AlertCircle } from 'lucide-react'

export default function Dashboard() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth()
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth/login')
      return
    }

    const loadBookings = async () => {
      try {
        setIsLoading(true)
        const response = await bookingsService.getUserBookings()
        setBookings(response.data)
      } catch (err) {
        console.error(err)
        // Afficher quand même le tableau de bord même si API non réponse
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      loadBookings()
    }
  }, [isAuthenticated, authLoading, navigate])

  if (authLoading || isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  const totalSpent = bookings.reduce((sum, booking) => sum + (booking.final_price || 0), 0)
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2 text-gray-900">
              Bienvenue, {user?.email}
            </h1>
            <p className="text-gray-600">Gérez vos réservations d'animation</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <Link 
                to="/booking" 
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Nouvelle réservation
              </Link>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
              <h3 className="font-semibold text-gray-900 mb-4">Profil</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Utilisateur depuis</p>
                  <p className="font-medium text-gray-900">
                    {new Date().toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600 text-sm">Total réservations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{bookings.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600 text-sm">Confirmées</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{confirmedCount}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600 text-sm">Dépenses totales</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{totalSpent}€</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600 text-sm">Nombre enfants</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {bookings.reduce((sum, b) => sum + (b.children_count || 0), 0)}
                </p>
              </div>
            </div>

            {/* Reservations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2 text-gray-900">
                <Calendar size={28} />
                Mes réservations
              </h2>

              <div className="space-y-4">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{booking.service?.title || 'Service'}</h3>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : booking.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {booking.status === 'confirmed' ? 'Confirmée' :
                               booking.status === 'pending' ? 'En attente' :
                               'Annulée'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            Numéro: <span className="font-medium">{booking.booking_number}</span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Date et heure</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(booking.event_date).toLocaleDateString('fr-FR')} à {booking.start_time}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Lieu</p>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.city}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Durée</p>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.duration_minutes} minutes
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Nombre d'enfants</p>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.children_count}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4">
                        <span className="font-bold text-lg text-blue-600">{booking.final_price}€</span>
                        <button className="text-sm px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                          Voir détails
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">Aucune réservation pour le moment</p>
                    <Link 
                      to="/booking" 
                      className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Faire une réservation
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
