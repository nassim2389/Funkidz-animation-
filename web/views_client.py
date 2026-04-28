from django.shortcuts import redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from bookings.models import Booking

@login_required
def cancel_booking(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)
    if booking.status != 'DONE':
        booking.status = 'CANCELLED'
        booking.save()
    return redirect('dashboard')
