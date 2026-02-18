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
      <section className="section bg-primary text-primary-foreground">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif font-bold mb-4">Tarifs</h1>
          <p className="text-lg opacity-90">
            Des tarifs transparents pour tous les budgets
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`card ${pkg.highlighted ? 'ring-2 ring-primary shadow-lg' : ''}`}
              >
                {pkg.highlighted && (
                  <div className="mb-4 inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    POPULAIRE
                  </div>
                )}
                <h3 className="text-2xl font-serif font-bold text-primary mb-2">
                  {pkg.name}
                </h3>
                <p className="text-secondary text-sm mb-6">{pkg.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">{pkg.price}€</span>
                  <span className="text-secondary ml-2">{pkg.duration}</span>
                </div>

                <button className={`w-full btn mb-8 ${pkg.highlighted ? 'btn-primary' : 'btn-secondary'}`}>
                  Sélectionner
                </button>

                <div className="space-y-4">
                  {pkg.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-muted">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="section-header">
            <h2>Questions Fréquentes</h2>
            <p>Tout ce que vous devez savoir sur nos tarifs</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {[
              {
                q: 'Puis-je combiner plusieurs services ?',
                a: 'Oui, bien sûr ! Nous proposons des offres combinées avec des réductions.'
              },
              {
                q: 'Y a-t-il des frais de déplacement ?',
                a: 'Non, les frais de déplacement sont inclus dans nos tarifs.'
              },
              {
                q: 'Quel est le délai de réservation ?',
                a: 'Nous recommandons une réservation 2 semaines avant l\'événement.'
              },
              {
                q: 'Proposez-vous des forfaits groupes ?',
                a: 'Oui, contactez-nous pour les offres spéciales groupes.'
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-border">
                <h4 className="font-semibold text-primary mb-2">{faq.q}</h4>
                <p className="text-secondary text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Prêt à réserver ?</h2>
          <Link to="/booking" className="btn btn-primary">
            Réserver maintenant
          </Link>
        </div>
      </section>
    </div>
  )
}
