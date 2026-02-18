'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';

const pricingTiers = [
  {
    name: 'Basique',
    description: 'Parfait pour les petits événements',
    price: '150',
    duration: '2h',
    features: [
      'Animateur qualifié',
      'Activités adaptées à l\'âge',
      'Matériel inclus',
      'Jusqu\'à 20 enfants',
      'Email de confirmation',
    ],
    color: 'from-primary to-secondary',
    highlight: false,
  },
  {
    name: 'Premium',
    description: 'Le choix préféré pour les événements',
    price: '250',
    duration: '3h',
    features: [
      'Tout du plan Basique',
      'Deux animateurs',
      'Options supplémentaires',
      'Jusqu\'à 50 enfants',
      'Décoration thématique',
      'Assistante dédiée',
    ],
    color: 'from-secondary to-accent',
    highlight: true,
  },
  {
    name: 'Entreprise',
    description: 'Pour les grands événements et séminaires',
    price: 'Sur devis',
    duration: 'Personnalisable',
    features: [
      'Tout du plan Premium',
      'Équipe complète',
      'Animations sur mesure',
      'Plus de 50 enfants',
      'Coordination complète',
      'Support prioritaire',
      'Photographie incluse',
    ],
    color: 'from-accent to-primary',
    highlight: false,
  },
];

const optionsPricing = [
  { name: 'Décoration Thématique', price: '50€' },
  { name: 'Maquillage Professionnel', price: '40€' },
  { name: 'Goûter Animé', price: '60€' },
  { name: 'Photographie Professionnel', price: '80€' },
  { name: 'DJ et Piste de Danse', price: '100€' },
  { name: 'Gâteau Surprise', price: '30€' },
];

export default function PricingPage() {
  return (
    <main className="bg-background min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Tarifs Transparents</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Nos Tarifs
            </h1>
            <p className="text-xl text-muted-foreground">
              Des prix justes et compétitifs pour tous les budgets. Pas de frais cachés.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="flex-1 py-20">
        <div className="container mx-auto px-4">
          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative group hover:shadow-2xl transition-all duration-300 ${
                  tier.highlight ? 'md:scale-105 ring-2 ring-primary' : ''
                }`}
              >
                {tier.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-bold">
                      Le Plus Populaire
                    </div>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                  {/* Price */}
                  <div className="text-center py-6 border-b border-border">
                    <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {tier.price}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{tier.duration}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href="/booking" className="block">
                    <Button
                      className={`w-full text-lg py-6 h-auto ${
                        tier.highlight
                          ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90'
                          : ''
                      }`}
                      variant={tier.highlight ? 'default' : 'outline'}
                    >
                      Réserver Maintenant
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Options */}
          <div className="bg-card rounded-lg p-8 border border-border">
            <h2 className="text-3xl font-bold mb-2 text-center">Options Supplémentaires</h2>
            <p className="text-muted-foreground text-center mb-8">
              Personnalisez votre événement avec nos options premium
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {optionsPricing.map((option, index) => (
                <div key={index} className="flex justify-between items-center p-4 rounded-lg border border-border hover:bg-accent/5 transition">
                  <span className="font-medium">{option.name}</span>
                  <span className="text-primary font-bold">{option.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-2xl mx-auto mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Questions Fréquentes</h2>

            <div className="space-y-4">
              {[
                {
                  q: 'Les tarifs incluent-ils le déplacement ?',
                  a: 'Non, les tarifs affichés sont pour Paris intra-muros. Un supplément peut s\'appliquer selon le lieu.',
                },
                {
                  q: 'Puis-je annuler ma réservation ?',
                  a: 'Oui, annulation gratuite jusqu\'à 48h avant l\'événement. Au-delà, les frais s\'appliqueront selon nos conditions.',
                },
                {
                  q: 'Avez-vous des forfaits spéciaux pour les groupes ?',
                  a: 'Oui ! Nous proposons des tarifs réduits pour les réservations de plusieurs événements.',
                },
                {
                  q: 'Puis-je payer en plusieurs fois ?',
                  a: 'Nous acceptons les virements échelonnés. Contactez-nous pour discuter les modalités.',
                },
              ].map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">{item.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 text-center border border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Vous avez besoin d\'un devis personnalisé ?</h3>
            <p className="text-muted-foreground mb-6">
              Notre équipe est prête à créer un forfait sur mesure pour votre événement unique.
            </p>
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 text-lg px-8 py-6 h-auto">
                Nous Contacter
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
