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
        context = super().get_context_data(**kwargs)
        context['services'] = Service.objects.all()
        return context

class AboutView(TemplateView):
    template_name = 'about.html'

class PaymentSuccessView(TemplateView):
    template_name = 'payments/success.html'

    def get(self, request, *args, **kwargs):
        from payments.models import Payment
        from bookings.models import Booking

        session_id = request.GET.get('session_id')
        booking_id = request.GET.get('booking_id')

        if session_id:
            try:
                payment = Payment.objects.get(stripe_session_id=session_id)
                if payment.status != Payment.Status.SUCCEEDED:
                    payment.status = Payment.Status.SUCCEEDED
                    payment.save()
                booking = payment.booking
                if booking.status != Booking.Status.CONFIRMED:
                    booking.status = Booking.Status.CONFIRMED
                    booking.save()  # Déclenche le signal d'envoi d'e-mail de confirmation
            except Payment.DoesNotExist:
                pass
        elif booking_id:
            try:
                booking = Booking.objects.get(id=booking_id)
                if booking.status != Booking.Status.CONFIRMED:
                    booking.status = Booking.Status.CONFIRMED
                    booking.save()  # Déclenche le signal d'envoi d'e-mail de confirmation
                payment, created = Payment.objects.get_or_create(
                    booking=booking,
                    defaults={'stripe_session_id': f'demo_{booking.id}', 'amount': booking.final_price, 'status': Payment.Status.SUCCEEDED}
                )
                if not created and payment.status != Payment.Status.SUCCEEDED:
                    payment.status = Payment.Status.SUCCEEDED
                    payment.save()
            except Booking.DoesNotExist:
                pass

        return super().get(request, *args, **kwargs)

class PaymentCancelledView(TemplateView):
    template_name = 'payments/cancelled.html'

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
            from django.core.mail import send_mail
            from django.conf import settings
            
            # Record in ContactMessage DB
            ContactMessage.objects.create(
                name="Abonné Newsletter",
                email=email,
                message="Inscription à la Newsletter Funkidz"
            )
            
            # Send notification email to admin
            subject = f"📩 Nouvelle inscription Newsletter Funkidz : {email}"
            email_body = f"""Bonjour,

Un nouvel abonné vient de s'inscrire à la Newsletter Funkidz :

Adresse E-mail : {email}

---
Cette inscription a été enregistrée dans la base de données.
"""
            try:
                send_mail(
                    subject=subject,
                    message=email_body,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=['sedraniainaeuphredat@gmail.com'],
                    fail_silently=True
                )
            except Exception:
                pass
            
            # Send welcome email to subscriber
            welcome_subject = "Bienvenue dans la communauté Funkidz ! 🎈"
            welcome_body = f"""Bonjour,

Merci pour votre inscription à la newsletter Funkidz !

Vous recevrez désormais nos meilleures idées d'animations, nos conseils pour organiser des fêtes inoubliables et nos offres exclusives.

À très bientôt sur Funkidz !
L'équipe Funkidz Animation
"""
            try:
                send_mail(
                    subject=welcome_subject,
                    message=welcome_body,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=True
                )
            except Exception:
                pass

            messages.success(request, "Merci pour votre inscription à notre newsletter ! Un e-mail de bienvenue vous a été envoyé.")
    return redirect(request.META.get('HTTP_REFERER', '/'))

