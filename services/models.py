from django.db import models

class Service(models.Model):
    class Category(models.TextChoices):
        ANNIVERSAIRE = 'ANNIVERSAIRE', 'Anniversaire'
        MARIAGE = 'MARIAGE', 'Mariage'
        SEMINAIRE = 'SEMINAIRE', 'Séminaire'
        ECOLE = 'ECOLE', 'École'
        AUTRE = 'AUTRE', 'Autre'

    name = models.CharField(max_length=200)
    description = models.TextField()
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_minutes = models.PositiveIntegerField(default=60)
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.ANNIVERSAIRE
    )
    is_active = models.BooleanField(default=True)
    max_children = models.PositiveIntegerField(default=15)
    min_children = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Service"
        verbose_name_plural = "Services"

class Option(models.Model):
    class PricingType(models.TextChoices):
        FIXED = 'FIXED', 'Prix Fixe'
        PER_CHILD = 'PER_CHILD', 'Par Enfant'
        PER_HOUR = 'PER_HOUR', 'Par Heure'

    service = models.ForeignKey(Service, related_name='options', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    pricing_type = models.CharField(
        max_length=20,
        choices=PricingType.choices,
        default=PricingType.FIXED
    )
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.service.name})"

    class Meta:
        verbose_name = "Option"
        verbose_name_plural = "Options"
