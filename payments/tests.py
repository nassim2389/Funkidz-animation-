from django.test import TestCase
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

    def test_create_session_demo_mode(self):
        url = reverse('create-stripe-session')
        payload = {
            'booking_id': self.booking.id,
            'payment_mode': 'demo'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['mode'], 'demo')
        self.assertIn('/payment-success/', response.data['url'])
        self.assertEqual(response.data['booking_id'], self.booking.id)

        payment = Payment.objects.get(booking=self.booking)
        self.assertEqual(payment.amount, Decimal("220.00"))

    @patch('stripe.checkout.Session.create')
    def test_create_session_stripe_decomposed_line_items(self, mock_stripe_create):
        mock_session = MagicMock()
        mock_session.id = "cs_test_abc123"
        mock_session.url = "https://checkout.stripe.com/pay/cs_test_abc123"
        mock_stripe_create.return_value = mock_session

        with patch('django.conf.settings.STRIPE_API_KEY', 'sk_test_mock_key_123'):
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

        url = reverse('stripe-webhook')
        response = self.client.post(
            url,
            data=json.dumps(webhook_payload),
            content_type='application/json'
        )
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

        url = reverse('stripe-webhook')
        response = self.client.post(
            url,
            data=json.dumps(webhook_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)

        payment.refresh_from_db()
        self.assertEqual(payment.status, Payment.Status.FAILED)

    def test_payment_success_view(self):
        url = reverse('payment-success') + f'?booking_id={self.booking.id}&mode=demo'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'payments/success.html')
        self.assertEqual(response.context['booking'].id, self.booking.id)
        self.assertTrue(response.context['is_demo'])
        
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.CONFIRMED)
