# Lancer et tester Funkidz en local

## TL;DR — démarrage en 6 commandes

Le `venv/` du dépôt était inutilisable, **il faut le recréer**, ne jamais le réutiliser.

```bash
python3 -m venv venv                                   # recréer le venv
./venv/bin/pip install -r requirements.txt             # installer les deps
./venv/bin/python manage.py migrate                    # créer la base SQLite
./venv/bin/python manage.py createsuperuser --email admin@funkidz.fr   # login par EMAIL
./venv/bin/python seed_all_data.py                     # données de démo (PURGE la base)
./venv/bin/python manage.py runserver 8000             # → http://127.0.0.1:8000/
```

## Les 3 erreurs qui bloquent au démarrage

| Message d'erreur | Cause | Solution |
|---|---|---|
| `venv/bin/python3: No such file or directory` | venv commité avec les chemins d'une autre machine | `rm -rf venv` puis le recréer |
| `ModuleNotFoundError: No module named 'jazzmin'` | dépendance absente de `requirements.txt` | `pip install django-jazzmin` |
| `unrecognized arguments: --username` | le modèle User se logue par email | utiliser `--email` |

## Réflexes de débogage

```bash
./venv/bin/python manage.py check       # erreurs de config, doit dire "no issues"
./venv/bin/python manage.py showmigrations | grep '\[ \]'   # migrations en attente
./venv/bin/python manage.py shell       # inspecter les modèles à la main
```

`DEBUG=True` affiche la stacktrace complète et la requête SQL directement dans le
navigateur : c'est le premier endroit où regarder en cas de 500. Pour un 404,
consulter `web/urls.py`, les URLs réelles sont `/nos-surprises/`, `/booking/`,
`/gallery/`, et non `/services/` ou `/reservation/`.

Repartir d'une base propre : `rm db.sqlite3` puis rejouer `migrate` et le seed.

---

Récapitulatif de la mise en route du projet sur une machine neuve (Linux), avec
les problèmes rencontrés et leurs corrections.

Projet **Django 6.0** (pas de build npm) : backend Django + Django REST Framework,
front en templates Django avec Tailwind/Alpine.js via CDN, admin Jazzmin.

---

## 1. Problèmes rencontrés

### 1.1 `venv/` était commité avec les chemins de la machine d'origine — bloquant

Le dossier `venv/` (9328 fichiers) était suivi par git alors qu'il figure déjà
dans `.gitignore`. Les scripts qu'il contient pointaient en dur vers le chemin
absolu de la machine d'origine :

```
./venv/bin/pip: line 2: /home/euphredat/PROJET EDDY/funkiz/venv/bin/python3: No such file or directory
```

Un environnement virtuel Python n'est **pas relocalisable** : `pyvenv.cfg`, les
shebangs des scripts de `bin/` et les liens symboliques référencent le chemin de
création. Après un `git clone` dans un autre dossier, `pip` et `python` du venv
sont donc inutilisables.

**Correction** : `git rm -r --cached venv` (le dossier reste sur le disque, il
n'est simplement plus versionné). Chaque développeur recrée son propre venv.

### 1.2 `django-jazzmin` absent de `requirements.txt` — bloquant

`core/settings.py` déclare `jazzmin` en tête d'`INSTALLED_APPS` mais le paquet
n'était pas listé dans `requirements.txt`. Après une installation propre, Django
échoue au démarrage avec `ModuleNotFoundError: No module named 'jazzmin'`.

**Correction** : ajout de `django-jazzmin==3.0.5` à `requirements.txt`.

### 1.3 README : `createsuperuser --username` échoue — mineur

Le modèle `User` du projet utilise `email` comme `USERNAME_FIELD`. La commande
du README renvoie :

```
manage.py createsuperuser: error: unrecognized arguments: --username admin
```

Il faut créer le superutilisateur avec un email uniquement (voir §2, étape 5).

### 1.4 Ce qui n'était **pas** cassé

Le code applicatif est sain : `manage.py check` ne signale aucun problème,
toutes les migrations passent, et toutes les pages publiques répondent en 200.

---

## 2. Procédure d'installation (Linux / macOS)

```bash
# 1. Environnement virtuel (ne jamais réutiliser un venv versionné)
python3 -m venv venv

# 2. Dépendances
./venv/bin/pip install -r requirements.txt

# 3. Fichier .env à la racine (non versionné)
cat > .env <<'EOF'
DEBUG=True
SECRET_KEY=django-insecure-key-funkidz-test-123456
EOF

# 4. Base de données
./venv/bin/python manage.py migrate

# 5. Compte administrateur (login par email, pas par username)
./venv/bin/python manage.py createsuperuser --email admin@funkidz.fr

# 6. Données de démonstration (formules, options, réservations, animateurs...)
./venv/bin/python seed_all_data.py

# 7. Serveur de développement
./venv/bin/python manage.py runserver 8000
```

Sous Windows, remplacer `./venv/bin/python` par `venv\Scripts\python`.

Le fichier `.env` est optionnel : `core/settings.py` fournit des valeurs par
défaut pour `DEBUG` et `SECRET_KEY`. Le définir reste préférable pour éviter
d'utiliser la clé de secours en dur.

---

## 3. Vérification du bon fonctionnement

```bash
./venv/bin/python manage.py check     # attendu : System check identified no issues
```

Pages testées et fonctionnelles :

| URL | Attendu | Contenu |
|---|---|---|
| `/` | 200 | Page d'accueil |
| `/nos-surprises/` | 200 | Catalogue des formules |
| `/pricing/` | 200 | Tarifs |
| `/gallery/` | 200 | Galerie |
| `/about/` | 200 | À propos |
| `/contact/` | 200 | Formulaire de contact |
| `/booking/` | 302 | Tunnel de réservation, redirige vers login |
| `/admin/` | 200 | Back-office Jazzmin |
| `/api/docs/` | 200 | Documentation Swagger (drf-spectacular) |

Contrôle rapide en une commande :

```bash
for u in / /nos-surprises/ /pricing/ /gallery/ /about/ /contact/ /admin/ /api/docs/; do
  curl -s -o /dev/null -w "$u %{http_code}\n" http://127.0.0.1:8000$u
done
```

---

## 4. Comptes de test

L'authentification se fait par **adresse email**, jamais par nom d'utilisateur.

| Rôle | Identifiant | Mot de passe | Origine |
|---|---|---|---|
| Administrateur | `admin@funkidz.fr` | `admin123` | créé manuellement (étape 5) |
| Animateur | emails générés par le seed | `animateur123` | `seed_all_data.py` |
| Client | emails générés par le seed | `password123` | `seed_all_data.py` |

Les emails exacts des comptes de démo sont consultables dans `/admin/` ou dans
`seed_all_data.py`.

---

## 5. Points à connaître pour les tests

- **Paiement Stripe** : sans clé API configurée, le tunnel bascule en *mode démo*
  et valide la réservation instantanément. Aucun paiement réel n'est effectué.
- **Emails Brevo** : si `EMAIL_HOST` n'est pas défini dans `.env`, Django utilise
  le backend fichier/console. Les mails de confirmation ne partent pas vraiment,
  ce qui est le comportement voulu en local.
- **Base de données** : SQLite (`db.sqlite3`), créée par `migrate`. Pour repartir
  de zéro, supprimer le fichier puis rejouer `migrate` et `seed_all_data.py`.
- **Port occupé** : `Error: That port is already in use.` — lancer sur un autre
  port, par exemple `runserver 8010`, ou libérer le port 8000.

---

## 6. Modifications apportées au dépôt

Commit `94ded60` — *fix: untrack venv/ and add missing django-jazzmin dependency*

- `venv/` retiré du suivi git (9328 fichiers), déjà couvert par `.gitignore`
- `django-jazzmin==3.0.5` ajouté à `requirements.txt`

Ce commit est **local et non poussé**. Aucun `git push` n'a été effectué sur
`origin`.
