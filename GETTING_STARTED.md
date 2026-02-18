# Guide de Démarrage - Funkidz Animation React

## 1. Installation initiale

### Prérequis
- Node.js 18+ et npm/pnpm
- Backend Django en local (port 8000)

### Installation des dépendances

```bash
# Avec npm
npm install

# Ou avec pnpm (plus rapide)
pnpm install
```

## 2. Configuration de l'environnement

Créer un fichier `.env.local` à la racine du projet:

```env
# API Backend
REACT_APP_API_URL=http://localhost:8000/api

# Stripe (optionnel pour paiements)
REACT_APP_STRIPE_PUBLIC_KEY=votre_clé_publique_stripe
```

## 3. Démarrage du développement

### Lancer le serveur Vite

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### Proxy API automatique

Le fichier `vite.config.js` configure un proxy qui redirige:
- `http://localhost:3000/api/*` → `http://localhost:8000/*`

Cela vous permet de faire des requêtes sans problèmes CORS.

## 4. Structure de l'application

```
src/
├── components/        # Composants réutilisables
├── pages/            # Pages de l'application
├── services/         # Services API et utilitaires
├── App.jsx          # Configuration routing
├── main.jsx         # Point d'entrée
└── index.css        # Styles globaux
```

## 5. Ajouter une nouvelle page

### Exemple: Créer une page "À propos"

**1. Créer le fichier** `src/pages/About.jsx`:

```jsx
export default function About() {
  return (
    <div className="pt-20">
      <section className="section">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold mb-6">À propos</h1>
          <p className="text-lg text-secondary">
            Contenu de la page...
          </p>
        </div>
      </section>
    </div>
  )
}
```

**2. Ajouter la route** dans `src/App.jsx`:

```jsx
import About from './pages/About'

// Dans le composant App:
<Route path="/about" element={<About />} />
```

**3. Ajouter le lien** dans la Navbar:

```jsx
// Dans src/components/Navbar.jsx:
{ label: 'À propos', href: '/about' }
```

## 6. Utiliser l'API

### Exemple: Récupérer les services

```jsx
import { useEffect, useState } from 'react'
import { servicesService } from '@/services/api'

export default function MyComponent() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    servicesService.getAll()
      .then(res => setServices(res.data))
      .catch(err => console.error('Erreur:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Chargement...</p>

  return (
    <div>
      {services.map(service => (
        <div key={service.id}>{service.name}</div>
      ))}
    </div>
  )
}
```

### Exemple: Authentification

```jsx
import { authService } from '@/services/api'

// Connexion
const handleLogin = async (email, password) => {
  try {
    const res = await authService.login(email, password)
    localStorage.setItem('token', res.data.access)
    navigate('/dashboard')
  } catch (err) {
    console.error('Connexion échouée')
  }
}

// Déconnexion
const handleLogout = () => {
  authService.logout()
  navigate('/')
}
```

## 7. Styling avec Tailwind

### Classes disponibles

```jsx
// Conteneur
<div className="container max-w-7xl mx-auto px-4">

// Sections
<section className="section bg-primary">

// Boutons
<button className="btn btn-primary">Cliquer</button>
<button className="btn btn-secondary">Secondaire</button>

// Grille
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

// Cartes
<div className="card">
  <h3>Titre</h3>
  <p>Contenu</p>
</div>

// Texte
<h1 className="text-5xl font-serif font-bold">Titre</h1>
<p className="text-secondary">Texte gris</p>
```

Voir `src/index.css` pour toutes les classe disponibles.

## 8. Variables d'environnement

Les variables d'environnement doivent être préfixées par `REACT_APP_`:

```env
# ✓ Accessible dans le code
REACT_APP_API_URL=...

# ✗ Ne sera pas accessible
API_URL=...
```

Accéder dans le code:
```javascript
const apiUrl = process.env.REACT_APP_API_URL
```

## 9. Build pour la production

```bash
# Build
npm run build

# Génère les fichiers dans /dist

# Tester le build local
npm run preview
```

## 10. Déploiement

### Sur Vercel (recommandé)

1. Connecter le repo GitHub
2. Vite est automatiquement détecté
3. Ajouter les variables d'environnement dans Vercel
4. Deploy!

### Ailleurs

```bash
# Générer le build
npm run build

# Uploader le dossier /dist
# Le serveur doit rediriger les 404 vers index.html
```

## 11. Troubleshooting

### Erreur "Cannot find module"

```bash
# Nettoyer node_modules et réinstaller
rm -rf node_modules
npm install
```

### Port 3000 déjà utilisé

```bash
# Modifier dans vite.config.js
server: {
  port: 3001,
}
```

### CORS errors

Vérifier que:
1. Le backend Django est en cours d'exécution
2. `REACT_APP_API_URL` est correctement configuré
3. CORS est activé dans Django (`django-cors-headers`)

### Token expiré

Le service API redirige automatiquement vers `/auth/login` si le token est expiré (erreur 401).

## 12. Ressources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)

## 13. Support

Pour les problèmes:
1. Vérifier la console du navigateur (F12)
2. Vérifier que le backend Django fonctionne
3. Consulter les logs du serveur Vite

---

**Bon développement! 🚀**
