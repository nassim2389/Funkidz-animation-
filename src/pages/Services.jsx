import { Sparkles, Users, Music, Laugh, Gamepad2, Palette } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Services() {
  const services = [
    {
      icon: Sparkles,
      title: 'Magiciens',
      description: 'Spectacles magiques captivants avec illusions et manipulations impressionnantes.',
      price: 'À partir de 250€',
      features: ['Spectacle 30-60 min', 'Interaction avec enfants', 'Accessoires inclus']
    },
    {
      icon: Laugh,
      title: 'Clowns & Jongleurs',
      description: 'Animation ludique et joyeuse avec jonglage, acrobaties et humour.',
      price: 'À partir de 200€',
      features: ['Performance interactive', 'Maquillage ludique', 'Ballons sculptés']
    },
    {
      icon: Users,
      title: 'Animateurs',
      description: 'Professionnels créatifs pour encadrer les enfants et organiser les activités.',
      price: 'À partir de 180€',
      features: ['Jeux en groupe', 'Ateliers créatifs', 'Supervision complète']
    },
    {
      icon: Music,
      title: 'DJ & Musique',
      description: 'Animation musicale avec DJ, karaoké et piste de danse.',
      price: 'À partir de 300€',
      features: ['Équipement professionnel', 'Musicothèque complète', 'Karaoké inclus']
    },
    {
      icon: Gamepad2,
      title: 'Jeux & Compétitions',
      description: 'Organisation de jeux et compétitions pour tous les âges.',
      price: 'À partir de 220€',
      features: ['Jeux variés', 'Récompenses', 'Arbitrage inclus']
    },
    {
      icon: Palette,
      title: 'Ateliers Créatifs',
      description: 'Ateliers peinture, dessin, artisanat et création pour les enfants.',
      price: 'À partir de 150€',
      features: ['Matériel fourni', 'Créations à emporter', 'Encadrement créatif']
    },
  ]

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="section bg-primary text-primary-foreground">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif font-bold mb-4">Nos Services</h1>
          <p className="text-lg opacity-90">
            Une large gamme d'animations professionnelles pour tous vos événements
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div key={service.title} className="card flex flex-col">
                  <div className="mb-4">
                    <Icon size={40} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-2 text-primary">
                    {service.title}
                  </h3>
                  <p className="text-secondary text-sm mb-4">{service.description}</p>
                  
                  <div className="mb-4 text-lg font-semibold text-primary">
                    {service.price}
                  </div>

                  <ul className="space-y-2 mb-6 flex-grow text-sm">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-secondary">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to="/booking" className="btn btn-secondary text-center mt-auto">
                    Réserver ce service
                  </Link>
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
