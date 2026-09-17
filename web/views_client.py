from django.shortcuts import redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from bookings.models import Booking


@login_required
def cancel_booking(request, booking_id):
    """
    Annulation d'une réservation par le client lui-même.

    Règle appliquée : le client peut annuler tant qu'il reste au moins
    Booking.CLIENT_CANCELLATION_DEADLINE_HOURS heures (48 h) avant le début de
    la prestation. Passé ce délai, l'annulation doit être demandée à
    l'administration, qui reste seule à pouvoir la prononcer.
    """
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)

    if booking.status == Booking.Status.DONE:
        messages.error(
            request,
            "Cette prestation est déjà terminée : elle ne peut plus être annulée."
        )
    elif booking.status == Booking.Status.CANCELLED:
        messages.info(request, f"La réservation #{booking.id} est déjà annulée.")
    elif not booking.can_be_cancelled_by_client:
        messages.error(
            request,
            f"Annulation impossible en ligne : il reste moins de "
            f"{Booking.CLIENT_CANCELLATION_DEADLINE_HOURS} heures avant le début de "
            f"la prestation. Contactez-nous pour toute demande d'annulation tardive."
        )
    else:
        booking.status = Booking.Status.CANCELLED
        booking.cancelled_by = Booking.CancelledBy.CLIENT
        booking.save()
        messages.success(
            request,
            f"Votre réservation #{booking.id} a bien été annulée. "
            f"Un e-mail de confirmation vous a été envoyé."
        )

    return redirect('dashboard')
