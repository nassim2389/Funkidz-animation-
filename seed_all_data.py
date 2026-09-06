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
    print("🚀 Démarrage du remplissage MASSIF et COMPLET de la base de données...")

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

    # 2. CRÉATION DE 10 FORMULES & SERVICES
    services_data = [
        {
            "name": "Chasse au Trésor des Pirates",
            "description": "Une aventure grandeur nature avec déguisements, carte ancienne mystérieuse, énigmes captivantes et ouverture du grand coffre aux trésors rempli de pièces d'or.",
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
            "description": "Un spectacle de magie interactif et saisissant avec colombes, apparitions mystérieuses et atelier d'initiation où chaque enfant devient apprenti sorcier.",
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
            "description": "Entraînement physique et ludique pour devenir de véritables héros : parcours d'obstacles, épreuves de courage, tests de supers pouvoirs et remise de capes officielles.",
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
            "description": "Atelier créatif culinaire où les enfants préparent et décorent leurs propres cupcakes et sablés sous les conseils avisés de nos chefs animateurs.",
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
        },
        {
            "name": "Escape Game & Enquête Mystère",
            "description": "Un scénario d'évasion palpitant à domicile : fouille, messages secrets à décoder et énigmes scientifiques pour résoudre le mystère avant le temps imparti.",
            "base_price": 220.00,
            "duration_minutes": 100,
            "category": "ATELIER",
            "max_children": 12,
            "options": [
                {"name": "Kit Enquêteur & Loupe d'agent secret (par enfant)", "price": 6.50, "pricing_type": "PER_CHILD"},
                {"name": "Cadenas cryptex surprise final", "price": 35.00, "pricing_type": "FIXED"}
            ]
        },
        {
            "name": "Princesse Féerique & Bal Royal",
            "description": "Un conte de fées vivant avec défilé royal, initiation aux danses de la cour, ateliers couronnes scintillantes et séances photos enchantées.",
            "base_price": 185.00,
            "duration_minutes": 90,
            "category": "ANNIVERSAIRE",
            "max_children": 15,
            "options": [
                {"name": "Couronne & Baguette brillante (par enfant)", "price": 5.50, "pricing_type": "PER_CHILD"},
                {"name": "Tapis rouge royal & Trône photo", "price": 40.00, "pricing_type": "FIXED"}
            ]
        },
        {
            "name": "Mascotte Géante & Boum des Tout-Petits",
            "description": "Spécialement pensé pour les 2 à 5 ans : comptines, mini-jeux sensoriels, ateliers ballons sculptés et câlins avec notre mascotte géante.",
            "base_price": 150.00,
            "duration_minutes": 75,
            "category": "SPECTACLE",
            "max_children": 10,
            "options": [
                {"name": "Sculpture sur ballon personnalisée (par enfant)", "price": 2.50, "pricing_type": "PER_CHILD"},
                {"name": "Mascotte supplémentaire au choix", "price": 60.00, "pricing_type": "FIXED"}
            ]
        },
        {
            "name": "Atelier Scientifique & Expériences Étonnantes",
            "description": "Faites découvrir la science en s'amusant : éruptions de volcans, fabriquer de la pâte slime fluo et réactions chimiques multicolores sécurisées.",
            "base_price": 195.00,
            "duration_minutes": 90,
            "category": "ATELIER",
            "max_children": 14,
            "options": [
                {"name": "Blouse de savant fou & Lunettes (par enfant)", "price": 6.00, "pricing_type": "PER_CHILD"},
                {"name": "Pot de Slime personnalisé à emporter", "price": 4.00, "pricing_type": "PER_CHILD"}
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

    # 3. CRÉATION DE 6 ANIMATEURS COMPLETS
    animateurs_data = [
        {"email": "animateur@funkidz.fr", "first_name": "Lucas", "last_name": "Dupont", "phone": "0612345678", "rating": 4.9, "bio": "Spécialiste de la magie et des chasses au trésor depuis 5 ans."},
        {"email": "sophie.anim@funkidz.fr", "first_name": "Sophie", "last_name": "Martin", "phone": "0623456789", "rating": 4.8, "bio": "Comédienne passionnée par les ateliers créatifs et théâtraux."},
        {"email": "thomas.anim@funkidz.fr", "first_name": "Thomas", "last_name": "Bernard", "phone": "0634567890", "rating": 5.0, "bio": "DJ Junior et animateur sportif diplômé BAFA."},
        {"email": "emma.anim@funkidz.fr", "first_name": "Emma", "last_name": "Petit", "phone": "0645678901", "rating": 4.7, "bio": "Experte en maquillage artistique et aventures féeriques."},
        {"email": "alexandre.anim@funkidz.fr", "first_name": "Alexandre", "last_name": "Roux", "phone": "0656789012", "rating": 4.9, "bio": "Spécialiste des escape games et ateliers scientifiques passionnants."},
        {"email": "chloe.anim@funkidz.fr", "first_name": "Chloé", "last_name": "Morel", "phone": "0667890123", "rating": 4.8, "bio": "Animatrice diplômée spécialiste des tout-petits et mascottes."}
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

    # 4. CRÉATION DES CLIENTS ET DE L'ADMINISTRATEUR DE TEST
    admin_user, _ = User.objects.get_or_create(
        email="admin@funkidz.fr",
        defaults={"first_name": "Administrateur", "last_name": "Funkidz", "role": User.Role.ADMIN, "is_staff": True, "is_superuser": True, "is_verified": True}
    )
    admin_user.set_password("admin123")
    admin_user.role = User.Role.ADMIN
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.save()
    print("✅ Compte Administrateur fonctionnel créé (admin@funkidz.fr / admin123).")

    clients_data = [
        {"email": "sedraniainaeuphredat@gmail.com", "first_name": "Sedra", "last_name": "Nia"},
        {"email": "euphredat91@gmail.com", "first_name": "Euphredat", "last_name": "Test"},
        {"email": "marie.dubois@gmail.com", "first_name": "Marie", "last_name": "Dubois"},
        {"email": "pierre.moreau@yahoo.fr", "first_name": "Pierre", "last_name": "Moreau"},
        {"email": "julie.laurent@outlook.com", "first_name": "Julie", "last_name": "Laurent"},
        {"email": "david.benoit@gmail.com", "first_name": "David", "last_name": "Benoit"}
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
            "animator": created_animators[0],
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
            "animator": created_animators[1],
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
            "animator": created_animators[2],
            "payment_status": Payment.Status.SUCCEEDED
        },
        {
            "user": created_clients[4],
            "service": created_services[6], # Escape Game
            "booking_date": date.today() + timedelta(days=15),
            "booking_time": time(14, 0),
            "nb_children": 10,
            "location_address": "25 Rue de la République",
            "location_city": "Lille",
            "location_zip": "59000",
            "status": Booking.Status.CONFIRMED,
            "estimated_price": 220.00,
            "final_price": 255.00,
            "animator": created_animators[4],
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

    # 6. GALERIE MÉDIA DE 12 PHOTOS HD
    media_items = [
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
    print("🎉 SEEDING COMPLET ET MASSIF TERMINÉ AVEC SUCCÈS !")

if __name__ == "__main__":
    seed_all()
