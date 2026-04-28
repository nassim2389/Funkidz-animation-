from django.contrib import admin
from .models import MediaGallery
@admin.register(MediaGallery)
class MediaGalleryAdmin(admin.ModelAdmin):
    list_display = ('title', 'service', 'media_type', 'order')
