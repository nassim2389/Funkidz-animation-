export default function Gallery() {
  const images = Array(12).fill(null).map((_, i) => ({
    id: i,
    title: `Événement ${i + 1}`,
  }))

  const colorGradients = [
    'from-purple-400 to-pink-400',
    'from-pink-400 to-blue-400',
    'from-blue-400 to-green-400',
    'from-green-400 to-yellow-400',
    'from-yellow-400 to-red-400',
    'from-red-400 to-purple-400',
  ]

  return (
    <div className="pt-20">
      <section className="section bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl font-serif font-bold mb-4 animate-scale-in drop-shadow-lg">
            🎬 Galerie
          </h1>
          <p className="text-xl font-bold opacity-95 drop-shadow-md">
            Découvrez nos événements réussis et les sourires des enfants! ✨
          </p>
        </div>
      </section>

      <section className="section bg-gradient-to-b from-white to-slate-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((img, idx) => {
              const gradient = colorGradients[idx % colorGradients.length]
              const emojis = ['🎉', '🎊', '🎁', '🎈', '🎭', '🎪', '🎨', '🎵', '🎸', '🎤', '🎬', '🎯']
              return (
                <div 
                  key={img.id} 
                  className={`bg-gradient-to-b ${gradient} rounded-xl p-1 hover-lift transition-all`}
                >
                  <div className="aspect-square bg-white rounded-lg overflow-hidden flex items-center justify-center flex-col group cursor-pointer hover:shadow-2xl transition-all">
                    <div className="text-7xl mb-4 group-hover:animate-bounce-custom">
                      {emojis[idx]}
                    </div>
                    <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-center">
                      {img.title}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-orange-400 via-pink-400 to-red-400">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-serif font-bold mb-6 text-white drop-shadow-lg animate-bounce-custom">
            Vous voulez créer votre propre événement inoubliable? 🎉
          </h2>
          <p className="text-white text-xl font-bold mb-8 drop-shadow-md">
            Réservez maintenant et rejoignez les milliers de familles satisfaites!
          </p>
        </div>
      </section>
    </div>
  )
}
