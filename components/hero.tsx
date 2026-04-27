'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative py-24 md:py-40 overflow-hidden bg-gradient-to-b from-blue-50 via-purple-50 to-white dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Main Headline */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-balance">
              🎉 Plateforme de Réservation d&apos;Animateurs Professionnels
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 text-pretty max-w-3xl font-semibold">
              Réservez des animateurs qualifiés pour vos événements. Processus simple, sécurisé et amusant!
            </p>

            {/* Key Features */}
            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 px-4 py-3 rounded-lg border-2 border-emerald-200 dark:border-emerald-800 hover-lift">
                <span className="text-2xl">✨</span>
                <span className="font-bold">Animateurs vérifiés</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 px-4 py-3 rounded-lg border-2 border-blue-200 dark:border-blue-800 hover-lift">
                <span className="text-2xl">🔒</span>
                <span className="font-bold">Réservation sécurisée</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-950/20 dark:to-red-950/20 px-4 py-3 rounded-lg border-2 border-pink-200 dark:border-pink-800 hover-lift">
                <span className="text-2xl">💬</span>
                <span className="font-bold">Support 24/24</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-in-left">
            <Link href="/booking" className="inline-block">
              <Button size="lg" className="gap-2 text-base h-16 px-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover-scale">
                🚀 Commencer Maintenant
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/services" className="inline-block">
              <Button size="lg" variant="outline" className="text-base h-16 px-10 font-bold border-3 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                📋 Voir les Services
              </Button>
            </Link>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-6 md:gap-8 pt-12 border-t-4 border-purple-300 dark:border-purple-700">
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-300 dark:border-purple-700 text-center hover-lift">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text">5000+</div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">🎊 Familles satisfaites</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-950/30 dark:to-green-950/30 border-2 border-blue-300 dark:border-blue-700 text-center hover-lift">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text">10K+</div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">🎉 Événements réussis</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-yellow-100 to-red-100 dark:from-yellow-950/30 dark:to-red-950/30 border-2 border-yellow-300 dark:border-yellow-700 text-center hover-lift">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-yellow-600 to-red-600 dark:from-yellow-400 dark:to-red-400 bg-clip-text">4.9/5</div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">⭐ Note moyenne</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
