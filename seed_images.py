"""
==============================================================================
FUNKIDZ - ETAPE 2 : Embellissement Visuel & Attribution des Images HD
==============================================================================

Script de seeding dedie UNIQUEMENT a l'attribution des images haute definition
et des badges promotionnels pour les Services, Options et la Galerie.

COMPORTEMENT :
- NON-DESTRUCTIF : met a jour les champs image_url et badge_label sans supprimer les donnees.
- IDEMPOTENT     : peut etre execute plusieurs fois en toute securite.
- CIBLE          : met a jour Service, Option et MediaGallery.

UTILISATION :
    python seed_images.py
==============================================================================
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from services.models import Service, Option
from media.models import MediaGallery

SERVICES_IMAGES = [
    {
        "keyword": "pirate",
        "image_url": "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=85",
        "badge_label": "★ Top Ventes"
    },
    {
        "keyword": "magie",
        "image_url": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=85",
        "badge_label": "✨ Coup de Cœur"
    },
    {
        "keyword": "héros",
        "image_url": "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1200&q=85",
        "badge_label": "⚡ Aventure"
    },
    {
        "keyword": "pâtisserie",
        "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85",
        "badge_label": "🧁 Gourmand"
    },
    {
        "keyword": "disco",
        "image_url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85",
        "badge_label": "🎉 Ambiance VIP"
    },
    {
        "keyword": "kermesse",
        "image_url": "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=1200&q=85",
        "badge_label": "🏆 Plein Air"
    },
    {
        "keyword": "escape",
        "image_url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85",
        "badge_label": "🔍 Mystère"
    },
    {
        "keyword": "princesse",
        "image_url": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=85",
        "badge_label": "👑 Féerique"
    },
    {
        "keyword": "mascotte",
        "image_url": "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=85",
        "badge_label": "🧸 Spécial Tout-Petits"
    },
    {
        "keyword": "scientifique",
        "image_url": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=85",
        "badge_label": "🧪 Découverte"
    }
]

OPTIONS_IMAGES = [
    {"keyword": "maquillage", "image_url": "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "barbe", "image_url": "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "photobooth", "image_url": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "bulle", "image_url": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "épée", "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "coffre", "image_url": "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "chapeau", "image_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "gâteau", "image_url": "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "cape", "image_url": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "tablier", "image_url": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "boîte", "image_url": "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "médaille", "image_url": "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "cadenas", "image_url": "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "couronne", "image_url": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "tapis", "image_url": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "sculpture", "image_url": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "blouse", "image_url": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=500&q=80"},
    {"keyword": "slime", "image_url": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=80"}
]

GALLERY_PHOTOS = [
    {"title": "Spectacle de Magie d'Anniversaire", "media_url": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80"},
    {"title": "Chasse au Trésor et Déguisements Pirates", "media_url": "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80"},
    {"title": "Animation Super-Héros et Parcours d'Obstacles", "media_url": "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=800&q=80"},
    {"title": "Mini Boom Disco & Effets Lumineux LED", "media_url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"},
    {"title": "Olympiades & Défis Sportifs Enfants", "media_url": "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80"},
    {"title": "Atelier Maquillage Féerique & Paillettes", "media_url": "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80"},
    {"title": "Atelier Pâtisserie & Décoration Cupcakes", "media_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"},
    {"title": "Escape Game & Enquête d'Agents Secrets", "media_url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"},
    {"title": "Bal Royal des Princesses", "media_url": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80"},
    {"title": "Mascotte Géante & Sculptures de Ballons", "media_url": "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80"},
    {"title": "Atelier Scientifique & Expériences Slime", "media_url": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"},
    {"title": "Goûter d'Anniversaire & Gâteau Magique", "media_url": "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&q=80"}
]


def seed_images():
    print("=" * 65)
    print("Seeding ETAPE 2 : Embellissement Visuel & Attribution Images HD")
    print("=" * 65)
    print("Mode NON-DESTRUCTIF : mise a jour des illustrations et badges.\n")

    # 1. MISE A JOUR DES SERVICES
    print("[1/3] Attribution des images HD aux Services...")
    updated_services = 0
    for service in Service.objects.all():
        name_lower = service.name.lower()
        matched = False
        for entry in SERVICES_IMAGES:
            if entry["keyword"] in name_lower:
                service.image_url = entry["image_url"]
                if not service.badge_label:
                    service.badge_label = entry["badge_label"]
                service.save()
                matched = True
                updated_services += 1
                print(f"  ✓ Service '{service.name}' mis a jour avec l'image HD ({service.badge_label}).")
                break
        if not matched and not service.image_url:
            service.image_url = "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=85"
            service.save()
            updated_services += 1
            print(f"  ✓ Service '{service.name}' configure avec l'image HD par defaut.")

    print(f"-> {updated_services} service(s) enrichi(s) en images HD.\n")

    # 2. MISE A JOUR DES OPTIONS
    print("[2/3] Attribution des images aux Options complémentaires...")
    updated_options = 0
    for option in Option.objects.all():
        name_lower = option.name.lower()
        for opt_entry in OPTIONS_IMAGES:
            if opt_entry["keyword"] in name_lower:
                option.image_url = opt_entry["image_url"]
                option.save()
                updated_options += 1
                break
        if not option.image_url:
            option.image_url = "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80"
            option.save()
            updated_options += 1

    print(f"-> {updated_options} option(s) enrichie(s) en images.\n")

    # 3. GALERIE MULTIMEDIA
    print("[3/3] Synchronisation de la Galerie d'images HD...")
    synced_media = 0
    for idx, photo in enumerate(GALLERY_PHOTOS):
        media_obj, created = MediaGallery.objects.get_or_create(
            title=photo["title"],
            defaults={
                "media_url": photo["media_url"],
                "media_type": MediaGallery.MediaType.IMAGE,
                "order": idx + 1
            }
        )
        if not created and not media_obj.media_url:
            media_obj.media_url = photo["media_url"]
            media_obj.save()
        synced_media += 1

    print(f"-> {synced_media} photo(s) verifiee(s) dans la Galerie Média.\n")
    print("=" * 65)
    print("SEEDING ETAPE 2 TERMINE AVEC SUCCES : TOUTES LES IMAGES SONT EN PLACE !")
    print("=" * 65)


if __name__ == "__main__":
    seed_images()
