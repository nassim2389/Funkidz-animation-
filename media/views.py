from rest_framework import viewsets, permissions
from .models import MediaGallery
from .serializers import MediaGallerySerializer

class MediaGalleryViewSet(viewsets.ModelViewSet):
    queryset = MediaGallery.objects.all()
    serializer_class = MediaGallerySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
