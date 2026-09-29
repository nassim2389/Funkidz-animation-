# Funkidz Animation — Installation sur Windows

Ce guide explique comment installer et lancer le site Funkidz Animation
sur un ordinateur Windows, en local, pour le tester.

---

## 1. Ce qu'il faut installer avant de commencer

- **Python 3.10 ou supérieur**
  Téléchargement : https://www.python.org/downloads/

  ⚠️ Pendant l'installation, cochez bien la case **"Add Python to PATH"**
  sur le premier écran de l'assistant. Sans cette case cochée, le script
  ne fonctionnera pas.

C'est tout ce qui est nécessaire : le reste (dépendances du projet, base
de données, données de démonstration) est installé automatiquement par
le script fourni.

---

## 2. Lancer l'application

1. Récupérez le dossier du projet (`Funkidz-animation-`) sur votre
   ordinateur.
2. Ouvrez ce dossier dans l'explorateur Windows.
3. Double-cliquez sur le fichier **`Lancer_sur_windows.cmd`**.

Une fenêtre noire (invite de commandes) s'ouvre et effectue
automatiquement, dans l'ordre :

1. Création de l'environnement Python du projet.
2. Installation des dépendances nécessaires.
3. Création du fichier de configuration `.env` (si absent).
4. Préparation de la base de données.
5. Injection des données de démonstration (formules, comptes de test,
   avis, galerie photo...).
6. Lancement du serveur et ouverture automatique du site dans votre
   navigateur.

**Laissez cette fenêtre ouverte** tant que vous utilisez le site : la
fermer arrête le serveur. Pour tout réutiliser une prochaine fois, il
suffit de redoubler-cliquer sur `Lancer_sur_windows.cmd` — les étapes déjà
faites (installation, base de données) sont réutilisées, seul le
serveur redémarre.

---

## 3. Adresses du site une fois lancé

| Espace | Adresse |
| :--- | :--- |
| Site public (réservation) | http://127.0.0.1:8000/ |
| Panneau d'administration | http://127.0.0.1:8000/admin/ |
| Espace client / animateur | http://127.0.0.1:8000/dashboard/ |

---

## 4. Comptes de test

| Rôle | Adresse e-mail | Mot de passe |
| :--- | :--- | :--- |
| **Administrateur** | `nassimoouche@gmail.com` | `admin123` |
| **Client** | `jrdfklhx@outlook.be` | `client123` |
| **Animateur** | `oreocq@gmail.com` | `animateur123` |

Ces adresses sont réelles : en effectuant des actions avec ces comptes
précis (réservation côté client, attribution de mission côté
animateur...), les e-mails de notification correspondants sont
réellement envoyés dans ces boîtes — à condition que les identifiants
Brevo aient été renseignés dans le fichier `.env` (voir ci-dessous).
D'autres comptes de test existent également (voir `seed_all_data.py`).

---

## 5. Recevoir les vrais e-mails de test (optionnel)

Par défaut, si le fichier `.env` est créé automatiquement par le script
sans configuration e-mail, le site fonctionne normalement mais aucun
e-mail n'est réellement envoyé.

Pour recevoir les vrais e-mails (confirmation de réservation, paiement,
annulation...), demandez à Nassim les identifiants Brevo et ajoutez-les
dans le fichier `.env` à la racine du projet :

```
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=<identifiant fourni par Nassim>
EMAIL_HOST_PASSWORD=<clé fournie par Nassim>
DEFAULT_FROM_EMAIL=Funkidz Animation <hello.funkidz@gmail.com>
ADMIN_NOTIFICATION_EMAILS=nassimoouche@gmail.com
```

Puis relancez `Lancer_sur_windows.cmd`.

---

## 6. En cas de problème

| Problème | Solution |
| :--- | :--- |
| `'python' n'est pas reconnu...` | Python n'est pas installé, ou pas ajouté au PATH. Réinstallez Python en cochant "Add Python to PATH". |
| La fenêtre se ferme immédiatement | Rouvrez une invite de commandes (`Windows + R` puis `cmd`), déplacez-vous dans le dossier du projet (`cd chemin\vers\Funkidz-animation-`) et tapez `Lancer_sur_windows.cmd` pour voir le message d'erreur exact. |
| `Error: That port is already in use` | Un autre programme utilise déjà le port 8000. Fermez-le, ou redémarrez l'ordinateur. |
| Aucun e-mail reçu | Normal si le fichier `.env` n'a pas les identifiants Brevo (voir section 5). |
| Repartir sur une base entièrement propre | Supprimez le fichier `db.sqlite3` à la racine du projet, puis relancez `Lancer_sur_windows.cmd`. |
