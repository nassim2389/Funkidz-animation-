import secrets

from django.core.management.base import BaseCommand
from django.db import transaction

from users.models import AnimateurProfile, User

# Comptes utilisés pour les tests fonctionnels et la démonstration.
# Aucun mot de passe n'est stocké ici : il est fourni en option ou généré.
TEST_ACCOUNTS = [
    {'email': 'nassim2389@hotmail.com', 'first_name': 'Administrateur', 'last_name': 'Funkidz',
     'role': User.Role.ADMIN, 'label': 'Admin'},
    {'email': 'nassimoouche@gmail.com', 'first_name': 'Client', 'last_name': 'Test 1',
     'role': User.Role.CLIENT, 'label': 'Client 1'},
    {'email': 'client2@funkidz.fr', 'first_name': 'Client', 'last_name': 'Test 2',
     'role': User.Role.CLIENT, 'label': 'Client 2'},
    {'email': 'animateur@funkidz.fr', 'first_name': 'Animateur', 'last_name': 'Test',
     'role': User.Role.ANIMATEUR, 'label': 'Animateur'},
]


class Command(BaseCommand):
    help = (
        "Crée les comptes de test (Admin, Client 1, Client 2, Animateur) et harmonise "
        "le rôle des super-utilisateurs. Idempotent : un compte existant n'est jamais "
        "supprimé et son mot de passe n'est modifié qu'avec --reset-passwords."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--password',
            help="Mot de passe attribué aux comptes créés (sinon un mot de passe aléatoire par compte).",
        )
        parser.add_argument(
            '--reset-passwords', action='store_true',
            help="Réattribue aussi un mot de passe aux comptes de test déjà existants.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        shared_password = options.get('password')
        reset = options['reset_passwords']
        credentials = []

        for spec in TEST_ACCOUNTS:
            user = User.objects.filter(email__iexact=spec['email']).first()
            created = user is None
            if created:
                user = User(email=spec['email'], first_name=spec['first_name'], last_name=spec['last_name'])

            user.role = spec['role']
            user.is_active = True
            user.is_verified = True
            is_admin = spec['role'] == User.Role.ADMIN
            user.is_staff = is_admin
            user.is_superuser = is_admin

            password = None
            if created or reset:
                password = shared_password or secrets.token_urlsafe(9)
                user.set_password(password)
            user.save()

            if spec['role'] == User.Role.ANIMATEUR:
                AnimateurProfile.objects.get_or_create(user=user)

            credentials.append((spec['label'], user.email, 'créé' if created else 'existant', password))

        fixed = []
        for user in User.objects.filter(is_superuser=True).exclude(role=User.Role.ADMIN):
            user.role = User.Role.ADMIN
            user.save(update_fields=['role'])
            fixed.append(user.email)

        self.stdout.write(self.style.SUCCESS("Comptes de test prêts :"))
        for label, email, state, password in credentials:
            secret = password if password else "(inchangé)"
            self.stdout.write(f"  {label:<10} {email:<28} {state:<9} mot de passe : {secret}")
        if fixed:
            self.stdout.write(self.style.WARNING(
                "Rôle corrigé en ADMIN pour les super-utilisateurs : " + ", ".join(fixed)
            ))
        self.stdout.write("Conservez ces mots de passe hors du dépôt Git.")
