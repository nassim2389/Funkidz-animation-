from django.db import models
from bookings.models import Booking

class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'En attente'
        SUCCEEDED = 'SUCCEEDED', 'Réussi'
        FAILED = 'FAILED', 'Échoué'
        REFUNDED = 'REFUNDED', 'Remboursé'

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payments')
    stripe_session_id = models.CharField(max_length=255, unique=True)
    stripe_payment_intent = models.CharField(max_length=255, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Paiement {self.id} - {self.status}"

    class Meta:
        verbose_name = "Paiement"
        verbose_name_plural = "Paiements"
