import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Clock, Users, CheckCircle } from 'lucide-react'

export default function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Mock data - à remplacer par appel API
  const service = {
    id: 1,
    title: 'Magicien',
    description: 'Un spectacle de magie captivant pour tous les âges',
    longDescription: 'Notre magicien professionnel offre un spectacle interactif et amusant qui émerveillera les enfants et les adultes. Les tours de magie sont adaptés à l\'âge des enfants et incluent de l\'interaction avec le public.',
    price: 250,
    duration: 60,
    maxChildren: 30,
    rating: 4.8,
    reviews: 24,
    image: 'https://via.placeholder.com/600x400',
    features: [
      'Spectacle interactif de 60 minutes',
      'Tours de magie adaptés à tous les âges',
      'Matériel fourni',
      'Clown créatif et sympathique',
      'Adapté à l\'intérieur comme à l\'extérieur',
      'Animation personnalisée',
    ],
    reviews_list: [
      { author: 'Jean D.', rating: 5, text: 'Excellent ! Les enfants ont adoré.' },
      { author: 'Marie M.', rating: 5, text: 'Service professionnel et enthousiaste.' },
      { author: 'Thomas B.', rating: 4, text: 'Très bien, un peu cher mais ça en vaut la peine.' },
    ]
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            Retour
          </button>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            <img
              src={service.image}
              alt={service.title}
              className="w-full rounded-lg shadow-sm"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{service.title}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(service.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-900">{service.rating}</span>
                <span className="text-gray-600">({service.reviews} avis)</span>
              </div>

              <p className="text-gray-600 text-lg mb-6">{service.longDescription}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Clock size={20} />
                    Durée
                  </div>
                  <p className="font-bold text-gray-900">{service.duration} min</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Users size={20} />
                    Max enfants
                  </div>
                  <p className="font-bold text-gray-900">{service.maxChildren}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-2">Prix</p>
                  <p className="text-2xl font-bold text-blue-600">{service.price}€</p>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Réserver ce service
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ce qui est inclus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Avis clients</h2>
          <div className="space-y-6">
            {service.reviews_list.map((review, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900">{review.author}</h4>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
