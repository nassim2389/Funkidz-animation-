from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'booking', 'stripe_session_id', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('stripe_session_id', 'booking__user__email')
