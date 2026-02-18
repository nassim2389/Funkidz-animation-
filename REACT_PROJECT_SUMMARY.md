# Funkidz Animation - React + Vite Frontend

## Projet Complété

Application web **minimaliste et professionnelle** pour la réservation de services d'animation pour enfants.

### Stack Technologique

- **Frontend**: React 19 + Vite 5
- **Backend**: Django REST Framework (à implémenter)
- **Styling**: Tailwind CSS v3
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Pages Implémentées (9 pages + 2 auth)

**Pages Publiques**:
1. **Accueil** (`/`) - Hero avec statistiques, services, CTA
2. **Services** (`/services`) - Catalogue complet 6 services avec prix
3. **Tarifs** (`/pricing`) - 3 forfaits avec comparaison, FAQ
4. **Galerie** (`/gallery`) - Grille 12 images events
5. **Contact** (`/contact`) - Formulaire + coordonnées
6. **Réservation** (`/booking`) - Formulaire 3 étapes avec calcul prix

**Pages Authentification**:
7. **Connexion** (`/auth/login`) - Formulaire login
8. **Inscription** (`/auth/signup`) - Formulaire signup

**Pages Utilisateur**:
9. **Dashboard** (`/dashboard`) - Tableau de bord personnel

### Composants Réutilisables

- **Navbar** - Navigation sticky avec menu mobile
- **Footer** - Pied de page avec liens
- Tous construits avec style minimaliste épuré

### Design System

**Palette de couleurs** (minimaliste & professionnel):
- Primary: #0a0a0a (Noir)
- Secondary: #6b7280 (Gris)
- Background: #fafafa (Blanc cassé)
- Border: #e5e5e5 (Gris clair)

**Typographie**:
- Titres: Serif (Playfair Display)
- Corps: Sans-serif (Inter)
- Espacements généreux (white space)
- Animations subtiles

### Architecture API

**Service centralisé** (`src/services/api.js`):
- Client Axios avec intercepteurs
- Gestion automatique des tokens JWT
- Gestion des erreurs 401
- 6 services groupés avec 25+ endpoints

**Services disponibles**:
- `authService` - Authentification
- `servicesService` - Catalogue services
- `reservationsService` - Réservations
- `optionsService` - Options services
- `paymentsService` - Paiements Stripe
- `contactService` - Messages contact
- `adminService` - Gestion admin

### Fichiers Clés

```
src/
├── components/          # Composants réutilisables
│   ├── Navbar.jsx
│   └── Footer.jsx
├── pages/              # Pages de l'app
│   ├── Home.jsx
│   ├── Services.jsx
│   ├── Pricing.jsx
│   ├── Gallery.jsx
│   ├── Contact.jsx
│   ├── Booking.jsx
│   ├── Dashboard.jsx
│   └── auth/
│       ├── Login.jsx
│       └── Signup.jsx
├── services/
│   └── api.js          # Client API
├── App.jsx             # Routing principal
├── main.jsx            # Point d'entrée
└── index.css           # Styles globaux

Configuration:
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── package.json
```

### Démarrage Rapide

```bash
# Installation
npm install

# Développement
npm run dev

# Production
npm run build
npm run preview
```

L'app sera accessible sur `http://localhost:3000`

### Configuration Proxy

Le fichier `vite.config.js` configure un proxy automatique:
- URLs `/api/*` → `http://localhost:8000/*`
- Facilite le développement sans CORS

### Prochaines Étapes

1. **Implémenter backend Django** selon BACKEND_SETUP.md
2. **Configurer variables d'environnement** (.env):
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   REACT_APP_STRIPE_PUBLIC_KEY=...
   ```
3. **Tester intégration API** avec Django en local
4. **Implémenter Stripe** pour paiements
5. **Déployer** sur Vercel/production

### Points Forts du Design

✓ Minimaliste et professionnel  
✓ Responsive mobile-first  
✓ Navigation intuitive  
✓ Formulaires ergonomiques  
✓ Performance optimale  
✓ Code maintenable et scalable  
✓ SEO-ready  
✓ Accessible (a11y)  

### Structure Prête pour Scaling

- Séparation nette de la logique UI/API
- Service API centralisé pour faciliter maintenance
- Composants réutilisables
- Structure de dossiers évolutive
- Facile d'ajouter nouvelles pages/services

### Tests & Validation

- Tous les formulaires valident les entrées
- Gestion d'erreurs robuste
- Feedback utilisateur (messages, notifications)
- Design responsive testé

## Support Django

Référer à `BACKEND_SETUP.md` pour les spécifications complètes de l'API Django.

---

**Projet créé avec v0 - Vercel AI Assistant**  
Date: 2024  
Version: 1.0.0
