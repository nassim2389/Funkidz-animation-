import apiClient from './api'

export const dataExportService = {
  // Exporter les données personnelles (RGPD)
  exportPersonalData: async () => {
    try {
      const response = await apiClient.get('/users/export-data/', {
        responseType: 'blob'
      })
      
      // Télécharger le fichier
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `funkidz-data-${new Date().toISOString().split('T')[0]}.json`)
      document.body.appendChild(link)
      link.click()
      link.parentChild.removeChild(link)
      
      return true
    } catch (error) {
      console.error('Erreur export données:', error)
      throw error
    }
  },

  // Supprimer le compte (RGPD)
  deleteAccount: async (password) => {
    try {
      const response = await apiClient.delete('/users/delete-account/', {
        data: { password }
      })
      return response.data
    } catch (error) {
      console.error('Erreur suppression compte:', error)
      throw error
    }
  },

  // Obtenir l'historique des activités
  getActivityLog: async () => {
    try {
      const response = await apiClient.get('/users/activity-log/')
      return response.data
    } catch (error) {
      console.error('Erreur historique activité:', error)
      throw error
    }
  },

  // Gérer les consentements
  updateConsents: async (consents) => {
    try {
      const response = await apiClient.put('/users/consents/', consents)
      return response.data
    } catch (error) {
      console.error('Erreur mise à jour consentements:', error)
      throw error
    }
  },

  // Obtenir les consentements
  getConsents: async () => {
    try {
      const response = await apiClient.get('/users/consents/')
      return response.data
    } catch (error) {
      console.error('Erreur récupération consentements:', error)
      throw error
    }
  }
}

export default dataExportService
