# Dictionnaire de donnees

## Profils Animateurs (`users_animateurprofile`)

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `id` | UUIDField | cle primaire · optionnel · max 32 caracteres | Id |
| `user_id` | OneToOneField → users.User | unique · obligatoire | User |
| `bio` | TextField | obligatoire | Bio |
| `phone` | CharField | obligatoire · max 20 caracteres | Phone |
| `avatar_url` | CharField | obligatoire · max 200 caracteres | Avatar url |
| `rating` | FloatField | obligatoire · defaut = 0.0 | Rating |

## Utilisateurs (`users_user`)

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `last_login` | DateTimeField | optionnel | Dernière connexion |
| `is_superuser` | BooleanField | obligatoire · defaut = False | Précise que l’utilisateur possède toutes les permissions sans les assigner explicitement. |
| `first_name` | CharField | obligatoire · max 150 caracteres | Prénom |
| `last_name` | CharField | obligatoire · max 150 caracteres | Nom |
| `is_staff` | BooleanField | obligatoire · defaut = False | Précise si l’utilisateur peut se connecter à ce site d'administration. |
| `is_active` | BooleanField | obligatoire · defaut = True | Précise si l’utilisateur doit être considéré comme actif. Décochez ceci plutôt que de supprimer le compte. |
| `date_joined` | DateTimeField | obligatoire | Date d’inscription |
| `id` | UUIDField | cle primaire · optionnel · max 32 caracteres | Id |
| `password_hash` | CharField | obligatoire · max 128 caracteres | Mot de passe |
| `email` | CharField | unique · obligatoire · max 254 caracteres | Adresse électronique |
| `role` | CharField | obligatoire · max 10 caracteres · defaut = User.Role.CLIENT · choix : CLIENT, ADMIN, ANIMATEUR | Role |
| `is_verified` | BooleanField | obligatoire · defaut = False | Is verified |
| `created_at` | DateTimeField | obligatoire | Created at |
| `updated_at` | DateTimeField | obligatoire | Updated at |

## Options (`services_option`)

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `id` | UUIDField | cle primaire · optionnel · max 32 caracteres | Id |
| `service_id` | ForeignKey → services.Service | obligatoire | Service |
| `name` | CharField | obligatoire · max 200 caracteres | Name |
| `description` | TextField | obligatoire | Description |
| `price` | DecimalField | obligatoire | Price |
| `pricing_type` | CharField | obligatoire · max 20 caracteres · defaut = Option.PricingType.FIXED · choix : FIXED, PER_CHILD, PER_HOUR | Pricing type |
| `image_url` | CharField | optionnel · max 500 caracteres | URL de l'image ou icône de l'option |
| `is_active` | BooleanField | obligatoire · defaut = True | Is active |

## Services (`services_service`)

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `id` | UUIDField | cle primaire · optionnel · max 32 caracteres | Id |
| `title` | CharField | obligatoire · max 200 caracteres | Name |
| `description` | TextField | obligatoire | Description |
| `base_price` | DecimalField | obligatoire | Base price |
| `duration_minutes` | PositiveIntegerField | obligatoire · defaut = 60 | Duration minutes |
| `category` | CharField | obligatoire · max 20 caracteres · defaut = Service.Category.ANNIVERSAIRE · choix : ANNIVERSAIRE, MARIAGE, SEMINAIRE, ECOLE, AUTRE | Category |
| `is_active` | BooleanField | obligatoire · defaut = True | Is active |
| `max_children` | PositiveIntegerField | obligatoire · defaut = 15 | Max children |
| `min_children` | PositiveIntegerField | obligatoire · defaut = 1 | Min children |
| `image_url` | CharField | optionnel · max 500 caracteres | URL de l'image de couverture HD |
| `badge_label` | CharField | obligatoire · max 50 caracteres | Badge promotionnel (ex: 'Top Ventes', 'Coup de Cœur') |
| `created_at` | DateTimeField | obligatoire | Created at |
| `updated_at` | DateTimeField | obligatoire | Updated at |

## Réservations (`bookings_booking`)

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `id` | UUIDField | cle primaire · optionnel · max 32 caracteres | Id |
| `user_id` | ForeignKey → users.User | obligatoire | User |
| `service_id` | ForeignKey → services.Service | obligatoire | Service |
| `event_date` | DateField | obligatoire | Booking date |
| `start_time` | TimeField | obligatoire | Booking time |
| `children_count` | PositiveIntegerField | obligatoire | Nb children |
| `estimated_price` | DecimalField | obligatoire · defaut = 0.0 | Estimated price |
| `final_price` | DecimalField | obligatoire · defaut = 0.0 | Final price |
| `status` | CharField | obligatoire · max 20 caracteres · defaut = Booking.Status.PENDING · choix : PENDING, CONFIRMED, CANCELLED, DONE | Status |
| `cancelled_by` | CharField | obligatoire · max 10 caracteres · defaut = '' · choix : ADMIN, CLIENT | Annulée par |
| `address` | CharField | obligatoire · max 255 caracteres | Location address |
| `city` | CharField | obligatoire · max 100 caracteres | Location city |
| `location_zip` | CharField | obligatoire · max 20 caracteres | Location zip |
| `child_name` | CharField | obligatoire · max 100 caracteres · defaut = '' | Prénom de l'enfant |
| `child_age` | PositiveIntegerField | optionnel | Âge fêté |
| `contact_phone` | CharField | obligatoire · max 20 caracteres · defaut = '' | Téléphone de contact |
| `notes` | TextField | obligatoire | Special instructions |
| `confirmation_email_sent_at` | DateTimeField | optionnel | E-mail de confirmation client envoyé le |
| `admin_notification_sent_at` | DateTimeField | optionnel | Notification admin envoyée le |
| `cancellation_email_sent_at` | DateTimeField | optionnel | E-mail d'annulation envoyé le |
| `created_at` | DateTimeField | obligatoire | Created at |
| `updated_at` | DateTimeField | obligatoire | Updated at |

## Assignations d'animateurs (`bookings_bookingassignment`)

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `id` | UUIDField | cle primaire · optionnel · max 32 caracteres | Id |
| `booking_id` | ForeignKey → bookings.Booking | obligatoire | Booking |
| `animateur_id` | ForeignKey → users.AnimateurProfile | obligatoire | Animateur |
| `status` | CharField | obligatoire · max 20 caracteres · defaut = BookingAssignment.Status.PENDING · choix : PENDING, ACCEPTED, REFUSED | Status |
| `notification_sent_at` | DateTimeField | optionnel | Notification animateur envoyée le |
| `created_at` | DateTimeField | obligatoire | Created at |

## Options de réservation (`bookings_bookingoption`)

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `id` | UUIDField | cle primaire · optionnel · max 32 caracteres | Id |
| `booking_id` | ForeignKey → bookings.Booking | obligatoire | Booking |
| `option_id` | ForeignKey → services.Option | obligatoire | Option |
| `quantity` | PositiveIntegerField | obligatoire · defaut = 1 | Quantity |
| `unit_price` | DecimalField | obligatoire | Price at time |

## Congés Animateurs (`availability_animateurleave`)

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `id` | UUIDField | cle primaire · optionnel · max 32 caracteres | Id |
| `animateur_id` | ForeignKey → users.AnimateurProfile | obligatoire | Animateur |
| `start_date` | DateField | obligatoire | Start date |
| `end_date` | DateField | obligatoire | End date |
| `reason` | TextField | obligatoire | Reason |
| `status` | CharField | obligatoire · max 20 caracteres · defaut = AnimateurLeave.Status.PENDING · choix : PENDING, APPROVED, REJECTED | Status |

## Disponibilités (`availability_availability`)

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `id` | UUIDField | cle primaire · optionnel · max 32 caracteres | Id |
| `animateur_id` | ForeignKey → users.AnimateurProfile | obligatoire | Animateur |
| `date` | DateField | obligatoire | Date |
| `start_time` | TimeField | obligatoire | Start time |
| `end_time` | TimeField | obligatoire | End time |
| `is_blocked` | BooleanField | obligatoire · defaut = False | Is blocked |

## Horaires Récurrents (`availability_weeklyschedule`)

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `id` | UUIDField | cle primaire · optionnel · max 32 caracteres | Id |
| `animateur_id` | ForeignKey → users.AnimateurProfile | obligatoire | Animateur |
| `day_of_week` | IntegerField | obligatoire · choix : 0, 1, 2, 3, 4, 5, 6 | Weekday |
| `start_time` | TimeField | obligatoire | Start time |
| `end_time` | TimeField | obligatoire | End time |
| `is_active` | BooleanField | obligatoire · defaut = True | Is active |

## Paiements (`payments_payment`)

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `id` | UUIDField | cle primaire · optionnel · max 32 caracteres | Id |
| `booking_id` | ForeignKey → bookings.Booking | obligatoire | Booking |
| `stripe_session_id` | CharField | unique · obligatoire · max 255 caracteres | Stripe session id |
| `stripe_payment_intent` | CharField | obligatoire · max 255 caracteres | Stripe payment intent |
| `amount` | DecimalField | obligatoire | Amount |
| `status` | CharField | obligatoire · max 20 caracteres · defaut = Payment.Status.PENDING · choix : PENDING, SUCCEEDED, FAILED, REFUNDED | Status |
| `failure_email_sent_at` | DateTimeField | optionnel | E-mail d'échec envoyé le |
| `created_at` | DateTimeField | obligatoire | Created at |
| `updated_at` | DateTimeField | obligatoire | Updated at |

## Avis (`reviews_review`)

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `id` | UUIDField | cle primaire · optionnel · max 32 caracteres | Id |
| `booking_id` | OneToOneField → bookings.Booking | unique · obligatoire | Booking |
| `rating` | PositiveSmallIntegerField | obligatoire | Rating |
| `comment` | TextField | obligatoire | Comment |
| `created_at` | DateTimeField | obligatoire | Created at |

## Galerie multimédia (`media_mediagallery`)

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `id` | UUIDField | cle primaire · optionnel · max 32 caracteres | Id |
| `service_id` | ForeignKey → services.Service | optionnel | Service |
| `media_url` | CharField | obligatoire · max 200 caracteres | Lien externe (ex: YouTube) |
| `file` | FileField | optionnel · max 100 caracteres | Importer depuis votre ordinateur |
| `type` | CharField | obligatoire · max 10 caracteres · defaut = MediaGallery.MediaType.IMAGE · choix : IMAGE, VIDEO | Media type |
| `title` | CharField | obligatoire · max 200 caracteres | Title |
| `order` | PositiveIntegerField | obligatoire · defaut = 0 | Order |

## Messages de contact (`contact_contactmessage`)

| Champ | Type | Contraintes | Description |
|---|---|---|---|
| `id` | UUIDField | cle primaire · optionnel · max 32 caracteres | Id |
| `name` | CharField | obligatoire · max 200 caracteres | Name |
| `email` | CharField | obligatoire · max 254 caracteres | Email |
| `phone` | CharField | obligatoire · max 20 caracteres | Phone |
| `message` | TextField | obligatoire | Message |
| `is_read` | BooleanField | obligatoire · defaut = False | Is read |
| `created_at` | DateTimeField | obligatoire | Created at |

## Relations entre tables

- `users_animateurprofile.user_id` → `users_user`
- `services_option.service_id` → `services_service`
- `bookings_booking.user_id` → `users_user`
- `bookings_booking.service_id` → `services_service`
- `bookings_bookingassignment.booking_id` → `bookings_booking`
- `bookings_bookingassignment.animateur_id` → `users_animateurprofile`
- `bookings_bookingoption.booking_id` → `bookings_booking`
- `bookings_bookingoption.option_id` → `services_option`
- `availability_animateurleave.animateur_id` → `users_animateurprofile`
- `availability_availability.animateur_id` → `users_animateurprofile`
- `availability_weeklyschedule.animateur_id` → `users_animateurprofile`
- `payments_payment.booking_id` → `bookings_booking`
- `reviews_review.booking_id` → `bookings_booking`
- `media_mediagallery.service_id` → `services_service`
