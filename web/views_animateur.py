from django.shortcuts import redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from bookings.models import BookingAssignment
from availability.models import Availability, WeeklySchedule, AnimateurLeave
from users.models import AnimateurProfile

@login_required
def accept_assignment(request, assignment_id):
    assignment = get_object_or_404(BookingAssignment, id=assignment_id, animateur__user=request.user)
    assignment.status = 'ACCEPTED'
    assignment.save()
    messages.success(request, "Vous avez accepté la mission ! 🎉")
    return redirect('dashboard')

@login_required
def refuse_assignment(request, assignment_id):
    assignment = get_object_or_404(BookingAssignment, id=assignment_id, animateur__user=request.user)
    assignment.status = 'REFUSED'
    assignment.save()
    messages.warning(request, "Vous avez refusé la mission.")
    return redirect('dashboard')

@login_required
def complete_mission(request, booking_id):
    # Check if animateur is assigned to this booking
    assignment = get_object_or_404(BookingAssignment, booking_id=booking_id, animateur__user=request.user, status='ACCEPTED')
    booking = assignment.booking
    booking.status = 'DONE'
    booking.save()
    messages.success(request, "Mission marquée comme terminée ! Félicitations ! 🌟")
    return redirect('dashboard')

@login_required
def block_date(request):
    if request.user.role != 'ANIMATEUR':
        return redirect('home')
    
    if request.method == 'POST':
        date_str = request.POST.get('date')
        if date_str:
            profile = get_object_or_404(AnimateurProfile, user=request.user)
            # Avoid duplicate blocking
            Availability.objects.get_or_create(
                animateur=profile,
                date=date_str,
                defaults={'start_time': '00:00:00', 'end_time': '23:59:59', 'is_blocked': True}
            )
            messages.success(request, "Date bloquée avec succès. 🚫")
        else:
            messages.error(request, "Veuillez sélectionner une date valide.")
            
    return redirect('dashboard')

@login_required
def unblock_slot(request, slot_id):
    if request.user.role != 'ANIMATEUR':
        return redirect('home')
        
    profile = get_object_or_404(AnimateurProfile, user=request.user)
    slot = get_object_or_404(Availability, id=slot_id, animateur=profile)
    slot.delete()
    messages.success(request, "Créneau débloqué avec succès. ✅")
    return redirect('dashboard')

@login_required
def add_weekly_schedule(request):
    if request.user.role != 'ANIMATEUR':
        return redirect('home')
        
    if request.method == 'POST':
        weekday = request.POST.get('weekday')
        start_time = request.POST.get('start_time')
        end_time = request.POST.get('end_time')
        
        if weekday is not None and start_time and end_time:
            profile = get_object_or_404(AnimateurProfile, user=request.user)
            try:
                WeeklySchedule.objects.create(
                    animateur=profile,
                    weekday=int(weekday),
                    start_time=start_time,
                    end_time=end_time
                )
                messages.success(request, "Horaire récurrent ajouté ! 📅")
            except Exception as e:
                messages.error(request, "Erreur: cet horaire récurrent existe déjà ou est invalide.")
        else:
            messages.error(request, "Veuillez remplir tous les champs.")
            
    return redirect('dashboard')

@login_required
def delete_weekly_schedule(request, schedule_id):
    if request.user.role != 'ANIMATEUR':
        return redirect('home')
        
    profile = get_object_or_404(AnimateurProfile, user=request.user)
    schedule = get_object_or_404(WeeklySchedule, id=schedule_id, animateur=profile)
    schedule.delete()
    messages.success(request, "Horaire récurrent supprimé. ✅")
    return redirect('dashboard')

@login_required
def declare_leave(request):
    if request.user.role != 'ANIMATEUR':
        return redirect('home')
        
    if request.method == 'POST':
        start_date = request.POST.get('start_date')
        end_date = request.POST.get('end_date')
        reason = request.POST.get('reason', '')
        
        if start_date and end_date:
            profile = get_object_or_404(AnimateurProfile, user=request.user)
            if start_date > end_date:
                messages.error(request, "La date de début doit être antérieure à la date de fin.")
            else:
                AnimateurLeave.objects.create(
                    animateur=profile,
                    start_date=start_date,
                    end_date=end_date,
                    reason=reason
                )
                messages.success(request, "Votre demande de congé a été enregistrée et est en attente de validation. ✈️")
        else:
            messages.error(request, "Veuillez spécifier les dates de début et de fin.")
            
    return redirect('dashboard')

@login_required
def cancel_leave(request, leave_id):
    if request.user.role != 'ANIMATEUR':
        return redirect('home')
        
    profile = get_object_or_404(AnimateurProfile, user=request.user)
    leave = get_object_or_404(AnimateurLeave, id=leave_id, animateur=profile)
    if leave.status == 'PENDING':
        leave.delete()
        messages.success(request, "Demande de congé annulée. ✅")
    else:
        messages.error(request, "Vous ne pouvez pas annuler un congé déjà validé ou refusé.")
        
    return redirect('dashboard')

