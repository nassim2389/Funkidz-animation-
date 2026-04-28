from django.db import models

class Review(models.Model):
    booking = models.OneToOneField('bookings.Booking', on_delete=models.CASCADE, related_name='review')
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Avis {self.id} - {self.rating}/5"

    class Meta:
        verbose_name = "Avis"
        verbose_name_plural = "Avis"
