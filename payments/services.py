"""
Traitement du résultat d'un PaymentIntent Stripe.

Point unique utilisé par la page de retour de paiement, la synchronisation
déclenchée par le formulaire de carte et le webhook : l'état enregistré en
base reflète toujours l'état réel communiqué par Stripe.
"""
import logging

from django.utils import timezone

from bookings.models import Booking
from .models import Payment

logger = logging.getLogger(__name__)

SUCCEEDED = 'succeeded'
PROCESSING = 'processing'
FAILED = 'failed'
CANCELED = 'canceled'
PENDING = 'pending'

# Statuts Stripe qui signifient qu'aucun débit n'a eu lieu et que le client
# doit encore agir : le paiement reste en attente.
_WAITING_STATUSES = ('requires_confirmation', 'requires_action', 'requires_capture')


def as_dict(stripe_object):
    """
    Convertit un objet renvoyé par le SDK Stripe en dictionnaire Python.

    Depuis la version 15 du SDK, les objets Stripe ne sont plus des
    dictionnaires (pas de méthode get) : toute lecture passe donc par une
    conversion explicite. Un dictionnaire déjà converti est renvoyé tel quel.
    """
    if hasattr(stripe_object, 'to_dict'):
        return stripe_object.to_dict()
    return stripe_object or {}


def _intent_error_message(intent):
    error = intent.get('last_payment_error') or {}
    return error.get('message') or "La transaction bancaire a été déclinée."


def notify_payment_failure(payment, error_message=None):
    """Envoie une seule fois l'e-mail d'échec au client (verrou en base)."""
    updated = Payment.objects.filter(
        id=payment.id,
        failure_email_sent_at__isnull=True
    ).update(failure_email_sent_at=timezone.now())
    if updated:
        from core.emails import send_payment_failed_notification
        send_payment_failed_notification(payment.booking, error_message=error_message)
    return bool(updated)


def confirm_payment(payment, reference=None):
    """Marque le paiement réussi et confirme la réservation (déclenche les e-mails)."""
    if payment.status != Payment.Status.SUCCEEDED:
        payment.status = Payment.Status.SUCCEEDED
        if reference:
            payment.stripe_payment_intent = reference
        payment.save()

    booking = payment.booking
    if booking.status != Booking.Status.CONFIRMED:
        booking.status = Booking.Status.CONFIRMED
        booking.cancelled_by = ''
        booking.save()


def apply_intent_outcome(payment, intent):
    """
    Répercute l'état d'un PaymentIntent sur le paiement et la réservation.

    Retourne l'un des résultats : 'succeeded', 'processing', 'failed',
    'canceled' ou 'pending'.
    """
    intent = as_dict(intent)
    status = intent.get('status')

    if status == SUCCEEDED:
        confirm_payment(payment, reference=intent.get('id'))
        return SUCCEEDED

    if payment.status == Payment.Status.SUCCEEDED:
        # Un paiement déjà encaissé n'est jamais rétrogradé.
        return SUCCEEDED

    if status == PROCESSING:
        # Paiement accepté par le client mais pas encore finalisé par la banque.
        _set_status(payment, Payment.Status.PENDING)
        return PROCESSING

    if status == 'requires_payment_method' and intent.get('last_payment_error'):
        _set_status(payment, Payment.Status.FAILED)
        notify_payment_failure(payment, _intent_error_message(intent))
        return FAILED

    if status == CANCELED:
        _set_status(payment, Payment.Status.FAILED)
        return CANCELED

    if status in _WAITING_STATUSES or status == 'requires_payment_method':
        _set_status(payment, Payment.Status.PENDING)
        return PENDING

    logger.warning(f"Statut Stripe inattendu « {status} » pour le paiement #{payment.id}.")
    return PENDING


def _set_status(payment, status):
    if payment.status != status:
        payment.status = status
        payment.save(update_fields=['status', 'updated_at'])
