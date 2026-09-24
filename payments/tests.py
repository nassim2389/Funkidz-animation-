from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch, MagicMock
import json
from decimal import Decimal
from django.contrib.auth import get_user_model
from services.models import Service, Option
from bookings.models import Booking, BookingOption
from payments.models import Payment

User = get_user_model()

class StripePaymentTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="client.stripe@funkidz.fr",
            password="password123",
            first_name="Sophie",
            last_name="Bernard",
            role=User.Role.CLIENT
        )
        self.client.force_authenticate(user=self.user)

        self.service = Service.objects.create(
            name="Magie & Illusion",
            description="Spectacle interactif",
            base_price=Decimal("160.00"),
            duration_minutes=90,
            category="ANNIVERSAIRE"
        )
        self.option = Option.objects.create(
            service=self.service,
            name="Chapeau Magique",
            price=Decimal("6.00"),
            pricing_type="PER_CHILD"
        )

        self.booking = Booking.objects.create(
            user=self.user,
            service=self.service,
            booking_date="2026-08-10",
            booking_time="15:00",
            nb_children=10,
            child_name="Léo",
            child_age=6,
            contact_phone="0601020304",
            location_address="10 Rue de la Paix",
            location_city="Paris",
            location_zip="75002",
            estimated_price=Decimal("220.00"),
            final_price=Decimal("220.00"),
            status=Booking.Status.PENDING
        )
        BookingOption.objects.create(
            booking=self.booking,
            option=self.option,
            quantity=1,
            price_at_time=Decimal("6.00")
        )

    def test_pay_later_does_not_create_payment(self):
        """« Payer plus tard » laisse la réservation en attente, sans paiement."""
        url = reverse('create-stripe-session')
        response = self.client.post(
            url, {'booking_id': self.booking.id, 'payment_mode': 'later'}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['mode'], 'later')
        self.assertIn('/dashboard/', response.data['url'])
        self.assertNotIn('/payment-success/', response.data['url'])

        self.assertFalse(Payment.objects.filter(booking=self.booking).exists())
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.PENDING)

    def test_create_session_without_stripe_keys_is_refused(self):
        """Sans clé Stripe, aucune session n'est créée et rien n'est marqué payé."""
        url = reverse('create-stripe-session')
        with patch('django.conf.settings.STRIPE_ENABLED', False):
            response = self.client.post(
                url, {'booking_id': self.booking.id, 'payment_mode': 'stripe'}, format='json'
            )
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertIn('error', response.data)

        self.assertFalse(Payment.objects.filter(booking=self.booking).exists())
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.PENDING)

    @patch('stripe.checkout.Session.create')
    def test_create_session_stripe_decomposed_line_items(self, mock_stripe_create):
        mock_session = MagicMock()
        mock_session.id = "cs_test_abc123"
        mock_session.url = "https://checkout.stripe.com/pay/cs_test_abc123"
        mock_stripe_create.return_value = mock_session

        with patch('django.conf.settings.STRIPE_API_KEY', 'sk_test_mock_key_123'), \
             patch('django.conf.settings.STRIPE_PUBLISHABLE_KEY', 'pk_test_mock_key_123'), \
             patch('django.conf.settings.STRIPE_ENABLED', True):
            url = reverse('create-stripe-session')
            payload = {
                'booking_id': self.booking.id,
                'payment_mode': 'stripe'
            }
            response = self.client.post(url, payload, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['mode'], 'stripe')
            self.assertEqual(response.data['session_id'], 'cs_test_abc123')
            self.assertEqual(response.data['url'], 'https://checkout.stripe.com/pay/cs_test_abc123')

            # Verify line_items decomposition passed to Stripe
            mock_stripe_create.assert_called_once()
            _, kwargs = mock_stripe_create.call_args
            line_items = kwargs.get('line_items')
            self.assertEqual(len(line_items), 2)
            
            # Item 1: Base service (160.00 € = 16000 cents)
            self.assertEqual(line_items[0]['price_data']['unit_amount'], 16000)
            self.assertIn("Magie & Illusion", line_items[0]['price_data']['product_data']['name'])
            
            # Item 2: Option (6.00 € * 10 children = 60.00 € = 6000 cents)
            self.assertEqual(line_items[1]['price_data']['unit_amount'], 6000)
            self.assertIn("Chapeau Magique", line_items[1]['price_data']['product_data']['name'])

    def _post_signed_webhook(self, payload):
        """Simule un événement Stripe dont la signature a été validée."""
        with override_settings(STRIPE_WEBHOOK_SECRET='whsec_unittest'), \
                patch('stripe.Webhook.construct_event', return_value=payload):
            return self.client.post(
                reverse('stripe-webhook'),
                data=json.dumps(payload),
                content_type='application/json',
                HTTP_STRIPE_SIGNATURE='t=1,v1=signature'
            )

    def _forged_success_event(self):
        return {
            'type': 'payment_intent.succeeded',
            'data': {'object': {'id': 'pi_forged', 'metadata': {'booking_id': str(self.booking.id)}}}
        }

    @override_settings(STRIPE_WEBHOOK_SECRET='')
    def test_webhook_without_secret_is_refused(self):
        """Sans secret configuré, aucun événement n'est accepté."""
        response = self.client.post(
            reverse('stripe-webhook'),
            data=json.dumps(self._forged_success_event()),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.PENDING)
        self.assertFalse(Payment.objects.filter(booking=self.booking).exists())

    @override_settings(STRIPE_WEBHOOK_SECRET='whsec_unittest')
    def test_webhook_with_invalid_signature_is_refused(self):
        """Un événement dont la signature est fausse est rejeté."""
        response = self.client.post(
            reverse('stripe-webhook'),
            data=json.dumps(self._forged_success_event()),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='t=1,v1=fausse_signature'
        )
        self.assertEqual(response.status_code, 400)
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.PENDING)

    def test_webhook_checkout_session_completed(self):
        payment = Payment.objects.create(
            booking=self.booking,
            stripe_session_id="cs_test_webhook_success",
            amount=self.booking.final_price,
            status=Payment.Status.PENDING
        )

        webhook_payload = {
            'type': 'checkout.session.completed',
            'data': {
                'object': {
                    'id': 'cs_test_webhook_success',
                    'payment_intent': 'pi_test_999',
                    'metadata': {
                        'booking_id': str(self.booking.id)
                    }
                }
            }
        }

        response = self._post_signed_webhook(webhook_payload)
        self.assertEqual(response.status_code, 200)

        payment.refresh_from_db()
        self.booking.refresh_from_db()

        self.assertEqual(payment.status, Payment.Status.SUCCEEDED)
        self.assertEqual(payment.stripe_payment_intent, 'pi_test_999')
        self.assertEqual(self.booking.status, Booking.Status.CONFIRMED)

    def test_webhook_payment_intent_failed(self):
        payment = Payment.objects.create(
            booking=self.booking,
            stripe_session_id="cs_test_webhook_failed",
            stripe_payment_intent="pi_test_failed_888",
            amount=self.booking.final_price,
            status=Payment.Status.PENDING
        )

        webhook_payload = {
            'type': 'payment_intent.payment_failed',
            'data': {
                'object': {
                    'id': 'pi_test_failed_888',
                    'last_payment_error': {
                        'message': 'Carte expirée'
                    },
                    'metadata': {
                        'booking_id': str(self.booking.id)
                    }
                }
            }
        }

        response = self._post_signed_webhook(webhook_payload)
        self.assertEqual(response.status_code, 200)

        payment.refresh_from_db()
        self.assertEqual(payment.status, Payment.Status.FAILED)

    def test_success_page_does_not_confirm_without_stripe_reference(self):
        """Arriver sur l'URL de succès ne suffit pas à valider un paiement."""
        url = reverse('payment-success') + f'?booking_id={self.booking.id}&mode=demo'
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'payments/success.html')
        self.assertFalse(response.context['payment_confirmed'])

        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.PENDING)
        self.assertFalse(Payment.objects.filter(
            booking=self.booking, status=Payment.Status.SUCCEEDED
        ).exists())

    @patch('stripe.PaymentIntent.retrieve')
    def test_success_page_confirms_only_when_stripe_says_succeeded(self, mock_retrieve):
        """Le paiement n'est validé que si Stripe répond succeeded."""
        Payment.objects.create(
            booking=self.booking,
            stripe_session_id='pi_test_ok_1',
            stripe_payment_intent='pi_test_ok_1',
            amount=self.booking.final_price,
            status=Payment.Status.PENDING,
        )
        mock_retrieve.return_value = {
            'id': 'pi_test_ok_1',
            'status': 'succeeded',
            'metadata': {'booking_id': str(self.booking.id)},
        }

        url = reverse('payment-success') + '?payment_intent=pi_test_ok_1'
        with patch('django.conf.settings.STRIPE_API_KEY', 'sk_test_mock_key_123'):
            response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.context['payment_confirmed'])

        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.CONFIRMED)
        self.assertEqual(
            Payment.objects.get(booking=self.booking).status, Payment.Status.SUCCEEDED
        )

    @patch('stripe.PaymentIntent.retrieve')
    def test_success_page_rejects_unpaid_intent(self, mock_retrieve):
        """Un paiement refusé ne confirme ni la réservation ni le règlement."""
        Payment.objects.create(
            booking=self.booking,
            stripe_session_id='pi_test_ko_1',
            stripe_payment_intent='pi_test_ko_1',
            amount=self.booking.final_price,
            status=Payment.Status.PENDING,
        )
        mock_retrieve.return_value = {
            'id': 'pi_test_ko_1',
            'status': 'requires_payment_method',
            'metadata': {'booking_id': str(self.booking.id)},
        }

        url = reverse('payment-success') + '?payment_intent=pi_test_ko_1'
        with patch('django.conf.settings.STRIPE_API_KEY', 'sk_test_mock_key_123'):
            response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.context['payment_confirmed'])

        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.PENDING)
        self.assertEqual(
            Payment.objects.get(booking=self.booking).status, Payment.Status.FAILED
        )

    @patch('stripe.checkout.Session.retrieve')
    def test_success_page_rejects_unpaid_checkout_session(self, mock_retrieve):
        """Une Checkout Session non payée ne confirme pas la réservation."""
        Payment.objects.create(
            booking=self.booking,
            stripe_session_id='cs_test_unpaid',
            amount=self.booking.final_price,
            status=Payment.Status.PENDING,
        )
        mock_retrieve.return_value = {
            'id': 'cs_test_unpaid',
            'payment_status': 'unpaid',
            'metadata': {'booking_id': str(self.booking.id)},
        }

        url = reverse('payment-success') + '?session_id=cs_test_unpaid'
        with patch('django.conf.settings.STRIPE_API_KEY', 'sk_test_mock_key_123'):
            response = self.client.get(url)

        self.assertFalse(response.context['payment_confirmed'])
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.PENDING)


class PaymentElementTests(APITestCase):
    """Formulaire de carte affiché dans le site via le Payment Element Stripe."""

    def setUp(self):
        self.user = User.objects.create_user(
            email="client.element@funkidz.fr",
            password="password123",
            first_name="Marc",
            last_name="Durand",
            role=User.Role.CLIENT,
        )
        self.service = Service.objects.create(
            name="Atelier Carte",
            description="Prestation de test",
            base_price=Decimal("180.00"),
            duration_minutes=120,
        )
        self.booking = Booking.objects.create(
            user=self.user,
            service=self.service,
            booking_date="2026-08-20",
            booking_time="10:00",
            nb_children=12,
            location_address="8 rue du Paiement",
            location_city="Paris",
            location_zip="75008",
            estimated_price=Decimal("180.00"),
            final_price=Decimal("180.00"),
            status=Booking.Status.PENDING,
        )

    def test_intent_refused_without_stripe_configuration(self):
        self.client.force_authenticate(user=self.user)
        with patch('django.conf.settings.STRIPE_ENABLED', False):
            response = self.client.post(
                reverse('create-payment-intent'), {'booking_id': self.booking.id}, format='json'
            )
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertIn('missing', response.data)
        self.assertFalse(Payment.objects.filter(booking=self.booking).exists())

    @patch('stripe.PaymentIntent.create')
    def test_intent_amount_matches_booking(self, mock_create):
        mock_create.return_value = {
            'id': 'pi_test_amount',
            'client_secret': 'pi_test_amount_secret_xyz',
            'status': 'requires_payment_method',
        }
        self.client.force_authenticate(user=self.user)

        with patch('django.conf.settings.STRIPE_API_KEY', 'sk_test_mock_key_123'), \
             patch('django.conf.settings.STRIPE_PUBLISHABLE_KEY', 'pk_test_mock_key_123'), \
             patch('django.conf.settings.STRIPE_ENABLED', True):
            response = self.client.post(
                reverse('create-payment-intent'), {'booking_id': self.booking.id}, format='json'
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['client_secret'], 'pi_test_amount_secret_xyz')
        self.assertEqual(response.data['publishable_key'], 'pk_test_mock_key_123')

        _, kwargs = mock_create.call_args
        self.assertEqual(kwargs['amount'], 18000)          # 180,00 EUR
        self.assertEqual(kwargs['currency'], 'eur')
        self.assertEqual(kwargs['metadata']['booking_id'], str(self.booking.id))

        payment = Payment.objects.get(booking=self.booking)
        self.assertEqual(payment.status, Payment.Status.PENDING)
        self.assertEqual(payment.stripe_payment_intent, 'pi_test_amount')

    def test_intent_refuses_booking_of_another_user(self):
        other = User.objects.create_user(
            email="intrus@funkidz.fr", password="password123", role=User.Role.CLIENT
        )
        self.client.force_authenticate(user=other)
        with patch('django.conf.settings.STRIPE_ENABLED', True), \
             patch('django.conf.settings.STRIPE_API_KEY', 'sk_test_mock_key_123'):
            response = self.client.post(
                reverse('create-payment-intent'), {'booking_id': self.booking.id}, format='json'
            )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_payment_page_shows_card_form_when_stripe_configured(self):
        self.client.force_login(self.user)
        with patch('django.conf.settings.STRIPE_ENABLED', True), \
             patch('django.conf.settings.STRIPE_PUBLISHABLE_KEY', 'pk_test_mock_key_123'):
            response = self.client.get(reverse('payment-page', args=[self.booking.id]))

        self.assertEqual(response.status_code, 200)
        content = response.content.decode()
        self.assertIn('payment-element', content)               # conteneur du Payment Element
        self.assertIn('js.stripe.com/v3', content)              # Stripe.js officiel
        self.assertIn('Paiement par carte bancaire', content)
        self.assertNotIn('name="card_number"', content)         # aucun champ carte maison

    def test_payment_page_explains_missing_configuration(self):
        self.client.force_login(self.user)
        with patch('django.conf.settings.STRIPE_ENABLED', False), \
             patch('django.conf.settings.STRIPE_API_KEY', ''), \
             patch('django.conf.settings.STRIPE_PUBLISHABLE_KEY', ''):
            response = self.client.get(reverse('payment-page', args=[self.booking.id]))

        self.assertEqual(response.status_code, 200)
        content = response.content.decode()
        self.assertIn('STRIPE_API_KEY', content)
        self.assertIn('STRIPE_PUBLISHABLE_KEY', content)
        self.assertNotIn('js.stripe.com/v3', content)

    def test_payment_page_refuses_booking_of_another_user(self):
        other = User.objects.create_user(
            email="intrus2@funkidz.fr", password="password123", role=User.Role.CLIENT
        )
        self.client.force_login(other)
        response = self.client.get(reverse('payment-page', args=[self.booking.id]))
        self.assertEqual(response.status_code, 404)


class PaymentPagesOwnershipTests(TestCase):
    """Les pages de retour de paiement n'exposent une réservation qu'à son titulaire."""

    def setUp(self):
        service = Service.objects.create(
            name="Spectacle", description="Spectacle", base_price=Decimal("120.00"), duration_minutes=60
        )
        self.owner = User.objects.create_user(email="proprietaire@funkidz.fr", password="password123")
        self.intruder = User.objects.create_user(email="intrus@funkidz.fr", password="password123")
        self.booking = Booking.objects.create(
            user=self.owner, service=service, booking_date="2030-03-01", booking_time="14:00",
            nb_children=8, location_address="2 rue Test", location_city="Lyon", location_zip="69001",
            estimated_price=Decimal("120.00"), final_price=Decimal("120.00"), status=Booking.Status.PENDING
        )
        self.url = reverse('payment-cancelled') + f'?booking_id={self.booking.id}'

    def test_cancelled_page_hides_booking_from_other_user(self):
        self.client.force_login(self.intruder)
        self.assertIsNone(self.client.get(self.url).context['booking'])

    def test_cancelled_page_hides_booking_from_anonymous(self):
        self.assertIsNone(self.client.get(self.url).context['booking'])

    def test_cancelled_page_shows_booking_to_owner(self):
        self.client.force_login(self.owner)
        self.assertEqual(self.client.get(self.url).context['booking'], self.booking)

    @patch('stripe.PaymentIntent.retrieve')
    def test_success_page_hides_booking_from_other_user(self, mock_retrieve):
        mock_retrieve.return_value = {'status': 'succeeded', 'metadata': {'booking_id': str(self.booking.id)}}
        self.client.force_login(self.intruder)
        with patch('django.conf.settings.STRIPE_API_KEY', 'sk_test_mock_key_123'):
            response = self.client.get(reverse('payment-success') + '?payment_intent=pi_test_owner')
        # context_data : contexte de la page elle-même, hors gabarits d'e-mails rendus pendant la requête
        self.assertIsNone(response.context_data['booking'])
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.CONFIRMED)
