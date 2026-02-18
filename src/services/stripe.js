import axios from 'axios'

const stripeAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
})

export const stripeService = {
  // Créer une session de paiement
  createPaymentIntent: async (bookingId, amount) => {
    try {
      const response = await stripeAPI.post('/payments/create-intent/', {
        booking_id: bookingId,
        amount: Math.round(amount * 100) // Stripe utilise les cents
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Confirmer un paiement
  confirmPayment: async (paymentIntentId, paymentMethodId) => {
    try {
      const response = await stripeAPI.post('/payments/confirm/', {
        payment_intent_id: paymentIntentId,
        payment_method_id: paymentMethodId
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obtenir le statut du paiement
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await stripeAPI.get(`/payments/${paymentId}/`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Récupérer la clé publique Stripe
  getPublishableKey: async () => {
    try {
      const response = await stripeAPI.get('/payments/stripe-key/')
      return response.data.publishable_key
    } catch (error) {
      throw error
    }
  },

  // Générer facture
  generateInvoice: async (bookingId) => {
    try {
      const response = await stripeAPI.post(`/payments/${bookingId}/invoice/`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obtenir historique paiements
  getPaymentHistory: async () => {
    try {
      const response = await stripeAPI.get('/payments/history/')
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default stripeService
