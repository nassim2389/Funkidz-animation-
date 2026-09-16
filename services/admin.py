from django.contrib import admin
from django.utils.html import format_html
from .models import Service, Option

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('image_thumbnail', 'name', 'category', 'badge_label', 'base_price', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'description')
    readonly_fields = ('image_preview',)

    def image_thumbnail(self, obj):
        url = obj.get_image_url()
        return format_html('<img src="{}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 6px;" />', url)
    image_thumbnail.short_description = "Aperçu"

    def image_preview(self, obj):
        url = obj.get_image_url()
        return format_html('<img src="{}" style="max-width: 320px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />', url)
    image_preview.short_description = "Image Actuelle"

@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ('image_thumbnail', 'name', 'service', 'price', 'pricing_type', 'is_active')
    list_filter = ('pricing_type', 'is_active', 'service')
    search_fields = ('name', 'description')
    readonly_fields = ('image_preview',)

    def image_thumbnail(self, obj):
        url = obj.get_image_url()
        return format_html('<img src="{}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px;" />', url)
    image_thumbnail.short_description = "Aperçu"

    def image_preview(self, obj):
        url = obj.get_image_url()
        return format_html('<img src="{}" style="max-width: 250px; border-radius: 10px;" />', url)
    image_preview.short_description = "Image Actuelle"

