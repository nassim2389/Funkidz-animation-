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
