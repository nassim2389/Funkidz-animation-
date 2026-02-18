import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PaymentForm from '../components/PaymentForm'

export default function Payment() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const bookingId = searchParams.get('booking')
  const amount = parseFloat(searchParams.get('amount') || '0')
  const service = searchParams.get('service') || 'Service'

  if (!bookingId || amount === 0) {
    return (
      <div className="pt-20 min-h-screen flex items-center bg-gray-50">
        <div className="container max-w-md mx-auto px-4 text-center">
          <p className="text-gray-600 mb-4">Les informations de paiement sont manquantes.</p>
          <Link to="/booking" className="text-blue-600 hover:underline">
            Retour à la réservation
          </Link>
        </div>
      </div>
    )
  }

  const handlePaymentSuccess = (payment) => {
    navigate(`/payment-success?booking=${bookingId}`)
  }

  const handlePaymentError = (error) => {
    console.error('Erreur de paiement:', error)
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Finaliser votre paiement</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <PaymentForm
              bookingId={bookingId}
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-3">Données de paiement sécurisées</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  Chiffrement SSL 256-bit
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  Conformité PCI DSS
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  Pas de stockage de données sensibles
                </li>
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Récapitulatif</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{service}</p>
                    <p className="text-sm text-gray-600">Prestation</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium text-gray-900">{amount}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais</span>
                    <span className="font-medium text-gray-900">0€</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">{amount}€</span>
                </div>
                <p className="text-xs text-gray-600">TVA comprise si applicable</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="bg-gray-50 rounded p-3">
                  <p className="font-medium text-gray-900 mb-1">Numéro de réservation</p>
                  <p className="text-gray-600 font-mono">{bookingId}</p>
                </div>

                <div>
                  <p className="text-gray-600 mb-2">
                    Cette réservation inclut la prestation complète. Aucun coût supplémentaire ne vous sera facturé.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
