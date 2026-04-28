from django.views.generic import ListView
from services.models import Service

class ServiceListView(ListView):
    model = Service
    template_name = 'services/list.html'
    context_object_name = 'services'
