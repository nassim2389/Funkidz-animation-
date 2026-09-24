import os
from decimal import Decimal
from importlib import import_module
from io import StringIO
from unittest.mock import patch

from django.apps import apps as django_apps
from django.contrib.auth import authenticate
from django.core.management import call_command
from django.test import Client, TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient

from bookings.models import Booking
from services.models import Service
from users.forms import UserAdminForm
from users.models import User


class GoogleLoginSecurityTests(TestCase):
    """La connexion Google ne doit jamais ouvrir un compte sans preuve d'identité."""

    def setUp(self):
        self.admin = User.objects.create_user(
            email='admin.test@funkidz.fr', password='motdepasse-admin', role=User.Role.ADMIN,
            is_staff=True, is_superuser=True
        )
        self.animateur = User.objects.create_user(
            email='anim.test@funkidz.fr', password='motdepasse-anim', role=User.Role.ANIMATEUR
        )
        self.client_user = User.objects.create_user(
            email='client.test@funkidz.fr', password='motdepasse-client', role=User.Role.CLIENT
        )
        self.callback_url = reverse('google-callback')

    def _is_logged_in(self):
        return '_auth_user_id' in self.client.session

    @patch.dict(os.environ, {'GOOGLE_CLIENT_ID': '', 'GOOGLE_CLIENT_SECRET': '', 'GOOGLE_LOGIN_SIMULATION': ''})
    def test_email_in_query_string_does_not_log_in(self):
        response = self.client.get(self.callback_url, {'email': self.admin.email})
        self.assertRedirects(response, reverse('login'), fetch_redirect_response=False)
        self.assertFalse(self._is_logged_in())

    @patch.dict(os.environ, {'GOOGLE_CLIENT_ID': '', 'GOOGLE_CLIENT_SECRET': '', 'GOOGLE_LOGIN_SIMULATION': ''})
    def test_email_in_form_does_not_log_in_without_simulation(self):
        self.client.post(self.callback_url, {'email': self.client_user.email})
        self.assertFalse(self._is_logged_in())

    @patch.dict(os.environ, {'GOOGLE_CLIENT_ID': '', 'GOOGLE_CLIENT_SECRET': '', 'GOOGLE_LOGIN_SIMULATION': ''})
    def test_google_login_page_unavailable_without_configuration(self):
        response = self.client.get(reverse('google-login'))
        self.assertRedirects(response, reverse('login'), fetch_redirect_response=False)

    @override_settings(DEBUG=True)
    @patch.dict(os.environ, {'GOOGLE_CLIENT_ID': '', 'GOOGLE_CLIENT_SECRET': '', 'GOOGLE_LOGIN_SIMULATION': 'True'})
    def test_simulation_never_opens_privileged_accounts(self):
        for user in (self.admin, self.animateur):
            self.client.post(self.callback_url, {'email': user.email})
            self.assertFalse(self._is_logged_in(), user.email)

    @override_settings(DEBUG=True)
    @patch.dict(os.environ, {'GOOGLE_CLIENT_ID': '', 'GOOGLE_CLIENT_SECRET': '', 'GOOGLE_LOGIN_SIMULATION': 'True'})
    def test_simulation_rejects_get_requests(self):
        self.client.get(self.callback_url, {'email': self.client_user.email})
        self.assertFalse(self._is_logged_in())

    @override_settings(DEBUG=True)
    @patch.dict(os.environ, {'GOOGLE_CLIENT_ID': '', 'GOOGLE_CLIENT_SECRET': '', 'GOOGLE_LOGIN_SIMULATION': 'True'})
    def test_simulation_logs_in_client_account_in_debug(self):
        self.client.post(self.callback_url, {'email': self.client_user.email})
        self.assertTrue(self._is_logged_in())

    @override_settings(DEBUG=False)
    @patch.dict(os.environ, {'GOOGLE_CLIENT_ID': '', 'GOOGLE_CLIENT_SECRET': '', 'GOOGLE_LOGIN_SIMULATION': 'True'})
    def test_simulation_disabled_outside_debug(self):
        self.client.post(self.callback_url, {'email': self.client_user.email})
        self.assertFalse(self._is_logged_in())

    @patch.dict(os.environ, {'GOOGLE_CLIENT_ID': 'id', 'GOOGLE_CLIENT_SECRET': 'secret'})
    @patch('users.urls._google_identity_from_code', return_value=None)
    def test_unverified_google_identity_is_refused(self, _mock_identity):
        self.client.get(self.callback_url, {'code': 'code-invalide', 'email': self.admin.email})
        self.assertFalse(self._is_logged_in())

    @patch.dict(os.environ, {'GOOGLE_CLIENT_ID': 'id', 'GOOGLE_CLIENT_SECRET': 'secret'})
    @patch('users.urls._google_identity_from_code', return_value=('client.test@funkidz.fr', 'Client', 'Test'))
    def test_verified_google_identity_logs_in(self, _mock_identity):
        self.client.get(self.callback_url, {'code': 'code-valide', 'email': self.admin.email})
        self.assertTrue(self._is_logged_in())
        self.assertEqual(int(self.client.session['_auth_user_id']), self.client_user.id)



class EmailCaseInsensitiveLoginTests(TestCase):
    """Une adresse e-mail désigne le même compte, quelle que soit la casse saisie."""

    def setUp(self):
        self.user = User.objects.create_user(email='Client.Casse@Exemple.fr', password='Mot-de-passe-2026')

    def test_email_is_stored_in_lowercase(self):
        self.assertEqual(self.user.email, 'client.casse@exemple.fr')

    def test_email_is_normalized_on_every_save(self):
        self.user.email = 'AUTRE.Adresse@Exemple.FR'
        self.user.save()
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, 'autre.adresse@exemple.fr')

    def test_authenticate_ignores_case(self):
        for typed in ('client.casse@exemple.fr', 'CLIENT.CASSE@EXEMPLE.FR', '  Client.Casse@exemple.fr '):
            self.assertEqual(authenticate(username=typed, password='Mot-de-passe-2026'), self.user, typed)

    def test_web_login_ignores_case(self):
        response = self.client.post(reverse('login'), {
            'username': 'CLIENT.Casse@exemple.fr', 'password': 'Mot-de-passe-2026'
        })
        self.assertEqual(response.status_code, 302)
        self.assertEqual(int(self.client.session['_auth_user_id']), self.user.id)

    def test_api_token_login_ignores_case(self):
        response = APIClient().post(reverse('token_obtain_pair'), {
            'email': 'Client.CASSE@exemple.fr', 'password': 'Mot-de-passe-2026'
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)

    def test_wrong_password_is_still_refused(self):
        self.assertIsNone(authenticate(username='client.casse@exemple.fr', password='mauvais'))


class SignupValidationTests(TestCase):
    """Inscription : messages clairs, pas de doublon, mot de passe robuste."""

    def setUp(self):
        User.objects.create_user(email='deja.inscrit@exemple.fr', password='Mot-de-passe-2026')

    def test_duplicate_email_with_other_case_is_refused_cleanly(self):
        response = self.client.post(reverse('signup'), {
            'email': 'Deja.Inscrit@Exemple.fr', 'password': 'Un-autre-mot-2026'
        })
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Un compte existe déjà')
        self.assertEqual(User.objects.filter(email__iexact='deja.inscrit@exemple.fr').count(), 1)
        self.assertNotIn('_auth_user_id', self.client.session)

    def test_weak_password_is_refused(self):
        response = self.client.post(reverse('signup'), {'email': 'nouveau@exemple.fr', 'password': '123'})
        self.assertEqual(response.status_code, 200)
        self.assertFalse(User.objects.filter(email='nouveau@exemple.fr').exists())

    def test_invalid_email_is_refused(self):
        self.client.post(reverse('signup'), {'email': 'pas-une-adresse', 'password': 'Mot-de-passe-2026'})
        self.assertFalse(User.objects.filter(email='pas-une-adresse').exists())

    def test_valid_signup_creates_client_and_logs_in(self):
        response = self.client.post(reverse('signup'), {
            'email': 'Nouveau.Client@Exemple.fr', 'password': 'Mot-de-passe-2026'
        })
        self.assertRedirects(response, '/', fetch_redirect_response=False)
        user = User.objects.get(email='nouveau.client@exemple.fr')
        self.assertEqual(user.role, User.Role.CLIENT)
        self.assertEqual(int(self.client.session['_auth_user_id']), user.id)

    def test_api_register_refuses_duplicate_and_weak_password(self):
        api = APIClient()
        duplicate = api.post(reverse('register'), {
            'email': 'DEJA.inscrit@exemple.fr', 'password': 'Mot-de-passe-2026'
        }, format='json')
        self.assertEqual(duplicate.status_code, 400)
        weak = api.post(reverse('register'), {'email': 'faible@exemple.fr', 'password': '123'}, format='json')
        self.assertEqual(weak.status_code, 400)

    def test_admin_form_refuses_duplicate_with_other_case(self):
        form = UserAdminForm(data={'email': 'DEJA.INSCRIT@exemple.fr', 'role': User.Role.CLIENT})
        form.is_valid()
        self.assertIn('email', form.errors)


class RoleProtectionTests(TestCase):
    """Le rôle, qui conditionne les droits, n'est pas modifiable par l'utilisateur."""

    def test_client_cannot_promote_himself_admin(self):
        user = User.objects.create_user(email='client.role@exemple.fr', password='Mot-de-passe-2026')
        api = APIClient()
        api.force_authenticate(user=user)
        api.patch(reverse('user_me'), {'role': User.Role.ADMIN}, format='json')
        user.refresh_from_db()
        self.assertEqual(user.role, User.Role.CLIENT)


class MultiClientIsolationTests(TestCase):
    """Deux clients connectés en parallèle ne voient que leurs propres réservations."""

    def setUp(self):
        service = Service.objects.create(
            name="Atelier", description="Atelier", base_price=Decimal("100.00"), duration_minutes=60
        )
        self.client_a = User.objects.create_user(email='client.a@exemple.fr', password='Mot-de-passe-2026')
        self.client_b = User.objects.create_user(email='client.b@exemple.fr', password='Mot-de-passe-2026')
        self.staff = User.objects.create_user(
            email='staff@exemple.fr', password='Mot-de-passe-2026', is_staff=True, is_superuser=True
        )
        common = dict(
            service=service, booking_time="15:00", nb_children=5, location_address="1 rue Test",
            location_city="Paris", location_zip="75001", estimated_price=Decimal("100.00"),
            final_price=Decimal("100.00"), status=Booking.Status.PENDING
        )
        self.booking_a = Booking.objects.create(user=self.client_a, booking_date="2030-04-01", **common)
        self.booking_b = Booking.objects.create(user=self.client_b, booking_date="2030-04-02", **common)

    def test_two_sessions_in_parallel_are_isolated(self):
        browser_a, browser_b = Client(), Client()
        self.assertTrue(browser_a.login(username='CLIENT.A@exemple.fr', password='Mot-de-passe-2026'))
        self.assertTrue(browser_b.login(username='client.b@exemple.fr', password='Mot-de-passe-2026'))

        bookings_a = list(browser_a.get(reverse('dashboard')).context['bookings'])
        bookings_b = list(browser_b.get(reverse('dashboard')).context['bookings'])
        self.assertEqual(bookings_a, [self.booking_a])
        self.assertEqual(bookings_b, [self.booking_b])
        self.assertNotEqual(browser_a.session.session_key, browser_b.session.session_key)

    def test_api_lists_only_own_bookings(self):
        api = APIClient()
        api.force_authenticate(user=self.client_a)
        ids = [b['id'] for b in api.get('/api/bookings/').data]
        self.assertEqual(ids, [self.booking_a.id])
        self.assertEqual(api.get(f'/api/bookings/{self.booking_b.id}/').status_code, 404)

    def test_staff_account_sees_all_bookings_even_with_client_role(self):
        api = APIClient()
        api.force_authenticate(user=self.staff)
        ids = sorted(b['id'] for b in api.get('/api/bookings/').data)
        self.assertEqual(ids, sorted([self.booking_a.id, self.booking_b.id]))


class PrepareTestAccountsCommandTests(TestCase):
    """Commande de préparation des comptes de test."""

    def _run(self, *args):
        out = StringIO()
        call_command('prepare_test_accounts', *args, stdout=out)
        return out.getvalue()

    def test_creates_accounts_with_expected_roles(self):
        self._run('--password', 'Mot-de-passe-2026')
        admin = User.objects.get(email='nassim2389@hotmail.com')
        self.assertEqual(admin.role, User.Role.ADMIN)
        self.assertTrue(admin.is_staff and admin.is_superuser)
        for email in ('nassimoouche@gmail.com', 'client2@funkidz.fr'):
            self.assertEqual(User.objects.get(email=email).role, User.Role.CLIENT)
        animateur = User.objects.get(email='animateur@funkidz.fr')
        self.assertEqual(animateur.role, User.Role.ANIMATEUR)
        self.assertTrue(hasattr(animateur, 'animateur_profile'))
        self.assertIsNotNone(authenticate(username='Nassim2389@hotmail.com', password='Mot-de-passe-2026'))

    def test_is_idempotent_and_keeps_existing_passwords(self):
        User.objects.create_user(email='animateur@funkidz.fr', password='mot-de-passe-existant',
                                 role=User.Role.ANIMATEUR)
        self._run('--password', 'Mot-de-passe-2026')
        self._run('--password', 'Autre-mot-2026')
        self.assertEqual(User.objects.filter(email='client2@funkidz.fr').count(), 1)
        self.assertIsNotNone(authenticate(username='animateur@funkidz.fr', password='mot-de-passe-existant'))
        self.assertIsNotNone(authenticate(username='client2@funkidz.fr', password='Mot-de-passe-2026'))

    def test_fixes_superuser_with_client_role(self):
        legacy = User.objects.create_user(email='admin.legacy@exemple.fr', password='x',
                                          is_staff=True, is_superuser=True, role=User.Role.CLIENT)
        output = self._run('--password', 'Mot-de-passe-2026')
        legacy.refresh_from_db()
        self.assertEqual(legacy.role, User.Role.ADMIN)
        self.assertIn('admin.legacy@exemple.fr', output)


class EmailNormalizationMigrationTests(TestCase):
    """Migration de données : passage des adresses existantes en minuscules."""

    def _migrate(self):
        module = import_module('users.migrations.0003_normalize_user_emails')
        module.lowercase_emails(django_apps, None)

    def test_lowercases_existing_addresses(self):
        user = User.objects.create_user(email='temp@exemple.fr', password='x')
        User.objects.filter(pk=user.pk).update(email='Ancien.Compte@Exemple.fr')
        self._migrate()
        user.refresh_from_db()
        self.assertEqual(user.email, 'ancien.compte@exemple.fr')

    def test_never_merges_colliding_accounts(self):
        User.objects.create_user(email='doublon@exemple.fr', password='x')
        other = User.objects.create_user(email='temp2@exemple.fr', password='x')
        User.objects.filter(pk=other.pk).update(email='Doublon@exemple.fr')
        self._migrate()
        other.refresh_from_db()
        self.assertEqual(other.email, 'Doublon@exemple.fr')
        self.assertEqual(User.objects.filter(email__iexact='doublon@exemple.fr').count(), 2)
