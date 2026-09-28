@echo off
setlocal enabledelayedexpansion
title Funkidz Animation - Installation et lancement (Windows)
cd /d "%~dp0"

echo ================================================================
echo   FUNKIDZ ANIMATION - Installation et lancement (Windows)
echo ================================================================
echo.

:: 1. Verifier que Python est installe et accessible
where python >nul 2>nul
if errorlevel 1 (
    echo [ERREUR] Python est introuvable.
    echo Installez Python 3.10 ou superieur depuis https://www.python.org/downloads/
    echo IMPORTANT : cochez bien la case "Add Python to PATH" pendant l'installation.
    echo Relancez ensuite ce script.
    pause
    exit /b 1
)

:: 2. Creer l'environnement virtuel s'il n'existe pas encore
if not exist venv (
    echo [1/6] Creation de l'environnement virtuel Python...
    python -m venv venv
) else (
    echo [1/6] Environnement virtuel deja present, reutilisation.
)

:: 3. Activer l'environnement virtuel
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo [ERREUR] Impossible d'activer l'environnement virtuel.
    pause
    exit /b 1
)

:: 4. Installer les dependances du projet
echo [2/6] Installation des dependances (peut prendre quelques minutes)...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERREUR] L'installation des dependances a echoue.
    pause
    exit /b 1
)

:: 5. Creer le fichier .env s'il n'existe pas encore
if not exist .env (
    echo [3/6] Creation du fichier .env a partir de .env.example...
    copy .env.example .env >nul
    echo.
    echo [ATTENTION] Le fichier .env vient d'etre cree avec des valeurs par defaut.
    echo Pour envoyer de vrais e-mails de test, demandez a Nassim les identifiants
    echo Brevo ^(EMAIL_HOST_USER / EMAIL_HOST_PASSWORD^) et renseignez-les dans le
    echo fichier .env a la racine du projet avant de continuer.
    echo Sans cela, l'application fonctionne normalement mais aucun e-mail n'est
    echo reellement envoye.
    echo.
    pause
) else (
    echo [3/6] Fichier .env deja present, conserve tel quel.
)

:: 6. Appliquer les migrations de base de donnees
echo [4/6] Mise a jour de la base de donnees...
python manage.py migrate
if errorlevel 1 (
    echo [ERREUR] Les migrations ont echoue.
    pause
    exit /b 1
)

:: 7. Injecter les donnees de demonstration (formules, comptes de test...)
echo [5/6] Injection des donnees de demonstration...
python seed_all_data.py
if errorlevel 1 (
    echo [ERREUR] L'injection des donnees de demonstration a echoue.
    pause
    exit /b 1
)

:: 8. Lancer le serveur et ouvrir le navigateur
echo [6/6] Lancement du serveur...
echo.
echo ================================================================
echo   Serveur disponible sur http://127.0.0.1:8000/
echo   Laissez cette fenetre ouverte pendant l'utilisation du site.
echo   Fermez-la (ou faites Ctrl+C) pour arreter le serveur.
echo ================================================================
echo.
start "" http://127.0.0.1:8000/
python manage.py runserver

pause
