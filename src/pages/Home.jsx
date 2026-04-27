import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Users, Music, Trophy } from 'lucide-react'

export default function Home() {
  const services = [
    {
      icon: Sparkles,
      title: 'Magiciens',
      description: 'Des spectacles magiques captivants qui émerveilleront vos enfants.',
    },
    {
      icon: Users,
      title: 'Animateurs',
      description: 'Des professionnels créatifs pour animer vos événements.',
    },
    {
      icon: Music,
      title: 'DJ & Musique',
      description: 'Ambiance musicale et danse pour tous les âges.',
    },
    {
      icon: Trophy,
      title: 'Jeux & Compétitions',
      description: 'Des activités ludiques et des jeux passionnants.',
    },
  ]

  const stats = [
    { label: 'Enfants ravis', value: '5000+' },
    { label: 'Événements réussis', value: '800+' },
    { label: 'Années d\'expérience', value: '12' },
    { label: 'Professionnels', value: '50+' },
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-6xl font-serif font-bold mb-6 text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text animate-scale-in">
              Créons des moments inoubliables 🎉
            </h1>
            <p className="text-xl text-gray-700 mb-8 font-medium">
              Funkidz Animation vous propose des services d'animation professionnels et créatifs pour tous vos événements. Magiciens, clowns, animateurs et bien plus encore.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link 
                to="/booking" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Réserver maintenant
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/services" 
                className="inline-flex items-center gap-2 px-8 py-4 border-3 border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors"
              >
                Voir les services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features - Colorful badges */}
      <section className="py-12 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-100 to-blue-100 px-6 py-4 rounded-lg border-3 border-emerald-400 hover-lift">
              <span className="text-4xl">✨</span>
              <div>
                <p className="font-bold text-emerald-900">Animateurs vérifiés</p>
                <p className="text-sm text-emerald-700">Professionnels qualifiés</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-4 rounded-lg border-3 border-blue-400 hover-lift">
              <span className="text-4xl">🔒</span>
              <div>
                <p className="font-bold text-blue-900">Réservation sécurisée</p>
                <p className="text-sm text-blue-700">100% sécurisé</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-pink-100 to-red-100 px-6 py-4 rounded-lg border-3 border-pink-400 hover-lift">
              <span className="text-4xl">💬</span>
              <div>
                <p className="font-bold text-pink-900">Support 24/24</p>
                <p className="text-sm text-pink-700">Toujours disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white bg-opacity-20 backdrop-blur rounded-lg p-6 border-3 border-white hover-lift">
              <p className="text-5xl font-bold text-white mb-2">5000+</p>
              <p className="text-white font-bold text-lg">Enfants ravis</p>
            </div>
            <div className="text-center bg-white bg-opacity-20 backdrop-blur rounded-lg p-6 border-3 border-white hover-lift">
              <p className="text-5xl font-bold text-white mb-2">800+</p>
              <p className="text-white font-bold text-lg">Événements réussis</p>
            </div>
            <div className="text-center bg-white bg-opacity-20 backdrop-blur rounded-lg p-6 border-3 border-white hover-lift">
              <p className="text-5xl font-bold text-white mb-2">4.9/5</p>
              <p className="text-white font-bold text-lg">Note moyenne</p>
            </div>
            <div className="text-center bg-white bg-opacity-20 backdrop-blur rounded-lg p-6 border-3 border-white hover-lift">
              <p className="text-5xl font-bold text-white mb-2">50+</p>
              <p className="text-white font-bold text-lg">Professionnels</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-serif font-bold text-center mb-4 text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
            Nos services
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg font-medium">
            Une large gamme de services d'animation pour tous vos événements
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {services.map((service, idx) => {
              const Icon = service.icon
              const colors = [
                'from-purple-100 to-pink-100',
                'from-blue-100 to-cyan-100',
                'from-yellow-100 to-orange-100',
                'from-green-100 to-emerald-100',
              ]
              const borderColors = [
                'border-purple-400',
                'border-blue-400',
                'border-yellow-400',
                'border-green-400',
              ]
              return (
                <div key={idx} className={`bg-gradient-to-br ${colors[idx]} rounded-lg p-8 border-3 ${borderColors[idx]} hover:shadow-xl hover-lift transition-all`}>
                  <Icon size={40} className="text-gray-700 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-700 font-medium">{service.description}</p>
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <Link 
              to="/services" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Découvrir tous les services
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 text-white">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif font-bold mb-4">
            Prêt à créer un événement magique ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Réservez dès maintenant et recevez une réponse en moins de 24h
          </p>
          <Link 
            to="/booking" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Réserver un service
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center mb-12 text-gray-900">
            Pourquoi nous choisir ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-4">✓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professionnels expérimentés</h3>
              <p className="text-gray-600">
                Tous nos animateurs sont des professionnels vérifiés et expérimentés
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-4">✓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Réservation facile</h3>
              <p className="text-gray-600">
                Réservez en quelques clics et recevez une confirmation immédiate
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-4">✓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tarifs transparents</h3>
              <p className="text-gray-600">
                Pas de frais cachés, tous nos tarifs sont affichés clairement
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
