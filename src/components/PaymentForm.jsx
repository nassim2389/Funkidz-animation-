import { useState } from 'react'
import { Lock, AlertCircle } from 'lucide-react'
import stripeService from '../services/stripe'

export default function PaymentForm({ bookingId, amount, onSuccess, onError }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvc, setCvc] = useState('')
  const [cardName, setCardName] = useState('')

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, '')
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim()
    setCardNumber(formatted)
  }

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length >= 2) {
      const formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}`
      setExpiryDate(formatted)
    } else {
      setExpiryDate(value)
    }
  }

  const handleCvcChange = (e) => {
    setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validation basique
      if (!cardNumber || !expiryDate || !cvc || !cardName) {
        throw new Error('Veuillez remplir tous les champs')
      }

      if (cardNumber.replace(/\s/g, '').length !== 16) {
        throw new Error('Numéro de carte invalide')
      }

      if (cvc.length < 3) {
        throw new Error('Code CVC invalide')
      }

      // Créer intent de paiement
      const paymentIntent = await stripeService.createPaymentIntent(bookingId, amount)
      
      // Simuler la confirmation (en production, utiliser @stripe/react-stripe-js)
      const confirmed = await stripeService.confirmPayment(
        paymentIntent.client_secret,
        null // paymentMethodId depuis Stripe.js
      )

      if (confirmed.status === 'succeeded') {
        onSuccess(confirmed)
      } else {
        throw new Error('Paiement non confirmé')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur de paiement'
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Informations de paiement</h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom sur la carte
          </label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jean Dupont"
            required
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de carte
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength="19"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>

        {/* Expiry & CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration
            </label>
            <input
              type="text"
              value={expiryDate}
              onChange={handleExpiryChange}
              maxLength="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="MM/YY"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={handleCvcChange}
              maxLength="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="123"
              required
            />
          </div>
        </div>

        {/* Security Info */}
        <div className="flex items-center gap-2 text-sm text-gray-600 py-4 border-t border-gray-200">
          <Lock size={16} className="text-green-600" />
          <span>Paiement sécurisé par Stripe</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Traitement en cours...' : `Payer ${amount}€`}
        </button>

        <p className="text-xs text-gray-600 text-center">
          Votre paiement est sécurisé et chiffré. Aucune information de carte n'est stockée.
        </p>
      </form>
    </div>
  )
}
