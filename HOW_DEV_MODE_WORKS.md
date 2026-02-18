# Comment Fonctionne le Mode Développement

## Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend React App                     │
│              (localhost:5173)                            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓ Détecte VITE_DEV_MODE=true
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ↓ OUI                         ↓ NON
        │                             │
   ┌────────────────┐           ┌────────────────┐
   │  Dev Mode      │           │  Production    │
   │  Active        │           │  Mode          │
   └────────┬───────┘           └────────┬───────┘
            │                            │
            ↓                            ↓
      ┌──────────────┐         ┌──────────────────┐
      │ Mock Auth    │         │ Real Backend     │
      │ Service      │         │ Django           │
      │              │         │ (localhost:8000) │
      │ - Login      │         │                  │
      │ - Register   │         │ - Database       │
      │ - Logout     │         │ - API Endpoints  │
      └──────┬───────┘         └──────┬───────────┘
             │                        │
             ↓                        ↓
      ┌──────────────┐         ┌──────────────────┐
      │ Mock Data    │         │ Real Data        │
      │ Service      │         │ PostgreSQL       │
      │              │         │                  │
      │ - Services   │         │ - Services       │
      │ - Bookings   │         │ - Bookings       │
      │ - Users      │         │ - Users          │
      │ - Payments   │         │ - Payments       │
      └──────┬───────┘         └──────┬───────────┘
             │                        │
             ↓                        ↓
      ┌──────────────┐         ┌──────────────────┐
      │ localStorage │         │ API Response     │
      │              │         │ (JSON)           │
      │ Token        │         │                  │
      │ User Data    │         │ Full Objects     │
      │ Mock Data    │         │                  │
      └──────┬───────┘         └──────┬───────────┘
             │                        │
             └────────────┬───────────┘
                          │
                          ↓
                   ┌──────────────┐
                   │  Component   │
                   │  Renderized  │
                   │              │
                   │ UI Updates   │
                   └──────────────┘
```

---

## Flux D'Authentification - Mode Dev

### 1. User Clique "Login as Admin"

```javascript
// DevLoginHelper.jsx
handleQuickLogin('admin')
```

### 2. Appel à mockAuthService.login()

```javascript
// mockAuthService.js
{
  email: 'admin@funkidz.fr',
  password: 'admin123'
}
```

### 3. Vérification des Credentials

```javascript
// mockAuthService.js
const user = MOCK_USERS[email]
if (user && user.password === password) {
  // ✅ Success
} else {
  // ❌ Failed
}
```

### 4. Sauvegarde du Token & User

```javascript
localStorage.setItem('token', 'mock_admin_token_12345')
localStorage.setItem('user', JSON.stringify({...}))
```

### 5. Redirection vers /admin

```javascript
navigate('/admin')
```

### 6. Admin Dashboard Chargé

```
✅ Token dans localStorage
✅ User dans localStorage
✅ Accès /admin autorisé
✅ Données mock chargées
```

---

## Flux de Chargement des Données - Mode Dev

### 1. Component AdminDashboard Monte

```javascript
useEffect(() => {
  loadStats()
  loadBookings()
}, [])
```

### 2. Appel à mockDataService

```javascript
// AdminDashboard.jsx
mockDataService.getStats()
mockDataService.getBookings()
```

### 3. Données Mock Retournées

```javascript
// mockDataService.js - Après délai de 300ms
{
  total_bookings: 3,
  confirmed_bookings: 2,
  pending_bookings: 1,
  total_revenue: 750,
  total_users: 2
}
```

### 4. State Mis à Jour

```javascript
setStats(data)
setBookings(data)
```

### 5. Rendu du Composant

```javascript
return (
  <div>
    {stats.total_bookings} réservations
    {stats.total_revenue}€ de revenus
    {bookings.map(b => ...)}
  </div>
)
```

---

## Flux de Transition Vers Production

### Actuellement (Dev Mode)
```
User Click
  ↓
mockAuthService.login()
  ↓
localStorage
  ↓
Component Renders
```

### Après (Production Mode - VITE_DEV_MODE=false)
```
User Click
  ↓
authService.login() → API Django
  ↓
Backend vérifie credentials
  ↓
Backend retourne JWT token
  ↓
localStorage
  ↓
Component Renders
```

**Changement:** Une seule ligne (mockAuthService → authService)

---

## Structure des Dossiers

```
src/
├── services/
│   ├── api.js                 ← API Client réelle
│   ├── mockAuthService.js     ← Mock Auth (NEW)
│   ├── mockDataService.js     ← Mock Data (NEW)
│   ├── stripe.js
│   ├── emailService.js
│   └── dataExportService.js
│
├── config/
│   └── devMode.js             ← Dev Config (NEW)
│
├── components/
│   ├── DevLoginHelper.jsx     ← Quick Login (NEW)
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── ...
│
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── ServicesManagement.jsx
│   │   └── ...
│   └── ...
│
└── App.jsx                    ← Modifié pour incluire DevLoginHelper
```

---

## Interception des Appels API

### Actuellement (Dev Mode)
```javascript
// Dans AdminDashboard.jsx
const stats = await mockDataService.getStats()
// Retourne immédiatement les données mock
```

### Plus tard (Production Mode)
```javascript
// Dans AdminDashboard.jsx
const stats = await apiClient.get('/api/stats/')
// Envoie requête à Django, retourne données réelles
```

**Transparence:** Le code du composant reste IDENTIQUE!

---

## Variables d'Environnement Impact

### VITE_DEV_MODE=true
```javascript
// src/config/devMode.js
if (DEV_MODE) {
  return mockAuthService    // ← Mock
  return mockDataService    // ← Mock
}
```

### VITE_DEV_MODE=false
```javascript
// src/config/devMode.js
if (DEV_MODE) {
  // ...
} else {
  return authService        // ← Real API
  return apiClient          // ← Real API
}
```

---

## Avantages du Mode Dev

✅ **Tester UI/UX sans backend**
✅ **Données stables et complètes**
✅ **Pas de dépendance réseau**
✅ **Développement parallèle**
✅ **Transition facile vers production**

---

## Données Mock Détail

### Services Mock (4 items)
```javascript
MOCK_DATA.services = [
  { id: 1, title: 'Magicien', price: 250, ... },
  { id: 2, title: 'Clown', price: 200, ... },
  // ...
]
```

### Bookings Mock (3 items)
```javascript
MOCK_DATA.bookings = [
  { id: 1, booking_number: 'BK-001-2024', status: 'confirmed', ... },
  { id: 2, booking_number: 'BK-002-2024', status: 'pending', ... },
  // ...
]
```

### Etc.
```javascript
MOCK_DATA.users = [...]
MOCK_DATA.payments = [...]
```

---

## Erreurs Courantes & Solutions

### Erreur: "DEV MODE button not showing"
```
✓ Vérifier VITE_DEV_MODE=true dans .env.local
✓ Redémarrer: npm run dev
✓ Rafraîchir le navigateur
```

### Erreur: "API not responding"
```
✓ Si dev mode: mock devrait fonctionner
✓ Si production: vérifier Django lancé
✓ Vérifier console (F12) pour erreurs
```

### Erreur: "Login échoue"
```
✓ Dev mode: utiliser admin@funkidz.fr / admin123
✓ Production: vérifier credentials en DB
✓ Vérifier token dans localStorage
```

---

## Performance

### Mode Dev (Mock)
- ✅ Instant (données en RAM)
- ✅ 0ms latence
- ✅ Simulé ~300ms pour réalisme

### Mode Production (Real)
- ⚠️ 50-200ms latence
- ⚠️ Dépend du serveur
- ⚠️ Dépend du réseau

---

## Debugging

### Voir les logs DEV MODE
```javascript
// Console (F12)
// Chercher:
[DEV MODE] Using mock authentication service
[DEV MODE] Using mock data service
```

### Vérifier token
```javascript
// Console (F12)
localStorage.getItem('token')
// Affiche: mock_admin_token_12345
```

### Vérifier données user
```javascript
// Console (F12)
JSON.parse(localStorage.getItem('user'))
// Affiche: { id, email, role, ... }
```

---

## Résumé du Flux Complet

```
1. VITE_DEV_MODE=true défini
   ↓
2. User clique "Login as Admin"
   ↓
3. mockAuthService.login() appelé
   ↓
4. Credentials mock vérifiés
   ↓
5. Token & User sauvegardés
   ↓
6. Redirection vers /admin
   ↓
7. AdminDashboard monte
   ↓
8. mockDataService.getStats() appelé
   ↓
9. Données mock retournées (300ms)
   ↓
10. Component re-rendu avec données
   ↓
11. Panel admin affichant les données mock
   ↓
✅ Mode dev fonctionne!
```

---

**Le système est conçu pour être transparent:**
- Changez une ligne (DEV_MODE)
- Tout bascule du mode dev à production
- Le code des composants ne change pas

Génial pour développement parallèle! 🚀
