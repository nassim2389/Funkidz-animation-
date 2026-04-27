import { Sparkles, Users, Music, Laugh, Gamepad2, Palette } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Services() {
  const services = [
    {
      icon: Sparkles,
      title: 'Magiciens',
      description: 'Spectacles magiques captivants avec illusions et manipulations impressionnantes.',
      price: 'À partir de 250€',
      features: ['Spectacle 30-60 min', 'Interaction avec enfants', 'Accessoires inclus'],
      emoji: '✨',
      gradientBg: 'from-purple-400 to-pink-400',
      gradientText: 'from-purple-600 to-pink-600',
    },
    {
      icon: Laugh,
      title: 'Clowns & Jongleurs',
      description: 'Animation ludique et joyeuse avec jonglage, acrobaties et humour.',
      price: 'À partir de 200€',
      features: ['Performance interactive', 'Maquillage ludique', 'Ballons sculptés'],
      emoji: '🤡',
      gradientBg: 'from-pink-400 to-blue-400',
      gradientText: 'from-pink-600 to-blue-600',
    },
    {
      icon: Users,
      title: 'Animateurs',
      description: 'Professionnels créatifs pour encadrer les enfants et organiser les activités.',
      price: 'À partir de 180€',
      features: ['Jeux en groupe', 'Ateliers créatifs', 'Supervision complète'],
      emoji: '👥',
      gradientBg: 'from-blue-400 to-green-400',
      gradientText: 'from-blue-600 to-green-600',
    },
    {
      icon: Music,
      title: 'DJ & Musique',
      description: 'Animation musicale avec DJ, karaoké et piste de danse.',
      price: 'À partir de 300€',
      features: ['Équipement professionnel', 'Musicothèque complète', 'Karaoké inclus'],
      emoji: '🎵',
      gradientBg: 'from-green-400 to-yellow-400',
      gradientText: 'from-green-600 to-yellow-600',
    },
    {
      icon: Gamepad2,
      title: 'Jeux & Compétitions',
      description: 'Organisation de jeux et compétitions pour tous les âges.',
      price: 'À partir de 220€',
      features: ['Jeux variés', 'Récompenses', 'Arbitrage inclus'],
      emoji: '🎮',
      gradientBg: 'from-yellow-400 to-red-400',
      gradientText: 'from-yellow-600 to-red-600',
    },
    {
      icon: Palette,
      title: 'Ateliers Créatifs',
      description: 'Ateliers peinture, dessin, artisanat et création pour les enfants.',
      price: 'À partir de 150€',
      features: ['Matériel fourni', 'Créations à emporter', 'Encadrement créatif'],
      emoji: '🎨',
      gradientBg: 'from-red-400 to-purple-400',
      gradientText: 'from-red-600 to-purple-600',
    },
  ]

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="section bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl font-serif font-bold mb-4 animate-scale-in drop-shadow-lg">Nos Services</h1>
          <p className="text-xl font-semibold opacity-95">
            Une large gamme d'animations professionnelles pour tous vos événements
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section bg-gradient-to-b from-white to-slate-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon
              return (
                <div 
                  key={service.title} 
                  className={`bg-gradient-to-b ${service.gradientBg} rounded-xl p-1 hover-lift transition-all`}
                >
                  <div className="bg-white rounded-lg p-6 h-full flex flex-col">
                    {/* Emoji Header */}
                    <div className="text-5xl mb-4 animate-bounce-custom">{service.emoji}</div>
                    
                    <h3 className={`text-2xl font-serif font-bold mb-3 text-transparent bg-gradient-to-r ${service.gradientText} bg-clip-text`}>
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 font-medium">{service.description}</p>
                    
                    <div className={`mb-4 text-2xl font-bold text-transparent bg-gradient-to-r ${service.gradientText} bg-clip-text`}>
                      {service.price}
                    </div>

                    <ul className="space-y-2 mb-6 flex-grow text-sm">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-gray-600">
                          <span>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link to="/booking" className={`btn w-full text-center mt-auto bg-gradient-to-r ${service.gradientText} text-white font-bold hover:shadow-lg`}>
                      Réserver ce service
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-muted">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">
            Besoin d'une offre personnalisée ?
          </h2>
          <p className="text-secondary mb-8 max-w-2xl mx-auto">
            Contactez-nous pour discuter de votre événement spécifique et obtenir une offre adaptée.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Nous contacter
          </Link>
        </div>
      </section>
    </div>
  )
}
