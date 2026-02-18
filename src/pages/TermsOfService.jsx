export default function TermsOfService() {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Conditions d'utilisation</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8 prose prose-sm max-w-none">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptation des conditions</h2>
            <p className="text-gray-600 mb-4">
              En utilisant notre plateforme Funkidz Animation, vous acceptez l'intégralité de ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Utilisation du service</h2>
            <p className="text-gray-600 mb-4">
              Vous acceptez d'utiliser Funkidz Animation uniquement à des fins légales et en conformité avec toutes les lois et réglementations applicables. Vous ne devez pas utiliser notre service pour:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Violer les droits d'autrui</li>
              <li>Transmettre du contenu offensant ou nuisible</li>
              <li>Perturber le fonctionnement normal du service</li>
              <li>Accéder sans autorisation à nos systèmes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Propriété intellectuelle</h2>
            <p className="text-gray-600 mb-4">
              Tout contenu présent sur Funkidz Animation, y compris textes, images et logos, est protégé par les droits d'auteur. Vous ne pouvez pas reproduire ou distribuer ce contenu sans autorisation écrite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Responsabilité limitée</h2>
            <p className="text-gray-600 mb-4">
              Funkidz Animation n'est pas responsable des dommages indirects ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser notre service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Modifications</h2>
            <p className="text-gray-600 mb-4">
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront effectives dès la publication sur notre site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact</h2>
            <p className="text-gray-600">
              Pour toute question concernant ces conditions, contactez-nous à contact@funkidz.fr
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
