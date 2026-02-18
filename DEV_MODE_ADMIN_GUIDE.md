# Guide d'Accès au Panel Admin en Mode Développement

## Situation Actuelle

Vous n'avez pas encore implémenté le backend Django, mais vous voulez tester le panel admin. 

**Solution:** Mode développement avec authentification et données mock

---

## Démarrage Rapide

### 1. Vérifier le Mode Dev est Activé

Le fichier `.env.local` doit contenir:
```
VITE_DEV_MODE=true
VITE_API_URL=http://localhost:8000/api
```

### 2. Lancer l'Application

```bash
npm install      # Si pas fait
npm run dev      # Lancer sur localhost:5173
```

### 3. Accéder au Panel Admin

**Option A: Via le bouton Helper (Coin inférieur droit)**
- Un bouton jaune "DEV MODE - Quick Login" apparaît en bas à droite
- Cliquez sur "Login as Admin"
- Vous êtes automatiquement connecté et redirigé vers `/admin`

**Option B: Via le Formulaire de Login**
- Allez à `http://localhost:5173/auth/login`
- Email: `admin@funkidz.fr`
- Password: `admin123`
- Cliquez "Se connecter"

**Option C: URL Directe**
- Une fois connecté comme admin, accédez directement à `http://localhost:5173/admin`

---

## Identifiants de Test

### Compte Admin
- **Email:** admin@funkidz.fr
- **Password:** admin123
- **Accès:** /admin, gestion complète

### Compte User (Client)
- **Email:** user@funkidz.fr
- **Password:** user123
- **Accès:** /dashboard, profil utilisateur

---

## Données Mock Disponibles

### Services (4 exemples)
- Magicien - 250€/h
- Clown - 200€/45min
- DJ & Danseur - 300€/2h
- Atelier Créatif - 180€/1.5h

### Réservations (3 exemples)
- BK-001-2024: Magicien (confirmée)
- BK-002-2024: Clown (en attente)
- BK-003-2024: DJ (confirmée)

### Utilisateurs (2 exemples)
- Admin (role: admin)
- Client Test (role: user)

### Paiements (2 exemples)
- Paiement 1: 250€ (complété)
- Paiement 2: 200€ (en attente)

---

## Pages Admin Disponibles

### 1. Admin Dashboard (`/admin`)
- Vue d'ensemble avec statistiques
- Nombre de réservations
- Chiffre d'affaires
- Dernières réservations

### 2. Gestion Services (`/admin/services`)
- Liste des services avec filtrage
- Ajouter/modifier/supprimer services
- Statut actif/inactif

### 3. Gestion Réservations (`/admin/bookings`)
- Filtrer par statut (tous, en attente, confirmées)
- Confirmer/annuler réservations
- Détails complets

### 4. Gestion Utilisateurs (`/admin/users`)
- Liste des clients
- Nombre de réservations par client
- Statut d'inscription

### 5. Gestion Paiements (`/admin/payments`)
- Historique des transactions
- Télécharger reçus
- Statuts des paiements

### 6. Gestion Galerie (`/admin/gallery`)
- Upload images
- Gérer la visibilité
- Lier aux services

### 7. Paramètres Admin (`/admin/settings`)
- Configuration entreprise
- Paramètres Stripe
- Paramètres notifications

---

## Comment Fonctionne le Mode Dev

### Architecture

```
1. Utilisateur clique "Login as Admin"
   ↓
2. Détecte VITE_DEV_MODE=true
   ↓
3. Utilise mockAuthService au lieu de API réelle
   ↓
4. Les données sont stockées dans localStorage
   ↓
5. Accès au panel admin avec données mock
```

### Authentification Mock

Le service `src/services/mockAuthService.js` fournit:
- Login/Signup mock
- Token mock (stocké localement)
- User data mock

### Données Mock

Le service `src/services/mockDataService.js` fournit:
- Services mock
- Réservations mock
- Utilisateurs mock
- Paiements mock
- Statistiques mock

---

## Débogage en Mode Dev

### Voir les logs du mode dev
Ouvrez la console du navigateur (F12) et cherchez:
```
[DEV MODE] Using mock authentication service
[DEV MODE] Using mock data service
```

### Vérifier le token
```javascript
// Dans la console du navigateur
localStorage.getItem('token')
// Affiche: mock_admin_token_12345 ou mock_user_token_67890
```

### Vérifier les données utilisateur
```javascript
// Dans la console du navigateur
JSON.parse(localStorage.getItem('user'))
// Affiche les infos de l'utilisateur connecté
```

---

## Passer au Backend Réel

### Quand Django est prêt:

1. **Désactiver le mode dev**
   ```
   # .env.local
   VITE_DEV_MODE=false
   VITE_API_URL=http://localhost:8000/api
   ```

2. **Redémarrer l'app**
   ```bash
   npm run dev
   ```

3. **Utiliser les vrais identifiants**
   - L'app utilisera le vrai backend Django
   - Plus de données mock

---

## Limitations du Mode Dev

- Les données mock ne sont pas persistantes entre rechargements
- Pas de véritable validation de base de données
- Pas de véritable paiement Stripe
- Données statiques (simulent juste)

**Solution:** Quand Django sera implémenté, ces limitations disparaîtront.

---

## Tests Recommandés en Mode Dev

1. Tester toutes les pages du panel admin
2. Vérifier la navigation et les filtres
3. Tester les formulaires (modification services, etc.)
4. Valider les calculs (prix, statistiques)
5. Tester le logout et reconnexion

---

## Support

Si vous rencontrez un problème:

1. Vérifier que `VITE_DEV_MODE=true` dans `.env.local`
2. Vérifier la console du navigateur (F12) pour les erreurs
3. Vérifier que `localhost:5173` est accessible
4. Rafraîchir la page (`Ctrl+F5`)

---

**Important:** Le mode dev est uniquement pour tester le frontend. 
Quand Django est prêt, changez `VITE_DEV_MODE=false` et tous les appels iront au vrai backend.

Bon développement! 🚀
