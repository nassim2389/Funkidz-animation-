'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const galleryImages = [
  {
    title: 'Anniversaire Enfants',
    category: 'Anniversaires',
    description: 'Fête d\'anniversaire colorée avec animations interactives',
  },
  {
    title: 'Spectacle Magique',
    category: 'Spectacles',
    description: 'Moment magique avec tour de magie captivant',
  },
  {
    title: 'DJ et Danse',
    category: 'Animations Musicales',
    description: 'Ambiance dansante avec DJ professionnel',
  },
  {
    title: 'Face Painting',
    category: 'Activités',
    description: 'Maquillage créatif pour tous les enfants',
  },
  {
    title: 'Mariage Famille',
    category: 'Événements',
    description: 'Animation d\'un mariage avec enfants enchantés',
  },
  {
    title: 'Séminaire Entreprise',
    category: 'Entreprise',
    description: 'Animation team building pour enfants du personnel',
  },
];

export default function GalleryPage() {
  return (
    <main className="bg-background min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Nos Réalisations</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Galerie Photos
            </h1>
            <p className="text-xl text-muted-foreground">
              Découvrez nos plus beaux moments et événements réussis
            </p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <Card
                key={index}
                className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                {/* Image Placeholder */}
                <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative text-center px-4">
                    <Sparkles size={48} className="mx-auto mb-2 text-primary opacity-60 group-hover:opacity-100 transition" />
                    <p className="text-sm text-foreground font-medium">{image.title}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-3">
                    <span className="text-xs font-medium">{image.category}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                  <p className="text-sm text-muted-foreground">{image.description}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                5000+
              </div>
              <p className="text-muted-foreground mt-2">Événements réussis</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                50+
              </div>
              <p className="text-muted-foreground mt-2">Animateurs qualifiés</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                4.9★
              </div>
              <p className="text-muted-foreground mt-2">Note moyenne clients</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
