from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from bookings.models import Booking
from datetime import date, timedelta
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Sends reminder emails to clients 24 hours before their event.'

    def handle(self, *args, **options):
        tomorrow = date.today() + timedelta(days=1)
        bookings = Booking.objects.filter(booking_date=tomorrow, status=Booking.Status.CONFIRMED)
        
        if not bookings.exists():
            self.stdout.write(self.style.SUCCESS('Aucune réservation confirmée pour demain.'))
            return
            
        success_count = 0
        for booking in bookings:
            subject = f"Rappel : Votre fête Funkidz c'est demain ! 🎈🎁"
            message = (
                f"Bonjour {booking.user.first_name or 'Super Client'},\n\n"
                f"Toute l'équipe de Funkidz trépigne d'impatience ! Votre fête est prévue pour demain, le {booking.booking_date} à {booking.booking_time}.\n\n"
                f"Voici un petit rappel des détails :\n"
                f"- Formule : {booking.service.name}\n"
                f"- Lieu : {booking.location_address}, {booking.location_zip} {booking.location_city}\n\n"
                f"Nos animateurs arriveront environ 15 à 30 minutes avant le début pour tout mettre en place.\n\n"
                f"Si vous avez la moindre question de dernière minute, n'hésitez pas à nous contacter !\n\n"
                f"À demain pour une journée inoubliable ! 🌟\n\n"
                f"L'équipe Funkidz"
            )
            try:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@funkidz.fr'),
                    recipient_list=[booking.user.email],
                    fail_silently=False,
                )
                success_count += 1
                self.stdout.write(self.style.SUCCESS(f"Rappel envoyé pour la réservation #{booking.id} à {booking.user.email}"))
            except Exception as e:
                logger.error(f"Erreur lors de l'envoi du rappel pour la réservation #{booking.id}: {e}")
                self.stdout.write(self.style.ERROR(f"Échec de l'envoi du rappel pour #{booking.id}"))
                
        self.stdout.write(self.style.SUCCESS(f"Terminé. {success_count} rappel(s) envoyé(s) avec succès !"))
