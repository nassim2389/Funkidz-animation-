import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from services.models import Service, Option
from django.contrib.auth import get_user_model

User = get_user_model()

def seed_data():
    print("Seeding database with professional services & options...")
    # Clear existing
    Option.objects.all().delete()
    Service.objects.all().delete()

    # Service 1
    s1 = Service.objects.create(
        name="Magie & Illusion Enchantée",
        description="Un spectacle interactif fascinant avec colombes, apparitions mystérieuses et initiation à la magie pour émerveiller les petits comme les grands.",
        base_price=160.00,
        duration_minutes=90,
        category='ANNIVERSAIRE',
        max_children=15
    )
    Option.objects.create(service=s1, name="Chapeau & Baguette Magique (par enfant)", price=6.00, pricing_type='PER_CHILD')
    Option.objects.create(service=s1, name="Apparition Spéciale du Gâteau en Magie", price=45.00, pricing_type='FIXED')
    Option.objects.create(service=s1, name="Atelier Magie Approfondi (+30 min)", price=50.00, pricing_type='PER_HOUR')

    # Service 2
    s2 = Service.objects.create(
        name="Chasse au Trésor des Pirates",
        description="Une grande aventure immersive guidée par nos animateurs déguisés : énigmes, cartes au trésor anciennes et ouverture du coffre légendaire !",
        base_price=190.00,
        duration_minutes=120,
        category='ANNIVERSAIRE',
        max_children=20
    )
    Option.objects.create(service=s2, name="Kit Maquillage Pirate professionnel (par enfant)", price=4.00, pricing_type='PER_CHILD')
    Option.objects.create(service=s2, name="Épées gonflables & Bandanas", price=35.00, pricing_type='FIXED')
    Option.objects.create(service=s2, name="Coffre au Trésor rempli de friandises & cadeaux", price=40.00, pricing_type='FIXED')

    # Service 3
    s3 = Service.objects.create(
        name="Kermesse & Mini Olympiades",
        description="Des défis sportifs et ludiques adaptés : course en sac, tir à l'arc sécurisé, chamboule-tout et remise de médailles pour tous les participants.",
        base_price=210.00,
        duration_minutes=150,
        category='SPECTACLE',
        max_children=25
    )
    Option.objects.create(service=s3, name="Médailles & Diplômes personnalisés (par enfant)", price=3.50, pricing_type='PER_CHILD')
    Option.objects.create(service=s3, name="Machine à Barbe à Papa avec consommables", price=45.00, pricing_type='FIXED')

    # Service 4
    s4 = Service.objects.create(
        name="Super-Héros & Académie des Champions",
        description="Un entraînement palpitant pour devenir un véritable super-héros avec parcours d'obstacles, défis de force et remise de cape officielle.",
        base_price=175.00,
        duration_minutes=90,
        category='ATELIER',
        max_children=15
    )
    Option.objects.create(service=s4, name="Cape & Masque de Super-Héros (par enfant)", price=5.00, pricing_type='PER_CHILD')
    Option.objects.create(service=s4, name="Photobooth Super-Héros avec impression instantanée", price=50.00, pricing_type='FIXED')

    # Service 5
    s5 = Service.objects.create(
        name="KIDS Disco & Karaoke VIP",
        description="Une vraie ambiance de fête avec sonorisation pro, jeux de lumière LED, machine à bulles et micro pour interpréter leurs hits préférés !",
        base_price=230.00,
        duration_minutes=120,
        category='ANNIVERSAIRE',
        max_children=30
    )
    Option.objects.create(service=s5, name="Machine à Bulles & Effets Spéciaux", price=25.00, pricing_type='FIXED')
    Option.objects.create(service=s5, name="Bracelets & Accessoires Fluos (par enfant)", price=3.00, pricing_type='PER_CHILD')

    print(f"Successfully seeded {Service.objects.count()} services and {Option.objects.count()} options!")

if __name__ == "__main__":
    seed_data()
