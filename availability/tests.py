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

