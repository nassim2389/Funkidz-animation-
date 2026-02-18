import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // Appel API à implémenter
      setTimeout(() => {
        setSuccess(true)
        setEmail('')
      }, 1000)
    } catch (err) {
      setError('Erreur lors de l\'envoi de l\'email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-20 min-h-screen flex items-center bg-gray-50">
      <div className="container max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {!success ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={32} className="text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mot de passe oublié</h1>
                <p className="text-gray-600">Entrez votre email pour réinitialiser votre mot de passe</p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600 text-sm">
                  Vous vous souvenez de votre mot de passe ?{' '}
                  <Link to="/auth/login" className="text-blue-600 hover:underline font-medium">
                    Se connecter
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Email envoyé</h2>
              <p className="text-gray-600 mb-6">
                Un lien de réinitialisation a été envoyé à {email}. Veuillez vérifier votre boîte de réception.
              </p>
              <Link to="/" className="text-blue-600 hover:underline font-medium">
                Retour à l'accueil
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
