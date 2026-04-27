export const metadata = {
  title: 'À Propos de Funkidz - Plateforme de Réservation d\'Animateurs',
  description: 'Funkidz est la plateforme leader de réservation d\'animateurs professionnels. Découvrez notre mission, nos valeurs et notre engagement.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 text-balance">
            À Propos de Funkidz
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Simplifier la réservation d&apos;animateurs professionnels pour les familles et les entreprises.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-16">
        
        <section>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Notre Mission</h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            Funkidz a été créée avec une mission simple : rendre la réservation d&apos;animateurs professionnels rapide, sécurisée et transparente. Nous connectons les meilleures talents avec les familles et les entreprises qui cherchent à faire de leurs événements des moments inoubliables.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Notre Approche</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="text-4xl font-bold text-blue-600">✓</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Qualité Vérifiée</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Tous nos animateurs sont vérifiés, expérimentés et certifiés pour garantir une qualité de service exceptionnelle.
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-blue-600">✓</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Transparence Totale</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Tarifs clairs, sans frais cachés. Vous savez exactement ce que vous payez dès le départ.
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-blue-600">✓</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Support 24/24</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Notre équipe est disponible pour répondre à vos questions et résoudre tout problème rapidement.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Nos Chiffres</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">5000+</div>
              <p className="text-slate-600 dark:text-slate-400">Familles satisfaites</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">50+</div>
              <p className="text-slate-600 dark:text-slate-400">Animateurs pros</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">10K+</div>
              <p className="text-slate-600 dark:text-slate-400">Événements réussis</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">4.9/5</div>
              <p className="text-slate-600 dark:text-slate-400">Note moyenne</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Pourquoi Funkidz?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-2xl text-blue-600 flex-shrink-0">•</div>
              <p className="text-slate-700 dark:text-slate-300"><strong>Sélection Rigoureuse:</strong> Chaque animateur est soigneusement sélectionné pour garantir l&apos;excellence.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl text-blue-600 flex-shrink-0">•</div>
              <p className="text-slate-700 dark:text-slate-300"><strong>Plateforme Sécurisée:</strong> Paiements cryptés, données protégées, garanties de qualité.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl text-blue-600 flex-shrink-0">•</div>
              <p className="text-slate-700 dark:text-slate-300"><strong>Réservation Simple:</strong> Trouvez et réservez en quelques clics seulement.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl text-blue-600 flex-shrink-0">•</div>
              <p className="text-slate-700 dark:text-slate-300"><strong>Support Réactif:</strong> Une équipe disponible pour vous aider à chaque étape.</p>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 dark:bg-slate-900 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Nous Contacter</h2>
          <div className="space-y-4 text-slate-700 dark:text-slate-300">
            <p><strong>Téléphone:</strong> <a href="tel:+33142685300" className="text-blue-600 hover:underline">+33 1 42 68 53 00</a></p>
            <p><strong>Email:</strong> <a href="mailto:contact@funkidz.fr" className="text-blue-600 hover:underline">contact@funkidz.fr</a></p>
            <p><strong>Adresse:</strong> 75002 Paris, Île-de-France, France</p>
            <p><strong>Horaires:</strong> Lun-Ven 9h-18h | Sam-Dim sur demande</p>
            <p><strong>Temps de réponse:</strong> Réponse sous 24h</p>
          </div>
        </section>
      </div>
    </div>
  );
}
