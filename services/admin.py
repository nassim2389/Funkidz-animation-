from django.contrib import admin
from .models import Service, Option

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'base_price', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'description')

@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'service', 'price', 'pricing_type', 'is_active')
    list_filter = ('pricing_type', 'is_active', 'service')
    search_fields = ('name', 'description')
