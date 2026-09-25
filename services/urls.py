from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, OptionViewSet

router = DefaultRouter()
router.register(r'services', ServiceViewSet)
router.register(r'options', OptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
