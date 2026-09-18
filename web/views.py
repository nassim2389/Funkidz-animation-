from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect
from django.contrib import messages
from services.models import Service
from media.models import MediaGallery
from contact.models import ContactMessage

class ServiceListWebView(TemplateView):
    template_name = 'services/list.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['services'] = Service.objects.all()
        return context

class HomeView(TemplateView):
    template_name = 'home.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['services'] = Service.objects.all()[:3]
        context['gallery_preview'] = MediaGallery.objects.all().order_by('order')[:6]
        return context

class BookingWizardView(LoginRequiredMixin, TemplateView):
    template_name = 'booking/wizard.html'
    login_url = '/auth/login/'

class GalleryView(TemplateView):
    template_name = 'gallery.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['gallery'] = MediaGallery.objects.all().order_by('order')
        return context

class PricingView(TemplateView):
    template_name = 'pricing.html'
    def get_context_data(self, **kwargs):
        from services.models import Option
        context = super().get_context_data(**kwargs)
        context['services'] = Service.objects.all()
        context['options'] = Option.objects.all()
        return context


class AboutView(TemplateView):
    template_name = 'about.html'

class PaymentPageView(LoginRequiredMixin, TemplateView):
    """
    Page de règlement par carte bancaire.

    Affiche le récapitulatif de la réservation puis le Payment Element officiel
    de Stripe : le numéro de carte, la date d'expiration et le CVC sont saisis
    dans les champs fournis par Stripe, jamais par un formulaire maison.
    """
    template_name = 'payments/checkout.html'
    login_url = '/auth/login/'

    def get_context_data(self, **kwargs):
        from django.conf import settings
        from django.shortcuts import get_object_or_404
        from bookings.models import Booking

        context = super().get_context_data(**kwargs)
        booking = get_object_or_404(
            Booking, id=kwargs.get('booking_id'), user=self.request.user
        )

        missing = []
        if not getattr(settings, 'STRIPE_API_KEY', ''):
            missing.append('STRIPE_API_KEY')
        if not getattr(settings, 'STRIPE_PUBLISHABLE_KEY', ''):
            missing.append('STRIPE_PUBLISHABLE_KEY')

        context['booking'] = booking
        context['stripe_enabled'] = getattr(settings, 'STRIPE_ENABLED', False)
        context['stripe_publishable_key'] = getattr(settings, 'STRIPE_PUBLISHABLE_KEY', '')
        context['missing_stripe_settings'] = missing
        context['already_paid'] = booking.payments.filter(status='SUCCEEDED').exists()
        return context


class PaymentSuccessView(TemplateView):
    """
    Page de résultat du paiement.

    Le règlement n'est jamais considéré comme abouti du simple fait d'arriver
    sur cette URL : l'état réel est demandé à Stripe (Checkout Session ou
    PaymentIntent) avant toute confirmation de la réservation.
    """
    template_name = 'payments/success.html'

    def get(self, request, *args, **kwargs):
        import logging
        import stripe
        from django.conf import settings
        from payments.models import Payment
        from bookings.models import Booking

        logger = logging.getLogger(__name__)

        session_id = request.GET.get('session_id')
        intent_id = request.GET.get('payment_intent')

        self.booking = None
        self.payment = None
        self.payment_confirmed = False
        self.payment_message = ""

        if not session_id and not intent_id:
            self.payment_message = (
                "Aucune référence de paiement n'a été transmise. "
                "Le règlement n'a pas pu être vérifié auprès de Stripe."
            )
            return super().get(request, *args, **kwargs)

        if not getattr(settings, 'STRIPE_API_KEY', ''):
            self.payment_message = (
                "La configuration Stripe est incomplète : le paiement ne peut pas "
                "être vérifié."
            )
            return super().get(request, *args, **kwargs)

        stripe.api_key = settings.STRIPE_API_KEY

        booking_id = None
        paid = False
        try:
            if session_id:
                session = stripe.checkout.Session.retrieve(session_id)
                paid = session.get('payment_status') == 'paid'
                booking_id = (session.get('metadata') or {}).get('booking_id')
                reference = session.get('payment_intent') or session_id
            else:
                intent = stripe.PaymentIntent.retrieve(intent_id)
                paid = intent.get('status') == 'succeeded'
                booking_id = (intent.get('metadata') or {}).get('booking_id')
                reference = intent_id
        except Exception as exc:
            logger.error(f"Vérification du paiement impossible auprès de Stripe : {exc}")
            self.payment_message = (
                "Le paiement n'a pas pu être vérifié auprès de Stripe. "
                "Votre réservation reste en attente de règlement."
            )
            return super().get(request, *args, **kwargs)

        payment = None
        if session_id:
            payment = Payment.objects.filter(stripe_session_id=session_id).first()
        if payment is None and intent_id:
            payment = Payment.objects.filter(stripe_payment_intent=intent_id).first()
        if payment is None and booking_id:
            payment = Payment.objects.filter(booking_id=booking_id).order_by('-created_at').first()

        booking = payment.booking if payment else None
        if booking is None and booking_id:
            booking = Booking.objects.filter(id=booking_id).first()

        if booking is None:
            self.payment_message = "Réservation introuvable pour ce paiement."
            return super().get(request, *args, **kwargs)

        if not paid:
            if payment and payment.status != Payment.Status.SUCCEEDED:
                payment.status = Payment.Status.FAILED
                payment.save(update_fields=['status', 'updated_at'])
            self.booking = booking
            self.payment = payment
            self.payment_message = (
                "Stripe n'a pas confirmé ce règlement. La réservation reste en "
                "attente de paiement."
            )
            return super().get(request, *args, **kwargs)

        # Paiement confirmé par Stripe
        if payment is None:
            payment = Payment.objects.create(
                booking=booking,
                stripe_session_id=session_id or reference,
                stripe_payment_intent=reference,
                amount=booking.final_price,
                status=Payment.Status.SUCCEEDED,
            )
        else:
            payment.stripe_payment_intent = reference
            payment.status = Payment.Status.SUCCEEDED
            payment.save()

        if booking.status != Booking.Status.CONFIRMED:
            booking.status = Booking.Status.CONFIRMED
            booking.cancelled_by = ''
            booking.save()  # Déclenche les e-mails de confirmation

        self.booking = booking
        self.payment = payment
        self.payment_confirmed = True
        return super().get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['booking'] = getattr(self, 'booking', None)
        context['payment'] = getattr(self, 'payment', None)
        context['payment_confirmed'] = getattr(self, 'payment_confirmed', False)
        context['payment_message'] = getattr(self, 'payment_message', '')
        # Conservé pour compatibilité avec le gabarit existant
        context['is_demo'] = False
        return context


class PaymentCancelledView(TemplateView):
    template_name = 'payments/cancelled.html'

    def get_context_data(self, **kwargs):
        from bookings.models import Booking
        context = super().get_context_data(**kwargs)
        booking_id = self.request.GET.get('booking_id')
        if booking_id:
            try:
                context['booking'] = Booking.objects.get(id=booking_id)
            except Booking.DoesNotExist:
                context['booking'] = None
        return context

class ContactView(TemplateView):
    template_name = 'contact.html'
    def post(self, request, *args, **kwargs):
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        message = request.POST.get('message')
        if name and email and message:
            ContactMessage.objects.create(name=name, email=email, phone=phone, message=message)
            messages.success(request, "Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.")
            return redirect('contact')
        messages.error(request, "Veuillez remplir tous les champs obligatoires du formulaire.")
        return self.get(request, *args, **kwargs)

class DashboardView(LoginRequiredMixin, TemplateView):
    def get(self, request, *args, **kwargs):
        user = request.user
        if user.role == 'ADMIN':
            return redirect('/admin/')
        elif user.role == 'ANIMATEUR':
            # Ensure AnimateurProfile exists
            from users.models import AnimateurProfile
            AnimateurProfile.objects.get_or_create(user=user)
            return render(request, 'dashboard/animateur.html', self.get_context_data())
        else:
            return render(request, 'dashboard/client.html', self.get_context_data())

    def get_context_data(self, **kwargs):
        from bookings.models import Booking
        context = super().get_context_data(**kwargs)
        user = self.request.user
        if user.role == 'CLIENT':
            context['bookings'] = Booking.objects.filter(user=user).order_by('-created_at')
        elif user.role == 'ANIMATEUR':
            from bookings.models import BookingAssignment
            from availability.models import Availability, WeeklySchedule, AnimateurLeave
            from users.models import AnimateurProfile
            
            profile = AnimateurProfile.objects.get(user=user)
            context['profile'] = profile
            context['assignments'] = BookingAssignment.objects.filter(animateur=profile).order_by('-created_at')
            context['blocked_slots'] = Availability.objects.filter(animateur=profile, is_blocked=True).order_by('date')
            context['weekly_schedules'] = WeeklySchedule.objects.filter(animateur=profile).order_by('weekday', 'start_time')
            context['leaves'] = AnimateurLeave.objects.filter(animateur=profile).order_by('-start_date')
            context['weekdays'] = WeeklySchedule.Weekday.choices
        return context

def newsletter_signup(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        if email:
            from contact.models import ContactMessage
            from core.emails import send_newsletter_welcome_email
            
            # Enregistrement en base de données
            ContactMessage.objects.create(
                name="Abonné Newsletter",
                email=email,
                message="Inscription à la Newsletter Funkidz"
            )
            
            # Envoi de l'e-mail de bienvenue responsive Funkidz
            send_newsletter_welcome_email(email)

            messages.success(request, "Merci pour votre inscription à notre newsletter ! Un e-mail de bienvenue vous a été envoyé.")
    return redirect(request.META.get('HTTP_REFERER', '/'))

