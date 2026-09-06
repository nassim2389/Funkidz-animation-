from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import AnimateurLeave
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=AnimateurLeave)
def notify_leave_status_change(sender, instance, created, **kwargs):
    if created:
        # Email notification to Admin
        subject = f"✈️ Nouvelle demande de congé : {instance.animateur.user.get_full_name() or instance.animateur.user.email}"
        message = (
            f"Bonjour Administrateur,\n\n"
            f"L'animateur {instance.animateur.user.get_full_name() or instance.animateur.user.email} vient de soumettre une demande de congé :\n\n"
            f"- Date de début : {instance.start_date}\n"
            f"- Date de fin : {instance.end_date}\n"
            f"- Motif : {instance.reason or 'Non spécifié'}\n"
            f"- Statut : En attente de validation\n\n"
            f"Rendez-vous dans l'espace d'administration (/admin/availability/animateurleave/) pour approuver ou refuser cette demande.\n\n"
            f"Funkidz Admin System"
        )
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@funkidz.fr'),
                recipient_list=['sedraniainaeuphredat@gmail.com'],
                fail_silently=True
            )
        except Exception as e:
            logger.error(f"Erreur d'envoi d'email admin pour la demande de congé #{instance.id}: {e}")

    else:
        # Email notification to Animateur when status is updated by Admin
        if instance.status in [AnimateurLeave.Status.APPROVED, AnimateurLeave.Status.REJECTED]:
            status_label = "APPROUVÉE ✅" if instance.status == AnimateurLeave.Status.APPROVED else "REFUSÉE ❌"
            subject = f"Décision concernant votre demande de congé - {status_label}"
            message = (
                f"Bonjour {instance.animateur.user.first_name or instance.animateur.user.email},\n\n"
                f"L'administration a examiné votre demande de congé du {instance.start_date} au {instance.end_date}.\n\n"
                f"Statut final : {instance.get_status_display().upper()}\n\n"
                f"Vous pouvez consulter votre planning à jour dans votre espace animateur (/dashboard/).\n\n"
                f"L'équipe Funkidz Animation"
            )
            try:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@funkidz.fr'),
                    recipient_list=[instance.animateur.user.email],
                    fail_silently=True
                )
            except Exception as e:
                logger.error(f"Erreur d'envoi d'email animateur pour le congé #{instance.id}: {e}")
