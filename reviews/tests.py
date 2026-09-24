from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from bookings.models import Booking
from reviews.models import Review
from services.models import Service
from users.models import User


class ReviewPermissionTests(APITestCase):
    """Un avis ne peut être créé ou modifié que par le titulaire de la réservation."""

    def setUp(self):
        service = Service.objects.create(
            name="Atelier", description="Atelier créatif", base_price=Decimal("100.00"), duration_minutes=60
        )
        self.owner = User.objects.create_user(email="titulaire@funkidz.fr", password="password123")
        self.other = User.objects.create_user(email="autre@funkidz.fr", password="password123")
        common = dict(
            service=service, booking_time="15:00", nb_children=5,
            location_address="1 rue Test", location_city="Paris", location_zip="75001",
            estimated_price=Decimal("100.00"), final_price=Decimal("100.00"), status=Booking.Status.DONE
        )
        self.booking = Booking.objects.create(user=self.owner, booking_date="2030-02-01", **common)
        self.other_booking = Booking.objects.create(user=self.owner, booking_date="2030-02-02", **common)
        self.review = Review.objects.create(booking=self.booking, rating=5, comment="Parfait")
        self.detail_url = reverse('review-detail', args=[self.review.id])

    def test_other_user_cannot_edit_or_delete(self):
        self.client.force_authenticate(user=self.other)
        self.assertEqual(self.client.patch(self.detail_url, {'rating': 1}).status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.delete(self.detail_url).status_code, status.HTTP_403_FORBIDDEN)
        self.review.refresh_from_db()
        self.assertEqual(self.review.rating, 5)

    def test_other_user_cannot_review_someone_else_booking(self):
        self.client.force_authenticate(user=self.other)
        response = self.client.post(reverse('review-list'), {'booking': self.other_booking.id, 'rating': 1})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_owner_can_edit(self):
        self.client.force_authenticate(user=self.owner)
        self.assertEqual(self.client.patch(self.detail_url, {'rating': 4}).status_code, status.HTTP_200_OK)

    def test_reviews_are_publicly_readable(self):
        self.assertEqual(self.client.get(reverse('review-list')).status_code, status.HTTP_200_OK)
