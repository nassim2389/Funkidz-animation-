from django.test import TestCase, override_settings
from django.core import mail
from django.contrib.auth import get_user_model
from decimal import Decimal
from unittest.mock import patch
import smtplib

from services.models import Service, Option
from bookings.models import Booking, BookingOption, BookingAssignment
from users.models import AnimateurProfile
from payments.models import Payment

User = get_user_model()


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class EmailNotificationsTests(TestCase):
    """
    Tests exhaustifs du système de notifications par e-mail Funkidz (Étape 5) :
    1. Email client après paiement réussi (avec détails complets).
    2. Notification admin lors de la création et de la confirmation.
    3. Notification animateur lors de l'assignation de mission.
    4. Aucun email de confirmation après échec ou annulation.
    5. Prévention absolue des doublons (idempotence webhook / refresh / signal).
    6. Résilience face aux erreurs SMTP (pas de crash applicatif ni de faux échec).
    7. Sécurité des configurations (absence de credentials en dur).
    """

    def setUp(self):
        mail.outbox.clear()

        # 1. Admin
        self.admin = User.objects.create_superuser(
            email="admin@funkidz.fr",
            password="adminpassword123",
            first_name="Directeur",
            last_name="Funkidz",
            role=User.Role.ADMIN
        )

        # 2. Client
        self.client_user = User.objects.create_user(
            email="parent.marie@exemple.fr",
            password="clientpassword123",
            first_name="Marie",
            last_name="Dupont",
            role=User.Role.CLIENT
        )

        # 3. Animateur
        self.anim_user = User.objects.create_user(
            email="lucas.animateur@funkidz.fr",
            password="animpassword123",
            first_name="Lucas",
            last_name="SuperMagic",
            role=User.Role.ANIMATEUR
        )
        self.anim_profile, _ = AnimateurProfile.objects.get_or_create(user=self.anim_user)

        # 4. Service & Options
        self.service = Service.objects.create(
            name="Formule Magie & Ballons",
            description="Spectacle magique interactif et sculptures de ballons",
            base_price=Decimal("200.00"),
            duration_minutes=120,
            category="ANNIVERSAIRE",
            max_children=15
        )

        self.opt1 = Option.objects.create(
            service=self.service,
            name="Machine à Barbe à Papa",
            price=Decimal("35.00"),
            pricing_type="FIXED"
        )
        self.opt2 = Option.objects.create(
            service=self.service,
            name="Maquillage Enfant",
            price=Decimal("3.00"),
            pricing_type="PER_CHILD"
        )

    def test_1_client_email_after_payment_success_with_all_details(self):
        """Vérifie l'e-mail de confirmation client complet et décomposé après paiement validé."""
        # Création de la réservation initiale (PENDING)
        booking = Booking.objects.create(
            user=self.client_user,
            service=self.service,
            booking_date="2026-08-15",
            booking_time="14:30",
            nb_children=10,
            child_name="Léo",
            child_age=6,
            contact_phone="0601020304",
            location_address="25 Rue de la Fête",
            location_zip="75008",
            location_city="Paris",
            special_instructions="Code grille B24",
            status=Booking.Status.PENDING,
            final_price=Decimal("265.00")
        )
        BookingOption.objects.create(booking=booking, option=self.opt1, quantity=1, price_at_time=Decimal("35.00"))
        BookingOption.objects.create(booking=booking, option=self.opt2, quantity=1, price_at_time=Decimal("3.00"))

        mail.outbox.clear()

        # Simulation de la confirmation suite à paiement Stripe réussi
        booking.status = Booking.Status.CONFIRMED
        booking.save()

        # On attend 2 e-mails : 1 pour le client, 1 pour l'administrateur
        client_emails = [m for m in mail.outbox if self.client_user.email in m.to]
        self.assertEqual(len(client_emails), 1, "Le client doit recevoir exactement 1 e-mail de confirmation")

        client_mail = client_emails[0]
        # Sujet
        self.assertIn("Confirmation", client_mail.subject)
        self.assertIn(str(booking.id), client_mail.subject)

        # Corps de l'e-mail (Texte ou HTML)
        body = client_mail.body
        html_alternatives = [content for content, mimetype in client_mail.alternatives if mimetype == "text/html"]
        self.assertTrue(len(html_alternatives) > 0, "L'e-mail doit comporter une alternative HTML responsive")
        html_body = html_alternatives[0]

        # Vérification des champs exigés par le cahier des charges
        self.assertIn("Marie", body, "Le nom/prénom du client doit être présent dans le texte")
        self.assertIn("Formule Magie & Ballons", body, "Le nom de la formule doit être présent dans le texte")
        self.assertIn("2026-08-15", body, "La date doit être présente")
        self.assertIn("14:30", body, "L'heure/créneau doit être présent")
        self.assertIn("Léo", body, "Le prénom de l'enfant fêté doit être présent")
        self.assertIn("Machine à Barbe à Papa", body, "L'option complémentaire 1 doit être mentionnée")
        self.assertIn("265", body, "Le montant total doit être affiché")
        self.assertIn("75008", body, "Le lieu de l'événement doit figurer dans le mail")

        self.assertIn("Marie", html_body, "Le nom du client doit figurer dans l'HTML")
        self.assertIn("Formule Magie", html_body, "La formule doit figurer dans l'HTML")
        self.assertIn("Léo", html_body, "L'enfant fêté doit figurer dans l'HTML")
        self.assertIn("265", html_body, "Le montant total doit figurer dans l'HTML")

    def test_2_admin_notification_on_booking_creation_and_payment_confirmed(self):
        """Vérifie que l'admin est notifié à la création puis à la confirmation du paiement."""
        # 1. Création (PENDING)
        booking = Booking.objects.create(
            user=self.client_user,
            service=self.service,
            booking_date="2026-08-20",
            booking_time="10:00",
            nb_children=8,
            location_address="10 Rue de Paris",
            location_zip="75001",
            location_city="Paris",
            status=Booking.Status.PENDING,
            final_price=Decimal("200.00")
        )

        admin_emails = [m for m in mail.outbox if self.admin.email in m.to]
        self.assertEqual(len(admin_emails), 1, "L'admin doit recevoir une notification à la création")
        self.assertIn(str(booking.id), admin_emails[0].subject)
        self.assertIn("Nouvelle", admin_emails[0].subject)

        mail.outbox.clear()

        # 2. Confirmation du paiement
        booking.status = Booking.Status.CONFIRMED
        booking.save()

        admin_conf_emails = [m for m in mail.outbox if self.admin.email in m.to]
        self.assertEqual(len(admin_conf_emails), 1, "L'admin doit recevoir une notification de paiement validé")
        self.assertIn("PAIEMENT CONFIRMÉ", admin_conf_emails[0].subject)

    def test_3_animateur_mission_notification(self):
        """Vérifie l'e-mail envoyé à l'animateur lors de l'attribution d'une mission."""
        booking = Booking.objects.create(
            user=self.client_user,
            service=self.service,
            booking_date="2026-08-22",
            booking_time="15:00",
            nb_children=12,
            child_name="Emma",
            child_age=7,
            location_address="44 Bd Haussmann",
            location_zip="75009",
            location_city="Paris",
            status=Booking.Status.CONFIRMED,
            final_price=Decimal("200.00")
        )
        mail.outbox.clear()

        # Attribution de la mission à l'animateur
        assignment = BookingAssignment.objects.create(
            booking=booking,
            animateur=self.anim_profile,
            status=BookingAssignment.Status.PENDING
        )

        anim_emails = [m for m in mail.outbox if self.anim_user.email in m.to]
        self.assertEqual(len(anim_emails), 1, "L'animateur doit recevoir une notification de mission")
        self.assertIn("Nouvelle mission", anim_emails[0].subject)
        self.assertIn(str(booking.id), anim_emails[0].subject)
        self.assertIn("Emma", anim_emails[0].body)
        self.assertIn("Paris", anim_emails[0].body)

    def test_4_no_confirmation_email_on_failed_or_cancelled_payment(self):
        """Vérifie qu'aucun e-mail de confirmation n'est envoyé lors d'un échec ou d'une annulation."""
        booking = Booking.objects.create(
            user=self.client_user,
            service=self.service,
            booking_date="2026-08-25",
            booking_time="16:00",
            nb_children=5,
            location_address="1 Place Concorde",
            location_zip="75008",
            location_city="Paris",
            status=Booking.Status.PENDING,
            final_price=Decimal("200.00")
        )
        mail.outbox.clear()

        # Annulation
        booking.status = Booking.Status.CANCELLED
        booking.save()

        # On vérifie qu'aucun e-mail portant sur une confirmation de paiement n'a été émis
        conf_emails = [m for m in mail.outbox if "Confirmation" in m.subject and "confirmée" in m.subject.lower()]
        self.assertEqual(len(conf_emails), 0, "Aucun e-mail de confirmation ne doit être envoyé si la commande est annulée")

        # Le client reçoit en revanche bien son email d'annulation
        cancel_emails = [m for m in mail.outbox if self.client_user.email in m.to and "Annulation" in m.subject]
        self.assertEqual(len(cancel_emails), 1, "Le client doit recevoir l'avis d'annulation")

    def test_5_anti_duplicate_prevention_idempotence(self):
        """
        Vérifie qu'un webhook reçu plusieurs fois, un refresh de page de succès
        ou plusieurs saves successifs n'envoient JAMAIS d'e-mails en double.
        """
        booking = Booking.objects.create(
            user=self.client_user,
            service=self.service,
            booking_date="2026-08-30",
            booking_time="14:00",
            nb_children=10,
            location_address="8 Rue des Fleurs",
            location_zip="75011",
            location_city="Paris",
            status=Booking.Status.PENDING,
            final_price=Decimal("200.00")
        )
        mail.outbox.clear()

        # 1er déclenchement (ex: Webhook Stripe checkout.session.completed)
        booking.status = Booking.Status.CONFIRMED
        booking.save()

        client_emails = [m for m in mail.outbox if self.client_user.email in m.to and "Confirmation" in m.subject]
        self.assertEqual(len(client_emails), 1, "Le client doit recevoir 1 seul e-mail de confirmation")

        # 2e déclenchement simulé (ex: Redirection navigateur vers /payment-success/ et nouvel enregistrement)
        booking.save()

        # 3e déclenchement simulé (ex: Rafraîchissement de la page par le client)
        booking.save()

        # 4e déclenchement simulé (ex: Webhook Stripe renvoyé par retry policy)
        booking.save()

        client_emails_after = [m for m in mail.outbox if self.client_user.email in m.to and "Confirmation" in m.subject]
        self.assertEqual(
            len(client_emails_after),
            1,
            "Malgré de multiples sauvegardes/retries, EXACTEMENT 1 e-mail de confirmation doit être émis (idempotence)"
        )
        self.assertIsNotNone(booking.confirmation_email_sent_at)

    def test_6_smtp_error_resilience_does_not_break_booking(self):
        """
        Vérifie qu'une panne ou exception SMTP ne fait pas échouer la validation
        de la réservation ni le statut du paiement.
        """
        booking = Booking.objects.create(
            user=self.client_user,
            service=self.service,
            booking_date="2026-09-02",
            booking_time="11:00",
            nb_children=10,
            location_address="3 Rue Royale",
            location_zip="75008",
            location_city="Paris",
            status=Booking.Status.PENDING,
            final_price=Decimal("200.00")
        )

        # On simule une panne réseau SMTP
        with patch('django.core.mail.EmailMultiAlternatives.send', side_effect=smtplib.SMTPException("Connexion SMTP refusée")):
            # L'opération doit réussir sans lever d'exception non gérée
            booking.status = Booking.Status.CONFIRMED
            booking.save()

        booking.refresh_from_db()
        self.assertEqual(
            booking.status,
            Booking.Status.CONFIRMED,
            "La réservation doit demeurer confirmée même en cas d'erreur de serveur de messagerie"
        )

    def test_7_email_settings_no_hardcoded_credentials(self):
        """Vérifie que les paramètres d'e-mail s'appuient sur l'environnement sans mot de passe en dur."""
        from django.conf import settings
        import os

        # Le mot de passe provient de la variable d'environnement ou du fichier .env
        env_pwd = os.getenv('EMAIL_HOST_PASSWORD', '')
        settings_pwd = getattr(settings, 'EMAIL_HOST_PASSWORD', '')
        self.assertEqual(env_pwd, settings_pwd)


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class AdminRecipientRoutingTests(TestCase):
    """
    Routage des notifications administratives (Étape 3).

    Vérifie que ADMIN_NOTIFICATION_EMAILS permet de diriger explicitement les
    e-mails admin vers une boîte de test, sans toucher au code ni exposer
    d'adresse en dur, et que le comportement historique reste en place quand la
    variable n'est pas renseignée.
    """

    def setUp(self):
        mail.outbox.clear()
        self.admin = User.objects.create_superuser(
            email="admin.routing@funkidz.fr",
            password="adminpassword123",
            first_name="Admin",
            last_name="Routing",
        )

    @override_settings(ADMIN_NOTIFICATION_EMAILS=[])
    def test_admin_recipients_fallback_on_admin_accounts(self):
        from core.utils import get_admin_recipient_emails

        recipients = get_admin_recipient_emails()
        self.assertIn(self.admin.email, recipients)

    @override_settings(ADMIN_NOTIFICATION_EMAILS=['boite-de-test@exemple.invalid'])
    def test_admin_recipients_use_configured_addresses_only(self):
        from core.utils import get_admin_recipient_emails

        recipients = get_admin_recipient_emails()
        self.assertEqual(recipients, ['boite-de-test@exemple.invalid'])
        self.assertNotIn(self.admin.email, recipients)

    @override_settings(ADMIN_NOTIFICATION_EMAILS=['boite-de-test@exemple.invalid'])
    def test_admin_notification_is_routed_to_configured_address(self):
        client_user = User.objects.create_user(
            email="client.routing@exemple.invalid",
            password="clientpassword123",
            first_name="Claire",
            last_name="Routing",
        )
        service = Service.objects.create(
            name="Atelier Routage",
            description="Prestation de test",
            base_price=Decimal('120.00'),
            duration_minutes=120,
        )
        mail.outbox.clear()

        Booking.objects.create(
            user=client_user,
            service=service,
            booking_date='2026-11-15',
            booking_time='14:00:00',
            nb_children=8,
            estimated_price=Decimal('120.00'),
            final_price=Decimal('120.00'),
            location_address="1 rue du Routage",
            location_city="Paris",
            location_zip="75001",
            status=Booking.Status.PENDING,
        )

        admin_messages = [m for m in mail.outbox if 'boite-de-test@exemple.invalid' in m.to]
        self.assertTrue(admin_messages, "La notification admin doit partir vers l'adresse configurée")
        for message in admin_messages:
            self.assertNotIn(client_user.email, message.to)
            self.assertFalse(message.cc)
            self.assertFalse(message.bcc)


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    ADMIN_NOTIFICATION_EMAILS=['nassim2389@hotmail.com'],
    SITE_URL='http://192.168.1.100:8010',
)
class EndToEndEmailWorkflowTests(TestCase):
    """
    Parcours complet des e-mails demandé par le retour client (§11 à §13) :
    création, affectation, réponse de l'animateur, paiement, échec et annulation.
    """

    def setUp(self):
        from datetime import date, time
        mail.outbox.clear()
        self.client_user = User.objects.create_user(
            email="client.parcours@exemple.fr", password="Mot-de-passe-2026",
            first_name="Claire", last_name="Martin"
        )
        anim_user = User.objects.create_user(
            email="anim.parcours@funkidz.fr", password="Mot-de-passe-2026",
            first_name="Hugo", last_name="Anim", role=User.Role.ANIMATEUR
        )
        self.anim_profile, _ = AnimateurProfile.objects.get_or_create(user=anim_user)
        self.anim_user = anim_user
        service = Service.objects.create(
            name="Chasse au trésor", description="Chasse", base_price=Decimal("180.00"), duration_minutes=90
        )
        self.booking = Booking.objects.create(
            user=self.client_user, service=service, booking_date=date(2026, 9, 26), booking_time=time(21, 0),
            nb_children=10, location_address="5 rue des Lilas", location_city="Paris", location_zip="75011",
            estimated_price=Decimal("180.00"), final_price=Decimal("180.00"), status=Booking.Status.PENDING
        )

    def _mails_to(self, address):
        return [m for m in mail.outbox if address in m.to]

    def test_creation_sends_receipt_to_client_and_alert_to_admin(self):
        client_mails = self._mails_to("client.parcours@exemple.fr")
        admin_mails = self._mails_to("nassim2389@hotmail.com")
        self.assertEqual(len(client_mails), 1)
        self.assertIn("enregistrée", client_mails[0].subject)
        self.assertEqual(len(admin_mails), 1)
        self.assertIn("Nouvelle réservation", admin_mails[0].subject)

    def test_receipt_contains_required_information(self):
        body = self._mails_to("client.parcours@exemple.fr")[0].body
        for expected in ("Claire Martin", "Chasse au trésor", "26/09/2026 à 21:00", "5 rue des Lilas",
                         "180,00", "Non réglé", f"#{self.booking.id}",
                         f"http://192.168.1.100:8010/paiement/{self.booking.id}/"):
            self.assertIn(expected, body, expected)

    def test_saving_again_does_not_resend_receipt(self):
        self.booking.special_instructions = "Gâteau à 18h"
        self.booking.save()
        self.assertEqual(len(self._mails_to("client.parcours@exemple.fr")), 1)

    def test_assignment_notifies_animateur(self):
        BookingAssignment.objects.create(booking=self.booking, animateur=self.anim_profile)
        anim_mails = self._mails_to("anim.parcours@funkidz.fr")
        self.assertEqual(len(anim_mails), 1)
        self.assertIn("26/09/2026", anim_mails[0].body)

    def test_animateur_acceptance_notifies_admin_once(self):
        assignment = BookingAssignment.objects.create(booking=self.booking, animateur=self.anim_profile)
        mail.outbox.clear()
        self.client.force_login(self.anim_user)
        self.client.get(f"/assignment/{assignment.id}/accept/")
        self.client.get(f"/assignment/{assignment.id}/accept/")
        admin_mails = self._mails_to("nassim2389@hotmail.com")
        self.assertEqual(len(admin_mails), 1)
        self.assertIn("acceptée", admin_mails[0].subject)
        self.assertIn("Hugo Anim", admin_mails[0].body)

    def test_animateur_refusal_notifies_admin(self):
        assignment = BookingAssignment.objects.create(booking=self.booking, animateur=self.anim_profile)
        mail.outbox.clear()
        self.client.force_login(self.anim_user)
        self.client.get(f"/assignment/{assignment.id}/refuse/")
        admin_mails = self._mails_to("nassim2389@hotmail.com")
        self.assertEqual(len(admin_mails), 1)
        self.assertIn("refusée", admin_mails[0].subject)
        self.assertIn("réattribuer", admin_mails[0].body)

    def test_payment_confirmation_emails_use_readable_date(self):
        mail.outbox.clear()
        self.booking.status = Booking.Status.CONFIRMED
        self.booking.save()
        client_mail = self._mails_to("client.parcours@exemple.fr")[0]
        admin_mail = self._mails_to("nassim2389@hotmail.com")[0]
        self.assertIn("26/09/2026", client_mail.body)
        self.assertIn("21:00", client_mail.body)
        self.assertIn("26/09/2026 à 21:00", admin_mail.body)

    def test_cancellation_emails_use_readable_date(self):
        mail.outbox.clear()
        self.booking.status = Booking.Status.CANCELLED
        self.booking.save()
        self.assertIn("26/09/2026 à 21:00", self._mails_to("client.parcours@exemple.fr")[0].body)
        self.assertIn("26/09/2026 à 21:00", self._mails_to("nassim2389@hotmail.com")[0].body)

    def test_admin_notifications_only_go_to_configured_address(self):
        recipients = {address for m in mail.outbox for address in m.to}
        self.assertNotIn("admin@funkidz.fr", recipients)
        self.assertNotIn("contact@funkidz.fr", recipients)
