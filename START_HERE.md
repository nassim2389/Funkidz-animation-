# START HERE - Accès Panel Admin en 1 Minute

## Les 4 Commandes

```bash
# 1. Aller dans le dossier
cd /vercel/share/v0-project

# 2. Installer les dépendances
npm install

# 3. Lancer l'app
npm run dev

# 4. Ouvrir le navigateur
# http://localhost:5173
```

## Connexion Admin (30 Secondes)

1. **Regarder le coin inférieur droit** → Bouton jaune "DEV MODE"
2. **Cliquer** "Login as Admin"
3. **Attendre** ~1 seconde
4. ✅ **Accès au panel admin**

## Alternative: Login Manuel

1. Aller à `http://localhost:5173/auth/login`
2. Copier/coller:
   - Email: `admin@funkidz.fr`
   - Password: `admin123`
3. Cliquer "Se connecter"

## Panel Admin URLs

Une fois connecté:

- http://localhost:5173/admin → Dashboard
- http://localhost:5173/admin/services → Services
- http://localhost:5173/admin/bookings → Réservations
- http://localhost:5173/admin/users → Utilisateurs
- http://localhost:5173/admin/payments → Paiements
- http://localhost:5173/admin/gallery → Galerie
- http://localhost:5173/admin/settings → Paramètres

## Credentials de Test

| Rôle | Email | Password |
|------|-------|----------|
| Admin | admin@funkidz.fr | admin123 |
| User | user@funkidz.fr | user123 |

## C'est Tout!

Vous accédez maintenant au panel admin complet avec:
- ✅ Données mock
- ✅ Navigation complète
- ✅ Tous les écrans
- ✅ Sans backend Django

## Pour Plus de Détails

- `QUICK_ADMIN_ACCESS.md` - Accès rapide
- `DEV_MODE_ADMIN_GUIDE.md` - Guide complet
- `HOW_DEV_MODE_WORKS.md` - Comment ça fonctionne

## Quand Django Sera Prêt

Changez dans `.env.local`:
```
VITE_DEV_MODE=false
```

Et tout se connectera au backend réel! 🚀
