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


def _stripe_is_configured():
    """Les deux clés Stripe nécessaires au formulaire de carte sont-elles présentes ?"""
    return bool(getattr(settings, 'STRIPE_ENABLED', False))


def _missing_stripe_settings():
    """Liste des variables d'environnement Stripe à renseigner."""
    missing = []
    if not getattr(settings, 'STRIPE_API_KEY', ''):
        missing.append('STRIPE_API_KEY')
    if not getattr(settings, 'STRIPE_PUBLISHABLE_KEY', ''):
        missing.append('STRIPE_PUBLISHABLE_KEY')
    return missing


class CreatePaymentIntentView(APIView):
    """
    Prépare un paiement par carte affiché directement dans le site.

    Crée (ou réutilise) un PaymentIntent Stripe pour la réservation et renvoie
    son client_secret. C'est ce secret qui alimente le Payment Element officiel
    de Stripe, seul composant autorisé à recevoir le numéro de carte : aucune
    donnée bancaire ne transite par le serveur Funkidz.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not _stripe_is_configured():
            return Response(
                {
                    'error': "Le paiement par carte n'est pas disponible : la configuration "
                             "Stripe est incomplète.",
                    'missing': _missing_stripe_settings(),
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        stripe.api_key = settings.STRIPE_API_KEY
        booking_id = request.data.get('booking_id')

        try:
            booking = Booking.objects.select_related('service').get(id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Réservation introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if booking.status == Booking.Status.CANCELLED:
            return Response(
                {'error': "Cette réservation est annulée : elle ne peut plus être réglée."},
                status=status.HTTP_400_BAD_REQUEST
            )

        amount_cents = int(round(float(booking.final_price) * 100))
        if amount_cents <= 0:
            return Response(
                {'error': "Le montant de cette réservation est nul."},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment = Payment.objects.filter(booking=booking).order_by('-created_at').first()

        try:
            intent = None
            # Réutilise l'intention existante tant qu'elle est encore payable et
            # porte le bon montant, pour ne pas multiplier les paiements Stripe.
            if payment and payment.stripe_payment_intent:
                try:
                    existing = stripe.PaymentIntent.retrieve(payment.stripe_payment_intent)
                    reusable = existing.get('status') in (
                        'requires_payment_method', 'requires_confirmation', 'requires_action'
                    )
                    if reusable and existing.get('amount') == amount_cents:
                        intent = existing
                except stripe.error.StripeError:
                    intent = None

            if intent is None:
                intent = stripe.PaymentIntent.create(
                    amount=amount_cents,
                    currency='eur',
                    automatic_payment_methods={'enabled': True},
                    receipt_email=request.user.email,
                    description=f"Funkidz — Réservation #{booking.id} : {booking.service.name}",
                    metadata={
                        'booking_id': str(booking.id),
                        'user_id': str(request.user.id),
                        'client_email': request.user.email,
                        'service': booking.service.name,
                        'booking_date': str(booking.booking_date),
                        'booking_time': str(booking.booking_time),
                    }
                )

            Payment.objects.update_or_create(
                booking=booking,
                defaults={
                    'stripe_session_id': intent['id'],
                    'stripe_payment_intent': intent['id'],
                    'amount': booking.final_price,
                    'status': Payment.Status.PENDING,
                }
            )

            logger.info(f"PaymentIntent {intent['id']} prêt pour la réservation #{booking.id}")
            return Response({
                'client_secret': intent['client_secret'],
                'publishable_key': settings.STRIPE_PUBLISHABLE_KEY,
                'amount': float(booking.final_price),
                'currency': 'eur',
                'booking_id': booking.id,
            })

        except stripe.error.AuthenticationError:
            logger.error("Clé API Stripe refusée par Stripe.")
            return Response(
                {'error': "La clé Stripe configurée a été refusée par Stripe. "
                          "Vérifiez STRIPE_API_KEY dans le fichier .env."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except stripe.error.StripeError as e:
            logger.error(f"Erreur Stripe (PaymentIntent) pour la réservation #{booking_id}: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CreateStripeSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        api_key = getattr(settings, 'STRIPE_API_KEY', os.getenv('STRIPE_API_KEY', ''))
        stripe.api_key = api_key

        booking_id = request.data.get('booking_id')
        payment_mode = request.data.get('payment_mode', 'stripe') # 'stripe' or 'demo'

        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Réservation introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        # « Payer plus tard » : la réservation reste En attente et AUCUN paiement
        # n'est enregistré. Le client est renvoyé vers son espace, d'où il pourra
        # régler par carte quand il le souhaite.
        if payment_mode == 'later':
            logger.info(f"Paiement différé demandé pour la réservation #{booking.id}")
            return Response({
                'mode': 'later',
                'url': request.build_absolute_uri('/dashboard/'),
                'booking_id': booking.id,
                'amount': float(booking.final_price)
            })

        # Sans clé Stripe exploitable, aucun paiement n'est possible : on le dit
        # explicitement au lieu de faire croire à un règlement abouti.
        if not _stripe_is_configured():
            logger.warning("Stripe non configuré : impossible de créer une session de paiement.")
            return Response(
                {
                    'error': "Le paiement par carte n'est pas disponible : la configuration "
                             "Stripe est incomplète.",
                    'missing': _missing_stripe_settings(),
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        try:
            # Construction décomposée des Line Items pour Stripe Checkout
            # 1. Formule principale d'animation
            child_desc = f" — Fête de {booking.child_name}" if booking.child_name else ""
            if booking.child_age:
                child_desc += f" ({booking.child_age} ans)"

            line_items = [
                {
                    'price_data': {
                        'currency': 'eur',
                        'product_data': {
                            'name': f"Formule Funkidz : {booking.service.name}",
                            'description': f"Intervention le {booking.booking_date} à {booking.booking_time} ({booking.service.duration_minutes} min, {booking.nb_children} enfants){child_desc}",
                        },
                        'unit_amount': int(booking.service.base_price * 100),
                    },
                    'quantity': 1,
                }
            ]

            # 2. Options complémentaires décomposées
            for b_opt in booking.selected_options.select_related('option').all():
                opt = b_opt.option
                if opt.pricing_type == 'FIXED':
                    opt_desc = "Tarif fixe"
                    unit_cents = int(b_opt.price_at_time * 100)
                    qty = b_opt.quantity
                elif opt.pricing_type == 'PER_CHILD':
                    opt_desc = f"Tarif par enfant : {b_opt.price_at_time}€ × {booking.nb_children} enfants"
                    unit_cents = int(b_opt.price_at_time * booking.nb_children * 100)
                    qty = b_opt.quantity
                elif opt.pricing_type == 'PER_HOUR':
                    from decimal import Decimal
                    dur_h = Decimal(booking.service.duration_minutes) / Decimal('60')
                    opt_desc = f"Tarif horaire : {b_opt.price_at_time}€/h × {dur_h:.1f}h"
                    unit_cents = int(b_opt.total_price * 100)
                    qty = 1
                else:
                    opt_desc = "Option personnalisée"
                    unit_cents = int(b_opt.total_price * 100)
                    qty = 1

                line_items.append({
                    'price_data': {
                        'currency': 'eur',
                        'product_data': {
                            'name': f"Option : {opt.name}",
                            'description': opt_desc,
                        },
                        'unit_amount': unit_cents,
                    },
                    'quantity': qty,
                })

            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                customer_email=request.user.email,
                line_items=line_items,
                mode='payment',
                success_url=request.build_absolute_uri('/payment-success/') + f'?session_id={{CHECKOUT_SESSION_ID}}&booking_id={booking.id}',
                cancel_url=request.build_absolute_uri('/payment-cancelled/') + f'?booking_id={booking.id}',
                metadata={
                    'booking_id': str(booking.id),
                    'user_id': str(request.user.id),
                    'client_email': request.user.email,
                    'child_name': booking.child_name or '',
                    'child_age': str(booking.child_age or '')
                }
            )

            # Enregistre ou met à jour la session Stripe
            Payment.objects.update_or_create(
                booking=booking,
                defaults={
                    'stripe_session_id': checkout_session.id,
                    'amount': booking.final_price,
                    'status': Payment.Status.PENDING
                }
            )

            logger.info(f"Session Stripe créée pour la réservation #{booking.id} — Session: {checkout_session.id}")
            return Response({
                'session_id': checkout_session.id,
                'url': checkout_session.url,
                'mode': 'stripe',
                'booking_id': booking.id,
                'amount': float(booking.final_price)
            })

        except stripe.error.AuthenticationError:
            logger.error("Clé API Stripe refusée par Stripe.")
            return Response(
                {'error': "La clé Stripe configurée a été refusée par Stripe. "
                          "Vérifiez STRIPE_API_KEY dans le fichier .env."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
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

    # Mode test direct : secret absent, placeholder ou non-production
    _is_test_mode = (
        not endpoint_secret
        or 'REMPLACER' in endpoint_secret
        or endpoint_secret.startswith('whsec_sample')
        or endpoint_secret.startswith('whsec_test')
    )

    if _is_test_mode:
        logger.warning("STRIPE_WEBHOOK_SECRET non configuré — mode test direct.")
        try:
            import json
            event = json.loads(payload.decode('utf-8'))
        except Exception as e:
            logger.error(f"Erreur parsing payload sans signature: {e}")
            return HttpResponse(status=400)
    else:
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        except ValueError:
            logger.error("Webhook Stripe : payload invalide.")
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError:
            logger.error("Webhook Stripe : signature invalide.")
            return HttpResponse(status=400)

    event_type = event.get('type')

    # ✅ Paiement réussi
    if event_type in ['checkout.session.completed', 'payment_intent.succeeded']:
        session_or_intent = event.get('data', {}).get('object', {})
        booking_id = session_or_intent.get('metadata', {}).get('booking_id')
        session_id = session_or_intent.get('id')

        payment = None
        if session_id:
            payment = Payment.objects.filter(stripe_session_id=session_id).first()

        if not payment and booking_id:
            payment = Payment.objects.filter(booking_id=booking_id).first()

        if payment:
            payment.status = Payment.Status.SUCCEEDED
            if 'payment_intent' in session_or_intent:
                payment.stripe_payment_intent = session_or_intent.get('payment_intent') or session_or_intent.get('id', '')
            payment.save()

            booking = payment.booking
            if booking.status != Booking.Status.CONFIRMED:
                booking.status = Booking.Status.CONFIRMED
                booking.save()  # Déclenche le signal Brevo / Django mail
            logger.info(f"✅ Webhook : Paiement confirmé pour la réservation #{booking.id}")
        elif booking_id:
            try:
                booking = Booking.objects.get(id=booking_id)
                booking.status = Booking.Status.CONFIRMED
                booking.save()
                Payment.objects.update_or_create(
                    booking=booking,
                    defaults={
                        'stripe_session_id': session_id or f'stripe_{booking.id}',
                        'amount': booking.final_price,
                        'status': Payment.Status.SUCCEEDED,
                        'stripe_payment_intent': session_or_intent.get('payment_intent', '')
                    }
                )
                logger.info(f"✅ Webhook : Réservation #{booking.id} confirmée avec création de paiement.")
            except Booking.DoesNotExist:
                logger.warning(f"Réservation {booking_id} introuvable dans le webhook.")

    # ❌ Paiement échoué
    elif event_type == 'payment_intent.payment_failed':
        intent = event.get('data', {}).get('object', {})
        error_msg = intent.get('last_payment_error', {}).get('message', 'Erreur inconnue')
        logger.warning(f"❌ Paiement échoué — PaymentIntent: {intent.get('id')} — Erreur: {error_msg}")

        try:
            payment = Payment.objects.filter(stripe_payment_intent=intent.get('id')).first()
            if not payment:
                booking_id = intent.get('metadata', {}).get('booking_id')
                if booking_id:
                    payment = Payment.objects.filter(booking_id=booking_id).order_by('-created_at').first()

            if payment:
                payment.status = Payment.Status.FAILED
                payment.stripe_payment_intent = intent.get('id', '')
                payment.save()

                from django.utils import timezone
                updated = Payment.objects.filter(
                    id=payment.id,
                    failure_email_sent_at__isnull=True
                ).update(failure_email_sent_at=timezone.now())

                if updated > 0:
                    from core.emails import send_payment_failed_notification
                    send_payment_failed_notification(payment.booking, error_message=error_msg)
        except Exception as e:
            logger.error(f"Erreur traitement webhook payment_failed: {e}")

    return HttpResponse(status=200)

