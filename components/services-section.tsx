'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Music, Gamepad2, Sparkles, Mic2, Wand2 } from 'lucide-react';

const services = [
  {
    icon: Mic2,
    title: 'Animation Musicale',
    description: 'DJ professionnel et animations musicales pour créer l\'ambiance parfaite.',
  },
  {
    icon: Music,
    title: 'Divertissement',
    description: 'Spectacles et animations variées adaptées à tous les types d\'événements.',
  },
  {
    icon: Gamepad2,
    title: 'Activités Interactives',
    description: 'Jeux et animations engageantes pour divertir tous vos invités.',
  },
  {
    icon: Sparkles,
    title: 'Décoration & Ambiance',
    description: 'Services de décoration et d\'ambiance pour transformer votre espace.',
  },
  {
    icon: Users,
    title: 'Coordination Événementielle',
    description: 'Orchestration complète de votre événement du début à la fin.',
  },
  {
    icon: Wand2,
    title: 'Spectacles Sur Mesure',
    description: 'Créations personnalisées adaptées à vos besoins spécifiques.',
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 md:py-40 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
            <Sparkles size={16} />
            <span className="text-sm font-medium">Nos Services</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
            Services Professionnels <span className="text-blue-600 dark:text-blue-400">d&apos;Animation</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Tout ce dont vous avez besoin pour créer un événement mémorable
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700">
                <CardHeader>
                  <div className="w-14 h-14 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/services">
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold text-lg px-8 py-6 h-auto">
              Voir Tous les Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
