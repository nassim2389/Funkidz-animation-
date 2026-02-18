import { apiClient } from './api'

export const emailService = {
  // Envoyer confirmation de réservation
  sendBookingConfirmation: async (bookingId, email) => {
    try {
      const response = await apiClient.post('/emails/send-booking-confirmation/', {
        booking_id: bookingId,
        email
      })
      return response.data
    } catch (error) {
      console.error('Erreur envoi email:', error)
      throw error
    }
  },

  // Envoyer facture
  sendInvoice: async (bookingId, email) => {
    try {
      const response = await apiClient.post('/emails/send-invoice/', {
        booking_id: bookingId,
        email
      })
      return response.data
    } catch (error) {
      console.error('Erreur envoi facture:', error)
      throw error
    }
  },

  // Envoyer rappel d'événement
  sendEventReminder: async (bookingId, email) => {
    try {
      const response = await apiClient.post('/emails/send-reminder/', {
        booking_id: bookingId,
        email
      })
      return response.data
    } catch (error) {
      console.error('Erreur envoi rappel:', error)
      throw error
    }
  },

  // Envoyer feedback email
  sendFeedbackRequest: async (bookingId, email) => {
    try {
      const response = await apiClient.post('/emails/send-feedback/', {
        booking_id: bookingId,
        email
      })
      return response.data
    } catch (error) {
      console.error('Erreur envoi feedback:', error)
      throw error
    }
  },

  // Envoyer email de bienvenue
  sendWelcomeEmail: async (email, name) => {
    try {
      const response = await apiClient.post('/emails/send-welcome/', {
        email,
        name
      })
      return response.data
    } catch (error) {
      console.error('Erreur envoi bienvenue:', error)
      throw error
    }
  },

  // Envoyer notification de paiement
  sendPaymentConfirmation: async (bookingId, email, amount) => {
    try {
      const response = await apiClient.post('/emails/send-payment-confirmation/', {
        booking_id: bookingId,
        email,
        amount
      })
      return response.data
    } catch (error) {
      console.error('Erreur envoi paiement:', error)
      throw error
    }
  }
}

export default emailService
