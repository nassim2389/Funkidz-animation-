from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from services.models import Service, Option
from bookings.models import Booking, BookingOption
from decimal import Decimal

User = get_user_model()

class BookingDecomposedTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="client.test@funkidz.fr",
            password="password123",
            first_name="Camille",
            last_name="Martin",
            role=User.Role.CLIENT
        )
        self.client.force_authenticate(user=self.user)

        self.service = Service.objects.create(
            name="Aventure Pirates & Mystères",
            description="Super aventure pour enfants",
            base_price=Decimal("190.00"),
            duration_minutes=120,
            category="ANNIVERSAIRE",
            max_children=20
        )

        self.opt_fixed = Option.objects.create(
            service=self.service,
            name="Machine à Barbe à Papa",
            price=Decimal("45.00"),
            pricing_type="FIXED"
        )
        self.opt_child = Option.objects.create(
            service=self.service,
            name="Kit Maquillage Pirate",
            price=Decimal("4.00"),
            pricing_type="PER_CHILD"
        )
        self.opt_hour = Option.objects.create(
            service=self.service,
            name="Atelier Magie Bonus",
            price=Decimal("50.00"),
            pricing_type="PER_HOUR"
        )

    def test_create_booking_with_decomposed_options_and_child_info(self):
        url = reverse('booking-list')
        payload = {
            'service': self.service.id,
            'booking_date': '2026-07-20',
            'booking_time': '14:00',
            'nb_children': 10,
            'child_name': 'Théo',
            'child_age': 8,
            'contact_phone': '0612345678',
            'location_address': '12 Rue des Enfants',
            'location_city': 'Paris',
            'location_zip': '75015',
            'special_instructions': 'Code porte 1234A',
            'selected_options': [
                {'option': self.opt_fixed.id, 'quantity': 1},
                {'option': self.opt_child.id, 'quantity': 1},
                {'option': self.opt_hour.id, 'quantity': 1}
            ]
        }

        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        booking_id = response.data['id']
        booking = Booking.objects.get(id=booking_id)

        # Base: 190€
        # Fixed: 45€
        # Per child: 4€ * 10 = 40€
        # Per hour: 50€ * (120/60 = 2h) = 100€
        # Total expected = 190 + 45 + 40 + 100 = 375.00€
        expected_total = Decimal("375.00")
        self.assertEqual(booking.final_price, expected_total)
        self.assertEqual(booking.child_name, 'Théo')
        self.assertEqual(booking.child_age, 8)
        self.assertEqual(booking.contact_phone, '0612345678')

        # Check total_price property on BookingOption
        opt_objs = booking.selected_options.all()
        self.assertEqual(opt_objs.count(), 3)
        fixed_bo = opt_objs.get(option=self.opt_fixed)
        child_bo = opt_objs.get(option=self.opt_child)
        hour_bo = opt_objs.get(option=self.opt_hour)

        self.assertEqual(fixed_bo.total_price, Decimal("45.00"))
        self.assertEqual(child_bo.total_price, Decimal("40.00"))
        self.assertEqual(hour_bo.total_price, Decimal("100.00"))

    def test_cancel_booking_action(self):
        booking = Booking.objects.create(
            user=self.user,
            service=self.service,
            booking_date='2026-07-25',
            booking_time='10:00',
            nb_children=8,
            location_address='5 Avenue Foch',
            location_city='Paris',
            location_zip='75016',
            status=Booking.Status.PENDING,
            final_price=Decimal("190.00")
        )
        url = reverse('booking-cancel', args=[booking.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertEqual(booking.status, Booking.Status.CANCELLED)


class ClientCancellationDeadlineTests(TestCase):
    """
    Règle des 48 heures (Étape 4) : le client ne peut annuler en ligne que s'il
    reste au moins 48 heures avant le début de la prestation.
    """

    def setUp(self):
        from django.utils import timezone

        self.service = Service.objects.create(
            name="Anniversaire Délai",
            description="Prestation de test",
            base_price=Decimal('150.00'),
            duration_minutes=120,
        )
        self.client_user = User.objects.create_user(
            email="client.delai@exemple.invalid",
            password="clientpassword123",
            first_name="Camille",
            last_name="Délai",
        )
        self.now = timezone.localtime()

    def _booking_starting_in(self, hours, status=Booking.Status.CONFIRMED):
        from datetime import timedelta

        start = self.now + timedelta(hours=hours)
        return Booking.objects.create(
            user=self.client_user,
            service=self.service,
            booking_date=start.date(),
            booking_time=start.time().replace(microsecond=0),
            nb_children=10,
            estimated_price=Decimal('150.00'),
            final_price=Decimal('150.00'),
            location_address="4 rue du Délai",
            location_city="Paris",
            location_zip="75004",
            status=status,
        )

    # --- Règle métier sur le modèle -------------------------------------

    def test_cancellation_allowed_more_than_48h_before(self):
        booking = self._booking_starting_in(72)
        self.assertTrue(booking.can_be_cancelled_by_client)

    def test_cancellation_refused_less_than_48h_before(self):
        booking = self._booking_starting_in(24)
        self.assertFalse(booking.can_be_cancelled_by_client)

    def test_cancellation_refused_for_past_booking(self):
        booking = self._booking_starting_in(-24)
        self.assertFalse(booking.can_be_cancelled_by_client)

    def test_cancellation_refused_when_already_done(self):
        booking = self._booking_starting_in(72, status=Booking.Status.DONE)
        self.assertFalse(booking.can_be_cancelled_by_client)

    # --- Vue d'annulation client ----------------------------------------

    def test_view_cancels_booking_more_than_48h_before(self):
        booking = self._booking_starting_in(72)
        self.client.force_login(self.client_user)

        response = self.client.get(reverse('cancel-booking', args=[booking.id]))
        self.assertEqual(response.status_code, 302)

        booking.refresh_from_db()
        self.assertEqual(booking.status, Booking.Status.CANCELLED)
        self.assertEqual(booking.cancelled_by, Booking.CancelledBy.CLIENT)

    def test_view_refuses_cancellation_less_than_48h_before(self):
        booking = self._booking_starting_in(24)
        self.client.force_login(self.client_user)

        response = self.client.get(reverse('cancel-booking', args=[booking.id]))
        self.assertEqual(response.status_code, 302)

        booking.refresh_from_db()
        self.assertEqual(booking.status, Booking.Status.CONFIRMED)
        self.assertEqual(booking.cancelled_by, '')


class BookingAdminDisplayTests(TestCase):
    """Affichage et tri du panel d'administration des réservations (Étape 4)."""

    def setUp(self):
        from datetime import date, time

        self.admin = User.objects.create_superuser(
            email="admin.panel@funkidz.fr",
            password="adminpassword123",
            first_name="Admin",
            last_name="Panel",
        )
        self.service = Service.objects.create(
            name="Anniversaire Panel",
            description="Prestation de test",
            base_price=Decimal('150.00'),
            duration_minutes=120,
        )
        self.dates = [
            (date(2026, 12, 10), time(16, 0)),
            (date(2026, 12, 8), time(9, 0)),
            (date(2026, 12, 10), time(9, 0)),
        ]
        self.bookings = [
            Booking.objects.create(
                user=self.admin,
                service=self.service,
                booking_date=d,
                booking_time=t,
                nb_children=10,
                estimated_price=Decimal('150.00'),
                final_price=Decimal('150.00'),
                location_address="5 rue du Panel",
                location_city="Paris",
                location_zip="75005",
                status=Booking.Status.PENDING,
            )
            for d, t in self.dates
        ]

    def _admin(self):
        from django.contrib import admin as django_admin
        return django_admin.site._registry[Booking]

    def test_status_badge_colors(self):
        model_admin = self._admin()
        cases = {
            Booking.Status.CONFIRMED: ("#15803d", "🟢"),
            Booking.Status.PENDING: ("#b45309", "🟠"),
            Booking.Status.CANCELLED: ("#b91c1c", "🔴"),
        }
        booking = self.bookings[0]
        for status_value, (color, dot) in cases.items():
            booking.status = status_value
            html = model_admin.status_badge(booking)
            self.assertIn(color, html, f"Couleur attendue pour {status_value}")
            self.assertIn(dot, html)

    def test_cancelled_badge_mentions_origin(self):
        model_admin = self._admin()
        booking = self.bookings[0]
        booking.status = Booking.Status.CANCELLED
        booking.cancelled_by = Booking.CancelledBy.ADMIN
        self.assertIn("administrateur", model_admin.status_badge(booking).lower())

    def test_default_ordering_is_chronological(self):
        model_admin = self._admin()
        self.assertEqual(model_admin.ordering, ('booking_date', 'booking_time'))

        ordered = list(
            Booking.objects.filter(id__in=[b.id for b in self.bookings])
            .order_by(*model_admin.ordering)
            .values_list('booking_date', 'booking_time')
        )
        self.assertEqual(ordered, sorted(self.dates))

    def test_changelist_marks_admin_as_canceller(self):
        """Changer le statut depuis la liste éditable trace l'origine admin."""
        self.client.force_login(self.admin)
        url = reverse('admin:bookings_booking_changelist')

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        target = self.bookings[0]
        data = {
            '_save': '',
            'action': '',
            'index': '0',
            'select_across': '0',
            'form-TOTAL_FORMS': str(len(self.bookings)),
            'form-INITIAL_FORMS': str(len(self.bookings)),
            'form-MIN_NUM_FORMS': '0',
            'form-MAX_NUM_FORMS': '1000',
        }
        for i, booking in enumerate(self.bookings):
            data[f'form-{i}-id'] = str(booking.id)
            data[f'form-{i}-status'] = (
                Booking.Status.CANCELLED if booking.id == target.id else booking.status
            )
            data[f'form-{i}-final_price'] = str(booking.final_price)

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)
        self.assertNotIn('booking_time', response.content.decode(errors='ignore'))

        target.refresh_from_db()
        self.assertEqual(target.status, Booking.Status.CANCELLED)
        self.assertEqual(target.cancelled_by, Booking.CancelledBy.ADMIN)
