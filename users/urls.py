from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, UserMeView, TokenObtainPairView
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib import messages
from .forms import SignupForm
from django.contrib.auth import get_user_model

User = get_user_model()

class UserLoginView(LoginView):
    template_name = 'auth/login.html'
    
    def get_success_url(self):
        return '/'

def signup_view(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            return redirect('/')
        for errors in form.errors.values():
            for error in errors:
                messages.error(request, error)
        return render(request, 'auth/signup.html', {'email': request.POST.get('email', '')})
    return render(request, 'auth/signup.html')

import logging
import os
import urllib.parse
import json
from urllib.request import Request, urlopen

logger = logging.getLogger(__name__)

def _google_oauth_configured():
    """La connexion Google réelle exige un identifiant client et son secret."""
    return bool(os.getenv('GOOGLE_CLIENT_ID') and os.getenv('GOOGLE_CLIENT_SECRET'))


def _google_simulation_enabled():
    """
    Sélecteur de compte Google simulé, réservé aux démonstrations locales.

    Il n'est actif qu'en mode DEBUG et sur activation explicite
    (GOOGLE_LOGIN_SIMULATION=True dans le .env), car il ne vérifie pas
    l'identité de l'utilisateur.
    """
    from django.conf import settings
    flag = os.getenv('GOOGLE_LOGIN_SIMULATION', 'False').lower() in ('true', '1', 't')
    return settings.DEBUG and flag


def _google_login_unavailable(request):
    messages.error(request, "La connexion avec Google n'est pas disponible pour le moment.")
    return redirect('login')


def google_login_view(request):
    google_client_id = os.getenv('GOOGLE_CLIENT_ID', '')

    # Connexion réelle : redirection vers le serveur OAuth de Google
    if _google_oauth_configured():
        redirect_uri = request.build_absolute_uri('/auth/google-callback/')
        google_auth_url = (
            f"https://accounts.google.com/o/oauth2/v2/auth?"
            f"client_id={google_client_id}&"
            f"redirect_uri={urllib.parse.quote(redirect_uri)}&"
            f"response_type=code&"
            f"scope=openid%20email%20profile&"
            f"prompt=select_account"
        )
        return redirect(google_auth_url)

    if _google_simulation_enabled():
        return render(request, 'auth/google_login.html')

    return _google_login_unavailable(request)


def _google_identity_from_code(request, code):
    """
    Échange le code d'autorisation contre l'identité vérifiée par Google.

    Retourne (email, prénom, nom) ou None si Google ne confirme pas l'adresse.
    """
    client_id = os.getenv('GOOGLE_CLIENT_ID', '')
    client_secret = os.getenv('GOOGLE_CLIENT_SECRET', '')
    redirect_uri = request.build_absolute_uri('/auth/google-callback/')

    try:
        data = urllib.parse.urlencode({
            'code': code,
            'client_id': client_id,
            'client_secret': client_secret,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code'
        }).encode('utf-8')
        req = Request(
            "https://oauth2.googleapis.com/token",
            data=data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        token_data = json.loads(urlopen(req, timeout=10).read().decode('utf-8'))
        access_token = token_data.get('access_token')
        if not access_token:
            return None

        req_info = Request(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={'Authorization': f'Bearer {access_token}'}
        )
        user_info = json.loads(urlopen(req_info, timeout=10).read().decode('utf-8'))
    except Exception:
        logger.exception("Échec de l'échange du code d'autorisation Google.")
        return None

    email = user_info.get('email')
    if not email or not user_info.get('email_verified'):
        return None
    return email, user_info.get('given_name', ''), user_info.get('family_name', '')


def google_callback_view(request):
    """
    Retour de l'authentification Google.

    L'adresse e-mail n'est jamais lue dans les paramètres de la requête en
    production : elle provient exclusivement de l'identité vérifiée par Google.
    Le mode simulé (démonstration locale) n'accepte qu'un envoi de formulaire
    et ne permet jamais d'ouvrir un compte administrateur ou animateur.
    """
    code = request.GET.get('code')

    if code and _google_oauth_configured():
        identity = _google_identity_from_code(request, code)
        if identity is None:
            return _google_login_unavailable(request)
        email, first_name, last_name = identity
    elif _google_simulation_enabled() and request.method == 'POST':
        email = (request.POST.get('email') or '').strip()
        first_name = request.POST.get('first_name', '')
        last_name = request.POST.get('last_name', '')
        if not email:
            return render(request, 'auth/google_login.html')
    else:
        return _google_login_unavailable(request)

    email = User.objects.normalize_email(email)
    if not first_name:
        first_name = email.split('@')[0].capitalize()

    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'first_name': first_name,
            'last_name': last_name or '',
            'role': User.Role.CLIENT,
            'is_verified': True
        }
    )

    if not code:
        is_privileged = user.is_staff or user.is_superuser or user.role != User.Role.CLIENT
        if is_privileged:
            logger.warning(f"Connexion Google simulée refusée pour un compte privilégié : {email}")
            return _google_login_unavailable(request)

    if not user.is_active:
        return _google_login_unavailable(request)

    login(request, user, backend='django.contrib.auth.backends.ModelBackend')
    return redirect('dashboard')

urlpatterns = [
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('signup/', signup_view, name='signup'),
    path('google-login/', google_login_view, name='google-login'),
    path('google-callback/', google_callback_view, name='google-callback'),
    path('register/', RegisterView.as_view(), name='register'),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserMeView.as_view(), name='user_me'),
]
