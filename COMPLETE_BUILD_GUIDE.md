## Funkidz Animation - Guide Complet du Projet

### Vue d'ensemble
Application React + Vite complète pour la plateforme Funkidz Animation avec:
- Panel admin complet
- Système de réservation avancé
- Paiement Stripe intégré
- Gestion des emails et notifications
- Conformité RGPD

---

## Architecture du Projet

### Structure des dossiers
```
src/
├── components/          # Composants réutilisables
│   ├── AdminLayout.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── PaymentForm.jsx
│   ├── NotificationContainer.jsx
│   └── PrivateRoute.jsx
├── pages/              # Pages principales
│   ├── Home.jsx
│   ├── Services.jsx
│   ├── Pricing.jsx
│   ├── Gallery.jsx
│   ├── Contact.jsx
│   ├── Booking.jsx
│   ├── Payment.jsx
│   ├── PaymentSuccess.jsx
│   ├── ServiceDetail.jsx
│   ├── Dashboard.jsx
│   ├── RGPDSettings.jsx
│   ├── TermsOfService.jsx
│   ├── PrivacyPolicy.jsx
│   ├── admin/          # Pages admin
│   │   ├── AdminDashboard.jsx
│   │   ├── ServicesManagement.jsx
│   │   ├── BookingsManagement.jsx
│   │   ├── UsersManagement.jsx
│   │   ├── PaymentsManagement.jsx
│   │   ├── GalleryManagement.jsx
│   │   └── AdminSettings.jsx
│   └── auth/
│       ├── Login.jsx
│       ├── Signup.jsx
│       └── ForgotPassword.jsx
├── services/           # Services API
│   ├── api.js          # Client API centralisé
│   ├── stripe.js       # Service Stripe
│   ├── emailService.js # Emails et notifications
│   ├── notificationService.js # Notifications UI
│   └── dataExportService.js # Export RGPD
├── context/
│   └── AuthContext.jsx # Gestion authentification
└── App.jsx            # Routes principales
```

---

## Fonctionnalités Implémentées

### 1. Panel Admin Complet
- **Tableau de bord** avec statistiques en temps réel
- **Gestion des services** (CRUD complet)
- **Gestion des réservations** (filtrage par statut)
- **Gestion des utilisateurs** (avec rôles)
- **Gestion des paiements** (historique, téléchargement)
- **Galerie media** (upload, visibilité)
- **Paramètres du système**

### 2. Pages Clients
- **Accueil** - Hero + services
- **Services** - Catalogue complet
- **Tarifs** - Forfaits comparatifs
- **Galerie** - Événements
- **Détails service** - Avis et description
- **Réservation** - Formulaire 3 étapes
- **Paiement** - Intégration Stripe
- **Dashboard** - Suivi réservations
- **Paramètres RGPD** - Export/suppression données

### 3. Système d'Authentification
- Inscription avec validation
- Connexion JWT automatique
- "Mot de passe oublié" fonctionnel
- Gestion de session sécurisée
- Context Auth global

### 4. Paiement Stripe
- Formulaire de paiement sécurisé
- Gestion d'erreurs robuste
- Validation des cartes
- Confirmation par email
- Historique des transactions

### 5. Emails et Notifications
- Service email centralisé
- Notifications toast en temps réel
- Emails de confirmation
- Rappels d'événement
- Factures PDF

### 6. Sécurité et RGPD
- Routes protégées (PrivateRoute)
- Roles et permissions (admin/client)
- Export de données personnelles
- Suppression de compte
- Gestion des consentements
- Historique d'activité

---

## Configuration

### Variables d'environnement (.env)
```
VITE_API_URL=http://localhost:8000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_APP_NAME=Funkidz Animation
```

### Installation et démarrage
```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Préview production
npm run preview
```

---

## Intégration Backend Django

### Endpoints API Requis

#### Authentification
- `POST /auth/register/` - Inscription
- `POST /auth/login/` - Connexion
- `POST /auth/logout/` - Déconnexion
- `POST /auth/refresh/` - Rafraîchir token
- `POST /auth/forgot-password/` - Réinitialisation

#### Services
- `GET /services/` - Lister les services
- `GET /services/{id}/` - Détails service
- `POST /services/` - Créer (admin)
- `PUT /services/{id}/` - Modifier (admin)
- `DELETE /services/{id}/` - Supprimer (admin)

#### Réservations
- `GET /bookings/` - Lister réservations
- `GET /bookings/my/` - Mes réservations
- `POST /bookings/` - Créer réservation
- `PUT /bookings/{id}/` - Modifier
- `DELETE /bookings/{id}/` - Annuler

#### Paiements
- `POST /payments/create-intent/` - Créer payment intent
- `POST /payments/confirm/` - Confirmer paiement
- `GET /payments/{id}/` - Statut paiement
- `GET /payments/history/` - Historique

#### Utilisateurs
- `GET /users/export-data/` - Export RGPD
- `DELETE /users/delete-account/` - Suppression compte
- `GET /users/consents/` - Consentements
- `PUT /users/consents/` - Mettre à jour consentements

#### Emails
- `POST /emails/send-booking-confirmation/`
- `POST /emails/send-invoice/`
- `POST /emails/send-reminder/`
- `POST /emails/send-payment-confirmation/`

---

## Routage Complet

### Routes Publiques
- `/` - Accueil
- `/services` - Services
- `/pricing` - Tarifs
- `/gallery` - Galerie
- `/contact` - Contact
- `/service/:id` - Détails service
- `/terms` - Conditions d'utilisation
- `/privacy` - Politique de confidentialité

### Routes Authentifiées
- `/auth/login` - Connexion
- `/auth/signup` - Inscription
- `/auth/forgot-password` - Mot de passe oublié
- `/dashboard` - Tableau de bord utilisateur
- `/rgpd-settings` - Paramètres RGPD

### Routes Paiement
- `/booking` - Formulaire réservation
- `/payment` - Paiement
- `/payment-success` - Confirmation

### Routes Admin (protégées)
- `/admin` - Dashboard admin
- `/admin/services` - Gestion services
- `/admin/bookings` - Gestion réservations
- `/admin/users` - Gestion utilisateurs
- `/admin/payments` - Gestion paiements
- `/admin/gallery` - Gestion galerie
- `/admin/settings` - Paramètres admin

---

## Tests et Validation

### À tester en priorité
1. **Authentification**: Login/Signup/Logout
2. **Réservation**: Flux complet de booking
3. **Paiement**: Formulaire Stripe
4. **Admin**: CRUD services
5. **RGPD**: Export/suppression données

### Comptes de test
```
Admin:  admin@funkidz.fr / password123
Client: user@example.com / password123
```

---

## Déploiement

### Sur Vercel
```bash
npm install -g vercel
vercel
```

### Variables Vercel
Configurer dans les settings:
- `VITE_API_URL`
- `VITE_STRIPE_PUBLISHABLE_KEY`

---

## Prochaines Étapes

1. Implémenter les endpoints Django
2. Configurer Stripe en production
3. Ajouter tests unitaires
4. Configurer CI/CD
5. Monitoring et logs
6. Sauvegardes BDD

---

## Support et Documentation

- API Documentation: `/api/docs`
- Stripe Docs: https://stripe.com/docs
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
