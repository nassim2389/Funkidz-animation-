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
    <main className="bg-background min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Services Complètes</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Nos Services d&apos;Animation
            </h1>
            <p className="text-xl text-muted-foreground">
              Des professionnels qualifiés pour transformer votre événement en moment inoubliable
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="flex-1 py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin" size={48} />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto text-center py-20">
              <p className="text-destructive mb-4">{error}</p>
              <Link href="/">
                <Button>Retour à l&apos;accueil</Button>
              </Link>
            </div>
          ) : services.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center py-20">
              <Sparkles size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Aucun service disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <CardTitle className="text-2xl group-hover:text-primary transition">
                      {service.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {service.duration}h par défaut
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground">{service.description}</p>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Tarif de base</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {service.base_price}€
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">par heure</p>
                    </div>

                    <Link href={`/booking?service=${service.id}`} className="block pt-4 border-t border-border">
                      <Button className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 group/btn">
                        Réserver
                        <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition" size={18} />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      {services.length > 0 && (
        <div className="bg-card border-t border-border py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Vous avez trouvé ce qu&apos;il vous faut ?
              </h2>
              <p className="text-lg text-muted-foreground">
                Commencez votre réservation maintenant et transformez votre événement en un moment magique.
              </p>
              <Link href="/booking">
                <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 text-lg px-8 py-6 h-auto">
                  Réserver Maintenant
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
