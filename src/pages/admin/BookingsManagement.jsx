import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { Eye, Check, X } from 'lucide-react'

export default function BookingsManagement() {
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setBookings([
      { id: 1, number: 'BK001', client: 'Jean Dupont', email: 'jean@example.com', service: 'Magicien', date: '2024-03-20', price: 250, status: 'confirmed', children: 15 },
      { id: 2, number: 'BK002', client: 'Marie Martin', email: 'marie@example.com', service: 'Animateur', date: '2024-03-21', price: 180, status: 'pending', children: 20 },
      { id: 3, number: 'BK003', client: 'Thomas Bernard', email: 'thomas@example.com', service: 'Clown', date: '2024-03-22', price: 200, status: 'confirmed', children: 18 },
    ])
  }, [])

  const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const updateStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b))
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Gestion des réservations</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Tous ({bookings.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              En attente ({bookings.filter(b => b.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'confirmed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Confirmées ({bookings.filter(b => b.status === 'confirmed').length})
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-600">N°</th>
                <th className="px-6 py-4 text-left font-medium text-gray-600">Client</th>
                <th className="px-6 py-4 text-left font-medium text-gray-600">Service</th>
                <th className="px-6 py-4 text-left font-medium text-gray-600">Date</th>
                <th className="px-6 py-4 text-center font-medium text-gray-600">Enfants</th>
                <th className="px-6 py-4 text-right font-medium text-gray-600">Montant</th>
                <th className="px-6 py-4 text-center font-medium text-gray-600">Statut</th>
                <th className="px-6 py-4 text-center font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{booking.number}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{booking.client}</p>
                      <p className="text-xs text-gray-500">{booking.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{booking.service}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(booking.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{booking.children}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">{booking.price}€</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2 flex justify-center">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(booking.id, 'confirmed')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => updateStatus(booking.id, 'cancelled')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
