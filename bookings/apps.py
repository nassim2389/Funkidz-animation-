from django.apps import AppConfig


class BookingsConfig(AppConfig):
    name = 'bookings'
    verbose_name = 'Gestion des Réservations'

    def ready(self):
        import bookings.signals
