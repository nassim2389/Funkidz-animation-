# De Mode Développement à Production Django

## Architecture Actuelle

```
Mode Développement (Maintenant)
├── Frontend React (localhost:5173)
├── Mock Authentication (mockAuthService.js)
├── Mock Data (mockDataService.js)
└── Données en localStorage

                  ↓↓↓ (Quand Django prêt)

Mode Production (Plus tard)
├── Frontend React (localhost:5173)
├── Real Backend Django (localhost:8000)
├── Real Database PostgreSQL
└── Real API Endpoints
```

---

## Comment Basculer Entre les Modes

### Actif le Mode Développement

**Fichier:** `.env.local`
```
VITE_DEV_MODE=true
VITE_API_URL=http://localhost:8000/api
```

**Redémarrer:** `npm run dev`

**Résultat:**
- ✅ Authentification mock fonctionne
- ✅ Données mock affichées
- ✅ Pas besoin de backend Django

---

### Activer Mode Production (Backend Real)

**Fichier:** `.env.local`
```
VITE_DEV_MODE=false
VITE_API_URL=http://localhost:8000/api
```

**Redémarrer:** `npm run dev`

**Prérequis:**
- ✅ Backend Django lancé sur localhost:8000
- ✅ Tous les 30+ endpoints implémentés
- ✅ Base de données PostgreSQL configurée
- ✅ CORS configuré sur Django

---

## Flux de Développement Recommandé

### Phase 1: Tests Frontend (Actuellement)
```
1. npm run dev
2. VITE_DEV_MODE=true
3. Testez tous les écrans avec mockAuthService
4. Validez la UI/UX
```

### Phase 2: Implémentation Backend Django
```
1. Créez le projet Django
2. Implémentez les modèles
3. Créez les 30+ endpoints API
4. Configurez CORS
5. Testez chaque endpoint avec Postman
```

### Phase 3: Intégration Frontend-Backend
```
1. Changez VITE_DEV_MODE=false
2. Connectez l'app au backend Django
3. Testez chaque flux complet
4. Corrigez les bugs d'intégratio
```

### Phase 4: Production
```
1. Déployez Django (Heroku/DigitalOcean/AWS)
2. Déployez React (Vercel)
3. Configurez les URLs réelles
4. Tests finaux
```

---

## Vérifications Avant de Passer en Production

### Checklist Backend Django

- [ ] 30+ endpoints créés et testés
- [ ] Authentification JWT fonctionne
- [ ] CORS configuré correctement
- [ ] Base de données PostgreSQL opérationnelle
- [ ] Tous les modèles créés
- [ ] Migrations appliquées
- [ ] Validation de données
- [ ] Gestion des erreurs

### Checklist Intégration

- [ ] Frontend se connecte au backend
- [ ] Authentification fonctionne
- [ ] Services se chargent
- [ ] Réservations se sauvegardent
- [ ] Paiements Stripe intégré
- [ ] Emails envoyés

### Checklist Production

- [ ] Tests en mode production
- [ ] Logs vérifiés
- [ ] Performance testée
- [ ] Sécurité vérifiée
- [ ] HTTPS activé
- [ ] Backup configuré

---

## Dépannage Common

### Erreur: "API not responding"
**Solution 1 (Dev Mode):**
- Vérifier `VITE_DEV_MODE=true`
- Redémarrer l'app: `npm run dev`

**Solution 2 (Production Mode):**
- Vérifier Django lancé: `python manage.py runserver`
- Vérifier CORS configuré dans Django
- Vérifier URL API correcte

### Erreur: "Cannot login"
**Dev Mode:**
- Email: admin@funkidz.fr / Password: admin123
- Email: user@funkidz.fr / Password: user123

**Production Mode:**
- Vérifier les identifiants en base de données
- Vérifier endpoint `/auth/login` fonctionne

### Erreur: "Token invalide"
**Dev Mode:**
- Token mock expiration: tokens ne s'expirent pas

**Production Mode:**
- Vérifier JWT_EXPIRATION_DELTA en Django
- Vérifier SECRET_KEY en Django

---

## Structure des Données Différence

### Mode Dev (Mock)
```javascript
Services: [
  { id: 1, title: 'Magicien', price: 250, ... }
]
// Données statiques
// Pas de persistence
```

### Mode Production (Real API)
```javascript
Services: [
  { 
    id: 1, 
    title: 'Magicien', 
    price: 250,
    description: 'from DB',
    created_at: '2024-...',
    ... 
  }
]
// Données de la base de données
// Persistence complète
```

---

## Variables d'Environnement

### Development
```
VITE_DEV_MODE=true
VITE_API_URL=http://localhost:8000/api
```

### Production
```
VITE_DEV_MODE=false
VITE_API_URL=https://api.funkidz.fr/api
```

### Testing
```
VITE_DEV_MODE=true
VITE_API_URL=http://localhost:8000/api
```

---

## Performance Impact

### Mode Dev (Mock)
- ✅ Très rapide (données en mémoire)
- ✅ Pas de latence réseau
- ✅ Idéal pour UI testing

### Mode Production (Real API)
- ⚠️ Plus lent (requêtes réseau)
- ⚠️ Latence normale (50-200ms)
- ✅ Données réelles et persistence

---

## Support Transition

Si vous rencontrez des problèmes lors du basculement:

1. Vérifier les logs du navigateur (F12)
2. Vérifier les logs Django
3. Vérifier les erreurs CORS
4. Vérifier les tokens JWT
5. Vérifier la base de données

Consultez les fichiers:
- `DJANGO_READINESS_REPORT.md` - Détails API
- `FINAL_DJANGO_INTEGRATION_GUIDE.md` - Guide d'intégration
- `DEV_MODE_ADMIN_GUIDE.md` - Guide mode dev complet

---

**Astuce:** Utilisez Postman pour tester les endpoints Django avant de les connecter au frontend. Cela vous évitera beaucoup de problèmes d'intégration.

Bon développement! 🚀
