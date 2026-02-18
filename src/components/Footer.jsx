import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-16">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">Funkidz</h3>
            <p className="text-sm text-gray-400">
              Créons des moments inoubliables pour vos enfants avec des animations de qualité.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Tarifs</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Galerie</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Magiciens</li>
              <li>Clowns</li>
              <li>Animateurs</li>
              <li>DJ & Musique</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Tel: +33 1 23 45 67 89</li>
              <li>Email: info@funkidz.fr</li>
              <li>Adresse: Paris, France</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 py-8 flex justify-between items-center text-sm text-gray-400">
          <p>&copy; 2024 Funkidz Animation. Tous droits réservés.</p>
          <div className="space-x-6">
            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
