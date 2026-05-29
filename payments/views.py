import stripe
import os
import logging
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from bookings.models import Booking
from .models import Payment

logger = logging.getLogger(__name__)

# Charge la clé Stripe depuis les variables d'environnement via settings
stripe.api_key = os.getenv('STRIPE_API_KEY')


class CreateStripeSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get('booking_id')
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Réservation introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if not stripe.api_key or 'REMPLACER' in stripe.api_key:
            logger.error("Clé Stripe manquante ou non configurée dans le fichier .env")
            return Response({'error': 'Service de paiement non configuré. Contactez l\'administrateur.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                customer_email=request.user.email,  # Pré-remplit l'email du client
                line_items=[
                    {
                        'price_data': {
                            'currency': 'eur',
                            'product_data': {
                                'name': f"Animation Funkidz - {booking.service.name}",
                                'description': f"Le {booking.booking_date} à {booking.booking_time} — {booking.nb_children} enfants",
                            },
                            'unit_amount': int(booking.final_price * 100),  # Stripe attend des centimes
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=request.build_absolute_uri('/payment-success/') + '?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=request.build_absolute_uri('/payment-cancelled/'),
                metadata={
                    'booking_id': booking.id
                }
            )

            # Enregistre la session Stripe dans notre base de données
            Payment.objects.create(
                booking=booking,
                stripe_session_id=checkout_session.id,
                amount=booking.final_price
            )

            logger.info(f"Session Stripe créée pour la réservation #{booking.id} — Session: {checkout_session.id}")
            return Response({'session_id': checkout_session.id, 'url': checkout_session.url})

        except stripe.error.AuthenticationError:
            logger.error("Clé API Stripe invalide.")
            return Response({'error': 'Clé API Stripe invalide.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Erreur Stripe pour la réservation #{booking_id}: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def stripe_webhook(request):
    """
    Endpoint Stripe Webhook — reçoit les événements Stripe.
    En local, utiliser : stripe listen --forward-to localhost:8000/api/payments/webhook/
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

    if not endpoint_secret or 'REMPLACER' in endpoint_secret:
        logger.warning("STRIPE_WEBHOOK_SECRET non configuré — validation de signature ignorée.")
        return HttpResponse(status=400)

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError:
        logger.error("Webhook Stripe : payload invalide.")
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        logger.error("Webhook Stripe : signature invalide.")
        return HttpResponse(status=400)

    # ✅ Paiement réussi
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        booking_id = session.get('metadata', {}).get('booking_id')

        if booking_id:
            try:
                payment = Payment.objects.get(stripe_session_id=session['id'])
                payment.status = Payment.Status.SUCCEEDED
                payment.stripe_payment_intent = session.get('payment_intent')
                payment.save()

                booking = payment.booking
                booking.status = Booking.Status.CONFIRMED
                booking.save()  # Déclenche le signal → envoi de l'email de confirmation Brevo

                logger.info(f"✅ Paiement confirmé pour la réservation #{booking.id}")
            except Payment.DoesNotExist:
                logger.warning(f"Payment introuvable pour la session Stripe {session['id']}")

    # ❌ Paiement échoué
    elif event['type'] == 'payment_intent.payment_failed':
        intent = event['data']['object']
        error_msg = intent.get('last_payment_error', {}).get('message', 'Erreur inconnue')
        logger.warning(f"❌ Paiement échoué — PaymentIntent: {intent['id']} — Erreur: {error_msg}")

        # Retrouver le Payment associé et notifier le client
        try:
            payment = Payment.objects.get(stripe_payment_intent=intent['id'])
            payment.status = Payment.Status.FAILED
            payment.save()

            booking = payment.booking
            send_mail(
                subject="Échec de paiement pour votre réservation Funkidz 😟",
                message=(
                    f"Bonjour {booking.user.first_name or ''},\n\n"
                    f"Nous n'avons pas pu traiter le paiement pour votre réservation #{booking.id} ({booking.service.name}).\n\n"
                    f"Raison : {error_msg}\n\n"
                    f"Veuillez réessayer en cliquant sur ce lien ou en contactant notre support.\n\n"
                    f"L'équipe Funkidz"
                ),
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@funkidz.fr'),
                recipient_list=[booking.user.email],
                fail_silently=True,
            )
        except Payment.DoesNotExist:
            pass

    return HttpResponse(status=200)

