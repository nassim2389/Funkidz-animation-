from django.apps import AppConfig


class AvailabilityConfig(AppConfig):
    name = 'availability'
    verbose_name = 'Disponibilités'

    def ready(self):
        import availability.signals

