import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, Download, Home } from 'lucide-react'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const bookingNumber = searchParams.get('booking')

  return (
    <div className="pt-20 min-h-screen flex items-center bg-gray-50">
      <div className="container max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Paiement réussi !
          </h1>
          <p className="text-gray-600 mb-8">
            Votre réservation a été confirmée avec succès.
          </p>

          {bookingNumber && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-600 mb-1">Numéro de réservation</p>
              <p className="text-2xl font-bold text-gray-900">{bookingNumber}</p>
            </div>
          )}

          <div className="space-y-3 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Ce qui se passe ensuite</h3>
            <div className="text-left space-y-2 text-sm text-gray-600">
              <p>1. Vous recevrez une confirmation par email</p>
              <p>2. Notre équipe vous contactera pour confirmer les détails</p>
              <p>3. Vous pouvez suivre votre réservation depuis votre tableau de bord</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Download size={20} />
              Télécharger la facture
            </button>

            <Link
              to="/dashboard"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              <Home size={20} />
              Mon tableau de bord
            </Link>

            <Link
              to="/"
              className="w-full text-center text-blue-600 hover:underline font-medium py-2"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
