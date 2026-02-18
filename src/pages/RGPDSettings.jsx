import { useState, useEffect } from 'react'
import { Download, Trash2, AlertTriangle } from 'lucide-react'
import dataExportService from '../services/dataExportService'
import notificationService from '../services/notificationService'

export default function RGPDSettings() {
  const [consents, setConsents] = useState({
    marketing: false,
    analytics: false,
    newsletter: false,
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadConsents()
  }, [])

  const loadConsents = async () => {
    try {
      const data = await dataExportService.getConsents()
      setConsents(data)
    } catch (error) {
      notificationService.error('Erreur lors du chargement des consentements')
    }
  }

  const handleConsentChange = async (key) => {
    const newConsents = { ...consents, [key]: !consents[key] }
    try {
      await dataExportService.updateConsents(newConsents)
      setConsents(newConsents)
      notificationService.success('Consentements mis à jour')
    } catch (error) {
      notificationService.error('Erreur lors de la mise à jour')
    }
  }

  const handleExportData = async () => {
    try {
      setIsLoading(true)
      await dataExportService.exportPersonalData()
      notificationService.success('Vos données ont été téléchargées')
    } catch (error) {
      notificationService.error('Erreur lors de l\'export des données')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!password) {
      notificationService.error('Veuillez entrer votre mot de passe')
      return
    }

    try {
      setIsLoading(true)
      await dataExportService.deleteAccount(password)
      notificationService.success('Votre compte a été supprimé')
      window.location.href = '/'
    } catch (error) {
      notificationService.error('Erreur lors de la suppression du compte')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Vos données et confidentialité</h1>

        {/* Data Export */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Download size={24} />
            Exporter vos données
          </h2>
          <p className="text-gray-600 mb-6">
            Téléchargez une copie de toutes vos données personnelles au format JSON conformément au RGPD.
          </p>
          <button
            onClick={handleExportData}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Téléchargement...' : 'Télécharger mes données'}
          </button>
        </div>

        {/* Consent Management */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Gérer les consentements</h2>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={consents.marketing}
                onChange={() => handleConsentChange('marketing')}
                className="w-5 h-5 rounded"
              />
              <div>
                <p className="font-medium text-gray-900">Communications marketing</p>
                <p className="text-sm text-gray-600">Recevoir des offres et promotions</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={consents.newsletter}
                onChange={() => handleConsentChange('newsletter')}
                className="w-5 h-5 rounded"
              />
              <div>
                <p className="font-medium text-gray-900">Infolettre</p>
                <p className="text-sm text-gray-600">Recevoir nos actualités mensuelles</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={consents.analytics}
                onChange={() => handleConsentChange('analytics')}
                className="w-5 h-5 rounded"
              />
              <div>
                <p className="font-medium text-gray-900">Données analytiques</p>
                <p className="text-sm text-gray-600">Nous aider à améliorer le service</p>
              </div>
            </label>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
            <AlertTriangle size={24} />
            Zone de danger
          </h2>
          <p className="text-gray-600 mb-4">
            Supprimer votre compte est définitif et irréversible. Toutes vos données seront supprimées.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 size={18} className="inline mr-2" />
            Supprimer mon compte
          </button>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Supprimer le compte</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous certain ? Cette action est définitive.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer avec votre mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setPassword('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
