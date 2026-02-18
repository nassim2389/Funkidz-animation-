import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { Download } from 'lucide-react'

export default function PaymentsManagement() {
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, pending: 0 })

  useEffect(() => {
    const mockPayments = [
      { id: 1, booking: 'BK001', client: 'Jean Dupont', amount: 250, date: '2024-03-15', method: 'card', status: 'completed' },
      { id: 2, booking: 'BK002', client: 'Marie Martin', amount: 180, date: '2024-03-18', method: 'card', status: 'completed' },
      { id: 3, booking: 'BK003', client: 'Thomas Bernard', amount: 200, date: '2024-03-19', method: 'card', status: 'completed' },
      { id: 4, booking: 'BK004', client: 'Sophie Durand', amount: 150, date: '2024-03-20', method: 'card', status: 'pending' },
    ]
    
    setPayments(mockPayments)
    setStats({
      total: mockPayments.reduce((sum, p) => sum + p.amount, 0),
      thisMonth: mockPayments.filter(p => new Date(p.date).getMonth() === new Date().getMonth()).reduce((sum, p) => sum + p.amount, 0),
      pending: mockPayments.filter(p => p.status === 'pending').length,
    })
  }, [])

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Gestion des paiements</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-sm">Chiffre d'affaires total</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}€</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-sm">Ce mois-ci</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.thisMonth}€</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-sm">Paiements en attente</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.pending}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-600">Réservation</th>
                <th className="px-6 py-4 text-left font-medium text-gray-600">Client</th>
                <th className="px-6 py-4 text-right font-medium text-gray-600">Montant</th>
                <th className="px-6 py-4 text-left font-medium text-gray-600">Date</th>
                <th className="px-6 py-4 text-left font-medium text-gray-600">Méthode</th>
                <th className="px-6 py-4 text-center font-medium text-gray-600">Statut</th>
                <th className="px-6 py-4 text-center font-medium text-gray-600">Reçu</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{payment.booking}</td>
                  <td className="px-6 py-4 text-gray-600">{payment.client}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">{payment.amount}€</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(payment.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 text-gray-600">{payment.method === 'card' ? 'Carte bancaire' : 'Virement'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {payment.status === 'completed' ? 'Complété' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Download size={18} />
                    </button>
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
