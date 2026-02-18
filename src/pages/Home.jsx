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
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-6xl font-serif font-bold mb-6 text-gray-900">
              Créons des moments inoubliables
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Funkidz Animation vous propose des services d'animation professionnels et créatifs pour tous vos événements. Magiciens, clowns, animateurs et bien plus encore.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link 
                to="/booking" 
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Réserver maintenant
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/services" 
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-300 text-gray-900 rounded-lg font-medium hover:border-gray-400 transition-colors"
              >
                Voir les services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-blue-400 mb-2">{stat.value}</p>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center mb-4 text-gray-900">
            Nos services
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Une large gamme de services d'animation pour tous vos événements
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {services.map((service, idx) => {
              const Icon = service.icon
              return (
                <div key={idx} className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
                  <Icon size={40} className="text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
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
