from django.contrib import admin
from .models import Booking, BookingOption, BookingAssignment

class BookingOptionInline(admin.TabularInline):
    model = BookingOption
    extra = 1

class BookingAssignmentInline(admin.TabularInline):
    model = BookingAssignment
    extra = 1

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'service', 'booking_date', 'status', 'final_price')
    list_filter = ('status', 'booking_date', 'service')
    search_fields = ('user__email', 'location_city')
    inlines = [BookingOptionInline, BookingAssignmentInline]

@admin.register(BookingAssignment)
class BookingAssignmentAdmin(admin.ModelAdmin):
    list_display = ('booking', 'animateur', 'status', 'created_at')
    list_filter = ('status',)
