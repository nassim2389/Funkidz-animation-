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
    list_display = ('animateur', 'start_date', 'end_date', 'status')
    list_filter = ('status',)
    actions = ['approve_leaves', 'reject_leaves']

    def approve_leaves(self, request, queryset):
        queryset.update(status=AnimateurLeave.Status.APPROVED)
    approve_leaves.short_description = "Approuver les congés sélectionnés"

    def reject_leaves(self, request, queryset):
        queryset.update(status=AnimateurLeave.Status.REJECTED)
    reject_leaves.short_description = "Refuser les congés sélectionnés"

