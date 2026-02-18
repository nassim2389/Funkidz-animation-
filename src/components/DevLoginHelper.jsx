import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isDevMode } from '../config/devMode'

export default function DevLoginHelper() {
  const navigate = useNavigate()
  const { login } = useAuth()

  if (!isDevMode()) {
    return null
  }

  const handleQuickLogin = async (role) => {
    const credentials = role === 'admin' 
      ? { email: 'admin@funkidz.fr', password: 'admin123' }
      : { email: 'user@funkidz.fr', password: 'user123' }

    try {
      await login(credentials.email, credentials.password)
      navigate(role === 'admin' ? '/admin' : '/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 shadow-lg z-50">
      <div className="text-xs font-bold text-yellow-800 mb-2">DEV MODE - Quick Login</div>
      <div className="space-y-2">
        <button
          onClick={() => handleQuickLogin('admin')}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
        >
          Login as Admin
        </button>
        <button
          onClick={() => handleQuickLogin('user')}
          className="w-full px-3 py-2 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors"
        >
          Login as User
        </button>
        <div className="text-xs text-yellow-700 pt-2 border-t border-yellow-300">
          <p className="font-semibold">Credentials:</p>
          <p>Admin: admin@funkidz.fr</p>
          <p>User: user@funkidz.fr</p>
        </div>
      </div>
    </div>
  )
}
