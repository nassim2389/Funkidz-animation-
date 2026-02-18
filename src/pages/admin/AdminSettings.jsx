import { useState } from 'react'
import AdminLayout from './AdminLayout'
import { Save } from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    businessName: 'Funkidz Animation',
    email: 'contact@funkidz.fr',
    phone: '+33 1 23 45 67 89',
    address: '123 rue de l\'Animation',
    city: 'Paris',
    zipCode: '75000',
    stripeKey: 'sk_test_...',
    emailNotifications: true,
    smsNotifications: false,
    autoConfirm: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = () => {
    alert('Paramètres enregistrés avec succès!')
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Paramètres</h3>

        {/* Business Info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Informations entreprise</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise</label>
              <input
                type="text"
                name="businessName"
                value={settings.businessName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                <input
                  type="text"
                  name="city"
                  value={settings.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                <input
                  type="text"
                  name="zipCode"
                  value={settings.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Paiements</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clé Stripe</label>
              <input
                type="password"
                name="stripeKey"
                value={settings.stripeKey}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Notifications</h4>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-gray-700">Notifications par email</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="smsNotifications"
                checked={settings.smsNotifications}
                onChange={handleChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-gray-700">Notifications par SMS</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="autoConfirm"
                checked={settings.autoConfirm}
                onChange={handleChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-gray-700">Confirmation automatique des réservations</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <Save size={20} />
          Enregistrer les paramètres
        </button>
      </div>
    </AdminLayout>
  )
}
