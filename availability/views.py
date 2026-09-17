from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from datetime import datetime, timedelta, time, date
from .models import Availability, AnimateurLeave, WeeklySchedule
from .serializers import AvailabilitySerializer
from users.models import AnimateurProfile
from bookings.models import BookingAssignment, Booking
from services.models import Service

def _parse_slot(booking_date, booking_time):
    """Normalise la date et l'heure reçues (str ou objets) en objets Python."""
    if isinstance(booking_date, str):
        try:
            booking_date = datetime.strptime(booking_date, '%Y-%m-%d').date()
        except ValueError:
            return None, None, "Format de date invalide (attendu: AAAA-MM-JJ)."

    if isinstance(booking_time, str):
        try:
            booking_time = datetime.strptime(booking_time, '%H:%M').time()
        except ValueError:
            try:
                booking_time = datetime.strptime(booking_time, '%H:%M:%S').time()
            except ValueError:
                return None, None, "Format d'heure invalide (attendu: HH:MM)."

    return booking_date, booking_time, None


def _slot_duration(service_id):
    """Durée en minutes de la prestation (2 h par défaut)."""
    duration = 120
    if service_id:
        try:
            if isinstance(service_id, Service):
                duration = service_id.duration_minutes
            else:
                duration = Service.objects.get(id=service_id).duration_minutes
        except (Service.DoesNotExist, ValueError):
            pass
    return duration


def _overlaps(start_a, end_a, start_b, end_b):
    """Chevauchement d'intervalles stricts [start, end[."""
    return start_a < end_b and end_a > start_b


def is_animator_free(animator, booking_date, new_start_dt, new_end_dt, exclude_booking_id=None):
    """
    Disponibilité d'UN animateur sur un créneau donné (son propre calendrier).

    Un animateur est indisponible s'il est :
    - en congé validé (AnimateurLeave) ;
    - sur une plage qu'il a bloquée (Availability.is_blocked) ;
    - déjà mobilisé sur une mission qui chevauche le créneau (BookingAssignment).

    Retourne (disponible: bool, motif: str).
    """
    on_leave = AnimateurLeave.objects.filter(
        animateur=animator,
        status=AnimateurLeave.Status.APPROVED,
        start_date__lte=booking_date,
        end_date__gte=booking_date
    ).exists()
    if on_leave:
        return False, "En congé validé à cette date."

    blocked_availabilities = Availability.objects.filter(
        animateur=animator,
        date=booking_date,
        is_blocked=True
    )
    for av in blocked_availabilities:
        av_start = datetime.combine(booking_date, av.start_time)
        av_end = datetime.combine(booking_date, av.end_time)
        if _overlaps(av_start, av_end, new_start_dt, new_end_dt):
            return False, f"Indisponibilité déclarée de {av.start_time} à {av.end_time}."

    assignments = BookingAssignment.objects.select_related('booking', 'booking__service').filter(
        animateur=animator,
        status__in=[BookingAssignment.Status.PENDING, BookingAssignment.Status.ACCEPTED],
        booking__booking_date=booking_date,
        booking__status__in=[Booking.Status.CONFIRMED, Booking.Status.PENDING]
    )
    if exclude_booking_id:
        assignments = assignments.exclude(booking_id=exclude_booking_id)

    for assignment in assignments:
        mission = assignment.booking
        m_dur = mission.service.duration_minutes if mission.service else 120
        m_start = datetime.combine(booking_date, mission.booking_time)
        m_end = m_start + timedelta(minutes=m_dur)
        if _overlaps(m_start, m_end, new_start_dt, new_end_dt):
            return False, f"Déjà en mission de {m_start.strftime('%H:%M')} à {m_end.strftime('%H:%M')}."

    return True, "Disponible."


def get_animators_availability(booking_date, booking_time, service_id=None, exclude_booking_id=None):
    """
    Calendrier par animateur : état de chaque animateur sur un créneau précis.
    Retourne (liste de dicts, nb_animateurs_libres).
    """
    booking_date, booking_time, error = _parse_slot(booking_date, booking_time)
    if error:
        return [], 0

    duration = _slot_duration(service_id)
    new_start_dt = datetime.combine(booking_date, booking_time)
    new_end_dt = new_start_dt + timedelta(minutes=duration)

    results = []
    for animator in AnimateurProfile.objects.select_related('user').all():
        free, reason = is_animator_free(
            animator, booking_date, new_start_dt, new_end_dt, exclude_booking_id
        )
        results.append({
            'animateur_id': animator.id,
            'name': animator.user.get_full_name() or animator.user.email,
            'email': animator.user.email,
            'available': free,
            'reason': reason,
        })

    return results, sum(1 for r in results if r['available'])


def _unassigned_load(booking_date, new_start_dt, new_end_dt, exclude_booking_id=None):
    """
    Nombre de réservations actives chevauchant le créneau et pas encore
    attribuées : chacune mobilisera un animateur du pool.
    """
    bookings = Booking.objects.select_related('service').filter(
        booking_date=booking_date,
        status__in=[Booking.Status.CONFIRMED, Booking.Status.PENDING]
    )
    if exclude_booking_id:
        bookings = bookings.exclude(id=exclude_booking_id)

    load = 0
    for b in bookings:
        b_dur = b.service.duration_minutes if b.service else 120
        b_start = datetime.combine(booking_date, b.booking_time)
        b_end = b_start + timedelta(minutes=b_dur)
        if not _overlaps(b_start, b_end, new_start_dt, new_end_dt):
            continue
        has_animator = b.assignments.filter(
            status__in=[BookingAssignment.Status.PENDING, BookingAssignment.Status.ACCEPTED]
        ).exists()
        if not has_animator:
            load += 1
    return load


def is_slot_available_for_booking(booking_date, booking_time, service_id=None, exclude_booking_id=None, check_past=False, animateur_id=None):
    """
    Vérifie si un créneau horodaté est disponible.

    La disponibilité est évaluée PAR ANIMATEUR : une réservation ne bloque que
    l'animateur qui lui est affecté. Plusieurs réservations peuvent donc
    coexister sur la même date et la même heure tant qu'il reste des animateurs
    disponibles.

    - `animateur_id` fourni : on ne teste que le calendrier de cet animateur
      (même animateur + même date + même créneau = conflit).
    - `animateur_id` absent : on teste le pool. Le créneau est disponible tant
      qu'au moins un animateur reste libre après déduction des réservations
      déjà posées sur ce créneau et pas encore attribuées.

    Prend en compte :
    - Les congés validés des animateurs (AnimateurLeave)
    - Les indisponibilités bloquées des animateurs (Availability)
    - Les missions déjà attribuées aux animateurs (BookingAssignment)
    - Les réservations actives non encore attribuées (capacité du pool)
    """
    booking_date, booking_time, error = _parse_slot(booking_date, booking_time)
    if error:
        return False, error

    if check_past:
        today = date.today()
        if booking_date < today:
            return False, "Impossible de sélectionner une date antérieure à aujourd'hui."
        if booking_date == today:
            now_time = datetime.now().time()
            if booking_time <= now_time:
                return False, "Ce créneau horaire est déjà passé pour aujourd'hui."

    duration = _slot_duration(service_id)
    new_start_dt = datetime.combine(booking_date, booking_time)
    new_end_dt = new_start_dt + timedelta(minutes=duration)

    # 1. Disponibilité d'un animateur précis (calendrier individuel)
    if animateur_id:
        animator = AnimateurProfile.objects.select_related('user').filter(id=animateur_id).first()
        if animator is None:
            return False, "Animateur introuvable."
        free, reason = is_animator_free(
            animator, booking_date, new_start_dt, new_end_dt, exclude_booking_id
        )
        if not free:
            return False, f"Ce créneau est indisponible pour cet animateur : {reason}"
        return True, "Super ! Ce créneau est disponible pour cet animateur. 🎉✨"

    # 2. Disponibilité du pool d'animateurs
    animators = list(AnimateurProfile.objects.select_related('user').all())
    if not animators:
        return True, "Créneau disponible ! Nos équipes d'animation vous attendent avec impatience ! 🎉"

    available_animators = [
        a for a in animators
        if is_animator_free(a, booking_date, new_start_dt, new_end_dt, exclude_booking_id)[0]
    ]

    if not available_animators:
        return False, "Ce créneau est indisponible (aucun animateur disponible à cette date, tous occupés ou en congé)."

    # 3. Anti-doublon : les réservations déjà posées sur ce créneau et non
    # encore attribuées mobiliseront elles aussi un animateur du pool.
    pending_load = _unassigned_load(booking_date, new_start_dt, new_end_dt, exclude_booking_id)
    if len(available_animators) <= pending_load:
        return False, "Ce créneau est indisponible (tous nos animateurs sont déjà mobilisés sur ce créneau)."

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
        animateur_id = request.query_params.get('animateur')

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

        available, message = is_slot_available_for_booking(
            booking_date, booking_time, service_id, animateur_id=animateur_id
        )

        animators, animators_available = get_animators_availability(
            booking_date, booking_time, service_id
        )

        return Response({
            'available': available,
            'message': message,
            'animateur_id': int(animateur_id) if animateur_id else None,
            'animators_total': len(animators),
            'animators_available': animators_available,
            'animators': animators,
        })

    @action(detail=False, methods=['get'], url_path='animators')
    def get_animators_for_slot(self, request):
        """Disponibilité de chaque animateur (calendrier individuel) sur un créneau."""
        date_str = request.query_params.get('date')
        time_str = request.query_params.get('time')
        service_id = request.query_params.get('service')

        if not date_str or not time_str:
            return Response(
                {'error': 'Les paramètres "date" (AAAA-MM-JJ) et "time" (HH:MM) sont obligatoires.'},
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
                {'error': "Format de date ou d'heure invalide."},
                status=status.HTTP_400_BAD_REQUEST
            )

        animators, animators_available = get_animators_availability(
            booking_date, booking_time, service_id
        )

        return Response({
            'date': date_str,
            'time': time_str,
            'animators_total': len(animators),
            'animators_available': animators_available,
            'animators': animators,
        })

    @action(detail=False, methods=['get'], url_path='slots')
    def get_daily_slots(self, request):
        date_str = request.query_params.get('date')
        service_id = request.query_params.get('service')
        animateur_id = request.query_params.get('animateur')

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
                available, message = is_slot_available_for_booking(
                    booking_date, t_obj, service_id, animateur_id=animateur_id
                )

            _, animators_available = get_animators_availability(booking_date, t_obj, service_id)

            slots_data.append({
                'time': t_str,
                'end_time': end_dt.strftime('%H:%M'),
                'available': available,
                'is_past': is_past,
                'message': message,
                'duration_minutes': duration,
                'animators_available': 0 if is_past else animators_available
            })

        return Response({
            'date': date_str,
            'service_id': service_id,
            'animateur_id': int(animateur_id) if animateur_id else None,
            'service_name': service_name,
            'duration_minutes': duration,
            'slots': slots_data,
            'has_available_slots': any(s['available'] for s in slots_data)
        })


