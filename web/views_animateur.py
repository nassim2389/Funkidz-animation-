from django.shortcuts import redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from bookings.models import BookingAssignment

@login_required
def accept_assignment(request, assignment_id):
    assignment = get_object_or_404(BookingAssignment, id=assignment_id, animateur__user=request.user)
    assignment.status = 'ACCEPTED'
    assignment.save()
    return redirect('dashboard')

@login_required
def refuse_assignment(request, assignment_id):
    assignment = get_object_or_404(BookingAssignment, id=assignment_id, animateur__user=request.user)
    assignment.status = 'REFUSED'
    assignment.save()
    return redirect('dashboard')

@login_required
def complete_mission(request, booking_id):
    # Check if animateur is assigned to this booking
    assignment = get_object_or_404(BookingAssignment, booking_id=booking_id, animateur__user=request.user, status='ACCEPTED')
    booking = assignment.booking
    booking.status = 'DONE'
    booking.save()
    return redirect('dashboard')
