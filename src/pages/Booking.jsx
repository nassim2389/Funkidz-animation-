import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookingsService, servicesService, optionsService } from '../services/api'

export default function Booking() {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState([])
  const [options, setOptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    service_id: '',
    event_date: '',
    start_time: '',
    duration_minutes: 120,
    address: '',
    city: '',
    children_count: 10,
    notes: '',
    selected_options: [],
  })

  // Charger les services et options
  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesRes, optionsRes] = await Promise.all([
          servicesService.getAll(),
          optionsService.getAll(),
        ])
        setServices(servicesRes.data)
        setOptions(optionsRes.data)
      } catch (err) {
        setError('Erreur lors du chargement des services')
        console.error(err)
      }
    }
    loadData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleOptionToggle = (optionId) => {
    setFormData(prev => ({
      ...prev,
      selected_options: prev.selected_options.includes(optionId)
        ? prev.selected_options.filter(id => id !== optionId)
        : [...prev.selected_options, optionId]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (step < 3) {
      setStep(step + 1)
    } else {
      if (!isAuthenticated) {
        navigate('/auth/login')
        return
      }

      setIsLoading(true)
      setError('')
      
      try {
        // Créer la réservation
        const bookingRes = await bookingsService.create({
          service_id: parseInt(formData.service_id),
          event_date: formData.event_date,
          start_time: formData.start_time,
          duration_minutes: parseInt(formData.duration_minutes),
          address: formData.address,
          city: formData.city,
          children_count: parseInt(formData.children_count),
          notes: formData.notes,
        })

        // Ajouter les options sélectionnées
        if (formData.selected_options.length > 0) {
          for (const optionId of formData.selected_options) {
            await bookingsService.addOption(bookingRes.data.id, optionId, 1)
          }
        }

        alert('Réservation créée avec succès ! Vous recevrez un email de confirmation.')
        navigate(`/dashboard`)
      } catch (err) {
        setError(err.response?.data?.detail || 'Erreur lors de la création de la réservation')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const currentService = services.find(s => s.id === parseInt(formData.service_id))
  const estimatedPrice = currentService ? (currentService.base_price * formData.duration_minutes / 60) : 0

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold mb-8 text-center text-gray-900">Réservation</h1>

          {/* Progress Indicator */}
          <div className="flex justify-between mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s <= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`flex-grow h-1 mx-2 ${s < step ? 'bg-blue-600' : 'bg-gray-300'}`} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-4">Choisir un service</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <label key={service.id} className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.service_id === service.id.toString()
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-600'
                      }`}>
                        <input
                          type="radio"
                          name="service_id"
                          value={service.id}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{service.title}</p>
                          <p className="text-sm text-gray-600">{service.description}</p>
                          <p className="text-lg font-bold text-blue-600 mt-2">{service.base_price}€/heure</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de l'événement</label>
                    <input
                      type="date"
                      name="event_date"
                      value={formData.event_date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
                    <input
                      type="time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
                    <input
                      type="number"
                      name="duration_minutes"
                      value={formData.duration_minutes}
                      onChange={handleChange}
                      min="30"
                      step="30"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'enfants</label>
                    <input
                      type="number"
                      name="children_count"
                      value={formData.children_count}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location & Options */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-4">Lieu et Options</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Rue et numéro"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Ville"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Options */}
                  {options.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Options supplémentaires</h3>
                      <div className="space-y-3">
                        {options.map((option) => (
                          <label key={option.id} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={formData.selected_options.includes(option.id)}
                              onChange={() => handleOptionToggle(option.id)}
                              className="mr-3"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{option.name}</p>
                              <p className="text-sm text-gray-600">{option.description}</p>
                            </div>
                            <p className="font-bold text-blue-600">+{option.price}€</p>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes spéciales</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Ajouter des informations spéciales..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-4">Confirmation</h2>
                  
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Service</p>
                      <p className="font-medium text-gray-900">{currentService?.title}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Date et heure</p>
                        <p className="font-medium text-gray-900">{formData.event_date} à {formData.start_time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Durée</p>
                        <p className="font-medium text-gray-900">{formData.duration_minutes} minutes</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Lieu</p>
                        <p className="font-medium text-gray-900">{formData.address}, {formData.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Nombre d'enfants</p>
                        <p className="font-medium text-gray-900">{formData.children_count}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-300 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Estimation du prix</span>
                        <span className="text-2xl font-bold text-blue-600">{estimatedPrice.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-700">
                        Vous devez être connecté pour finaliser la réservation. Vous serez redirigé vers la page de connexion.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Précédent
                </button>
              )}
              <button
                type="submit"
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Traitement...' : step === 3 ? 'Confirmer la réservation' : 'Suivant'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
