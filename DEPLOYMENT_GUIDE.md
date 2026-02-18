# Guide de Déploiement - Funkidz Animation

## Vue d'ensemble

Ce projet est une application React + Vite avec design minimaliste et professionnel, intégrée avec un backend Django via une API REST.

### Structure du Projet

```
/src
  /pages              # Pages principales de l'application
  /components        # Composants réutilisables
  /services          # Services API (axios client)
  /context           # Context API pour l'authentification
  /index.css         # Styles Tailwind CSS
```

### Pages Disponibles

| Page | Route | Fonction |
|------|-------|----------|
| Accueil | `/` | Présentation Funkidz |
| Services | `/services` | Catalogue des services |
| Tarifs | `/pricing` | Forfaits et prix |
| Galerie | `/gallery` | Portfolio des événements |
| Contact | `/contact` | Formulaire de contact |
| Réservation | `/booking` | Formulaire de réservation |
| Connexion | `/auth/login` | Authentification |
| Inscription | `/auth/signup` | Création de compte |
| Tableau de bord | `/dashboard` | Espace utilisateur |

## Installation

### Prérequis
- Node.js 16+ et npm/pnpm
- Backend Django en cours d'exécution sur `http://localhost:8000`

### Étapes

```bash
# 1. Installation des dépendances
npm install
# ou
pnpm install

# 2. Configuration environnement
# Créer un fichier .env.local avec:
VITE_API_URL=http://localhost:8000/api

# 3. Lancer le serveur de développement
npm run dev
# ou
pnpm dev

# 4. Accéder à l'application
# http://localhost:3000 (ou le port affiché)
```

## Configuration API

### Base URL
L'application se connecte à : `http://localhost:8000/api`

Modifiez dans `/src/services/api.js` :
```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000/api'
```

### Endpoints Requis (Django Backend)

#### Authentification
- `POST /auth/login/` - Connexion
- `POST /auth/signup/` - Inscription
- `GET /auth/user/` - Profil utilisateur
- `POST /auth/token/refresh/` - Renouvellement token

#### Services
- `GET /services/` - Liste des services
- `GET /services/{id}/` - Détail d'un service

#### Options
- `GET /options/` - Liste des options
- `GET /options/?service={id}` - Options par service

#### Réservations (Bookings)
- `GET /bookings/` - Toutes les réservations
- `GET /bookings/my/` - Réservations de l'utilisateur
- `POST /bookings/` - Créer une réservation
- `GET /bookings/{id}/` - Détail d'une réservation
- `PUT /bookings/{id}/` - Mettre à jour
- `POST /bookings/{id}/options/` - Ajouter une option

#### Paiements
- `GET /payments/` - Liste des paiements
- `POST /payments/` - Créer un paiement

#### Messages Contact
- `POST /contact-messages/` - Envoyer un message

#### Galerie
- `GET /media-gallery/` - Galerie complète
- `GET /media-gallery/?service_id={id}` - Galerie par service

## Authentification

### Flux JWT

1. **Login** → Reçoit `access` token
2. **Stockage** → Token en localStorage
3. **Envoi** → Header `Authorization: Bearer {token}`
4. **Renouvellement** → Automatique via interceptor
5. **Logout** → Suppression du token

### Session Management

L'authentification est gérée par `AuthContext` (`/src/context/AuthContext.jsx`):

```javascript
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
}
```

## Styles & Design

### Tailwind CSS
- Couleurs minimalistes (gris, blanc, bleu)
- Design moderne et épuré
- Classes utilitaires personnalisées

### Couleurs principales
- Primaire: `bg-blue-600` / `text-blue-600`
- Secondaire: `bg-gray-100` / `text-gray-600`
- Arrière-plan: `bg-gray-50` / `bg-white`

## Build pour Production

```bash
# Build
npm run build

# Prévisualiser le build
npm run preview

# Les fichiers seront dans /dist
```

## Déploiement

### Vercel (Recommandé)
```bash
npm install -g vercel
vercel
```

### Variables d'environnement (Vercel)
```
VITE_API_URL=https://votre-backend-django.com/api
```

### Autre hébergement
- Copier le contenu de `/dist` sur votre serveur web
- S'assurer que les routes sont correctement configurées
- CORS doit être activé côté backend Django

## Dépannage

### "CORS error"
- Vérifier que Django a CORS activé
- Ajouter à Django: `CORS_ALLOWED_ORIGINS = ['http://localhost:3000']`

### "Token expiré"
- L'interceptor renouvelle automatiquement le token
- Si erreur 401 persiste, redirectionner vers login

### "Page blanche"
- Vérifier la console du navigateur pour les erreurs
- Vérifier que l'API est accessible
- Vérifier les variables d'environnement

## Support

Pour toute question ou problème, consultez:
- Backend Django: `BACKEND_SETUP.md`
- API Endpoints: `/src/services/api.js`
- Routes: `/src/App.jsx`
