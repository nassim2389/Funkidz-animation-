from django.db import models

class MediaGallery(models.Model):
    class MediaType(models.TextChoices):
        IMAGE = 'IMAGE', 'Image'
        VIDEO = 'VIDEO', 'Vidéo'

    service = models.ForeignKey('services.Service', on_delete=models.SET_NULL, null=True, blank=True, related_name='gallery')
    media_url = models.URLField()
    media_type = models.CharField(max_length=10, choices=MediaType.choices, default=MediaType.IMAGE)
    title = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title or self.media_url

    class Meta:
        verbose_name = "Élément multimédia"
        verbose_name_plural = "Galerie multimédia"
