from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Review
from .serializers import ReviewSerializer


class IsReviewOwnerOrStaff(permissions.BasePermission):
    """Seul le client titulaire de la réservation ou l'administration modifie un avis."""

    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.booking.user_id == request.user.id


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsReviewOwnerOrStaff()]

    def _check_booking_owner(self, serializer):
        booking = serializer.validated_data.get('booking')
        user = self.request.user
        if booking is not None and not user.is_staff and booking.user_id != user.id:
            raise PermissionDenied("Vous ne pouvez donner un avis que sur vos propres réservations.")

    def perform_create(self, serializer):
        self._check_booking_owner(serializer)
        serializer.save()

    def perform_update(self, serializer):
        self._check_booking_owner(serializer)
        serializer.save()
