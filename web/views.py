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

