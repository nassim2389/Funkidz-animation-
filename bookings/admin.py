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

# Couleurs des pastilles de statut affichées dans la liste des réservations.
STATUS_BADGE_STYLES = {
    Booking.Status.CONFIRMED: ("#15803d", "#dcfce7", "#86efac", "🟢"),
    Booking.Status.PENDING:   ("#b45309", "#ffedd5", "#fdba74", "🟠"),
    Booking.Status.CANCELLED: ("#b91c1c", "#fee2e2", "#fca5a5", "🔴"),
    Booking.Status.DONE:      ("#334155", "#e2e8f0", "#cbd5e1", "⚪"),
}


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'status_badge', 'user', 'service', 'booking_date', 'booking_time', 'status', 'final_price', 'confirmation_email_sent_at', 'payment_link_display')
    list_display_links = ('id', 'status_badge', 'user', 'service', 'booking_date', 'booking_time')
    list_editable = ('status', 'final_price')
    list_filter = ('status', 'cancelled_by', 'booking_date', 'service')
    search_fields = ('user__email', 'location_city', 'child_name')
    readonly_fields = ('confirmation_email_sent_at', 'admin_notification_sent_at', 'cancellation_email_sent_at', 'created_at', 'updated_at')
    inlines = [BookingOptionInline, BookingAssignmentInline]
    actions = ['confirm_bookings', 'cancel_bookings', 'generate_payment_links']

    class Media:
        js = ('js/admin_booking_row_click.js',)

    # Tri chronologique par défaut (date puis heure) ; les deux colonnes
    # restent triables par un clic sur leur en-tête.
    ordering = ('booking_date', 'booking_time')
    date_hierarchy = 'booking_date'

    @admin.display(description="Statut", ordering='status')
    def status_badge(self, obj):
        """Pastille colorée reflétant le statut réel de la réservation."""
        color, background, border, dot = STATUS_BADGE_STYLES.get(
            obj.status, ("#334155", "#e2e8f0", "#cbd5e1", "⚪")
        )
        label = obj.get_status_display()
        if obj.status == Booking.Status.CANCELLED and obj.cancelled_by:
            label = f"{label} par {obj.get_cancelled_by_display().lower()}"
        return format_html(
            '<span style="display:inline-block; padding:3px 10px; border-radius:9999px;'
            ' background:{}; color:{}; border:1px solid {}; font-weight:700;'
            ' font-size:11px; white-space:nowrap;">{} {}</span>',
            background, color, border, dot, label
        )

    def save_model(self, request, obj, form, change):
        """
        Trace l'origine d'une annulation décidée depuis l'administration.
        Couvre aussi bien le formulaire complet que la liste éditable.
        """
        if obj.status == Booking.Status.CANCELLED:
            if not obj.cancelled_by:
                obj.cancelled_by = Booking.CancelledBy.ADMIN
        else:
            obj.cancelled_by = ''
        super().save_model(request, obj, form, change)

    def confirm_bookings(self, request, queryset):
        count = 0
        for b in queryset:
            if b.status != Booking.Status.CONFIRMED:
                b.status = Booking.Status.CONFIRMED
                b.cancelled_by = ''
                b.save()
                count += 1
        self.message_user(request, f"{count} réservation(s) confirmée(s) et e-mails de confirmation envoyés. ✅")
    confirm_bookings.short_description = "Confirmer les réservations sélectionnées (déclenche e-mails)"

    def cancel_bookings(self, request, queryset):
        count = 0
        for b in queryset:
            if b.status != Booking.Status.CANCELLED:
                b.status = Booking.Status.CANCELLED
                b.cancelled_by = Booking.CancelledBy.ADMIN
                b.save()
                count += 1
        self.message_user(request, f"{count} réservation(s) annulée(s) et e-mails envoyés. ❌")
    cancel_bookings.short_description = "Annuler les réservations sélectionnées (déclenche e-mails)"

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
        """Lien vers la page de règlement par carte de la réservation."""
        url = f"/paiement/{obj.id}/"
        return format_html(
            '<a class="button" href="{}" target="_blank" style="padding: 4px 12px; background: #4F46E5; color: white; border-radius: 6px; font-weight: bold; text-decoration: none;">Page de paiement 💳</a>',
            url
        )
    payment_link_display.short_description = "Paiement"

@admin.register(BookingAssignment)
class BookingAssignmentAdmin(admin.ModelAdmin):
    list_display = ('booking', 'animateur', 'status', 'created_at')
    list_filter = ('status',)

