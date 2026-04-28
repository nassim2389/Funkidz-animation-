from django.urls import path
from django.views.generic import TemplateView
from .views import (
    HomeView, ServiceListWebView, BookingWizardView, GalleryView, PricingView, 
    AboutView, ContactView, DashboardView
)
from . import views_animateur, views_client

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('nos-surprises/', ServiceListWebView.as_view(), name='services-web'),
    path('booking/', BookingWizardView.as_view(), name='booking-wizard'),
    path('booking/<int:booking_id>/cancel/', views_client.cancel_booking, name='cancel-booking'),
    path('mission/<int:booking_id>/complete/', views_animateur.complete_mission, name='complete-mission'),
    path('gallery/', GalleryView.as_view(), name='gallery'),
    path('pricing/', PricingView.as_view(), name='pricing'),
    path('about/', AboutView.as_view(), name='about'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('terms/', TemplateView.as_view(template_name='terms.html'), name='terms'),
    path('privacy/', TemplateView.as_view(template_name='privacy.html'), name='privacy'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('assignment/<int:assignment_id>/accept/', views_animateur.accept_assignment, name='accept-assignment'),
    path('assignment/<int:assignment_id>/refuse/', views_animateur.refuse_assignment, name='refuse-assignment'),
]
