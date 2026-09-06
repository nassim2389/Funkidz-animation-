from django.contrib import admin
from .models import Availability, WeeklySchedule, AnimateurLeave

@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('animateur', 'date', 'start_time', 'end_time', 'is_blocked')
    list_filter = ('is_blocked', 'date')

@admin.register(WeeklySchedule)
class WeeklyScheduleAdmin(admin.ModelAdmin):
    list_display = ('animateur', 'weekday', 'start_time', 'end_time', 'is_active')
    list_filter = ('weekday', 'is_active')

@admin.register(AnimateurLeave)
class AnimateurLeaveAdmin(admin.ModelAdmin):
    list_display = ('animateur', 'start_date', 'end_date', 'reason', 'status')
    list_editable = ('status',)
    list_filter = ('status', 'start_date')
    search_fields = ('animateur__user__email', 'animateur__user__first_name', 'animateur__user__last_name', 'reason')
    actions = ['approve_leaves', 'reject_leaves']

    def approve_leaves(self, request, queryset):
        for leave in queryset:
            leave.status = AnimateurLeave.Status.APPROVED
            leave.save()
    approve_leaves.short_description = "Approuver les congés sélectionnés ✅"

    def reject_leaves(self, request, queryset):
        for leave in queryset:
            leave.status = AnimateurLeave.Status.REJECTED
            leave.save()
    reject_leaves.short_description = "Refuser les congés sélectionnés ❌"


