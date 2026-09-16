"""
==============================================================================
FUNKIDZ - ETAPE 1 : Gestion des roles et Comptes pre-enregistres (Data Seeding)
==============================================================================

Script de seeding dedie UNIQUEMENT aux comptes utilisateurs de test.

COMPORTEMENT :
- NON-DESTRUCTIF : ne supprime aucune donnee existante.
- IDEMPOTENT     : peut etre relance plusieurs fois sans creer de doublons.
- CIBLE          : ne touche qu aux utilisateurs (User + AnimateurProfile).

UTILISATION :
    python seed_users.py

COMPTES CREES :
    [ADMIN]      admin@funkidz.fr           | admin123
    [ANIMATEUR]  animateur@funkidz.fr       | animateur123
    [ANIMATEUR]  sophie.anim@funkidz.fr     | animateur123
    [ANIMATEUR]  thomas.anim@funkidz.fr     | animateur123
    [CLIENT]     client1@funkidz.fr         | client123
    [CLIENT]     client2@funkidz.fr         | client123
    [CLIENT]     client3@funkidz.fr         | client123
    [CLIENT]     marie.dubois@gmail.com     | client123
    [CLIENT]     pierre.moreau@yahoo.fr     | client123
==============================================================================
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import AnimateurProfile

User = get_user_model()


def seed_users():
    print("=" * 60)
    print("Seeding ETAPE 1 : comptes utilisateurs Funkidz")
    print("=" * 60)
    print("Mode NON-DESTRUCTIF : aucune donnee existante ne sera supprimee.\n")

    created_count = 0

    # =========================================================
    # 1. COMPTE ADMINISTRATEUR
    # =========================================================
    print("[1/3] Creation du compte Administrateur...")

    admin_user, created = User.objects.get_or_create(
        email="admin@funkidz.fr",
        defaults={
            "first_name": "Administrateur",
            "last_name": "Funkidz",
            "role": User.Role.ADMIN,
            "is_staff": True,
            "is_superuser": True,
            "is_verified": True,
        }
    )
    # Garantir les droits admin et le mot de passe (hache par Django)
    admin_user.role = User.Role.ADMIN
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.is_verified = True
    admin_user.first_name = "Administrateur"
    admin_user.last_name = "Funkidz"
    admin_user.set_password("admin123")
    admin_user.save()

    status = "CREE" if created else "EXISTANT mis a jour"
    print(f"   [{status}] admin@funkidz.fr  (role=ADMIN, is_superuser=True)")
    if created:
        created_count += 1

    # =========================================================
    # 2. COMPTES ANIMATEURS
    # =========================================================
    print("\n[2/3] Creation des comptes Animateurs...")

    animateurs_data = [
        {
            "email": "animateur@funkidz.fr",
            "first_name": "Lucas",
            "last_name": "Dupont",
            "phone": "0612345678",
            "rating": 4.9,
            "bio": "Specialiste de la magie et des chasses au tresor depuis 5 ans.",
        },
        {
            "email": "sophie.anim@funkidz.fr",
            "first_name": "Sophie",
            "last_name": "Martin",
            "phone": "0623456789",
            "rating": 4.8,
            "bio": "Comedienne passionnee par les ateliers creatifs.",
        },
        {
            "email": "thomas.anim@funkidz.fr",
            "first_name": "Thomas",
            "last_name": "Bernard",
            "phone": "0634567890",
            "rating": 5.0,
            "bio": "DJ Junior et animateur sportif diplome BAFA.",
        },
    ]

    for a in animateurs_data:
        user, created = User.objects.get_or_create(
            email=a["email"],
            defaults={
                "first_name": a["first_name"],
                "last_name": a["last_name"],
                "role": User.Role.ANIMATEUR,
                "is_verified": True,
            }
        )
        # Garantir le role et le mot de passe (hache par Django)
        user.role = User.Role.ANIMATEUR
        user.is_verified = True
        user.set_password("animateur123")
        user.save()

        # Creer le profil AnimateurProfile si absent (non-destructif)
        profile, profile_created = AnimateurProfile.objects.get_or_create(
            user=user,
            defaults={
                "phone": a["phone"],
                "rating": a["rating"],
                "bio": a["bio"],
            }
        )

        user_status = "CREE" if created else "EXISTANT"
        profile_status = "Profil cree" if profile_created else "Profil OK"
        print(f"   [{user_status}] {a['email']}  (role=ANIMATEUR) -- {profile_status}")
        if created:
            created_count += 1

    # =========================================================
    # 3. COMPTES CLIENTS (minimum 3 requis)
    # =========================================================
    print("\n[3/3] Creation des comptes Clients...")

    clients_data = [
        {"email": "client1@funkidz.fr", "first_name": "Jean", "last_name": "Dupont"},
        {"email": "client2@funkidz.fr", "first_name": "Amelie", "last_name": "Legrand"},
        {"email": "client3@funkidz.fr", "first_name": "Nicolas", "last_name": "Bernard"},
        {"email": "marie.dubois@gmail.com", "first_name": "Marie", "last_name": "Dubois"},
        {"email": "pierre.moreau@yahoo.fr", "first_name": "Pierre", "last_name": "Moreau"},
    ]

    for c in clients_data:
        user, created = User.objects.get_or_create(
            email=c["email"],
            defaults={
                "first_name": c["first_name"],
                "last_name": c["last_name"],
                "role": User.Role.CLIENT,
                "is_verified": True,
            }
        )
        # Garantir le role et le mot de passe (hache par Django)
        user.role = User.Role.CLIENT
        user.is_verified = True
        user.set_password("client123")
        user.save()

        user_status = "CREE" if created else "EXISTANT"
        print(f"   [{user_status}] {c['email']}  (role=CLIENT)")
        if created:
            created_count += 1

    # =========================================================
    # RAPPORT FINAL ET VERIFICATION
    # =========================================================
    total_admins = User.objects.filter(role=User.Role.ADMIN).count()
    total_animateurs = User.objects.filter(role=User.Role.ANIMATEUR).count()
    total_clients = User.objects.filter(role=User.Role.CLIENT).count()
    total_profiles = AnimateurProfile.objects.count()

    print("\n" + "=" * 60)
    print("SEEDING ETAPE 1 TERMINE AVEC SUCCES")
    print("=" * 60)
    print(f"   Comptes crees ce run : {created_count}")
    print("\nETAT ACTUEL DE LA BASE DE DONNEES :")
    print(f"   Administrateurs : {total_admins}")
    print(f"   Animateurs      : {total_animateurs}  (dont {total_profiles} avec AnimateurProfile)")
    print(f"   Clients         : {total_clients}")
    print(f"   Total           : {total_admins + total_animateurs + total_clients}")

    print("\nIDENTIFIANTS DE TEST :")
    print("   ROLE         EMAIL                       MOT DE PASSE")
    print("   ADMIN        admin@funkidz.fr            admin123")
    print("   ANIMATEUR    animateur@funkidz.fr        animateur123")
    print("   ANIMATEUR    sophie.anim@funkidz.fr      animateur123")
    print("   ANIMATEUR    thomas.anim@funkidz.fr      animateur123")
    print("   CLIENT       client1@funkidz.fr          client123")
    print("   CLIENT       client2@funkidz.fr          client123")
    print("   CLIENT       client3@funkidz.fr          client123")
    print("   CLIENT       marie.dubois@gmail.com      client123")
    print("   CLIENT       pierre.moreau@yahoo.fr      client123")
    print("\nURL login : http://127.0.0.1:8000/auth/login/")
    print("Admin     : http://127.0.0.1:8000/admin/")
    print("=" * 60)


if __name__ == "__main__":
    seed_users()
