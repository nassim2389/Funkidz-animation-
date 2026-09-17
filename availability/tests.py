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


class PerAnimatorAvailabilityTests(APITestCase):
    """Créneaux par animateur : une réservation ne bloque que son animateur."""

    def setUp(self):
        self.service = Service.objects.create(
            name="Anniversaire Magique",
            description="Prestation 2h",
            base_price=150.00,
            duration_minutes=120
        )
        self.animators = {}
        for key in ('A', 'B', 'C'):
            user = User.objects.create_user(
                email=f"anim{key.lower()}@funkidz.fr",
                password="password123",
                first_name=f"Anim{key}",
                last_name="Test",
                role=User.Role.ANIMATEUR
            )
            profile, _ = AnimateurProfile.objects.get_or_create(user=user)
            self.animators[key] = profile

        self.client_user = User.objects.create_user(
            email="client.pa@example.com",
            password="password123",
            first_name="Alice",
            last_name="Martin",
            role=User.Role.CLIENT
        )

        self.date_x = date(2026, 6, 15)
        self.time_y = time(14, 0)

    def _make_booking(self, booking_date, booking_time, animator=None,
                      assignment_status=BookingAssignment.Status.ACCEPTED):
        booking = Booking.objects.create(
            user=self.client_user,
            service=self.service,
            booking_date=booking_date,
            booking_time=booking_time,
            nb_children=10,
            estimated_price=150.00,
            final_price=150.00,
            location_address="1 rue des Fêtes",
            location_city="Paris",
            location_zip="75001",
            status=Booking.Status.CONFIRMED
        )
        if animator is not None:
            BookingAssignment.objects.create(
                booking=booking, animateur=animator, status=assignment_status
            )
        return booking

    # TEST 1 — Animateur A réservé : son créneau devient indisponible
    def test_1_booked_animator_slot_is_unavailable_for_him(self):
        from availability.views import is_slot_available_for_booking
        self._make_booking(self.date_x, self.time_y, self.animators['A'])

        available, message = is_slot_available_for_booking(
            self.date_x, self.time_y, self.service.id,
            animateur_id=self.animators['A'].id
        )
        self.assertFalse(available)
        self.assertIn("indisponible", message.lower())

    # TEST 2 — Même créneau, animateur B : autorisé (retour du professeur)
    def test_2_other_animator_stays_available_on_same_slot(self):
        from availability.views import is_slot_available_for_booking, get_animators_availability
        self._make_booking(self.date_x, self.time_y, self.animators['A'])

        for key in ('B', 'C'):
            available, _ = is_slot_available_for_booking(
                self.date_x, self.time_y, self.service.id,
                animateur_id=self.animators[key].id
            )
            self.assertTrue(available, f"L'animateur {key} devrait rester disponible")

        # Le créneau global reste ouvert : il reste des animateurs libres
        available, _ = is_slot_available_for_booking(self.date_x, self.time_y, self.service.id)
        self.assertTrue(available)

        _, nb_free = get_animators_availability(self.date_x, self.time_y, self.service.id)
        self.assertEqual(nb_free, 2)

        # Et une seconde réservation sur le même créneau est acceptée
        from bookings.serializers import BookingSerializer
        serializer = BookingSerializer(data={
            'service': self.service.id,
            'booking_date': self.date_x.isoformat(),
            'booking_time': '14:00',
            'nb_children': 8,
            'location_address': '2 rue des Ballons',
            'location_city': 'Paris',
            'location_zip': '75002'
        })
        self.assertTrue(serializer.is_valid(), serializer.errors)

    # TEST 3 — Même animateur + même créneau : refusé
    def test_3_same_animator_same_slot_is_refused(self):
        from django.core.exceptions import ValidationError
        from availability.views import is_slot_available_for_booking
        self._make_booking(self.date_x, self.time_y, self.animators['A'])

        available, message = is_slot_available_for_booking(
            self.date_x, self.time_y, self.service.id,
            animateur_id=self.animators['A'].id
        )
        self.assertFalse(available)
        self.assertIn("indisponible", message.lower())

        second = self._make_booking(self.date_x, self.time_y)
        conflicting = BookingAssignment(
            booking=second,
            animateur=self.animators['A'],
            status=BookingAssignment.Status.ACCEPTED
        )
        with self.assertRaises(ValidationError):
            conflicting.clean()

    # TEST 4 — Même animateur, autre créneau sans chevauchement : disponible
    def test_4_same_animator_other_slot_is_available(self):
        from availability.views import is_slot_available_for_booking
        self._make_booking(self.date_x, self.time_y, self.animators['A'])

        available, _ = is_slot_available_for_booking(
            self.date_x, time(17, 0), self.service.id,
            animateur_id=self.animators['A'].id
        )
        self.assertTrue(available)

    # TEST 5 — Même animateur, même heure, autre date : disponible
    def test_5_same_animator_other_date_is_available(self):
        from availability.views import is_slot_available_for_booking
        self._make_booking(self.date_x, self.time_y, self.animators['A'])

        available, _ = is_slot_available_for_booking(
            self.date_x + timedelta(days=1), self.time_y, self.service.id,
            animateur_id=self.animators['A'].id
        )
        self.assertTrue(available)

    # Capacité du pool : anti-doublon conservé quand tous les animateurs sont pris
    def test_pool_capacity_is_still_enforced(self):
        from availability.views import is_slot_available_for_booking
        for key in ('A', 'B', 'C'):
            self._make_booking(self.date_x, self.time_y, self.animators[key])

        available, message = is_slot_available_for_booking(
            self.date_x, self.time_y, self.service.id
        )
        self.assertFalse(available)
        self.assertIn("indisponible", message.lower())

    def test_pool_capacity_counts_unassigned_bookings(self):
        from availability.views import is_slot_available_for_booking
        # 3 réservations actives non attribuées mobiliseront les 3 animateurs
        for _ in range(3):
            self._make_booking(self.date_x, self.time_y)

        available, message = is_slot_available_for_booking(
            self.date_x, self.time_y, self.service.id
        )
        self.assertFalse(available)
        self.assertIn("mobilisés", message.lower())

    # Endpoints API
    def test_check_endpoint_accepts_animateur_param(self):
        self._make_booking(self.date_x, self.time_y, self.animators['A'])
        url = reverse('availability-check-availability')

        resp_a = self.client.get(url, {
            'date': '2026-06-15', 'time': '14:00',
            'service': self.service.id, 'animateur': self.animators['A'].id
        })
        self.assertEqual(resp_a.status_code, status.HTTP_200_OK)
        self.assertFalse(resp_a.data['available'])

        resp_b = self.client.get(url, {
            'date': '2026-06-15', 'time': '14:00',
            'service': self.service.id, 'animateur': self.animators['B'].id
        })
        self.assertEqual(resp_b.status_code, status.HTTP_200_OK)
        self.assertTrue(resp_b.data['available'])
        self.assertEqual(resp_b.data['animators_available'], 2)

    def test_animators_endpoint_returns_individual_calendar(self):
        self._make_booking(self.date_x, self.time_y, self.animators['A'])
        url = reverse('availability-get-animators-for-slot')
        resp = self.client.get(url, {
            'date': '2026-06-15', 'time': '14:00', 'service': self.service.id
        })
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['animators_total'], 3)
        self.assertEqual(resp.data['animators_available'], 2)

        by_id = {a['animateur_id']: a for a in resp.data['animators']}
        self.assertFalse(by_id[self.animators['A'].id]['available'])
        self.assertTrue(by_id[self.animators['B'].id]['available'])
        self.assertTrue(by_id[self.animators['C'].id]['available'])

    def test_slots_endpoint_exposes_free_animator_count(self):
        future = date.today() + timedelta(days=10)
        self._make_booking(future, time(14, 0), self.animators['A'])

        url = reverse('availability-get-daily-slots')
        resp = self.client.get(url, {'date': future.isoformat(), 'service': self.service.id})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        slot_14 = next(s for s in resp.data['slots'] if s['time'] == '14:00')
        self.assertTrue(slot_14['available'])          # B et C restent libres
        self.assertEqual(slot_14['animators_available'], 2)

        resp_a = self.client.get(url, {
            'date': future.isoformat(), 'service': self.service.id,
            'animateur': self.animators['A'].id
        })
        slot_14_a = next(s for s in resp_a.data['slots'] if s['time'] == '14:00')
        self.assertFalse(slot_14_a['available'])       # mais pas pour l'animateur A
