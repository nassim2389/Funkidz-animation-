# Explications pour le client — écarts assumés entre le diagramme de classe et le code

Ce document sert de support pour réexpliquer au client les quelques
points où le code s'écarte volontairement du diagramme de classe
(`docs/DC.jpeg`), après la mise en conformité faite le 28/09/2026
(voir `docs/analyse-diagramme-vs-code.md` pour l'historique complet
de l'analyse). Chaque point ici est un choix assumé, pas un oubli.

## Ce qui a été aligné sur le diagramme

Tous les renommages de vocabulaire (`title`, `event_date`,
`address`, `unit_price`, etc.) et le type des identifiants (UUID au
lieu d'entiers auto-incrémentés) sont maintenant conformes au
diagramme. Voir `dictionnaire-donnees.md`, généré directement depuis
le code, pour le détail exact table par table.

## Ce qui reste volontairement différent

### 1. Deux tables en plus, absentes du diagramme

- **`Review`** (avis clients) : note + commentaire laissés par un
  client après une prestation.
- **`Availability`** (créneaux bloqués ponctuels) : permet à un
  animateur de bloquer une plage horaire précise, différent des
  congés (`AnimateurLeave`, qui couvre des périodes plus longues).

Ce sont des ajouts de fonctionnalité faits après la conception
initiale, pas des erreurs. Le diagramme date d'avant ces ajouts.

### 2. `AnimateurLeave.status` — absent du diagramme, conservé

Le diagramme ne prévoit pas ce champ. En code, il porte tout le
circuit d'approbation des congés (`PENDING` / `APPROVED` /
`REJECTED`) : un animateur déclare un congé, l'administrateur
l'approuve ou le refuse depuis le panel admin. Sans ce champ, un
congé déclaré serait automatiquement effectif, sans validation
possible — on a choisi de le garder.

### 3. `Payment.amount` — aligné sur le diagramme (résolu)

Le diagramme prévoyait le montant lu directement sur la réservation
(`Booking.final_price`), sans champ séparé sur `Payment`. C'est
maintenant le cas : `Payment.amount` est devenu une simple propriété
Python qui renvoie `self.booking.final_price`, plus une colonne en
base. Vérifié : dans le code, un paiement était de toute façon
toujours créé avec le prix de la réservation au même instant, jamais
une valeur différente — aucune fonctionnalité perdue.

### 4. `BookingAssignment` — deux ajustements

- `assigned_at` : c'est en réalité la date de création de la ligne
  d'assignation, renommée pour correspondre au diagramme (même
  événement, pas un nouveau champ).
- `responded_at` : **nouveau champ**, absent avant. Enregistre le
  moment précis où l'animateur accepte ou refuse une mission,
  distinct de l'envoi de la notification (`notification_sent_at`).

### 5. `Booking.cancellation_reason` — ajouté en plus de `cancelled_by`

Le diagramme voulait un motif d'annulation en texte libre à la place
de `cancelled_by`. Les deux sont maintenant présents : `cancelled_by`
garde la distinction structurée ADMIN/CLIENT (utilisée pour l'affichage
coloré dans le panel admin et la règle des 48h), et
`cancellation_reason` est un nouveau champ texte libre, rempli par le
client au moment d'annuler depuis son espace personnel (nouveau
formulaire sur le tableau de bord client).

## Champs et tables ajoutés en code, absents du diagramme

Liste complète pour référence — aucun de ces champs ne supprime ou
contredit quelque chose du diagramme, ce sont des extensions :
`AnimateurProfile.avatar_url`/`rating` ; `Service.max_children`/
`min_children`/`image_url`/`badge_label` ; `Option.image_url` ;
`Booking.location_zip`/`child_name`/`child_age`/`contact_phone`/
`confirmation_email_sent_at`/`admin_notification_sent_at`/
`cancellation_email_sent_at` ; `WeeklySchedule.is_active` ;
`Payment.stripe_payment_intent`/`failure_email_sent_at`/`updated_at` ;
`MediaGallery.order` ; `ContactMessage.is_read`.
