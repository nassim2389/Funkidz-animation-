import uuid

from django.db import models
from bookings.models import Booking

class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'En attente'
        SUCCEEDED = 'SUCCEEDED', 'Réussi'
        FAILED = 'FAILED', 'Échoué'
        REFUNDED = 'REFUNDED', 'Remboursé'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payments')
    stripe_session_id = models.CharField(max_length=255, unique=True)
    stripe_payment_intent = models.CharField(max_length=255, blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    failure_email_sent_at = models.DateTimeField(null=True, blank=True, verbose_name="E-mail d'échec envoyé le")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def amount(self):
        """
        Montant du paiement : pas stocke, lu directement sur la reservation
        (diagramme de classe). Dans le code actuel, chaque paiement est
        toujours cree avec le prix final de la reservation au meme instant,
        aucun endroit ne fait diverger les deux valeurs.
        """
        return self.booking.final_price

    def __str__(self):
        return f"Paiement {self.id} - {self.status}"

    class Meta:
        verbose_name = "Paiement"
        verbose_name_plural = "Paiements"
