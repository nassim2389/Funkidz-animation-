'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Users, Music, Wand2, Laugh, Gamepad2 } from 'lucide-react';

const services = [
  {
    icon: Laugh,
    title: 'Clown & Magicien',
    description: 'Rires garantis avec nos clowns et magiciens talentueux qui captiveront petits et grands.',
    color: 'from-primary to-secondary',
  },
  {
    icon: Music,
    title: 'DJ & Animation Musicale',
    description: 'Ambiance dansante et musicale avec nos DJ expérimentés et équipement professionnel.',
    color: 'from-secondary to-accent',
  },
  {
    icon: Gamepad2,
    title: 'Jeux & Animations Interactives',
    description: 'Activités amusantes et engageantes pour tous les âges pendant votre événement.',
    color: 'from-accent to-primary',
  },
  {
    icon: Sparkles,
    title: 'Décoration & Ambiance',
    description: 'Transformation complète de votre espace avec décor thématique et éclairage spécial.',
    color: 'from-primary via-secondary to-accent',
  },
  {
    icon: Users,
    title: 'Animateur Événementiel',
    description: 'Professionnels pour animer et orchestrer votre événement du début à la fin.',
    color: 'from-secondary to-primary',
  },
  {
    icon: Wand2,
    title: 'Spectacles Sur Mesure',
    description: 'Créations personnalisées adaptées à votre thème et vos besoins spécifiques.',
    color: 'from-accent to-secondary',
  },
];

export function ServicesSection() {
  return (
    <section className="py-20 md:py-32 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
            <Sparkles size={16} />
            <span className="text-sm font-medium">Nos Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Tout ce dont vous avez besoin pour un événement <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">magique</span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-shadow border-border/50">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} p-2.5 mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/services">
            <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 text-lg px-8 py-6 h-auto">
              Voir Tous les Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
