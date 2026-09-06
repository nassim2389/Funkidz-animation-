from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings

class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message de {self.name} ({self.email})"

    class Meta:
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"

from core.utils import get_admin_recipient_emails

@receiver(post_save, sender=ContactMessage)
def send_contact_notification(sender, instance, created, **kwargs):
    if created:
        subject = f"📩 Nouveau message de contact de {instance.name} - Funkidz"
        email_body = f"""Bonjour,

Un nouveau message de contact vient d'être envoyé depuis le site Funkidz :

Nom : {instance.name}
E-mail : {instance.email}
Téléphone : {instance.phone or 'Non renseigné'}

Message :
{instance.message}

---
Ce message a été enregistré dans le panneau d'administration Funkidz.
"""
        try:
            send_mail(
                subject=subject,
                message=email_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=get_admin_recipient_emails(),
                fail_silently=True
            )
        except Exception:
            pass

