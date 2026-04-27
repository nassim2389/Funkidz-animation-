'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';

const pricingTiers = [
  {
    name: 'Forfait Essentiel',
    description: 'Idéal pour les petits événements',
    price: '150',
    duration: '2h',
    features: [
      '✓ Animateur qualifié et vérifié',
      '✓ Activités adaptées à l\'âge des enfants',
      '✓ Matériel et équipement inclus',
      '✓ Jusqu\'à 20 participants',
      '✓ Confirmation par email',
    ],
    color: 'from-blue-500 to-blue-600',
    highlight: false,
  },
  {
    name: 'Forfait Professionnel',
    description: 'Le choix pour des événements réussis',
    price: '250',
    duration: '3h',
    features: [
      '✓ Tous les avantages Essentiel',
      '✓ Deux animateurs professionnels',
      '✓ Options supplémentaires incluses',
      '✓ Jusqu\'à 50 participants',
      '✓ Décoration thématique',
      '✓ Coordinatrice dédiée',
      '✓ Support prioritaire',
    ],
    color: 'from-blue-600 to-blue-700',
    highlight: true,
  },
  {
    name: 'Forfait Sur Mesure',
    description: 'Pour vos événements exceptionnels',
    price: 'Sur devis',
    duration: 'Flexible',
    features: [
      '✓ Tous les avantages Professionnel',
      '✓ Équipe complète personnalisée',
      '✓ Animations sur mesure',
      '✓ Nombre de participants illimité',
      '✓ Coordination complète de l\'événement',
      '✓ Support premium 24/24',
      '✓ Photographies professionnelles',
      '✓ Services additionnels personnalisés',
    ],
    color: 'from-blue-700 to-blue-800',
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
    <main className="bg-white dark:bg-slate-950 min-h-screen flex flex-col">
      <Navbar />

      {/* Header - Coloré et ludique */}
      <div className="bg-gradient-to-b from-yellow-100 via-pink-100 to-white dark:from-yellow-950 dark:via-pink-950 dark:to-slate-950 border-b-4 border-yellow-400 dark:border-yellow-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-200 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-300 border-2 border-yellow-400 dark:border-yellow-600 animate-bounce-custom">
              <Sparkles size={20} />
              <span className="text-sm font-bold">Tarifs Transparents & Juste</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-transparent bg-gradient-to-r from-yellow-600 via-pink-600 to-orange-600 dark:from-yellow-400 dark:via-pink-400 dark:to-orange-400 bg-clip-text animate-fade-in">
              Tarification Transparente
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 font-semibold">
              Des prix justes pour tous vos événements. Aucun frais caché! 💰
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="flex-1 py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4">
          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {pricingTiers.map((tier, index) => {
              const tierColors = [
                { card: 'border-blue-300 dark:border-blue-700', badge: 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300', gradient: 'from-blue-400 to-cyan-400' },
                { card: 'border-pink-300 dark:border-pink-700', badge: 'bg-pink-100 dark:bg-pink-950/50 text-pink-800 dark:text-pink-300', gradient: 'from-pink-400 to-rose-400' },
                { card: 'border-purple-300 dark:border-purple-700', badge: 'bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300', gradient: 'from-purple-400 to-indigo-400' },
              ];
              const colors = tierColors[index % tierColors.length];

              return (
                <Card
                  key={index}
                  className={`relative group hover:shadow-2xl transition-all duration-300 border-3 ${colors.card} bg-white dark:bg-slate-900 overflow-hidden hover-lift ${
                    tier.highlight ? 'md:scale-105 ring-4 ring-offset-2 ring-yellow-400 dark:ring-offset-slate-950' : ''
                  }`}
                >
                  {/* Top Gradient Bar */}
                  <div className={`h-16 bg-gradient-to-r ${colors.gradient}`}></div>

                  {tier.highlight && (
                    <div className="absolute top-0 right-6 -translate-y-1/2">
                      <div className={`${colors.badge} px-4 py-2 rounded-full text-sm font-black border-2`}>
                        ⭐ Le Plus Populaire!
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center pt-6">
                    <CardTitle className="text-3xl font-black text-slate-900 dark:text-white">
                      {tier.name}
                    </CardTitle>
                    <CardDescription className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-8">
                    {/* Price */}
                    <div className="text-center py-6 border-b-2 border-slate-200 dark:border-slate-800">
                      <div className={`text-6xl font-black text-transparent bg-gradient-to-r ${colors.gradient} bg-clip-text`}>
                        {tier.price}
                      </div>
                      <p className="text-base text-slate-600 dark:text-slate-400 font-semibold mt-2">⏱️ {tier.duration}</p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex gap-3 items-start animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                          <span className={`text-lg`}>✨</span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link href="/booking" className="block pt-2">
                      <Button
                        className={`w-full text-lg py-6 h-auto font-bold hover-scale shadow-lg ${
                          tier.highlight
                            ? `bg-gradient-to-r ${colors.gradient} text-white`
                            : 'bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-2'
                        }`}
                      >
                        🚀 Réserver Maintenant
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Options */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg p-10 border-3 border-orange-300 dark:border-orange-700 shadow-lg">
            <h2 className="text-4xl font-black text-center mb-2 text-transparent bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text">
              🎨 Options Supplémentaires
            </h2>
            <p className="text-center text-slate-600 dark:text-slate-400 font-semibold mb-8">
              Personnalisez votre événement avec nos options premium
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {optionsPricing.map((option, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-5 rounded-lg bg-white dark:bg-slate-900 border-2 border-orange-200 dark:border-orange-800 hover:shadow-lg hover-lift transition-all"
                >
                  <span className="font-bold text-slate-900 dark:text-white">{option.name}</span>
                  <span className="text-xl font-black text-transparent bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 bg-clip-text">
                    {option.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-2xl mx-auto mt-20">
            <h2 className="text-4xl font-black mb-12 text-center text-transparent bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text">
              ❓ Questions Fréquentes
            </h2>

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
                <Card key={index} className="border-2 border-green-300 dark:border-green-700 hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">✅ {item.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{item.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 dark:from-pink-900 dark:via-purple-900 dark:to-blue-900 rounded-lg p-12 text-center border-4 border-pink-300 dark:border-pink-700 shadow-2xl">
            <h3 className="text-4xl md:text-5xl font-black text-white mb-4 animate-scale-in">
              Besoin d&apos;un devis? 🎁
            </h3>
            <p className="text-xl text-white font-semibold mb-8">
              Notre équipe crée un forfait personnalisé pour votre événement unique!
            </p>
            <Link href="/contact">
              <Button className="bg-white hover:bg-slate-100 text-pink-600 font-bold text-lg px-10 py-7 h-auto hover-scale shadow-2xl">
                📞 Nous Contacter
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
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
