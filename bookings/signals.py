from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Booking
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Booking)
def send_booking_email(sender, instance, created, **kwargs):
    # Check status and send appropriate emails
    if instance.status == Booking.Status.CONFIRMED:
        subject = f"Confirmation de votre réservation Funkidz #{instance.id} 🎈"
        message = (
            f"Bonjour,\n\n"
            f"Nous avons le plaisir de vous confirmer votre réservation pour l'animation suivante :\n"
            f"- Formule : {instance.service.name}\n"
            f"- Date : {instance.booking_date}\n"
            f"- Heure : {instance.booking_time}\n"
            f"- Lieu : {instance.location_address}, {instance.location_zip} {instance.location_city}\n\n"
            f"Le montant de {instance.final_price}€ a bien été réglé avec succès. 💳\n\n"
            f"Nos animateurs se préparent pour faire de cette journée un moment inoubliable pour les enfants ! 🌟\n\n"
            f"Vous pouvez retrouver tous les détails et télécharger votre reçu de paiement à tout moment dans votre espace client.\n\n"
            f"L'équipe Funkidz"
        )
        
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@funkidz.fr'),
                recipient_list=[instance.user.email],
                fail_silently=False,
            )
        except Exception as e:
            logger.error(f"Erreur d'envoi d'email de confirmation pour la réservation #{instance.id}: {e}")

    elif instance.status == Booking.Status.CANCELLED:
        subject = f"Annulation de votre réservation Funkidz #{instance.id} ❌"
        message = (
            f"Bonjour,\n\n"
            f"Nous vous informons que votre réservation #{instance.id} pour la formule '{instance.service.name}' prévue le {instance.booking_date} a bien été annulée.\n\n"
            f"Si vous avez déjà effectué le règlement, notre équipe de support procédera à la vérification et au remboursement selon nos conditions générales de vente.\n\n"
            f"Nous espérons vous revoir très bientôt pour de nouvelles aventures ! 💫\n\n"
            f"L'équipe Funkidz"
        )
        
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@funkidz.fr'),
                recipient_list=[instance.user.email],
                fail_silently=False,
            )
        except Exception as e:
            logger.error(f"Erreur d'envoi d'email d'annulation pour la réservation #{instance.id}: {e}")

