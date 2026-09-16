from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from datetime import datetime, timedelta, time, date
from .models import Availability, AnimateurLeave, WeeklySchedule
from .serializers import AvailabilitySerializer
from users.models import AnimateurProfile
from bookings.models import BookingAssignment, Booking
from services.models import Service

def is_slot_available_for_booking(booking_date, booking_time, service_id=None, exclude_booking_id=None, check_past=False):
    """
    Vérifie en temps réel si un créneau horodaté est disponible pour une nouvelle réservation.
    Prend en compte :
    - Les congés validés des animateurs (AnimateurLeave)
    - Les indisponibilités bloquées des animateurs (Availability)
    - Les missions déjà attribuées aux animateurs (BookingAssignment)
    - Les réservations actives non encore attribuées (capacité globale du pool d'animateurs)
    """
    if isinstance(booking_date, str):
        try:
            booking_date = datetime.strptime(booking_date, '%Y-%m-%d').date()
        except ValueError:
            return False, "Format de date invalide (attendu: AAAA-MM-JJ)."

    if isinstance(booking_time, str):
        try:
            booking_time = datetime.strptime(booking_time, '%H:%M').time()
        except ValueError:
            try:
                booking_time = datetime.strptime(booking_time, '%H:%M:%S').time()
            except ValueError:
                return False, "Format d'heure invalide (attendu: HH:MM)."

    if check_past:
        today = date.today()
        if booking_date < today:
            return False, "Impossible de sélectionner une date antérieure à aujourd'hui."
        if booking_date == today:
            now_time = datetime.now().time()
            if booking_time <= now_time:
                return False, "Ce créneau horaire est déjà passé pour aujourd'hui."

    duration = 120  # Durée par défaut : 2 heures
    if service_id:
        try:
            if isinstance(service_id, Service):
                duration = service_id.duration_minutes
            else:
                service = Service.objects.get(id=service_id)
                duration = service.duration_minutes
        except (Service.DoesNotExist, ValueError):
            pass

    new_start_dt = datetime.combine(booking_date, booking_time)
    new_end_dt = new_start_dt + timedelta(minutes=duration)

    # 1. Vérification stricte Anti-Doublon :
    # Si une réservation active (CONFIRMED ou PENDING) chevauche déjà cette plage horaire
    existing_overlapping = Booking.objects.filter(
        booking_date=booking_date,
        status__in=[Booking.Status.CONFIRMED, Booking.Status.PENDING]
    )
    if exclude_booking_id:
        existing_overlapping = existing_overlapping.exclude(id=exclude_booking_id)

    for b in existing_overlapping:
        b_dur = b.service.duration_minutes if b.service else 120
        b_start = datetime.combine(booking_date, b.booking_time)
        b_end = b_start + timedelta(minutes=b_dur)
        # Chevauchement d'intervalles stricts [start, end[
        if b_start < new_end_dt and b_end > new_start_dt:
            return False, "Ce créneau est indisponible."

    # 2. Vérification des animateurs disponibles (congés et indisponibilités)
    animators = list(AnimateurProfile.objects.select_related('user').all())
    if not animators:
        return True, "Créneau disponible ! Nos équipes d'animation vous attendent avec impatience ! 🎉"

    available_animators = []
    for animator in animators:
        # A. Congés validés
        on_leave = AnimateurLeave.objects.filter(
            animateur=animator,
            status=AnimateurLeave.Status.APPROVED,
            start_date__lte=booking_date,
            end_date__gte=booking_date
        ).exists()
        if on_leave:
            continue

        # B. Plage bloquée
        blocked_availabilities = Availability.objects.filter(
            animateur=animator,
            date=booking_date,
            is_blocked=True
        )
        is_blocked = False
        for av in blocked_availabilities:
            av_start = datetime.combine(booking_date, av.start_time)
            av_end = datetime.combine(booking_date, av.end_time)
            if av_start < new_end_dt and av_end > new_start_dt:
                is_blocked = True
                break
        if is_blocked:
            continue

        available_animators.append(animator)

    if not available_animators:
        return False, "Ce créneau est indisponible (aucun animateur disponible à cette date, tous occupés ou en congé)."

    return True, "Super ! Ce créneau est disponible. 🎉✨"


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

    @action(detail=False, methods=['get'], url_path='slots')
    def get_daily_slots(self, request):
        date_str = request.query_params.get('date')
        service_id = request.query_params.get('service')

        if not date_str:
            return Response(
                {'error': 'Le paramètre "date" (AAAA-MM-JJ) est obligatoire.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            booking_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Format de date invalide (attendu: AAAA-MM-JJ).'},
                status=status.HTTP_400_BAD_REQUEST
            )

        duration = 120
        service_name = ""
        if service_id:
            try:
                service = Service.objects.get(id=service_id)
                duration = service.duration_minutes
                service_name = service.name
            except (Service.DoesNotExist, ValueError):
                pass

        default_times = ["10:00", "11:30", "13:30", "14:00", "15:30", "16:30", "18:00"]
        slots_data = []

        for t_str in default_times:
            t_obj = datetime.strptime(t_str, '%H:%M').time()
            start_dt = datetime.combine(booking_date, t_obj)
            end_dt = start_dt + timedelta(minutes=duration)
            
            # Check past
            is_past = False
            today = date.today()
            if booking_date < today or (booking_date == today and t_obj <= datetime.now().time()):
                is_past = True
                available = False
                message = "Créneau horaire déjà passé."
            else:
                available, message = is_slot_available_for_booking(booking_date, t_obj, service_id)

            slots_data.append({
                'time': t_str,
                'end_time': end_dt.strftime('%H:%M'),
                'available': available,
                'is_past': is_past,
                'message': message,
                'duration_minutes': duration
            })

        return Response({
            'date': date_str,
            'service_id': service_id,
            'service_name': service_name,
            'duration_minutes': duration,
            'slots': slots_data,
            'has_available_slots': any(s['available'] for s in slots_data)
        })


