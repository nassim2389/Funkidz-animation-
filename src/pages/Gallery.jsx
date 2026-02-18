export default function Gallery() {
  const images = Array(12).fill(null).map((_, i) => ({
    id: i,
    title: `Événement ${i + 1}`,
  }))

  return (
    <div className="pt-20">
      <section className="section bg-primary text-primary-foreground">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif font-bold mb-4">Galerie</h1>
          <p className="text-lg opacity-90">
            Découvrez nos événements réussis
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <div key={img.id} className="bg-muted rounded-lg overflow-hidden group cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-serif font-bold text-gray-400 mb-2">📸</div>
                    <p className="text-gray-500 font-medium">{img.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
