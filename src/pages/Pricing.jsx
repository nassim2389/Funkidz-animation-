import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Pricing() {
  const packages = [
    {
      name: 'Starter',
      description: 'Pour les petits événements',
      price: '200',
      duration: 'par heure',
      features: [
        'Un animateur',
        'Durée 1-2 heures',
        'Jeux et activités',
        'Support par email',
      ],
      highlighted: false,
    },
    {
      name: 'Professional',
      description: 'Le choix populaire',
      price: '400',
      duration: 'par 3 heures',
      features: [
        'Deux professionnels',
        'Durée 3-4 heures',
        'Activités variées',
        'Décoration incluse',
        'Support prioritaire',
        'Surprise spéciale',
      ],
      highlighted: true,
    },
    {
      name: 'Premium',
      description: 'Pour les événements exceptionnels',
      price: '800',
      duration: 'par jour',
      features: [
        'Équipe complète',
        'Durée 6+ heures',
        'Animation personnalisée',
        'Décoration thématique',
        'Support 24/7',
        'Photographe inclus',
      ],
      highlighted: false,
    },
  ]

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="section bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl font-serif font-bold mb-4 text-white drop-shadow-lg">
            Tarifs
          </h1>
          <p className="text-xl text-white font-bold drop-shadow-md">
            Des tarifs transparents pour tous les budgets
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section bg-gradient-to-b from-white to-slate-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => {
              const colors = [
                { bg: 'from-blue-100 to-cyan-100', border: 'border-blue-400', text: 'text-blue-600', button: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
                { bg: 'from-purple-100 to-pink-100', border: 'border-purple-400', text: 'text-purple-600', button: 'bg-gradient-to-r from-purple-600 to-pink-600' },
                { bg: 'from-green-100 to-emerald-100', border: 'border-green-400', text: 'text-green-600', button: 'bg-gradient-to-r from-green-500 to-emerald-500' },
              ]
              const emojis = ['⭐', '👑', '💎']
              const color = colors[idx]
              return (
                <div
                  key={pkg.name}
                  className={`bg-gradient-to-b ${color.bg} rounded-xl border-4 ${color.border} p-8 hover-lift transition-all ${pkg.highlighted ? 'ring-2 ring-offset-2 ring-purple-400 shadow-2xl' : ''}`}
                >
                  {pkg.highlighted && (
                    <div className="mb-4 inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full">
                      🌟 POPULAIRE
                    </div>
                  )}
                  <div className="text-5xl mb-4">{emojis[idx]}</div>
                  <h3 className={`text-3xl font-serif font-bold mb-3 ${color.text}`}>
                    {pkg.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 font-medium">{pkg.description}</p>

                  <div className="mb-6 bg-white bg-opacity-70 rounded-lg p-4">
                    <span className={`text-5xl font-black ${color.text}`}>{pkg.price}€</span>
                    <span className="text-gray-600 ml-2 font-bold">{pkg.duration}</span>
                  </div>

                  <button className={`w-full btn text-white font-bold text-lg mb-8 hover:shadow-lg hover-scale ${color.button}`}>
                    🚀 Sélectionner
                  </button>

                  <div className="space-y-4">
                    {pkg.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <Check size={24} className={`${color.text} flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-serif font-bold text-center mb-4 text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            Questions Fréquentes
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg font-medium">Tout ce que vous devez savoir sur nos tarifs</p>

          <div className="max-w-2xl mx-auto space-y-6">
            {[
              {
                q: 'Puis-je combiner plusieurs services ?',
                a: 'Oui, bien sûr ! Nous proposons des offres combinées avec des réductions.',
              },
              {
                q: 'Y a-t-il des frais de déplacement ?',
                a: 'Non, les frais de déplacement sont inclus dans nos tarifs.',
              },
              {
                q: 'Quel est le délai de réservation ?',
                a: 'Nous recommandons une réservation 2 semaines avant l\'événement.',
              },
              {
                q: 'Proposez-vous des forfaits groupes ?',
                a: 'Oui, contactez-nous pour les offres spéciales groupes.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-gradient-to-r from-white to-slate-50 p-6 rounded-lg border-3 border-blue-300 hover-lift">
                <h4 className="font-bold text-lg text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600 font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-r from-orange-400 via-pink-400 to-red-400">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-serif font-bold mb-6 text-white drop-shadow-lg">
            Prêt à réserver ?
          </h2>
          <p className="text-white text-xl font-bold mb-8 drop-shadow-md">
            Créons ensemble des moments inoubliables pour vos enfants!
          </p>
          <Link to="/booking" className="inline-block px-10 py-4 bg-white text-transparent bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text font-black text-xl hover:shadow-2xl hover-scale transition-all rounded-lg border-4 border-white">
            Réserver maintenant
          </Link>
        </div>
      </section>
    </div>
  )
}
