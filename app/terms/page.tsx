export const metadata = {
  title: 'Conditions Générales - Funkidz',
  description: 'Conditions générales d\'utilisation de Funkidz. Réservation d\'animateurs professionnels, tarifs, cancellation policy.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto prose">
        <h1>Conditions Générales d'Utilisation</h1>
        
        <h2>1. Définitions</h2>
        <p>
          « Funkidz » désigne le service de réservation d'animations en ligne.
          « Client » désigne toute personne utilisant la plateforme.
          « Prestation » désigne le service d'animation réservé.
        </p>

        <h2>2. Acceptation des conditions</h2>
        <p>
          L'utilisation du site Funkidz implique l'acceptation pleine et entière des présentes conditions.
        </p>

        <h2>3. Services proposés</h2>
        <p>
          Funkidz propose des services d'animation pour enfants en ligne. Les prestations sont effectuées par des professionnels indépendants.
        </p>

        <h2>4. Processus de réservation</h2>
        <ul>
          <li>Sélection du service et des options</li>
          <li>Choix de la date et de l'heure</li>
          <li>Saisie des informations de contact</li>
          <li>Paiement via Stripe</li>
          <li>Confirmation de la réservation</li>
        </ul>

        <h2>5. Tarification et paiement</h2>
        <p>
          Les tarifs sont affichés en euros TTC. Le paiement s'effectue obligatoirement en ligne via Stripe. Aucun paiement n'est traité sans confirmation explicite du client.
        </p>

        <h2>6. Politique d'annulation</h2>
        <ul>
          <li>Annulation 48h avant : remboursement 100%</li>
          <li>Annulation 24h avant : remboursement 50%</li>
          <li>Annulation moins de 24h : remboursement 0%</li>
        </ul>

        <h2>7. Responsabilité</h2>
        <p>
          Funkidz ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le service.
        </p>

        <h2>8. Propriété intellectuelle</h2>
        <p>
          Tous les contenus du site (texte, images, logos) sont protégés par le droit d'auteur et appartiennent à Funkidz.
        </p>

        <h2>9. Modifications des conditions</h2>
        <p>
          Funkidz se réserve le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication sur le site.
        </p>

        <h2>10. Droit applicable</h2>
        <p>
          Ces conditions sont régies par la loi française. Tout litige sera de la compétence des tribunaux français.
        </p>

        <h2>11. Contact</h2>
        <p>
          Pour toute question, contactez-nous à: contact@funkidz.fr
        </p>

        <p className="text-sm text-muted-foreground mt-8">
          Dernière mise à jour: 27 avril 2026
        </p>
      </div>
    </div>
  );
}
