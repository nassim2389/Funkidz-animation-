import os
import django
from datetime import date, time, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from services.models import Service, Option
from users.models import User, AnimateurProfile
from bookings.models import Booking, BookingOption, BookingAssignment
from payments.models import Payment
from media.models import MediaGallery
from contact.models import ContactMessage
from reviews.models import Review

User = get_user_model()

def seed_all():
    print("🚀 Démarrage du remplissage complet de la base de données...")

    # 1. NETTOYAGE
    Review.objects.all().delete()
    Payment.objects.all().delete()
    BookingAssignment.objects.all().delete()
    BookingOption.objects.all().delete()
    Booking.objects.all().delete()
    Option.objects.all().delete()
    Service.objects.all().delete()
    MediaGallery.objects.all().delete()
    ContactMessage.objects.all().delete()

    print("✅ Nettoyage terminé.")

    # 2. CRÉATION DES SERVICES & OPTIONS
    services_data = [
        {
            "name": "Chasse au Trésor des Pirates",
            "description": "Une aventure grandeur nature avec déguisements, carte ancienne mystérieuse, énigmes captivantes et ouverture du grand coffre aux trésors.",
            "base_price": 190.00,
            "duration_minutes": 120,
            "category": "ANNIVERSAIRE",
            "max_children": 20,
            "options": [
                {"name": "Kit Maquillage Pirate pro (par enfant)", "price": 4.00, "pricing_type": "PER_CHILD"},
                {"name": "Épées gonflables & Bandanas pour l'équipe", "price": 35.00, "pricing_type": "FIXED"},
                {"name": "Coffre au trésor rempli de friandises & cadeaux", "price": 40.00, "pricing_type": "FIXED"}
            ]
        },
        {
            "name": "Magie & Illusion Enchantée",
            "description": "Un spectacle de magie interactif et saisissant avec colombes, apparitions magiques et atelier d'initiation où chaque enfant devient apprenti sorcier.",
            "base_price": 160.00,
            "duration_minutes": 90,
            "category": "ANNIVERSAIRE",
            "max_children": 15,
            "options": [
                {"name": "Chapeau & Baguette Magique (par enfant)", "price": 6.00, "pricing_type": "PER_CHILD"},
                {"name": "Apparition spéciale du gâteau en magie", "price": 45.00, "pricing_type": "FIXED"},
                {"name": "Atelier magie approfondi (+30 min)", "price": 50.00, "pricing_type": "PER_HOUR"}
            ]
        },
        {
            "name": "Super-Héros & Académie des Champions",
            "description": "Entraînement physique et ludique pour devenir de véritables héros : parcours d'obstacles, épreuves de courage et remise de capes officielles.",
            "base_price": 175.00,
            "duration_minutes": 90,
            "category": "ATELIER",
            "max_children": 15,
            "options": [
                {"name": "Cape & Masque de Super-Héros (par enfant)", "price": 5.00, "pricing_type": "PER_CHILD"},
                {"name": "Photobooth Super-Héros avec impression instantanée", "price": 50.00, "pricing_type": "FIXED"}
            ]
        },
        {
            "name": "Atelier Pâtisserie & Gourmandises VIP",
            "description": "Atelier créatif culinaire où les enfants préparent et décorent leurs propres cupcakes et sablés sous les conseils de nos chefs animateurs.",
            "base_price": 200.00,
            "duration_minutes": 120,
            "category": "ATELIER",
            "max_children": 12,
            "options": [
                {"name": "Tablier de chef personnalisé (par enfant)", "price": 7.00, "pricing_type": "PER_CHILD"},
                {"name": "Boîte de transport déco cadeaux gourmands", "price": 25.00, "pricing_type": "FIXED"}
            ]
        },
        {
            "name": "KIDS Disco & Karaoke Boom VIP",
            "description": "Une vraie discothèque pour enfants avec sono pro, jeux de lumière LED, machine à bulles et micros karaoké sur leurs Hits préférés.",
            "base_price": 230.00,
            "duration_minutes": 120,
            "category": "ANNIVERSAIRE",
            "max_children": 30,
            "options": [
                {"name": "Machine à bulles & fumée parfumée", "price": 30.00, "pricing_type": "FIXED"},
                {"name": "Bracelets & Accessoires fluos (par enfant)", "price": 3.00, "pricing_type": "PER_CHILD"}
            ]
        },
        {
            "name": "Kermesse & Olympiades Rétro",
            "description": "Des stands de jeux en bois traditionnels : tir à l'arc sécurisé, course en sac, chamboule-tout et grande cérémonie de médailles.",
            "base_price": 210.00,
            "duration_minutes": 150,
            "category": "SPECTACLE",
            "max_children": 25,
            "options": [
                {"name": "Médailles & Diplômes personnalisés (par enfant)", "price": 3.50, "pricing_type": "PER_CHILD"},
                {"name": "Machine à Barbe à Papa avec consommables", "price": 45.00, "pricing_type": "FIXED"}
            ]
        }
    ]

    created_services = []
    for s_data in services_data:
        options_list = s_data.pop("options")
        service = Service.objects.create(**s_data)
        for opt in options_list:
            Option.objects.create(service=service, **opt)
        created_services.append(service)

    print(f"✅ {len(created_services)} Services et leurs options créés.")

    # 3. CRÉATION DES ANIMATEURS
    animateurs_data = [
        {"email": "animateur@funkidz.fr", "first_name": "Lucas", "last_name": "Dupont", "phone": "0612345678", "rating": 4.9, "bio": "Spécialiste de la magie et des chasses au trésor depuis 5 ans."},
        {"email": "sophie.anim@funkidz.fr", "first_name": "Sophie", "last_name": "Martin", "phone": "0623456789", "rating": 4.8, "bio": "Comédienne passionnée par les ateliers créatifs et théâtraux."},
        {"email": "thomas.anim@funkidz.fr", "first_name": "Thomas", "last_name": "Bernard", "phone": "0634567890", "rating": 5.0, "bio": "DJ Junior et animateur sportif diplômé BAFA."},
        {"email": "emma.anim@funkidz.fr", "first_name": "Emma", "last_name": "Petit", "phone": "0645678901", "rating": 4.7, "bio": "Experte en maquillage artistique et aventures féeriques."}
    ]

    created_animators = []
    for a_data in animateurs_data:
        user, _ = User.objects.get_or_create(
            email=a_data["email"],
            defaults={"first_name": a_data["first_name"], "last_name": a_data["last_name"], "role": User.Role.ANIMATEUR, "is_verified": True}
        )
        user.set_password("animateur123")
        user.role = User.Role.ANIMATEUR
        user.save()
        profile, _ = AnimateurProfile.objects.get_or_create(
            user=user,
            defaults={"phone": a_data["phone"], "rating": a_data["rating"], "bio": a_data["bio"]}
        )
        created_animators.append(profile)

    print(f"✅ {len(created_animators)} Animateurs créés (Mot de passe: animateur123).")

    # 4. CRÉATION DES CLIENTS DE TEST
    clients_data = [
        {"email": "sedraniainaeuphredat@gmail.com", "first_name": "Sedra", "last_name": "Nia"},
        {"email": "euphredat91@gmail.com", "first_name": "Euphredat", "last_name": "Test"},
        {"email": "marie.dubois@gmail.com", "first_name": "Marie", "last_name": "Dubois"},
        {"email": "pierre.moreau@yahoo.fr", "first_name": "Pierre", "last_name": "Moreau"}
    ]

    created_clients = []
    for c_data in clients_data:
        user, _ = User.objects.get_or_create(
            email=c_data["email"],
            defaults={"first_name": c_data["first_name"], "last_name": c_data["last_name"], "role": User.Role.CLIENT, "is_verified": True}
        )
        user.set_password("password123")
        user.save()
        created_clients.append(user)

    print(f"✅ {len(created_clients)} Clients de test créés.")

    # 5. CRÉATION DE RÉSERVATIONS ET PAIEMENTS RÉALISTES
    bookings_data = [
        {
            "user": created_clients[0],
            "service": created_services[0], # Pirates
            "booking_date": date.today() + timedelta(days=3),
            "booking_time": time(14, 0),
            "nb_children": 12,
            "location_address": "15 Avenue des Champs-Élysées",
            "location_city": "Paris",
            "location_zip": "75008",
            "status": Booking.Status.CONFIRMED,
            "estimated_price": 190.00,
            "final_price": 225.00,
            "animator": created_animators[0], # Lucas
            "payment_status": Payment.Status.SUCCEEDED
        },
        {
            "user": created_clients[1],
            "service": created_services[1], # Magie
            "booking_date": date.today() + timedelta(days=7),
            "booking_time": time(15, 30),
            "nb_children": 10,
            "location_address": "8 Rue de la Paix",
            "location_city": "Boulogne-Billancourt",
            "location_zip": "92100",
            "status": Booking.Status.CONFIRMED,
            "estimated_price": 160.00,
            "final_price": 205.00,
            "animator": created_animators[1], # Sophie
            "payment_status": Payment.Status.SUCCEEDED
        },
        {
            "user": created_clients[2],
            "service": created_services[4], # KIDS Disco
            "booking_date": date.today() + timedelta(days=12),
            "booking_time": time(16, 0),
            "nb_children": 25,
            "location_address": "42 Rue Victor Hugo",
            "location_city": "Lyon",
            "location_zip": "69002",
            "status": Booking.Status.PENDING,
            "estimated_price": 230.00,
            "final_price": 260.00,
            "animator": None,
            "payment_status": Payment.Status.PENDING
        },
        {
            "user": created_clients[3],
            "service": created_services[2], # Super-Héros
            "booking_date": date.today() - timedelta(days=5),
            "booking_time": time(14, 30),
            "nb_children": 14,
            "location_address": "10 Boulevard Haussmann",
            "location_city": "Paris",
            "location_zip": "75009",
            "status": Booking.Status.DONE,
            "estimated_price": 175.00,
            "final_price": 225.00,
            "animator": created_animators[2], # Thomas
            "payment_status": Payment.Status.SUCCEEDED
        }
    ]

    for b_data in bookings_data:
        animator = b_data.pop("animator")
        pay_status = b_data.pop("payment_status")
        booking = Booking.objects.create(**b_data)

        # Création du paiement associé
        Payment.objects.create(
            booking=booking,
            amount=booking.final_price,
            stripe_session_id=f"demo_session_{booking.id}",
            status=pay_status
        )

        # Création de l'assignation si un animateur est désigné
        if animator:
            BookingAssignment.objects.create(
                booking=booking,
                animateur=animator,
                status=BookingAssignment.Status.ACCEPTED if booking.status in [Booking.Status.CONFIRMED, Booking.Status.DONE] else BookingAssignment.Status.PENDING
            )

        # Création d'un avis pour la prestation terminée
        if booking.status == Booking.Status.DONE:
            Review.objects.create(
                booking=booking,
                rating=5,
                comment="Animation incroyable ! Thomas a été fantastique avec les enfants, les activités super-héros étaient parfaitement rythmées. À refaire !"
            )

    print("✅ Réservations, Paiements, Assignations et Avis créés.")

    # 6. GALERIE MÉDIA
    media_items = [
        {"title": "Spectacle de Magie d'Anniversaire", "media_url": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80"},
        {"title": "Chasse au Trésor et Déguisements", "media_url": "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80"},
        {"title": "Animation Super-Héros et Parcours", "media_url": "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=800&q=80"},
        {"title": "Mini Boom Disco & Effets Lumineux", "media_url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"},
        {"title": "Olympiades & Défis Sportifs Enfants", "media_url": "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80"},
        {"title": "Atelier Maquillage Féerique", "media_url": "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80"}
    ]

    for idx, m_data in enumerate(media_items):
        MediaGallery.objects.create(
            title=m_data["title"],
            media_url=m_data["media_url"],
            media_type=MediaGallery.MediaType.IMAGE,
            order=idx + 1
        )

    print(f"✅ {len(media_items)} Photos ajoutées à la Galerie Média.")

    # 7. MESSAGES DE CONTACT ADMIN
    ContactMessage.objects.create(
        name="Jean-Marc Dupont",
        email="jeanmarc@gmail.com",
        phone="0611223344",
        message="Bonjour, proposez-vous des formules sur-mesure pour un groupe de 40 enfants lors d'un événement d'entreprise ?"
    )
    ContactMessage.objects.create(
        name="Claire Valette",
        email="claire.valette@sfr.fr",
        phone="0655443322",
        message="Merci pour la superbe prestation de magie de samedi dernier ! Tous les enfants ont adoré."
    )

    print("✅ Messages de contact ajoutés.")
    print("🎉 SEEDING COMPLET TERMINÉ AVEC SUCCÈS !")

if __name__ == "__main__":
    seed_all()
