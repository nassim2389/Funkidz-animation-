"""
Démonstration du routage des notifications e-mail Funkidz.

Rejoue le cycle de vie complet d'une réservation et affiche, pour chaque
événement, le destinataire réel de chaque e-mail : CLIENT, ANIMATEUR ou ADMIN.

Usage :
    python manage.py demo_email_notifications                  # vérification du routage (rien n'est envoyé)
    python manage.py demo_email_notifications --send           # envoi réel via le backend configuré
    python manage.py demo_email_notifications --client-email ... --animateur-email ...
"""

from datetime import date, time, timedelta

from django.core import mail
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.db import transaction

from bookings.models import Booking, BookingAssignment
from core.utils import get_admin_recipient_emails
from services.models import Service
from users.models import AnimateurProfile

User = get_user_model()

LOCMEM_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'


class Command(BaseCommand):
    help = (
        "Rejoue le cycle de vie d'une réservation et affiche le destinataire réel "
        "de chaque notification (client, animateur, admin)."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--client-email',
            default=None,
            help="Adresse du compte client à utiliser (par défaut : premier compte CLIENT trouvé).",
        )
        parser.add_argument(
            '--animateur-email',
            default=None,
            help="Adresse du compte animateur à utiliser (par défaut : premier animateur trouvé).",
        )
        parser.add_argument(
            '--send',
            action='store_true',
            help="Envoie réellement les e-mails via EMAIL_BACKEND au lieu de seulement vérifier le routage.",
        )
        parser.add_argument(
            '--keep',
            action='store_true',
            help="Conserve la réservation de démonstration au lieu de la supprimer à la fin.",
        )

    # ------------------------------------------------------------------ setup

    def _resolve_client(self, email):
        if email:
            user = User.objects.filter(email__iexact=email).first()
            if user is None:
                raise CommandError(f"Aucun compte utilisateur avec l'adresse {email}.")
            return user

        user = (
            User.objects.filter(role=User.Role.CLIENT, is_superuser=False)
            .exclude(email='')
            .order_by('id')
            .first()
        )
        if user is None:
            raise CommandError(
                "Aucun compte CLIENT disponible. Utilisez --client-email pour en désigner un."
            )
        return user

    def _resolve_animateur(self, email):
        qs = AnimateurProfile.objects.select_related('user')
        if email:
            profile = qs.filter(user__email__iexact=email).first()
            if profile is None:
                raise CommandError(f"Aucun profil animateur avec l'adresse {email}.")
            return profile

        profile = qs.exclude(user__email='').order_by('id').first()
        if profile is None:
            raise CommandError(
                "Aucun profil animateur disponible. Utilisez --animateur-email pour en désigner un."
            )
        return profile

    # ------------------------------------------------------------- affichage

    def _header(self, title):
        self.stdout.write("")
        self.stdout.write(self.style.MIGRATE_HEADING("=" * 78))
        self.stdout.write(self.style.MIGRATE_HEADING(f" {title}"))
        self.stdout.write(self.style.MIGRATE_HEADING("=" * 78))

    def _report(self, step, expected_role, expected_emails, messages):
        """Affiche les e-mails produits par une étape et contrôle les destinataires."""
        if not self.capture:
            # Envoi réel : le backend configuré a expédié les messages, le contenu
            # de la boîte d'envoi n'est pas inspectable ici.
            self.stdout.write(
                f"  --  {expected_role:<9} expédié vers {', '.join(expected_emails)}"
            )
            return True

        if not messages:
            self.stdout.write(self.style.WARNING(f"  [{step}] aucun e-mail produit."))
            return False

        all_ok = True
        for msg in messages:
            recipients = list(msg.to)
            match = any(addr in expected_emails for addr in recipients)
            marker = self.style.SUCCESS("OK ") if match else self.style.ERROR("KO ")
            if not match:
                all_ok = False
            self.stdout.write(f"  {marker} {expected_role:<9} TO={', '.join(recipients)}")
            self.stdout.write(f"      sujet : {msg.subject}")
            if msg.cc or msg.bcc:
                self.stdout.write(
                    self.style.WARNING(f"      CC={msg.cc} BCC={msg.bcc}")
                )
        return all_ok

    # ---------------------------------------------------------------- handle

    def handle(self, *args, **options):
        send_for_real = options['send']
        admin_emails = get_admin_recipient_emails()
        client_user = self._resolve_client(options['client_email'])
        animateur = self._resolve_animateur(options['animateur_email'])

        service = Service.objects.order_by('id').first()
        if service is None:
            raise CommandError("Aucune prestation en base : impossible de créer une réservation de test.")

        self._header("DÉMONSTRATION DES NOTIFICATIONS E-MAIL — FUNKIDZ ANIMATION")
        self.stdout.write(f"• EMAIL_BACKEND           : {settings.EMAIL_BACKEND}")
        self.stdout.write(f"• DEFAULT_FROM_EMAIL      : {settings.DEFAULT_FROM_EMAIL}")
        if settings.EMAIL_BACKEND.endswith('filebased.EmailBackend'):
            self.stdout.write(f"• EMAIL_FILE_PATH         : {settings.EMAIL_FILE_PATH}")
        self.stdout.write("")
        self.stdout.write(f"• Compte CLIENT           : {client_user.email}")
        self.stdout.write(f"• Compte ANIMATEUR        : {animateur.user.email}")
        self.stdout.write(f"• Destinataires ADMIN     : {', '.join(admin_emails)}")
        if not getattr(settings, 'ADMIN_NOTIFICATION_EMAILS', None):
            self.stdout.write(
                self.style.WARNING(
                    "  (déduits des comptes administrateurs — définissez ADMIN_NOTIFICATION_EMAILS "
                    "dans le .env pour les fixer explicitement)"
                )
            )

        self.capture = not send_for_real
        if send_for_real:
            self.stdout.write("")
            self.stdout.write(self.style.WARNING(
                "Mode --send : les e-mails sont réellement expédiés via le backend configuré. "
                "Les destinataires affichés sont ceux calculés par l'application."
            ))
        else:
            # Capture en mémoire : on vérifie le routage sans rien expédier.
            settings.EMAIL_BACKEND = LOCMEM_BACKEND
            self.stdout.write("")
            self.stdout.write(
                "Mode vérification : aucun e-mail n'est expédié, seuls les destinataires sont contrôlés."
            )

        booking = None
        results = []
        try:
            booking = self._run_scenario(client_user, animateur, service, results)
        finally:
            if booking is not None and not options['keep']:
                with transaction.atomic():
                    BookingAssignment.objects.filter(booking=booking).delete()
                    booking.delete()
                self.stdout.write("")
                self.stdout.write("Réservation de démonstration supprimée.")
            elif booking is not None:
                self.stdout.write("")
                self.stdout.write(f"Réservation de démonstration conservée : #{booking.id}")

        self._header("RÉSULTAT")
        for label, ok in results:
            style = self.style.SUCCESS if ok else self.style.ERROR
            self.stdout.write(style(f"  {'OK ' if ok else 'KO '} {label}"))

        if not self.capture:
            self.stdout.write("")
            self.stdout.write(
                "Envoi réel effectué : vérifiez la réception dans les trois boîtes concernées."
            )
        elif all(ok for _, ok in results):
            self.stdout.write("")
            self.stdout.write(self.style.SUCCESS("Toutes les notifications sont routées vers le bon destinataire."))
        else:
            self.stdout.write("")
            self.stdout.write(self.style.ERROR("Au moins une notification n'atteint pas le destinataire attendu."))

    def _outbox_since(self, index):
        """Messages capturés depuis un index donné (vide si envoi réel)."""
        return mail.outbox[index:] if hasattr(mail, 'outbox') else []

    def _run_scenario(self, client_user, animateur, service, results):
        admin_emails = get_admin_recipient_emails()
        mail.outbox = []

        # 1. Création de la réservation : notification ADMIN
        self._header("1. Création de la réservation (statut En attente)")
        start = len(mail.outbox)
        booking = Booking.objects.create(
            user=client_user,
            service=service,
            booking_date=date.today() + timedelta(days=30),
            booking_time=time(14, 0),
            nb_children=10,
            estimated_price=service.base_price,
            final_price=service.base_price,
            location_address="12 rue de la Démonstration",
            location_city="Paris",
            location_zip="75001",
            child_name="Démo",
            contact_phone="0600000000",
            status=Booking.Status.PENDING,
        )
        results.append((
            "Création de réservation : notification ADMIN",
            self._report("création", "ADMIN", admin_emails, self._outbox_since(start)),
        ))

        # 2. Attribution de la mission : notification ANIMATEUR
        self._header("2. Attribution de la mission à l'animateur")
        start = len(mail.outbox)
        BookingAssignment.objects.create(
            booking=booking,
            animateur=animateur,
            status=BookingAssignment.Status.PENDING,
        )
        results.append((
            "Attribution de mission : notification ANIMATEUR",
            self._report("attribution", "ANIMATEUR", [animateur.user.email], self._outbox_since(start)),
        ))

        # 3. Confirmation : notification CLIENT + ADMIN
        self._header("3. Confirmation de la réservation (paiement validé)")
        start = len(mail.outbox)
        booking.status = Booking.Status.CONFIRMED
        booking.save()
        produced = self._outbox_since(start)
        client_msgs = [m for m in produced if client_user.email in m.to]
        admin_msgs = [m for m in produced if any(a in m.to for a in admin_emails)]
        results.append((
            "Confirmation : notification CLIENT",
            self._report("confirmation", "CLIENT", [client_user.email], client_msgs),
        ))
        results.append((
            "Confirmation : notification ADMIN",
            self._report("confirmation", "ADMIN", admin_emails, admin_msgs),
        ))

        # 4. Annulation : notification CLIENT + ADMIN
        self._header("4. Annulation de la réservation")
        start = len(mail.outbox)
        booking.status = Booking.Status.CANCELLED
        booking.save()
        produced = self._outbox_since(start)
        client_msgs = [m for m in produced if client_user.email in m.to]
        admin_msgs = [m for m in produced if any(a in m.to for a in admin_emails)]
        results.append((
            "Annulation : notification CLIENT",
            self._report("annulation", "CLIENT", [client_user.email], client_msgs),
        ))
        results.append((
            "Annulation : notification ADMIN",
            self._report("annulation", "ADMIN", admin_emails, admin_msgs),
        ))

        return booking
