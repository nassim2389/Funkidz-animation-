import logging
from datetime import datetime
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string, TemplateDoesNotExist
from django.utils.html import strip_tags
from core.utils import get_admin_recipient_emails

logger = logging.getLogger(__name__)


def send_templated_email(subject, template_name, context, recipient_list, from_email=None, fail_silently=False):
    """
    Envoie un e-mail transactionnel multipart (HTML responsive + Texte brut de secours).
    - Capture et journalise les erreurs SMTP sans interrompre le flux applicatif.
    - Évite l'exposition de credentials ou de traces sensibles.
    - Enrichit automatiquement le contexte avec les constantes de marque et liens de base.
    """
    if not recipient_list:
        logger.warning(f"Tentative d'envoi d'email avec une liste de destinataires vide (Sujet: {subject})")
        return False

    # Filtrage des adresses valides
    valid_recipients = [r.strip() for r in recipient_list if r and '@' in str(r)]
    if not valid_recipients:
        logger.warning(f"Aucune adresse e-mail valide dans recipient_list: {recipient_list}")
        return False

    site_url = getattr(settings, 'SITE_URL', 'http://127.0.0.1:8000').rstrip('/')
    enriched_context = {
        'site_url': site_url,
        'brand_name': "Funkidz Animation",
        'brand_slogan': "Des fêtes d'anniversaire magiques et inoubliables 🎈",
        'support_email': "contact@funkidz.fr",
        'support_phone': "01 23 45 67 89",
        'current_year': datetime.now().year,
        'subject': subject,
        **context
    }

    # 1. Rendu HTML
    html_template_path = f"emails/{template_name}.html"
    try:
        html_content = render_to_string(html_template_path, enriched_context)
    except TemplateDoesNotExist:
        logger.error(f"Template HTML d'email introuvable: {html_template_path}")
        html_content = None
    except Exception as e:
        logger.error(f"Erreur lors du rendu du template HTML {html_template_path}: {e}")
        html_content = None

    # 2. Rendu Texte Brut
    txt_template_path = f"emails/{template_name}.txt"
    try:
        text_content = render_to_string(txt_template_path, enriched_context)
    except TemplateDoesNotExist:
        if html_content:
            text_content = strip_tags(html_content)
        else:
            text_content = context.get('fallback_text', subject)
    except Exception:
        text_content = strip_tags(html_content) if html_content else subject

    sender = from_email or getattr(settings, 'DEFAULT_FROM_EMAIL', 'Funkidz Animation <contact@funkidz.fr>')

    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=sender,
            to=valid_recipients
        )
        if html_content:
            msg.attach_alternative(html_content, "text/html")

        # Envoi effectif
        msg.send(fail_silently=fail_silently)
        logger.info(f"✅ E-mail envoyé avec succès à {valid_recipients} — Sujet: '{subject}' [Template: {template_name}]")
        return True
    except Exception as e:
        logger.error(f"❌ Erreur lors de l'envoi d'e-mail à {valid_recipients} (Sujet: '{subject}'): {e}")
        if not fail_silently and settings.DEBUG and getattr(settings, 'RAISE_EMAIL_EXCEPTIONS', False):
            raise
        return False


def _build_booking_decomposed_context(booking):
    """Construit les données complètes et décomposées d'une réservation pour les templates."""
    selected_options = []
    for b_opt in booking.selected_options.select_related('option').all():
        opt = b_opt.option
        selected_options.append({
            'name': opt.name,
            'quantity': b_opt.quantity,
            'unit_price': float(b_opt.price_at_time),
            'total_price': float(b_opt.total_price),
            'pricing_type': opt.get_pricing_type_display(),
        })

    client_name = f"{booking.user.first_name} {booking.user.last_name}".strip() or booking.user.email

    site_url = getattr(settings, 'SITE_URL', 'http://127.0.0.1:8000').rstrip('/')
    dashboard_url = f"{site_url}/dashboard/"
    admin_booking_url = f"{site_url}/admin/bookings/booking/{booking.id}/change/"

    return {
        'booking': booking,
        'client_name': client_name,
        'client_email': booking.user.email,
        'service_name': booking.service.name,
        'service_duration': booking.service.duration_minutes,
        'service_base_price': float(booking.service.base_price),
        'booking_date': booking.booking_date,
        'booking_time': booking.booking_time.strftime('%H:%M') if hasattr(booking.booking_time, 'strftime') else str(booking.booking_time),
        'nb_children': booking.nb_children,
        'child_name': booking.child_name or '',
        'child_age': booking.child_age or '',
        'contact_phone': booking.contact_phone or '',
        'location_address': booking.location_address,
        'location_zip': booking.location_zip,
        'location_city': booking.location_city,
        'special_instructions': booking.special_instructions or '',
        'final_price': float(booking.final_price),
        'status_label': booking.get_status_display(),
        'selected_options': selected_options,
        'has_options': len(selected_options) > 0,
        'dashboard_url': dashboard_url,
        'admin_booking_url': admin_booking_url,
    }


def send_booking_confirmation_client(booking):
    """E-mail de confirmation détaillé envoyé au client après paiement validé."""
    context = _build_booking_decomposed_context(booking)
    subject = f"🎉 Confirmation de votre réservation Funkidz #{booking.id} — C'est la fête !"
    return send_templated_email(
        subject=subject,
        template_name="booking_confirmation_client",
        context=context,
        recipient_list=[booking.user.email],
        fail_silently=True
    )


def send_booking_admin_notification(booking, event_type='new_booking'):
    """Notification administrateur lors d'une nouvelle réservation ou d'un paiement validé."""
    context = _build_booking_decomposed_context(booking)
    context['event_type'] = event_type
    recipients = get_admin_recipient_emails()

    if event_type == 'new_booking':
        subject = f"🔔 Nouvelle réservation #{booking.id} initiée par {context['client_name']}"
        template_name = "admin_booking_new"
    else:
        subject = f"✅ PAIEMENT CONFIRMÉ #{booking.id} — {booking.final_price}€ ({booking.service.name})"
        template_name = "admin_payment_confirmed"

    return send_templated_email(
        subject=subject,
        template_name=template_name,
        context=context,
        recipient_list=recipients,
        fail_silently=True
    )


def send_booking_cancellation_emails(booking):
    """E-mails d'annulation envoyés au client et aux administrateurs."""
    context = _build_booking_decomposed_context(booking)

    # Email Client
    client_subject = f"Annulation de votre réservation Funkidz #{booking.id} ❌"
    send_templated_email(
        subject=client_subject,
        template_name="booking_cancelled_client",
        context=context,
        recipient_list=[booking.user.email],
        fail_silently=True
    )

    # Email Admin
    admin_subject = f"⚠️ Annulation de la réservation #{booking.id} — {context['client_name']}"
    return send_templated_email(
        subject=admin_subject,
        template_name="admin_booking_cancelled",
        context=context,
        recipient_list=get_admin_recipient_emails(),
        fail_silently=True
    )


def send_animateur_mission_notification(assignment):
    """Notification envoyée à l'animateur lorsqu'une mission lui est attribuée."""
    booking = assignment.booking
    context = _build_booking_decomposed_context(booking)
    animateur_user = assignment.animateur.user
    context['animateur_name'] = animateur_user.first_name or animateur_user.get_full_name() or "Super Animateur"
    context['assignment'] = assignment

    subject = f"🎯 Nouvelle mission d'animation #{booking.id} attribuée — Funkidz"
    return send_templated_email(
        subject=subject,
        template_name="animateur_assignment",
        context=context,
        recipient_list=[animateur_user.email],
        fail_silently=True
    )


def send_payment_failed_notification(booking, error_message=None):
    """Alerte envoyée au client en cas d'échec de paiement sans crash applicatif."""
    context = _build_booking_decomposed_context(booking)
    context['error_message'] = error_message or "La transaction bancaire a été déclinée."
    subject = f"Information concernant le règlement de votre réservation Funkidz #{booking.id} ⚠️"
    return send_templated_email(
        subject=subject,
        template_name="payment_failed_client",
        context=context,
        recipient_list=[booking.user.email],
        fail_silently=True
    )


def send_contact_emails(contact_message):
    """Envoi de la notification admin et de l'accusé de réception client pour le formulaire de contact."""
    site_url = getattr(settings, 'SITE_URL', 'http://127.0.0.1:8000').rstrip('/')
    context = {
        'contact': contact_message,
        'admin_contact_url': f"{site_url}/admin/contact/contactmessage/{contact_message.id}/change/",
    }

    # 1. Notification Admin
    admin_subject = f"📩 Nouveau message de contact de {contact_message.name} — Funkidz"
    send_templated_email(
        subject=admin_subject,
        template_name="contact_admin_notification",
        context=context,
        recipient_list=get_admin_recipient_emails(),
        fail_silently=True
    )

    # 2. Accusé de réception au client
    if contact_message.email and '@' in contact_message.email:
        client_subject = "Nous avons bien reçu votre message — Funkidz Animation 🎈"
        send_templated_email(
            subject=client_subject,
            template_name="contact_acknowledgement_client",
            context=context,
            recipient_list=[contact_message.email],
            fail_silently=True
        )


def send_newsletter_welcome_email(email):
    """E-mail de bienvenue à l'abonné newsletter."""
    context = {'subscriber_email': email}
    subject = "Bienvenue dans la communauté Funkidz ! 🎈"
    return send_templated_email(
        subject=subject,
        template_name="newsletter_welcome_client",
        context=context,
        recipient_list=[email],
        fail_silently=True
    )
