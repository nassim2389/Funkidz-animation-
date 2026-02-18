import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { Edit, Trash2, Plus } from 'lucide-react'

export default function ServicesManagement() {
  const [services, setServices] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    basePrice: '',
    duration: '',
    maxChildren: '',
    isActive: true,
  })

  useEffect(() => {
    // Simulé - sera remplacé par appel API
    setServices([
      { id: 1, title: 'Magicien', description: 'Spectacle de magie', basePrice: 250, duration: 60, maxChildren: 30, isActive: true },
      { id: 2, title: 'Animateur', description: 'Animation jeux et activités', basePrice: 180, duration: 120, maxChildren: 40, isActive: true },
      { id: 3, title: 'Clown', description: 'Spectacle comique', basePrice: 200, duration: 45, maxChildren: 25, isActive: true },
    ])
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...formData, id: editingService.id } : s))
    } else {
      setServices([...services, { ...formData, id: Date.now() }])
    }
    setFormData({ title: '', description: '', basePrice: '', duration: '', maxChildren: '', isActive: true })
    setShowForm(false)
    setEditingService(null)
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData(service)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setServices(services.filter(s => s.id !== id))
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Gestion des services</h3>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingService(null)
              setFormData({ title: '', description: '', basePrice: '', duration: '', maxChildren: '', isActive: true })
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Nouveau service
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="text-lg font-bold mb-4 text-gray-900">{editingService ? 'Modifier' : 'Ajouter'} un service</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix de base (€)</label>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durée (min)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max enfants</label>
                  <input
                    type="number"
                    name="maxChildren"
                    value={formData.maxChildren}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Service actif</label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingService(null)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Titre</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Description</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Prix</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">Durée</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{service.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{service.description}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">{service.basePrice}€</td>
                  <td className="px-6 py-4 text-center text-gray-600">{service.duration}min</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {service.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2 flex justify-center">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
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
