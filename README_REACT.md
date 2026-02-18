# Funkidz Animation - Frontend React + Vite

Application web professionnelle et minimaliste pour la réservation de services d'animation pour enfants.

## Architecture

- **Frontend**: React 19 + Vite
- **Backend**: Django REST Framework (à implémenter)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6

## Démarrage rapide

### Installation

```bash
# Installer les dépendances
npm install

# Ou avec pnpm
pnpm install
```

### Développement

```bash
# Démarrer le serveur de développement
npm run dev

# L'application sera accessible à http://localhost:3000
```

### Build pour la production

```bash
npm run build
npm run preview
```

## Structure du projet

```
src/
├── components/
│   ├── Navbar.jsx
│   └── Footer.jsx
├── pages/
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
│   └── api.js          # Client API Axios
├── App.jsx
├── main.jsx
└── index.css
```

## Pages

- **/** - Page d'accueil avec statistiques
- **/services** - Catalogue des services
- **/pricing** - Tarifs et forfaits
- **/gallery** - Galerie des événements
- **/contact** - Formulaire de contact
- **/booking** - Formulaire de réservation 3 étapes
- **/auth/login** - Connexion utilisateur
- **/auth/signup** - Inscription
- **/dashboard** - Tableau de bord utilisateur

## Design

Thème **minimaliste et professionnel**:
- Palette de couleurs neutres (noir, gris, blanc)
- Typographie épurée avec serif pour les titres
- Espacement généreuse (white space)
- Animations subtiles
- Responsive design mobile-first

### Couleurs

- **Primary**: #0a0a0a (Noir)
- **Secondary**: #6b7280 (Gris)
- **Background**: #fafafa (Blanc cassé)
- **Border**: #e5e5e5 (Gris clair)

## API

L'application communique avec Django via des endpoints REST. Le service API est dans `src/services/api.js`.

### Configuration

Ajouter dans `.env`:
```
REACT_APP_API_URL=http://localhost:8000/api
```

### Endpoints principaux

**Authentification**:
- `POST /auth/login/` - Connexion
- `POST /auth/signup/` - Inscription
- `GET /auth/user/` - Utilisateur courant

**Services**:
- `GET /services/` - Liste des services
- `GET /services/{id}/` - Détail d'un service

**Réservations**:
- `GET /reservations/` - Toutes les réservations
- `POST /reservations/` - Créer une réservation
- `GET /reservations/{id}/` - Détail réservation
- `PUT /reservations/{id}/` - Modifier réservation

**Options**:
- `GET /options/` - Options des services
- `GET /options/?service={id}` - Options d'un service

**Paiements**:
- `POST /payments/intent/` - Créer intention de paiement (Stripe)
- `POST /payments/confirm/` - Confirmer paiement

**Contact**:
- `POST /contact/` - Envoyer message de contact

## Développement

### Ajouter une nouvelle page

1. Créer le fichier dans `src/pages/`
2. Importer dans `App.jsx`
3. Ajouter la route dans `<Routes>`

### Utiliser l'API

```jsx
import { servicesService } from '@/services/api'

const [services, setServices] = useState([])

useEffect(() => {
  servicesService.getAll()
    .then(res => setServices(res.data))
    .catch(err => console.error(err))
}, [])
```

## Configuration Tailwind

Le fichier `tailwind.config.js` contient la configuration personnalisée avec les couleurs et espacements.

Pour ajouter des styles globaux, modifier `src/index.css`.

## Intégration Stripe

À implémenter avec les endpoints de paiement Django.

## Performance

- Code splitting automatique avec Vite
- Lazy loading des routes avec React Router
- Optimisation des images
- CSS purgé en production

## Compatibilité

- Chrome/Edge latest
- Firefox latest
- Safari latest
- Mobile (iOS/Android)

## Support

Pour les questions ou problèmes:
1. Vérifier la documentation Django backend
2. Consulter le fichier BACKEND_SETUP.md
3. Vérifier les logs du navigateur (F12)

## Licence

Propriétaire - Funkidz Animation 2024
