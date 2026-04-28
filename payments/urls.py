from django.urls import path
from .views import CreateStripeSessionView, stripe_webhook

urlpatterns = [
    path('payments/create-session/', CreateStripeSessionView.as_view(), name='create-stripe-session'),
    path('payments/webhook/', stripe_webhook, name='stripe-webhook'),
]
