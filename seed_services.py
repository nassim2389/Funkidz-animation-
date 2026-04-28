from services.models import Service, Option

def seed_data():
    # Clear existing
    Option.objects.all().delete()
    Service.objects.all().delete()

    # Service 1
    s1 = Service.objects.create(
        name="Magie & Sortilèges 🪄",
        description="Un spectacle de magie époustouflant suivi d'un atelier pour apprendre ses premiers tours !",
        base_price=150.00,
        duration_minutes=90,
        category='ANNIVERSAIRE',
        max_children=15
    )
    Option.objects.create(service=s1, name="Chapeau de magicien", price=5.00, pricing_type='PER_CHILD')
    Option.objects.create(service=s1, name="Spectacle de lapin", price=50.00, pricing_type='FIXED')

    # Service 2
    s2 = Service.objects.create(
        name="Aventure Pirate 🏴‍☠️",
        description="Une chasse au trésor géante avec costumes, cartes et un vrai coffre à bijoux !",
        base_price=180.00,
        duration_minutes=120,
        category='ANNIVERSAIRE',
        max_children=20
    )
    Option.objects.create(service=s2, name="Maquillage pirate", price=3.00, pricing_type='PER_CHILD')
    Option.objects.create(service=s2, name="Épées en mousse", price=40.00, pricing_type='FIXED')

    # Service 3
    s3 = Service.objects.create(
        name="Boum des P'tits Loups 💃",
        description="Musique, lumières, confettis et chorégraphies endiablées avec notre DJ animateur !",
        base_price=120.00,
        duration_minutes=60,
        category='ANNIVERSAIRE',
        max_children=30
    )
    Option.objects.create(service=s3, name="Barbe à papa", price=2.00, pricing_type='PER_CHILD')
    Option.objects.create(service=s3, name="Machine à bulles", price=20.00, pricing_type='FIXED')

    print("Data seeded successfully!")

if __name__ == "__main__":
    seed_data()
