import { useState } from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { contactService } from '../services/api'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      await contactService.sendMessage(
        formData.name,
        formData.email,
        formData.phone,
        formData.message
      )
      setSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de l\'envoi du message')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-2 animate-scale-in">Nous contacter ✉️</h1>
          <p className="text-lg opacity-90">Une question ? Parlons-en — nous sommes là pour vous aider.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 border-3 border-emerald-300 hover-lift">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Phone size={20} className="text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-900">Téléphone</h3>
                    <p className="text-sm text-emerald-700 mt-1">+33 (0)1 23 45 67 89</p>
                    <p className="text-xs text-emerald-500">Lun-Ven: 9h-17h</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border-3 border-blue-300 hover-lift">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Mail size={20} className="text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-900">Email</h3>
                    <p className="text-sm text-blue-700 mt-1">contact@funkidz.fr</p>
                    <p className="text-xs text-blue-500">Réponse sous 24h</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-pink-50 to-red-50 border-3 border-pink-300 hover-lift">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center">
                    <MapPin size={20} className="text-pink-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-pink-900">Adresse</h3>
                    <p className="text-sm text-pink-700 mt-1">123 rue de l'Animation, 75000 Paris</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8 border-3 border-purple-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Envoyez-nous un message</h2>

                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    Merci — votre message a bien été envoyé. Nous revenons vers vous rapidement.
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Votre nom"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone (optionnel)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="+33 (0)1 23 45 67 89"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Votre message..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:scale-105 transform transition-all disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Envoi en cours...' : "Envoyer"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
