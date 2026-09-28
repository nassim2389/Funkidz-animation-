# Explications pour le client — diagramme de classe vs dictionnaire de données

Support pour réexpliquer au client où en est la correspondance entre
le diagramme de classe (`docs/DC.jpeg`) et la base réelle, après la
mise en conformité faite le 28/09/2026 (historique complet de
l'analyse dans `docs/analyse-diagramme-vs-code.md`). Le dictionnaire
de données (`dictionnaire-donnees.md`) est généré directement depuis
le code — c'est la référence exacte de ce qui existe réellement en
base, à utiliser en vis-à-vis de ce document.

## Ce qui a été aligné sur le diagramme

- Vocabulaire des champs : `title`, `event_date`, `start_time`,
  `children_count`, `address`, `city`, `notes`, `day_of_week`,
  `unit_price`, `type`, `password_hash` — tous renommés côté base
  pour matcher le diagramme, sans toucher au code applicatif
  (`db_column`, cf. `docs/analyse-diagramme-vs-code.md`).
- Type des identifiants : UUID sur les 14 tables, au lieu d'entiers
  auto-incrémentés.
- `Payment.amount` : plus de colonne séparée, lu directement sur
  `Booking.final_price` comme le prévoit le diagramme.
- `BookingAssignment.assigned_at` / `responded_at` : les deux
  champs du diagramme existent maintenant tels quels.
- `Booking.cancellation_reason` : le champ texte libre du diagramme
  existe, en plus de `cancelled_by` (voir écart 2 ci-dessous).

## Les 4 écarts réels restants

### 1. `AnimateurProfile` — champs manquants

Dictionnaire actuel (table `users_animateurprofile`) :
`id, user_id, bio, phone, avatar_url, rating`.

Le diagramme prévoit en plus `first_name`, `last_name`, `created_at`,
`updated_at`.

- `first_name`/`last_name` existent déjà, mais sur `User` (table
  `users_user`), pas ici. Les dupliquer sur les deux tables créerait
  un risque d'incohérence (nom changé d'un côté, pas de l'autre).
- `created_at`/`updated_at` n'existent pas sur ce modèle — aucune
  fonctionnalité n'a jamais eu besoin de savoir quand un profil
  animateur a été créé ou modifié.

Impact réel : aucun, purement déclaratif dans le diagramme.

### 2. `Booking` — `cancelled_by` conservé, 3 champs manquants

Dictionnaire actuel (table `bookings_booking`) a `cancelled_by`
(choix `ADMIN`/`CLIENT`) **en plus** de `cancellation_reason` (texte
libre). Il manque `booking_number`, `duration_minutes`,
`cancelled_at`.

- `cancelled_by` est gardé car il alimente le badge coloré du panel
  admin ("Annulée · Client" vs "Annulée · Admin") et la règle des
  48h — le retirer casserait ces deux fonctionnalités déjà testées.
- `booking_number` : jamais ajouté, l'`id` (UUID) suffit déjà à
  identifier une réservation ; un numéro "joli" en plus serait
  purement cosmétique.
- `duration_minutes` : la durée existe déjà, mais lue sur
  `Service.duration_minutes` (la formule choisie), pas dupliquée sur
  chaque réservation.
- `cancelled_at` : pas de champ dédié, mais
  `cancellation_email_sent_at` (déjà présent) donne une date très
  proche en pratique.

Impact réel : aucune fonctionnalité manquante, ces informations sont
déjà couvertes autrement ou jugées superflues.

### 3. `AnimateurLeave` — `status` conservé, `created_at` manquant

Dictionnaire actuel (table `availability_animateurleave`) a `status`
(`PENDING`/`APPROVED`/`REJECTED`), absent du diagramme.

- `status` est LE champ qui fait tourner le circuit d'approbation
  des congés dans l'admin (actions "Approuver"/"Refuser") : sans
  lui, un congé déclaré par un animateur serait automatiquement
  effectif, sans aucun contrôle possible côté administration.
- `created_at` (voulu par le diagramme) n'a jamais été ajouté :
  aucun affichage ou tri par date de déclaration n'en a besoin
  actuellement.

### 4. `MediaGallery` — pas un simple renommage

Dictionnaire actuel (table `media_mediagallery`) :
`id, service_id, media_url, file, type, title, order`.

`type` et `title` sont déjà alignés. Le diagramme veut en plus
`file_url`, `thumbnail_url`, `is_visible`.

Cas différent des trois précédents : le code propose **deux façons**
de fournir un média (`media_url` pour un lien externe type YouTube,
`file` pour un fichier uploadé depuis l'ordinateur), alors que le
diagramme n'en prévoit qu'une (`file_url`). Renommer purement et
simplement aurait supprimé cette double option. `thumbnail_url`
(miniature séparée) et `is_visible` (masquer sans supprimer)
n'existent pas du tout — fonctionnalités jamais développées.

Impact réel : aucun manque côté appli, mais c'est visuellement
l'écart le plus visible si on compare le dictionnaire ligne à ligne
avec le diagramme.

## Deux tables en plus, absentes du diagramme

- **`Review`** (avis clients) : note + commentaire laissés par un
  client après une prestation.
- **`Availability`** (créneaux bloqués ponctuels) : permet à un
  animateur de bloquer une plage horaire précise, différent des
  congés (`AnimateurLeave`, qui couvre des périodes plus longues).

Ajouts de fonctionnalité faits après la conception initiale, pas des
erreurs — le diagramme date d'avant ces ajouts.

## Autres champs ajoutés en code, sans équivalent diagramme

Liste pour référence — aucun ne supprime ou contredit quelque chose
du diagramme, ce sont des extensions : `Service.max_children`/
`min_children`/`image_url`/`badge_label` ; `Option.image_url` ;
`Booking.location_zip`/`child_name`/`child_age`/`contact_phone`/
`confirmation_email_sent_at`/`admin_notification_sent_at`/
`cancellation_email_sent_at` ; `WeeklySchedule.is_active` ;
`Payment.stripe_payment_intent`/`failure_email_sent_at`/`updated_at` ;
`MediaGallery.order` ; `ContactMessage.is_read`.
