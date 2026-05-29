from django.contrib import admin
from django.contrib import messages
from django.utils.html import format_html
import stripe
import os
from .models import Booking, BookingOption, BookingAssignment

class BookingOptionInline(admin.TabularInline):
    model = BookingOption
    extra = 1

class BookingAssignmentInline(admin.TabularInline):
    model = BookingAssignment
    extra = 1

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'service', 'booking_date', 'booking_time', 'status', 'final_price', 'payment_link_display')
    list_editable = ('status', 'final_price')
    list_filter = ('status', 'booking_date', 'service')
    search_fields = ('user__email', 'location_city')
    inlines = [BookingOptionInline, BookingAssignmentInline]
    actions = ['confirm_bookings', 'cancel_bookings', 'generate_payment_links']

    def confirm_bookings(self, request, queryset):
        rows_updated = queryset.update(status=Booking.Status.CONFIRMED)
        self.message_user(request, f"{rows_updated} réservation(s) confirmée(s) avec succès. ✅")
    confirm_bookings.short_description = "Confirmer les réservations sélectionnées"

    def cancel_bookings(self, request, queryset):
        rows_updated = queryset.update(status=Booking.Status.CANCELLED)
        self.message_user(request, f"{rows_updated} réservation(s) annulée(s). ❌")
    cancel_bookings.short_description = "Annuler les réservations sélectionnées"

    def generate_payment_links(self, request, queryset):
        stripe.api_key = os.getenv('STRIPE_API_KEY')
        success_count = 0
        for booking in queryset:
            try:
                checkout_session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    line_items=[
                        {
                            'price_data': {
                                'currency': 'eur',
                                'product_data': {
                                    'name': f"Animation Funkidz - {booking.service.name}",
                                },
                                'unit_amount': int(booking.final_price * 100),
                            },
                            'quantity': 1,
                        },
                    ],
                    mode='payment',
                    success_url=request.build_absolute_uri('/payment-success/') + '?session_id={CHECKOUT_SESSION_ID}',
                    cancel_url=request.build_absolute_uri('/payment-cancelled/'),
                    metadata={'booking_id': booking.id}
                )
                # Link is created, show to admin
                self.message_user(
                    request,
                    format_html(
                        "Lien généré pour la réservation #{}: <a href='{}' target='_blank'>Payer {}€ (Stripe)</a> 💳",
                        booking.id, checkout_session.url, booking.final_price
                    ),
                    level=messages.SUCCESS
                )
                success_count += 1
            except Exception as e:
                self.message_user(request, f"Erreur lors de la génération du lien pour #{booking.id}: {str(e)}", level=messages.ERROR)
        
        if success_count > 0:
            self.message_user(request, f"Génération terminée. {success_count} lien(s) Stripe créé(s).")
    generate_payment_links.short_description = "Générer & Envoyer lien de paiement Stripe"

    def payment_link_display(self, obj):
        return format_html(
            "<a class='button' href='/booking/' target='_blank' style='padding: 3px 10px; background: #4D96FF; color: white; border-radius: 4px; font-weight: bold;'>Simuler</a>"
        )
    payment_link_display.short_description = "Paiement"

@admin.register(BookingAssignment)
class BookingAssignmentAdmin(admin.ModelAdmin):
    list_display = ('booking', 'animateur', 'status', 'created_at')
    list_filter = ('status',)

