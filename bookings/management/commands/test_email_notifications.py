import sys
import socket
from datetime import date, time
from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.mail import get_connection
from django.contrib.auth import get_user_model
from core.emails import send_templated_email, send_booking_confirmation_client
from bookings.models import Booking
from services.models import Service


class Command(BaseCommand):
    help = "Vérifie la configuration SMTP et teste l'envoi réel d'un e-mail transactionnel Funkidz."

    def add_arguments(self, parser):
        parser.add_argument(
            '--recipient',
            type=str,
            help="Adresse email destinataire pour le test (par défaut: EMAIL_HOST_USER ou admin)",
            default=None
        )
        parser.add_argument(
            '--booking-id',
            type=int,
            help="ID d'une réservation existante pour tester l'email de confirmation réel",
            default=None
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("\n" + "=" * 65))
        self.stdout.write(self.style.MIGRATE_HEADING(" 🎈 DIAGNOSTIC & TEST D'ENVOI E-MAIL RÉEL — FUNKIDZ ANIMATION"))
        self.stdout.write(self.style.MIGRATE_HEADING("=" * 65 + "\n"))

        # 1. Affichage de la configuration (sans divulguer de mot de passe)
        backend = getattr(settings, 'EMAIL_BACKEND', 'Non défini')
        host = getattr(settings, 'EMAIL_HOST', 'localhost')
        port = getattr(settings, 'EMAIL_PORT', 587)
        use_tls = getattr(settings, 'EMAIL_USE_TLS', False)
        use_ssl = getattr(settings, 'EMAIL_USE_SSL', False)
        user = getattr(settings, 'EMAIL_HOST_USER', '')
        has_pwd = bool(getattr(settings, 'EMAIL_HOST_PASSWORD', ''))
        sender = getattr(settings, 'DEFAULT_FROM_EMAIL', '')

        self.stdout.write(f"• EMAIL_BACKEND      : {backend}")
        self.stdout.write(f"• EMAIL_HOST         : {host}")
        self.stdout.write(f"• EMAIL_PORT         : {port}")
        self.stdout.write(f"• TLS / SSL          : TLS={use_tls} / SSL={use_ssl}")
        self.stdout.write(f"• EMAIL_HOST_USER    : {user or '(non renseigné)'}")
        self.stdout.write(f"• EMAIL_HOST_PASSWORD: {'****** (configuré)' if has_pwd else '(non renseigné)'}")
        self.stdout.write(f"• DEFAULT_FROM_EMAIL : {sender}")
        self.stdout.write("-" * 65)

        # 2. Test de connectivité réseau (Socket) si SMTP
        if 'smtp' in backend.lower():
            self.stdout.write("1. Test de connectivité réseau (Socket)... ", ending="")
            try:
                sock = socket.create_connection((host, int(port)), timeout=5)
                sock.close()
                self.stdout.write(self.style.SUCCESS("OK (Hôte joignable)"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"ÉCHEC ({e})"))
                self.stdout.write(self.style.WARNING("Vérifiez votre connexion internet ou les paramètres de pare-feu."))

        # 3. Test de connexion SMTP Django
        self.stdout.write("2. Test de connexion & authentification SMTP... ", ending="")
        try:
            connection = get_connection()
            connection.open()
            connection.close()
            self.stdout.write(self.style.SUCCESS("OK (Connexion réussie)"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"ÉCHEC ({e})"))

        # 4. Détermination du destinataire de test
        target_email = options['recipient']
        if not target_email:
            target_email = user if (user and '@' in user) else 'client-test@funkidz.fr'

        # 5. Envoi effectif
        booking_id = options.get('booking_id')
        if booking_id:
            try:
                booking = Booking.objects.get(id=booking_id)
                self.stdout.write(f"3. Envoi de l'e-mail de confirmation réel pour la réservation #{booking.id} vers {booking.user.email}...")
                success = send_booking_confirmation_client(booking)
            except Booking.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Réservation #{booking_id} introuvable."))
                return
        else:
            self.stdout.write(f"3. Envoi d'un e-mail de test transactionnel vers {target_email}...")
            context = {
                'client_name': "Client Démonstration Localhost",
                'client_email': target_email,
                'service_name': "Formule Magie & Ballons",
                'service_duration': 120,
                'service_base_price': 220.0,
                'booking_date': date.today(),
                'booking_time': "14:30",
                'nb_children': 12,
                'child_name': "Lucas",
                'child_age': 7,
                'contact_phone': "06 12 34 56 78",
                'location_address': "15 rue des Étoiles",
                'location_zip': "75011",
                'location_city': "Paris",
                'special_instructions': "Présence d'un grand salon pour les tours de magie.",
                'final_price': 255.0,
                'status_label': "Confirmée",
                'selected_options': [
                    {'name': "Machine à Barbe à Papa", 'quantity': 1, 'unit_price': 35.0, 'total_price': 35.0, 'pricing_type': "Forfait"}
                ],
                'has_options': True,
                'dashboard_url': f"{settings.SITE_URL}/dashboard/",
                'admin_booking_url': f"{settings.SITE_URL}/admin/",
                'booking': type('Obj', (object,), {'id': 9999})(),
            }
            success = send_templated_email(
                subject="🎉 [TEST LOCALHOST] Confirmation de votre réservation Funkidz #9999",
                template_name="booking_confirmation_client",
                context=context,
                recipient_list=[target_email],
                fail_silently=False
            )

        self.stdout.write("-" * 65)
        if success:
            self.stdout.write(self.style.SUCCESS("✅ E-MAIL RÉELLEMENT ENVOYÉ AVEC SUCCÈS !"))
            if 'ethereal.email' in host:
                self.stdout.write(self.style.SUCCESS("\n📬 BOÎTE DE RÉCEPTION ACCESSIBLE EN DIRECT :"))
                self.stdout.write("  • URL de connexion : https://ethereal.email/login")
                self.stdout.write(f"  • Utilisateur      : {user}")
                self.stdout.write("  • Mot de passe     : r89ZsUEyprjrSNtg8D")
                self.stdout.write("  👉 Connectez-vous sur ce lien pour visualiser le rendu HTML complet de l'e-mail reçu !")
            elif 'brevo' in host:
                self.stdout.write(self.style.SUCCESS(f"\n📬 E-mail transmis via le relais Brevo vers {target_email}."))
                self.stdout.write("  👉 Vérifiez la boîte de réception correspondante ou les logs Brevo.")
            else:
                self.stdout.write(self.style.SUCCESS(f"\n📬 E-mail transmis au serveur SMTP ({host}) vers {target_email}."))
        else:
            self.stdout.write(self.style.ERROR("❌ L'ENVOI D'E-MAIL A ÉCHOUÉ. Vérifiez les logs serveur ci-dessus."))
        self.stdout.write("=" * 65 + "\n")
