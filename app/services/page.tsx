'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import mockDataService from '@/src/services/mockDataService.js';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: number;
  name: string;
  description: string;
  base_price: number;
  duration: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await mockDataService.getServices();
        setServices(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des services');
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <main className="bg-white dark:bg-slate-950 min-h-screen flex flex-col">
      <Navbar />

      {/* Header - Attrayant pour les enfants */}
      <div className="bg-gradient-to-b from-purple-100 via-pink-50 to-white dark:from-purple-950 dark:via-pink-950 dark:to-slate-950 border-b-4 border-purple-400 dark:border-purple-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-200 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-2 border-purple-400 dark:border-purple-600 animate-bounce-custom">
              <Sparkles size={20} />
              <span className="text-sm font-bold">Services Amusants!</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text animate-fade-in">
              Nos Services d&apos;Animation
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 font-semibold">
              Des professionnels qualifiés pour transformer votre événement en moment inoubliable! 🎉
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="flex-1 py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-purple-600" size={48} />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto text-center py-20">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Link href="/">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">Retour à l&apos;accueil</Button>
              </Link>
            </div>
          ) : services.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center py-20">
              <Sparkles size={48} className="mx-auto mb-4 text-purple-400" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">Aucun service disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const colors = [
                  'from-purple-400 to-pink-400',
                  'from-pink-400 to-blue-400',
                  'from-blue-400 to-green-400',
                  'from-green-400 to-yellow-400',
                  'from-yellow-400 to-red-400',
                  'from-red-400 to-purple-400',
                ];
                const gradientClass = colors[index % colors.length];
                
                return (
                  <Card 
                    key={service.id} 
                    className="group hover:shadow-2xl transition-all duration-300 hover-lift border-3 bg-white dark:bg-slate-900 overflow-hidden"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {/* Gradient Banner */}
                    <div className={`h-24 bg-gradient-to-r ${gradientClass} relative overflow-hidden`}>
                      <div className="absolute inset-0 animate-rotate-slow opacity-20">
                        <Sparkles className="absolute w-6 h-6" />
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text group-hover:scale-105 transition-transform duration-300 origin-left">
                        {service.name}
                      </CardTitle>
                      <CardDescription className="text-base font-semibold text-slate-600 dark:text-slate-400">
                        ⏱️ {service.duration}h par défaut
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{service.description}</p>

                      <div className="space-y-2 p-4 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-400 font-semibold">Tarif de base</span>
                          <span className={`text-3xl font-black text-transparent bg-gradient-to-r ${gradientClass} bg-clip-text`}>
                            {service.base_price}€
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">par heure</p>
                      </div>

                      <Link href={`/booking?service=${service.id}`} className="block pt-2 border-t-2 border-slate-200 dark:border-slate-800">
                        <Button className={`w-full bg-gradient-to-r ${gradientClass} text-white font-bold hover:scale-105 transition-transform duration-300 shadow-lg group/btn`}>
                          Réserver Maintenant
                          <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition" size={20} />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section - Attrayante */}
      {services.length > 0 && (
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 py-20 border-t-4 border-purple-600">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-5xl md:text-6xl font-black text-white animate-scale-in">
                Vous avez trouvé ce qu&apos;il vous faut? 🎊
              </h2>
              <p className="text-xl md:text-2xl text-white font-semibold">
                Commencez votre réservation maintenant et transformez votre événement en un moment magique!
              </p>
              <Link href="/booking">
                <Button className="bg-white hover:bg-slate-100 text-purple-600 font-bold text-lg px-10 py-7 h-auto hover-scale shadow-2xl">
                  🚀 Réserver Maintenant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
