'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-20 left-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/3 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
            <Sparkles size={16} />
            <span className="text-sm font-medium">Créateurs de Moments Magiques</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-balance">
            Transformez Votre{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Événement
            </span>
            {' '} en Souvenir
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Des animateurs professionnels pour tous vos événements : anniversaires, mariages, séminaires d&apos;entreprise, et bien plus.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/booking">
              <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 text-lg px-8 py-6 h-auto">
                <Zap className="mr-2" size={20} />
                Réserver Maintenant
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" className="text-lg px-8 py-6 h-auto">
                Découvrir nos Services
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-12 space-y-4">
            <p className="text-sm text-muted-foreground">Confiance de plus de 5000 familles</p>
            <div className="flex justify-center gap-6 flex-wrap">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4.9★</div>
                <p className="text-xs text-muted-foreground">2500+ avis</p>
              </div>
              <div className="border-l border-border"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">10K+</div>
                <p className="text-xs text-muted-foreground">Événements réussis</p>
              </div>
              <div className="border-l border-border"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">50+</div>
                <p className="text-xs text-muted-foreground">Animateurs pros</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
