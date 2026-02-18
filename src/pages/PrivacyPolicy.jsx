export default function PrivacyPolicy() {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Politique de confidentialité</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8 prose prose-sm max-w-none">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Collecte des données</h2>
            <p className="text-gray-600 mb-4">
              Funkidz Animation collecte les informations suivantes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Adresse de l'événement</li>
              <li>Informations de paiement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Utilisation des données</h2>
            <p className="text-gray-600 mb-4">
              Vos données sont utilisées pour:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Traiter vos réservations</li>
              <li>Vous envoyer des confirmations par email</li>
              <li>Améliorer notre service</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Sécurité des données</h2>
            <p className="text-gray-600 mb-4">
              Nous prenons des mesures de sécurité appropriées pour protéger vos données contre les accès non autorisés, la modification ou la destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Droits RGPD</h2>
            <p className="text-gray-600 mb-4">
              Conformément au RGPD, vous avez le droit de:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier vos données</li>
              <li>Demander la suppression de vos données</li>
              <li>Porter plainte auprès de l'autorité de contrôle</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies</h2>
            <p className="text-gray-600 mb-4">
              Notre site utilise des cookies pour améliorer votre expérience utilisateur et analyser le trafic du site. Vous pouvez les désactiver dans les paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact</h2>
            <p className="text-gray-600">
              Pour toute question concernant la confidentialité, contactez-nous à privacy@funkidz.fr
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
