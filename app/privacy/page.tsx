export const metadata = {
  title: 'Politique de Confidentialité - Funkidz',
  description: 'Politique de confidentialité et protection des données RGPD de Funkidz.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto prose">
        <h1>Politique de Confidentialité & RGPD</h1>

        <h2>1. Responsable du traitement</h2>
        <p>
          Funkidz - Contact: contact@funkidz.fr
        </p>

        <h2>2. Données collectées</h2>
        <p>
          Nous collectons les données suivantes:
        </p>
        <ul>
          <li>Informations d'identification (nom, prénom, email)</li>
          <li>Informations de contact (téléphone, adresse)</li>
          <li>Informations de réservation (date, service, options)</li>
          <li>Informations de paiement (traitées via Stripe)</li>
          <li>Données d'utilisation du site</li>
        </ul>

        <h2>3. Finalités du traitement</h2>
        <ul>
          <li>Traitement des réservations et des paiements</li>
          <li>Communication avec les clients</li>
          <li>Amélioration du service</li>
          <li>Conformité légale</li>
          <li>Marketing (avec consentement)</li>
        </ul>

        <h2>4. Base légale</h2>
        <p>
          Le traitement de vos données est fondé sur:
        </p>
        <ul>
          <li>L'exécution du contrat de service</li>
          <li>Votre consentement explicite</li>
          <li>Les obligations légales</li>
        </ul>

        <h2>5. Destinataires des données</h2>
        <p>
          Vos données sont partagées avec:
        </p>
        <ul>
          <li>Les animateurs (pour l'exécution de la prestation)</li>
          <li>Stripe (pour le paiement sécurisé)</li>
          <li>Les autorités légales (si requis)</li>
        </ul>

        <h2>6. Durée de conservation</h2>
        <ul>
          <li>Données de compte: tant que le compte est actif</li>
          <li>Données de réservation: 3 ans après la prestation</li>
          <li>Données de paiement: 5 ans (légalement exigé)</li>
          <li>Données de contact: 2 ans après dernière interaction</li>
        </ul>

        <h2>7. Droits des utilisateurs (RGPD)</h2>
        <p>
          Vous disposez des droits suivants:
        </p>
        <ul>
          <li><strong>Droit d'accès:</strong> Accéder à vos données personnelles</li>
          <li><strong>Droit de rectification:</strong> Corriger vos données inexactes</li>
          <li><strong>Droit à l'oubli:</strong> Supprimer vos données (sous certaines conditions)</li>
          <li><strong>Droit à la limitation:</strong> Limiter le traitement</li>
          <li><strong>Droit à la portabilité:</strong> Recevoir vos données dans un format structuré</li>
          <li><strong>Droit d'opposition:</strong> Vous opposer à certains traitements</li>
        </ul>

        <h2>8. Exercer vos droits</h2>
        <p>
          Pour exercer vos droits, contactez-nous à: contact@funkidz.fr avec votre demande et une preuve d'identité.
        </p>

        <h2>9. Cookies</h2>
        <p>
          Notre site utilise des cookies pour:
        </p>
        <ul>
          <li>Maintenir votre session</li>
          <li>Personnaliser votre expérience</li>
          <li>Analyser l'utilisation du site</li>
        </ul>
        <p>
          Vous pouvez configurer votre navigateur pour accepter ou refuser les cookies.
        </p>

        <h2>10. Consentement pour le marketing</h2>
        <p>
          Nous vous enverrons des e-mails promotionnels uniquement si vous avez consenti. Vous pouvez vous désabonner à tout moment.
        </p>

        <h2>11. Sécurité des données</h2>
        <p>
          Nous utilisons des mesures de sécurité appropriées pour protéger vos données, notamment:
        </p>
        <ul>
          <li>Chiffrement SSL/TLS</li>
          <li>Accès sécurisé</li>
          <li>Paiement via Stripe (PCI-DSS compliant)</li>
        </ul>

        <h2>12. CNIL</h2>
        <p>
          Pour toute plainte concernant le traitement de vos données, vous pouvez contacter la CNIL (Commission Nationale de l'Informatique et des Libertés):
        </p>
        <p>
          CNIL - 3 Place de Fontenoy, 75007 Paris<br />
          Tél: +33 (0)1 53 73 22 22
        </p>

        <h2>13. Modifications</h2>
        <p>
          Cette politique peut être modifiée à tout moment. Les modifications prendront effet dès leur publication.
        </p>

        <p className="text-sm text-muted-foreground mt-8">
          Dernière mise à jour: 27 avril 2026
        </p>
      </div>
    </div>
  );
}
