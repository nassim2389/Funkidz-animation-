import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { TrendingUp, Users, Calendar, Wallet } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingBookings: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])

  useEffect(() => {
    // Simulé - sera remplacé par les appels API
    setStats({
      totalBookings: 47,
      totalRevenue: 8950,
      totalUsers: 23,
      pendingBookings: 5,
    })
    
    setRecentBookings([
      { id: 1, client: 'Jean Dupont', service: 'Magicien', date: '2024-03-20', amount: 250, status: 'confirmed' },
      { id: 2, client: 'Marie Martin', service: 'Animateur', date: '2024-03-21', amount: 180, status: 'pending' },
      { id: 3, client: 'Thomas Bernard', service: 'Clown', date: '2024-03-22', amount: 200, status: 'confirmed' },
    ])
  }, [])

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Réservations"
            value={stats.totalBookings}
            icon={Calendar}
            color="blue"
          />
          <StatCard
            label="Chiffre d'affaires"
            value={`${stats.totalRevenue}€`}
            icon={Wallet}
            color="green"
          />
          <StatCard
            label="Utilisateurs"
            value={stats.totalUsers}
            icon={Users}
            color="purple"
          />
          <StatCard
            label="En attente"
            value={stats.pendingBookings}
            icon={TrendingUp}
            color="orange"
          />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Réservations récentes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 font-medium text-gray-600">Client</th>
                  <th className="text-left py-3 font-medium text-gray-600">Service</th>
                  <th className="text-left py-3 font-medium text-gray-600">Date</th>
                  <th className="text-right py-3 font-medium text-gray-600">Montant</th>
                  <th className="text-left py-3 font-medium text-gray-600">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4">{booking.client}</td>
                    <td className="py-4">{booking.service}</td>
                    <td className="py-4">{new Date(booking.date).toLocaleDateString('fr-FR')}</td>
                    <td className="py-4 text-right font-medium">{booking.amount}€</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function StatCard({ label, value, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  )
}
