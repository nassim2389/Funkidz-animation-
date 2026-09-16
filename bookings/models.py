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
    
    child_name = models.CharField(max_length=100, blank=True, default='', verbose_name="Prénom de l'enfant")
    child_age = models.PositiveIntegerField(null=True, blank=True, verbose_name="Âge fêté")
    contact_phone = models.CharField(max_length=20, blank=True, default='', verbose_name="Téléphone de contact")
    
    special_instructions = models.TextField(blank=True)
    
    # Horodatages d'envoi d'emails (idempotence & anti-doublon)
    confirmation_email_sent_at = models.DateTimeField(null=True, blank=True, verbose_name="E-mail de confirmation client envoyé le")
    admin_notification_sent_at = models.DateTimeField(null=True, blank=True, verbose_name="Notification admin envoyée le")
    cancellation_email_sent_at = models.DateTimeField(null=True, blank=True, verbose_name="E-mail d'annulation envoyé le")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        super().clean()
        if self.booking_date and self.booking_time and self.status in [self.Status.CONFIRMED, self.Status.PENDING]:
            from availability.views import is_slot_available_for_booking
            from django.core.exceptions import ValidationError
            service_id = self.service_id if hasattr(self, 'service_id') else None
            available, msg = is_slot_available_for_booking(
                self.booking_date,
                self.booking_time,
                service_id=service_id,
                exclude_booking_id=self.id
            )
            if not available:
                raise ValidationError({'booking_time': f"Ce créneau est indisponible : {msg}"})

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

    @property
    def total_price(self):
        if self.option.pricing_type == 'FIXED':
            return self.price_at_time * self.quantity
        elif self.option.pricing_type == 'PER_CHILD':
            return self.price_at_time * self.booking.nb_children * self.quantity
        elif self.option.pricing_type == 'PER_HOUR':
            from decimal import Decimal
            duration_hours = Decimal(self.booking.service.duration_minutes) / Decimal('60')
            return self.price_at_time * duration_hours * self.quantity
        return self.price_at_time * self.quantity

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
    notification_sent_at = models.DateTimeField(null=True, blank=True, verbose_name="Notification animateur envoyée le")
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        super().clean()
        from django.core.exceptions import ValidationError
        from availability.models import AnimateurLeave, Availability
        from datetime import datetime, timedelta

        if not hasattr(self, 'booking') or not hasattr(self, 'animateur') or not self.booking_id or not self.animateur_id:
            return

        booking = self.booking
        animateur = self.animateur

        # 1. Congés approuvés
        on_leave = AnimateurLeave.objects.filter(
            animateur=animateur,
            status=AnimateurLeave.Status.APPROVED,
            start_date__lte=booking.booking_date,
            end_date__gte=booking.booking_date
        ).exists()
        if on_leave:
            raise ValidationError(
                f"L'animateur {animateur.user.get_full_name() or animateur.user.email} est en congé validé le {booking.booking_date}."
            )

        # 2. Date / créneau bloqué
        b_start = datetime.combine(booking.booking_date, booking.booking_time)
        b_dur = booking.service.duration_minutes if booking.service else 120
        b_end = b_start + timedelta(minutes=b_dur)

        blocked = Availability.objects.filter(
            animateur=animateur,
            date=booking.booking_date,
            is_blocked=True
        )
        for bs in blocked:
            bs_start = datetime.combine(booking.booking_date, bs.start_time)
            bs_end = datetime.combine(booking.booking_date, bs.end_time)
            if bs_start < b_end and bs_end > b_start:
                raise ValidationError(
                    f"L'animateur a bloqué sa disponibilité sur ce créneau ({bs.start_time} - {bs.end_time})."
                )

        # 3. Autre mission déjà attribuée sur le même créneau
        other_assignments = BookingAssignment.objects.filter(
            animateur=animateur,
            status__in=[self.Status.ACCEPTED, self.Status.PENDING],
            booking__booking_date=booking.booking_date,
            booking__status__in=[Booking.Status.CONFIRMED, Booking.Status.PENDING]
        ).exclude(id=self.id).exclude(booking=booking)

        for oa in other_assignments:
            oa_start = datetime.combine(booking.booking_date, oa.booking.booking_time)
            oa_dur = oa.booking.service.duration_minutes if oa.booking.service else 120
            oa_end = oa_start + timedelta(minutes=oa_dur)
            if oa_start < b_end and oa_end > b_start:
                raise ValidationError(
                    f"L'animateur a déjà une mission ({oa.booking.service.name}) de {oa.booking.booking_time} à {oa_end.time()}."
                )

    def __str__(self):
        return f"Assignment {self.id} - {self.animateur.user.email}"

    class Meta:
        verbose_name = "Assignation d'animateur"
        verbose_name_plural = "Assignations d'animateurs"
