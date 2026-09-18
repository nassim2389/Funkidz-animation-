from django.urls import path
from .views import CreateStripeSessionView, CreatePaymentIntentView, stripe_webhook

urlpatterns = [
    path('payments/create-session/', CreateStripeSessionView.as_view(), name='create-stripe-session'),
    path('payments/create-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('payments/webhook/', stripe_webhook, name='stripe-webhook'),
]
