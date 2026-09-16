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
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="URL de l'image de couverture HD")
    badge_label = models.CharField(max_length=50, blank=True, help_text="Badge promotionnel (ex: 'Top Ventes', 'Coup de Cœur')")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def get_image_url(self):
        if self.image_url:
            return self.image_url
        name_lower = self.name.lower()
        if 'pirate' in name_lower:
            return "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80"
        elif 'magie' in name_lower or 'sorcier' in name_lower:
            return "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80"
        elif 'héros' in name_lower or 'heros' in name_lower:
            return "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=800&q=80"
        elif 'disco' in name_lower or 'karaoke' in name_lower or 'boum' in name_lower:
            return "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"
        elif 'pâtisserie' in name_lower or 'patisserie' in name_lower or 'gourmandise' in name_lower:
            return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
        elif 'princesse' in name_lower or 'féerique' in name_lower or 'feerique' in name_lower:
            return "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80"
        elif 'escape' in name_lower or 'enquête' in name_lower or 'mystère' in name_lower:
            return "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
        elif 'scientifique' in name_lower or 'science' in name_lower or 'slime' in name_lower:
            return "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
        elif 'mascotte' in name_lower or 'tout-petits' in name_lower:
            return "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80"
        elif 'kermesse' in name_lower or 'olympiade' in name_lower:
            return "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80"
        return "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80"

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
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="URL de l'image ou icône de l'option")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.service.name})"

    def get_image_url(self):
        if self.image_url:
            return self.image_url
        name_lower = self.name.lower()
        if 'maquillage' in name_lower:
            return "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80"
        elif 'barbe à papa' in name_lower or 'barbe a papa' in name_lower:
            return "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=400&q=80"
        elif 'photobooth' in name_lower or 'photo' in name_lower:
            return "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&q=80"
        elif 'bulle' in name_lower or 'fumée' in name_lower or 'fumee' in name_lower:
            return "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80"
        elif 'épée' in name_lower or 'epee' in name_lower or 'bandana' in name_lower:
            return "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80"
        elif 'chapeau' in name_lower or 'baguette' in name_lower:
            return "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80"
        elif 'cape' in name_lower or 'masque' in name_lower:
            return "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80"
        elif 'médaille' in name_lower or 'diplôme' in name_lower or 'diplome' in name_lower:
            return "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=400&q=80"
        elif 'coffre' in name_lower or 'cadeau' in name_lower:
            return "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=400&q=80"
        return "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80"

    class Meta:
        verbose_name = "Option"
        verbose_name_plural = "Options"
