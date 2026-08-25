from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, UserMeView, TokenObtainPairView
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import SignupForm
from django.contrib.auth import get_user_model

User = get_user_model()

class UserLoginView(LoginView):
    template_name = 'auth/login.html'
    
    def get_success_url(self):
        return '/'

def signup_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        if email and password:
            user = User.objects.create_user(email=email, password=password, is_verified=True)
            login(request, user)
            return redirect('/')
    return render(request, 'auth/signup.html')

import os
import urllib.parse
import json
from urllib.request import Request, urlopen

def google_login_view(request):
    client_id = os.getenv('GOOGLE_CLIENT_ID', '1071006060591-tmhssin2h21lcre235vtolojh4g403ep.apps.googleusercontent.com')
    redirect_uri = request.build_absolute_uri('/auth/google-callback/')
    
    # If user selected prompt=web, render web Account Chooser
    if request.GET.get('prompt') == 'web':
        return render(request, 'auth/google_login.html')
        
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={client_id}&"
        f"redirect_uri={urllib.parse.quote(redirect_uri)}&"
        f"response_type=code&"
        f"scope=openid%20email%20profile&"
        f"prompt=select_account"
    )
    return redirect(google_auth_url)

def google_callback_view(request):
    email = request.POST.get('email') or request.GET.get('email') or request.GET.get('login_email')
    first_name = request.POST.get('first_name') or request.GET.get('first_name')
    last_name = request.POST.get('last_name') or request.GET.get('last_name')

    code = request.GET.get('code')
    client_id = os.getenv('GOOGLE_CLIENT_ID', '1071006060591-tmhssin2h21lcre235vtolojh4g403ep.apps.googleusercontent.com')
    client_secret = os.getenv('GOOGLE_CLIENT_SECRET', '')
    redirect_uri = request.build_absolute_uri('/auth/google-callback/')

    if code and client_secret:
        try:
            token_url = "https://oauth2.googleapis.com/token"
            data = urllib.parse.urlencode({
                'code': code,
                'client_id': client_id,
                'client_secret': client_secret,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code'
            }).encode('utf-8')
            
            req = Request(token_url, data=data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
            res = urlopen(req)
            token_data = json.loads(res.read().decode('utf-8'))
            access_token = token_data.get('access_token')

            if access_token:
                userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"
                req_info = Request(userinfo_url, headers={'Authorization': f'Bearer {access_token}'})
                res_info = urlopen(req_info)
                user_info = json.loads(res_info.read().decode('utf-8'))
                email = user_info.get('email')
                first_name = user_info.get('given_name', 'Client')
                last_name = user_info.get('family_name', 'Google')
        except Exception:
            pass

    # If no email is provided, display Google Account Chooser UI
    if not email:
        return render(request, 'auth/google_login.html')

    if not first_name:
        first_name = email.split('@')[0].capitalize()
    if not last_name:
        last_name = ''

    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'first_name': first_name,
            'last_name': last_name,
            'role': User.Role.CLIENT,
            'is_verified': True
        }
    )
    login(request, user)
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
