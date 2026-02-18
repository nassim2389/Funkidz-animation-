import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { Trash2, Shield, AlertCircle } from 'lucide-react'

export default function UsersManagement() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    setUsers([
      { id: 1, email: 'jean@example.com', name: 'Jean Dupont', role: 'client', joined: '2024-01-15', bookings: 3, status: 'active' },
      { id: 2, email: 'marie@example.com', name: 'Marie Martin', role: 'client', joined: '2024-02-01', bookings: 1, status: 'active' },
      { id: 3, email: 'thomas@example.com', name: 'Thomas Bernard', role: 'client', joined: '2024-02-20', bookings: 5, status: 'active' },
      { id: 4, email: 'admin@funkidz.fr', name: 'Admin Funkidz', role: 'admin', joined: '2023-12-01', bookings: 0, status: 'active' },
    ])
  }, [])

  const deleteUser = (id) => {
    if (window.confirm('Êtes-vous sûr ?')) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Gestion des utilisateurs</h3>
          <p className="text-gray-600 text-sm">Total: {users.length} utilisateurs</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-600">Email</th>
                <th className="px-6 py-4 text-left font-medium text-gray-600">Nom</th>
                <th className="px-6 py-4 text-left font-medium text-gray-600">Rôle</th>
                <th className="px-6 py-4 text-center font-medium text-gray-600">Réservations</th>
                <th className="px-6 py-4 text-left font-medium text-gray-600">Inscrit le</th>
                <th className="px-6 py-4 text-center font-medium text-gray-600">Statut</th>
                <th className="px-6 py-4 text-center font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">{user.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.role === 'admin' && <Shield size={16} className="text-blue-600" />}
                      <span className={`text-xs font-medium ${user.role === 'admin' ? 'text-blue-600' : 'text-gray-600'}`}>
                        {user.role === 'admin' ? 'Admin' : 'Client'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">{user.bookings}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(user.joined).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Actif
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
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
