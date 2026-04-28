from django.db import models

class Availability(models.Model):
    animateur = models.ForeignKey('users.AnimateurProfile', on_delete=models.CASCADE, related_name='availabilities')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_blocked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.animateur.user.email} - {self.date}"

    class Meta:
        verbose_name = "Disponibilité"
        verbose_name_plural = "Disponibilités"
