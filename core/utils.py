import re
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Q

def get_admin_recipient_emails():
    """
    Récupère la liste des adresses email destinataires des notifications
    administratives.

    Ordre de priorité :
    1. ADMIN_NOTIFICATION_EMAILS (variable d'environnement) : si elle est
       renseignée, elle fait foi. C'est le réglage à utiliser pour diriger les
       notifications admin vers une boîte de test précise, sans toucher au code.
    2. Sinon : l'adresse extraite de DEFAULT_FROM_EMAIL, complétée par les
       adresses des comptes ayant le rôle ADMIN ou is_superuser=True.
    """
    configured = getattr(settings, 'ADMIN_NOTIFICATION_EMAILS', None)
    if configured:
        return list(configured)

    emails = set()

    # 1. Extraction depuis DEFAULT_FROM_EMAIL
    default_from = getattr(settings, 'DEFAULT_FROM_EMAIL', '')
    match = re.search(r'[\w\.-]+@[\w\.-]+', default_from)
    if match:
        emails.add(match.group(0))
    elif default_from and '@' in default_from:
        emails.add(default_from.strip())

    # 2. Ajout des emails des utilisateurs ayant le rôle ADMIN ou is_superuser=True
    try:
        User = get_user_model()
        admin_emails = User.objects.filter(
            Q(role='ADMIN') | Q(is_superuser=True)
        ).values_list('email', flat=True)
        for email in admin_emails:
            if email and '@' in email:
                emails.add(email)
    except Exception:
        pass

    if not emails:
        emails.add('admin@funkidz.fr')

    return list(emails)
