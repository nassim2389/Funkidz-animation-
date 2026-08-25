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

def google_login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email') or request.POST.get('google_email') or 'client.google@gmail.com'
        first_name = request.POST.get('first_name', 'Client')
        last_name = request.POST.get('last_name', 'Google')
    else:
        email = request.GET.get('email', 'client.google@gmail.com')
        first_name = 'Client'
        last_name = 'Google'

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
    path('register/', RegisterView.as_view(), name='register'),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserMeView.as_view(), name='user_me'),
]
