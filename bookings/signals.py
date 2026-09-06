from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Booking, BookingAssignment
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Booking)
def send_booking_email(sender, instance, created, **kwargs):
    from core.utils import get_admin_recipient_emails

    # Alert Admin on new booking creation (Pending payment)
    if created and instance.status == Booking.Status.PENDING:
        admin_subject = f"🔔 Nouvelle demande de réservation #{instance.id} (En attente de paiement Stripe)"
        admin_message = (
            f"Bonjour Administrateur,\n\n"
            f"Une nouvelle demande de réservation vient d'être initiée sur le site par {instance.user.first_name or ''} {instance.user.last_name or ''} ({instance.user.email}).\n\n"
            f"- Numéro de réservation : #{instance.id}\n"
            f"- Formule : {instance.service.name}\n"
            f"- Date & Heure : {instance.booking_date} à {instance.booking_time}\n"
            f"- Nombre d'enfants : {instance.nb_children}\n"
            f"- Lieu : {instance.location_address}, {instance.location_zip} {instance.location_city}\n"
            f"- Montant : {instance.final_price}€\n"
            f"- Statut actuel : En attente de règlement sur Stripe\n\n"
            f"Le client est actuellement sur la page de paiement sécurisé Stripe.\n\n"
            f"Funkidz Admin System"
        )
        try:
            send_mail(
                subject=admin_subject,
                message=admin_message,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@funkidz.fr'),
                recipient_list=get_admin_recipient_emails(),
                fail_silently=True,
            )
        except Exception as e:
            logger.error(f"Erreur d'envoi d'email admin pour la création de réservation #{instance.id}: {e}")

    # Send Confirmation emails when payment succeeds
    if instance.status == Booking.Status.CONFIRMED:
        # Client confirmation email
        subject = f"Confirmation de votre réservation Funkidz #{instance.id} 🎈"
        message = (
            f"Bonjour {instance.user.first_name or ''},\n\n"
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
            logger.error(f"Erreur d'envoi d'email de confirmation client pour la réservation #{instance.id}: {e}")

        # Admin confirmation notification
        admin_conf_subject = f"✅ PAIEMENT CONFIRMÉ - Réservation #{instance.id} ({instance.service.name})"
        admin_conf_message = (
            f"Bonjour Administrateur,\n\n"
            f"Le paiement de {instance.final_price}€ pour la réservation #{instance.id} a été RÉUSSI avec succès par carte bancaire !\n\n"
            f"- Client : {instance.user.first_name or ''} {instance.user.last_name or ''} ({instance.user.email})\n"
            f"- Formule : {instance.service.name}\n"
            f"- Date & Heure : {instance.booking_date} à {instance.booking_time}\n"
            f"- Lieu : {instance.location_address}, {instance.location_zip} {instance.location_city}\n\n"
            f"Vous pouvez dès à présent désigner un animateur depuis votre espace administrateur (/admin/).\n\n"
            f"Funkidz Admin System"
        )
        try:
            send_mail(
                subject=admin_conf_subject,
                message=admin_conf_message,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@funkidz.fr'),
                recipient_list=get_admin_recipient_emails(),
                fail_silently=True,
            )
        except Exception as e:
            logger.error(f"Erreur d'envoi d'email admin de confirmation pour la réservation #{instance.id}: {e}")



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

@receiver(post_save, sender=BookingAssignment)
def send_animateur_assignment_email(sender, instance, created, **kwargs):
    if created or instance.status == BookingAssignment.Status.PENDING:
        subject = f"🎯 Nouvelle mission d'animation attribuée #{instance.booking.id} - Funkidz"
        message = (
            f"Bonjour {instance.animateur.user.first_name or instance.animateur.user.email},\n\n"
            f"Une nouvelle mission d'animation vient de vous être attribuée par l'administrateur !\n\n"
            f"Détails de la mission :\n"
            f"- Formule : {instance.booking.service.name}\n"
            f"- Date : {instance.booking.booking_date}\n"
            f"- Heure : {instance.booking.booking_time}\n"
            f"- Nombre d'enfants : {instance.booking.nb_children}\n"
            f"- Lieu : {instance.booking.location_address}, {instance.booking.location_zip} {instance.booking.location_city}\n\n"
            f"Veuillez vous connecter à votre espace personnel Animateur (/dashboard/) pour accepter ou refuser la mission.\n\n"
            f"L'équipe Funkidz Animation"
        )
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@funkidz.fr'),
                recipient_list=[instance.animateur.user.email],
                fail_silently=True,
            )
        except Exception as e:
            logger.error(f"Erreur d'envoi d'email à l'animateur #{instance.animateur.id}: {e}")

