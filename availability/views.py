from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from datetime import datetime, timedelta, time
from .models import Availability, AnimateurLeave, WeeklySchedule
from .serializers import AvailabilitySerializer
from users.models import AnimateurProfile
from bookings.models import BookingAssignment, Booking
from services.models import Service

def is_slot_available_for_booking(booking_date, booking_time, service_id=None, exclude_booking_id=None):
    """
    Vérifie en temps réel si un créneau horodaté est disponible pour une nouvelle réservation.
    Prend en compte les congés des animateurs, leurs indisponibilités et les réservations existantes.
    """
    duration = 120  # Durée par défaut : 2 heures
    if service_id:
        try:
            service = Service.objects.get(id=service_id)
            duration = service.duration_minutes
        except Service.DoesNotExist:
            pass

    new_start_dt = datetime.combine(booking_date, booking_time)
    new_end_dt = new_start_dt + timedelta(minutes=duration)

    animators = AnimateurProfile.objects.all()
    if not animators.exists():
        return True, "Créneau disponible ! Nos équipes d'animation vous attendent avec impatience ! 🎉"

    # 1. Animateurs disponibles à cette date (hors congés et blocages)
    available_animators = []
    for animator in animators:
        on_leave = AnimateurLeave.objects.filter(
            animateur=animator,
            status=AnimateurLeave.Status.APPROVED,
            start_date__lte=booking_date,
            end_date__gte=booking_date
        ).exists()
        if on_leave:
            continue

        is_blocked = Availability.objects.filter(
            animateur=animator,
            date=booking_date,
            is_blocked=True
        ).exists()
        if is_blocked:
            continue

        available_animators.append(animator)

    if not available_animators:
        return False, "Ce créneau est indisponible (aucun animateur disponible à cette date)."

    # 2. Vérification du nombre de réservations actives chevauchant la même plage horaire
    existing_bookings = Booking.objects.filter(
        booking_date=booking_date,
        status__in=[Booking.Status.CONFIRMED, Booking.Status.PENDING]
    )
    if exclude_booking_id:
        existing_bookings = existing_bookings.exclude(id=exclude_booking_id)

    overlapping_count = 0
    for b in existing_bookings:
        b_start = datetime.combine(booking_date, b.booking_time)
        b_dur = b.service.duration_minutes if b.service else 120
        b_end = b_start + timedelta(minutes=b_dur)
        
        # Superposition des créneaux
        if b_start < new_end_dt and b_end > new_start_dt:
            overlapping_count += 1

    if overlapping_count >= len(available_animators):
        return False, "Ce créneau est indisponible (déjà réservé sur cette plage horaire)."

    return True, "Super ! Ce créneau est disponible et un animateur est libre. 🎉✨"


class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'], url_path='check')
    def check_availability(self, request):
        date_str = request.query_params.get('date')
        time_str = request.query_params.get('time')
        service_id = request.query_params.get('service')

        if not date_str or not time_str:
            return Response(
                {'available': False, 'message': 'Veuillez sélectionner une date et une heure. 🕒'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            booking_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            try:
                booking_time = datetime.strptime(time_str, '%H:%M').time()
            except ValueError:
                booking_time = datetime.strptime(time_str, '%H:%M:%S').time()
        except ValueError:
            return Response(
                {'available': False, 'message': 'Format de date ou d\'heure invalide. 📅'},
                status=status.HTTP_400_BAD_REQUEST
            )

        available, message = is_slot_available_for_booking(booking_date, booking_time, service_id)
        
        return Response({
            'available': available,
            'message': message
        })


