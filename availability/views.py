from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from datetime import datetime, timedelta, time
from .models import Availability, AnimateurLeave, WeeklySchedule
from .serializers import AvailabilitySerializer
from users.models import AnimateurProfile
from bookings.models import BookingAssignment, Booking
from services.models import Service

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
            # Try parsing time format HH:MM or HH:MM:SS
            try:
                booking_time = datetime.strptime(time_str, '%H:%M').time()
            except ValueError:
                booking_time = datetime.strptime(time_str, '%H:%M:%S').time()
        except ValueError:
            return Response(
                {'available': False, 'message': 'Format de date ou d\'heure invalide. 📅'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get service duration
        duration = 120  # Default 2 hours
        if service_id:
            try:
                service = Service.objects.get(id=service_id)
                duration = service.duration_minutes
            except Service.DoesNotExist:
                pass

        # Calculate new booking time range
        new_start_dt = datetime.combine(booking_date, booking_time)
        new_end_dt = new_start_dt + timedelta(minutes=duration)

        animators = AnimateurProfile.objects.all()
        if not animators.exists():
            # If no animators exist in the database, assume true for sandbox or seeding purposes
            return Response({
                'available': True,
                'message': 'Créneau disponible ! Nos équipes d\'animation vous attendent avec impatience ! 🎉'
            })

        available_animator_found = False

        for animator in animators:
            # 1. Check approved leaves
            on_leave = AnimateurLeave.objects.filter(
                animateur=animator,
                status=AnimateurLeave.Status.APPROVED,
                start_date__lte=booking_date,
                end_date__gte=booking_date
            ).exists()
            if on_leave:
                continue

            # 2. Check blocked days
            is_blocked = Availability.objects.filter(
                animateur=animator,
                date=booking_date,
                is_blocked=True
            ).exists()
            if is_blocked:
                continue

            # 3. Check overlapping bookings (assigned and accepted)
            assignments = BookingAssignment.objects.filter(
                animateur=animator,
                status=BookingAssignment.Status.ACCEPTED,
                booking__booking_date=booking_date
            )
            
            overlap_found = False
            for ass in assignments:
                exist_start = datetime.combine(booking_date, ass.booking.booking_time)
                exist_duration = ass.booking.service.duration_minutes
                exist_end = exist_start + timedelta(minutes=exist_duration)
                
                # Check overlap
                if exist_start < new_end_dt and exist_end > new_start_dt:
                    overlap_found = True
                    break
            
            if overlap_found:
                continue

            # If the animator passed all checks, they are available!
            available_animator_found = True
            break

        if available_animator_found:
            return Response({
                'available': True,
                'message': 'Super ! Ce créneau est disponible et un animateur est libre. 🎉✨'
            })
        else:
            return Response({
                'available': False,
                'message': 'Désolé, tous nos animateurs sont occupés ou indisponibles à ce moment. Essayez un autre créneau ! 💖'
            })

