import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  const links = [
    { label: 'Services', href: '/services' },
    { label: 'Tarifs', href: '/pricing' },
    { label: 'Galerie', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 border-b-4 border-yellow-400 z-50 shadow-lg">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Ludique */}
          <Link to="/" className="text-3xl font-serif font-black text-white drop-shadow-lg hover:scale-110 transition-transform">
            🎉 Funkidz
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-bold text-white hover:text-yellow-300 transition-colors drop-shadow-md transform hover:scale-110"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold text-white hover:text-yellow-300 transition-colors">
                  <User size={18} />
                  {user?.email}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-bold text-red-200 hover:text-red-100 transition-colors"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-sm font-bold text-white hover:text-yellow-300 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/auth/signup"
                  className="text-sm font-bold px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-yellow-300 transform hover:scale-105 transition-all shadow-md"
                >
                  Inscription
                </Link>
              </>
            )}
            <Link
              to="/booking"
              className="text-sm font-black px-6 py-2 bg-yellow-400 text-purple-900 rounded-lg hover:bg-white transform hover:scale-105 transition-all shadow-lg animate-bounce-custom"
            >
              🚀 Réserver
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t-4 border-yellow-400 bg-purple-700 bg-opacity-95">
            <div className="px-4 py-4 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block text-sm font-medium text-gray-600 hover:text-blue-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Mon tableau de bord
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      className="block text-sm font-medium text-gray-600 hover:text-blue-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/auth/signup"
                      className="block text-sm font-medium text-blue-600 hover:text-blue-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Inscription
                    </Link>
                  </>
                )}
                <Link
                  to="/booking"
                  className="block text-center text-sm font-medium px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  Réserver
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
