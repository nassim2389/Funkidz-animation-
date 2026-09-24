from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Booking, BookingAssignment
from core.emails import (
    send_booking_confirmation_client,
    send_booking_received_client,
    send_booking_admin_notification,
    send_booking_cancellation_emails,
    send_animateur_mission_notification,
)
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Booking)
def send_booking_email(sender, instance, created, **kwargs):
    """
    Signal d'envoi d'e-mails pour les réservations avec garantie d'idempotence stricte (anti-doublon).
    Combine une vérification d'état en mémoire et un verrou atomique en base de données.
    """
    now = timezone.now()

    # 1. Création d'une réservation (en attente de paiement) : alerte admin et accusé de réception client
    if created and instance.status == Booking.Status.PENDING:
        if getattr(instance, 'admin_notification_sent_at', None):
            return

        updated = Booking.objects.filter(
            id=instance.id,
            admin_notification_sent_at__isnull=True
        ).update(admin_notification_sent_at=now)

        if updated > 0:
            instance.admin_notification_sent_at = now
            logger.info(f"[Signal] Envoi notification admin pour nouvelle réservation #{instance.id}")
            send_booking_admin_notification(instance, event_type='new_booking')
            # Accusé de réception au client, protégé par le même verrou anti-doublon
            send_booking_received_client(instance)

    # 2. Confirmation Client & Notification Admin dès que le paiement est validé (Statut CONFIRMED)
    elif instance.status == Booking.Status.CONFIRMED:
        # Contrôle rapide en mémoire
        if getattr(instance, 'confirmation_email_sent_at', None):
            logger.debug(f"[Signal] E-mail de confirmation déjà envoyé (in-memory) pour #{instance.id}")
            return

        # Verrou atomique en base de données : protège contre les requêtes simultanées (webhook + redirect)
        updated = Booking.objects.filter(
            id=instance.id,
            confirmation_email_sent_at__isnull=True
        ).update(confirmation_email_sent_at=now)

        if updated > 0:
            instance.confirmation_email_sent_at = now
            logger.info(f"[Signal] Paiement validé pour #{instance.id} — Déclenchement e-mails confirmation")
            send_booking_confirmation_client(instance)
            send_booking_admin_notification(instance, event_type='payment_confirmed')
        else:
            logger.debug(f"[Signal] E-mail de confirmation déjà envoyé en BDD pour #{instance.id}")

    # 3. Notification d'annulation (Client et Admin)
    elif instance.status == Booking.Status.CANCELLED:
        if getattr(instance, 'cancellation_email_sent_at', None):
            return

        updated = Booking.objects.filter(
            id=instance.id,
            cancellation_email_sent_at__isnull=True
        ).update(cancellation_email_sent_at=now)

        if updated > 0:
            instance.cancellation_email_sent_at = now
            logger.info(f"[Signal] Réservation #{instance.id} annulée — Déclenchement e-mails d'annulation")
            send_booking_cancellation_emails(instance)


@receiver(post_save, sender=BookingAssignment)
def send_animateur_assignment_email(sender, instance, created, **kwargs):
    """
    Notification envoyée à l'animateur lorsqu'une mission lui est assignée.
    Garantie anti-doublon via notification_sent_at.
    """
    if getattr(instance, 'notification_sent_at', None):
        return

    now = timezone.now()
    updated = BookingAssignment.objects.filter(
        id=instance.id,
        notification_sent_at__isnull=True
    ).update(notification_sent_at=now)

    if updated > 0:
        instance.notification_sent_at = now
        logger.info(f"[Signal] Nouvelle attribution de mission pour l'animateur #{instance.animateur_id} sur réservation #{instance.booking_id}")
        send_animateur_mission_notification(instance)
