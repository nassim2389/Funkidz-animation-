from rest_framework import serializers
from .models import MediaGallery

class MediaGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaGallery
        fields = '__all__'
