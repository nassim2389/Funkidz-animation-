from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User, AnimateurProfile
from services.models import Service
from bookings.models import Booking, BookingAssignment
from availability.models import Availability, AnimateurLeave, WeeklySchedule
from datetime import date, time, timedelta

class AvailabilityCheckTests(APITestCase):
    def setUp(self):
        # Create a service
        self.service = Service.objects.create(
            name="Mega Anniv",
            description="Super anniversaire",
            base_price=150.00,
            duration_minutes=120
        )
        
        # Create an animator
        self.animator_user = User.objects.create_user(
            email="anim@funkiz.com",
            password="password123",
            first_name="Jean",
            last_name="Michel",
            role=User.Role.ANIMATEUR
        )
        self.animator_profile, _ = AnimateurProfile.objects.get_or_create(user=self.animator_user)
        
        # Create a client
        self.client_user = User.objects.create_user(
            email="client@example.com",
            password="password123",
            first_name="Alice",
            last_name="Smith",
            role=User.Role.CLIENT
        )

    def test_availability_when_free(self):
        # When animator is completely free
        url = reverse('availability-check-availability')
        response = self.client.get(url, {'date': '2026-06-15', 'time': '14:00', 'service': self.service.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['available'])
        self.assertIn("disponible", response.data['message'].lower())

    def test_availability_when_blocked(self):
        # When animator has blocked this date
        Availability.objects.create(
            animateur=self.animator_profile,
            date='2026-06-15',
            start_time='00:00:00',
            end_time='23:59:59',
            is_blocked=True
        )
        url = reverse('availability-check-availability')
        response = self.client.get(url, {'date': '2026-06-15', 'time': '14:00', 'service': self.service.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['available'])
        self.assertIn("occupés", response.data['message'].lower())

    def test_availability_when_on_leave(self):
        # When animator is on approved leave
        AnimateurLeave.objects.create(
            animateur=self.animator_profile,
            start_date='2026-06-10',
            end_date='2026-06-20',
            status=AnimateurLeave.Status.APPROVED
        )
        url = reverse('availability-check-availability')
        response = self.client.get(url, {'date': '2026-06-15', 'time': '14:00', 'service': self.service.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['available'])

    def test_availability_when_overlapping_booking(self):
        # Create a booking and assign + accept
        booking = Booking.objects.create(
            user=self.client_user,
            service=self.service,
            booking_date='2026-06-15',
            booking_time='13:00:00',
            nb_children=10,
            estimated_price=150.00,
            final_price=150.00,
            status=Booking.Status.CONFIRMED
        )
        BookingAssignment.objects.create(
            booking=booking,
            animateur=self.animator_profile,
            status=BookingAssignment.Status.ACCEPTED
        )
        
        # Check overlapping slots
        url = reverse('availability-check-availability')
        
        # Overlaps since existing is 13:00 to 15:00 and new is 14:00 to 16:00
        response = self.client.get(url, {'date': '2026-06-15', 'time': '14:00', 'service': self.service.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['available'])

        # Does NOT overlap (16:00 to 18:00)
        response_free = self.client.get(url, {'date': '2026-06-15', 'time': '16:00', 'service': self.service.id})
        self.assertEqual(response_free.status_code, status.HTTP_200_OK)
        self.assertTrue(response_free.data['available'])

    def test_get_daily_slots_endpoint(self):
        future_date = date.today() + timedelta(days=10)
        future_date_str = future_date.strftime('%Y-%m-%d')

        # Create a booking at 14:00 on future_date
        booking = Booking.objects.create(
            user=self.client_user,
            service=self.service,
            booking_date=future_date,
            booking_time='14:00:00',
            nb_children=10,
            estimated_price=150.00,
            final_price=150.00,
            status=Booking.Status.CONFIRMED
        )
        BookingAssignment.objects.create(
            booking=booking,
            animateur=self.animator_profile,
            status=BookingAssignment.Status.ACCEPTED
        )

        url = reverse('availability-get-daily-slots')
        response = self.client.get(url, {'date': future_date_str, 'service': self.service.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('slots', response.data)
        self.assertEqual(len(response.data['slots']), 7)

        # 14:00 slot must be unavailable
        slot_14 = next(s for s in response.data['slots'] if s['time'] == '14:00')
        self.assertFalse(slot_14['available'])

        # 10:00 slot must be available
        slot_10 = next(s for s in response.data['slots'] if s['time'] == '10:00')
        self.assertTrue(slot_10['available'])

    def test_booking_serializer_blocks_unavailable_slot(self):
        from bookings.serializers import BookingSerializer

        # Block the animator on 2026-06-15
        Availability.objects.create(
            animateur=self.animator_profile,
            date='2026-06-15',
            start_time='00:00:00',
            end_time='23:59:59',
            is_blocked=True
        )

        serializer = BookingSerializer(data={
            'service': self.service.id,
            'booking_date': '2026-06-15',
            'booking_time': '14:00',
            'nb_children': 10,
            'location_address': '123 Rue Test',
            'location_city': 'Paris',
            'location_zip': '75001'
        })
        self.assertFalse(serializer.is_valid())
        self.assertIn('booking_time', serializer.errors)

    def test_booking_model_clean_validation(self):
        from django.core.exceptions import ValidationError

        # Block the date
        Availability.objects.create(
            animateur=self.animator_profile,
            date='2026-06-15',
            start_time='00:00:00',
            end_time='23:59:59',
            is_blocked=True
        )

        booking = Booking(
            user=self.client_user,
            service=self.service,
            booking_date=date(2026, 6, 15),
            booking_time=time(14, 0),
            nb_children=10,
            location_address='123 Rue Test',
            location_city='Paris',
            location_zip='75001',
            status=Booking.Status.CONFIRMED
        )
        with self.assertRaises(ValidationError):
            booking.clean()

    def test_booking_assignment_clean_prevents_conflict(self):
        from django.core.exceptions import ValidationError

        # Existing confirmed booking and accepted assignment
        b1 = Booking.objects.create(
            user=self.client_user,
            service=self.service,
            booking_date=date(2026, 6, 15),
            booking_time=time(14, 0),
            nb_children=10,
            location_address='123 Rue Test',
            location_city='Paris',
            location_zip='75001',
            status=Booking.Status.CONFIRMED
        )
        BookingAssignment.objects.create(
            booking=b1,
            animateur=self.animator_profile,
            status=BookingAssignment.Status.ACCEPTED
        )

        # Second booking at overlapping time (15:00)
        b2 = Booking.objects.create(
            user=self.client_user,
            service=self.service,
            booking_date=date(2026, 6, 15),
            booking_time=time(15, 0),
            nb_children=8,
            location_address='456 Rue Test',
            location_city='Paris',
            location_zip='75001',
            status=Booking.Status.CONFIRMED
        )
        assignment2 = BookingAssignment(
            booking=b2,
            animateur=self.animator_profile,
            status=BookingAssignment.Status.ACCEPTED
        )

        with self.assertRaises(ValidationError):
            assignment2.clean()

    def test_animateur_block_date_conflict_in_view(self):
        from django.test import RequestFactory
        from web.views_animateur import block_date
        from django.contrib.messages.storage.fallback import FallbackStorage

        # Animateur has an accepted booking on 2026-06-15
        booking = Booking.objects.create(
            user=self.client_user,
            service=self.service,
            booking_date='2026-06-15',
            booking_time='14:00:00',
            nb_children=10,
            location_address='123 Rue Test',
            location_city='Paris',
            location_zip='75001',
            status=Booking.Status.CONFIRMED
        )
        BookingAssignment.objects.create(
            booking=booking,
            animateur=self.animator_profile,
            status=BookingAssignment.Status.ACCEPTED
        )

        factory = RequestFactory()
        request = factory.post('/block-date/', {'date': '2026-06-15'})
        request.user = self.animator_user
        setattr(request, 'session', {})
        messages = FallbackStorage(request)
        setattr(request, '_messages', messages)

        response = block_date(request)
        self.assertEqual(response.status_code, 302)

        # Availability should NOT have been created due to mission conflict
        blocked_exists = Availability.objects.filter(
            animateur=self.animator_profile,
            date='2026-06-15',
            is_blocked=True
        ).exists()
        self.assertFalse(blocked_exists)

