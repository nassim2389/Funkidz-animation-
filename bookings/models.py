from django.db import models
from django.conf import settings
from services.models import Service, Option

class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'En attente'
        CONFIRMED = 'CONFIRMED', 'Confirmée'
        CANCELLED = 'CANCELLED', 'Annulée'
        DONE = 'DONE', 'Terminée'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    service = models.ForeignKey(Service, on_delete=models.PROTECT)
    booking_date = models.DateField()
    booking_time = models.TimeField()
    nb_children = models.PositiveIntegerField()
    
    estimated_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    location_address = models.CharField(max_length=255)
    location_city = models.CharField(max_length=100)
    location_zip = models.CharField(max_length=20)
    
    special_instructions = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking {self.id} - {self.user.email} - {self.booking_date}"

    class Meta:
        verbose_name = "Réservation"
        verbose_name_plural = "Réservations"
        ordering = ['-booking_date', '-booking_time']

class BookingOption(models.Model):
    booking = models.ForeignKey(Booking, related_name='selected_options', on_delete=models.CASCADE)
    option = models.ForeignKey(Option, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    price_at_time = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.option.name} x {self.quantity} for Booking {self.booking.id}"

    class Meta:
        verbose_name = "Option de réservation"
        verbose_name_plural = "Options de réservation"

class BookingAssignment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'En attente'
        ACCEPTED = 'ACCEPTED', 'Acceptée'
        REFUSED = 'REFUSED', 'Refusée'

    booking = models.ForeignKey(Booking, related_name='assignments', on_delete=models.CASCADE)
    animateur = models.ForeignKey('users.AnimateurProfile', on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Assignment {self.id} - {self.animateur.user.email}"

    class Meta:
        verbose_name = "Assignation d'animateur"
        verbose_name_plural = "Assignations d'animateurs"
