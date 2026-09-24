import os
from unittest.mock import patch

from django.test import TestCase, override_settings
from django.urls import reverse

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
