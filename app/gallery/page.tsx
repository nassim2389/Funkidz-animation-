'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Image as ImageIcon, Star } from 'lucide-react';

const galleryImages = [
  {
    title: 'Anniversaire Enfants',
    category: 'Anniversaires',
    description: 'Fête d\'anniversaire réussie avec animations interactives',
  },
  {
    title: 'Spectacle Professionnel',
    category: 'Spectacles',
    description: 'Représentation spectaculaire et captivante',
  },
  {
    title: 'Animation Musicale',
    category: 'Animations Musicales',
    description: 'Ambiance musicale de qualité avec animateur professionnel',
  },
  {
    title: 'Atelier Créatif',
    category: 'Ateliers',
    description: 'Activité créative pour tous les enfants',
  },
  {
    title: 'Événement Familial',
    category: 'Événements',
    description: 'Animation d\'un événement familial réussi',
  },
  {
    title: 'Animation Entreprise',
    category: 'Entreprise',
    description: 'Animation professionnelle pour événement corporate',
  },
];

export default function GalleryPage() {
  return (
    <main className="bg-white dark:bg-slate-950 min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-b from-purple-100 via-pink-100 to-white dark:from-purple-950 dark:via-pink-950 dark:to-slate-950 border-b-4 border-purple-400 dark:border-purple-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-200 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-2 border-purple-400 dark:border-purple-600 animate-bounce-custom">
              <ImageIcon size={20} />
              <span className="text-sm font-bold">Nos Meilleures Réalisations</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text animate-fade-in">
              Galerie Professionnelle
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 font-semibold">
              Découvrez nos réalisations et événements réussis 🎉
            </p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="flex-1 py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => {
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
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-300 border-3 bg-white dark:bg-slate-900 overflow-hidden hover-lift hover-scale cursor-pointer"
                  style={{
                    borderColor: `hsl(${(index * 60) % 360}, 70%, 60%)`,
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* Image Placeholder avec Gradient Animé */}
                  <div className={`relative h-72 bg-gradient-to-br ${gradientClass} flex items-center justify-center overflow-hidden`}>
                    <div className="absolute inset-0 animate-rotate-slow opacity-30">
                      <ImageIcon size={80} className="absolute w-full h-full" />
                    </div>
                    <div className="relative text-center px-4 z-10">
                      <ImageIcon size={64} className="mx-auto mb-4 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" />
                      <p className="text-lg font-bold text-white">{image.title}</p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2" style={{ borderColor: `hsl(${(index * 60) % 360}, 70%, 60%)` }}>
                      <span className="text-xs font-bold" style={{ color: `hsl(${(index * 60) % 360}, 70%, 40%)` }}>{image.category}</span>
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 mt-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition">
                      {image.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{image.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 border-3 border-purple-300 dark:border-purple-700 text-center hover-lift">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text mb-2">
                5000+
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-bold">Événements réussis</p>
            </div>
            <div className="p-8 rounded-lg bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-950/30 dark:to-green-950/30 border-3 border-blue-300 dark:border-blue-700 text-center hover-lift">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text mb-2">
                50+
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-bold">Animateurs qualifiés</p>
            </div>
            <div className="p-8 rounded-lg bg-gradient-to-br from-yellow-100 to-red-100 dark:from-yellow-950/30 dark:to-red-950/30 border-3 border-yellow-300 dark:border-yellow-700 text-center hover-lift">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="text-5xl font-black text-transparent bg-gradient-to-r from-yellow-600 to-red-600 dark:from-yellow-400 dark:to-red-400 bg-clip-text">4.9</div>
                <Star size={40} className="text-yellow-500 dark:text-yellow-400 fill-current" />
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-bold">Note moyenne</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
