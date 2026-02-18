## Accès Immédiat au Panel Admin (Sans Backend Django)

### 3 Étapes Simple

#### 1. Vérifier le .env.local
```bash
# Doit contenir:
VITE_DEV_MODE=true
```

#### 2. Lancer l'App
```bash
npm install
npm run dev
```

#### 3. Se Connecter Comme Admin
**Méthode 1 (La plus simple):**
- Regardez le coin inférieur droit
- Un bouton jaune "DEV MODE" apparaît
- Cliquez sur "Login as Admin"
- ✅ Accès immédiat au panel admin

**Méthode 2 (Via formulaire):**
- Allez à http://localhost:5173/auth/login
- Email: `admin@funkidz.fr`
- Password: `admin123`
- Cliquez "Se connecter"

**Méthode 3 (Comme client):**
- Email: `user@funkidz.fr`
- Password: `user123`

---

## URLs du Panel Admin

Une fois connecté comme admin:

| Page | URL |
|------|-----|
| Dashboard | http://localhost:5173/admin |
| Services | http://localhost:5173/admin/services |
| Réservations | http://localhost:5173/admin/bookings |
| Utilisateurs | http://localhost:5173/admin/users |
| Paiements | http://localhost:5173/admin/payments |
| Galerie | http://localhost:5173/admin/gallery |
| Paramètres | http://localhost:5173/admin/settings |

---

## Données de Test Incluses

### Services (4)
- ✅ Magicien (250€)
- ✅ Clown (200€)
- ✅ DJ & Danseur (300€)
- ✅ Atelier Créatif (180€)

### Réservations (3)
- ✅ 3 réservations avec statuts différents
- ✅ Clients, dates, prix

### Utilisateurs (2)
- ✅ Admin
- ✅ Client de test

### Paiements (2)
- ✅ Historique de paiements

---

## C'est Tout!

Vous pouvez maintenant tester le panel admin en mode développement pendant que le backend Django se développe.

**Note:** Quand Django sera prêt, changez `VITE_DEV_MODE=false` et tout fonctionnera avec le backend réel.

Bon test! 🎉
