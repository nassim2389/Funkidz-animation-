from django.db import models

class Availability(models.Model):
    animateur = models.ForeignKey('users.AnimateurProfile', on_delete=models.CASCADE, related_name='availabilities')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_blocked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.animateur.user.email} - {self.date} ({self.start_time} - {self.end_time})"

    class Meta:
        verbose_name = "Disponibilité"
        verbose_name_plural = "Disponibilités"

class WeeklySchedule(models.Model):
    class Weekday(models.IntegerChoices):
        MONDAY = 0, 'Lundi'
        TUESDAY = 1, 'Mardi'
        WEDNESDAY = 2, 'Mercredi'
        THURSDAY = 3, 'Jeudi'
        FRIDAY = 4, 'Vendredi'
        SATURDAY = 5, 'Samedi'
        SUNDAY = 6, 'Dimanche'

    animateur = models.ForeignKey('users.AnimateurProfile', on_delete=models.CASCADE, related_name='weekly_schedules')
    weekday = models.IntegerField(choices=Weekday.choices)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Horaire Récurrent"
        verbose_name_plural = "Horaires Récurrents"
        unique_together = ('animateur', 'weekday', 'start_time', 'end_time')

    def __str__(self):
        return f"{self.animateur.user.email} - {self.get_weekday_display()} ({self.start_time} - {self.end_time})"

class AnimateurLeave(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'En attente'
        APPROVED = 'APPROVED', 'Approuvé'
        REJECTED = 'REJECTED', 'Refusé'

    animateur = models.ForeignKey('users.AnimateurProfile', on_delete=models.CASCADE, related_name='leaves')
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    class Meta:
        verbose_name = "Congé Animateur"
        verbose_name_plural = "Congés Animateurs"

    def __str__(self):
        return f"Congé {self.animateur.user.email} du {self.start_date} au {self.end_date} ({self.get_status_display()})"

