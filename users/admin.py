from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, AnimateurProfile

class AnimateurProfileInline(admin.StackedInline):
    model = AnimateurProfile
    can_delete = False
    verbose_name_plural = 'Profil Animateur'

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_verified', 'is_staff')
    list_filter = ('role', 'is_verified', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    inlines = (AnimateurProfileInline,)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informations personnelles', {'fields': ('first_name', 'last_name', 'role', 'is_verified')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates importantes', {'fields': ('last_login', 'date_joined')}),
    )

    def save_model(self, request, obj, form, change):
        # Auto-create animateur profile if role is ANIMATEUR
        super().save_model(request, obj, form, change)
        if obj.role == User.Role.ANIMATEUR:
            AnimateurProfile.objects.get_or_create(user=obj)

@admin.register(AnimateurProfile)
class AnimateurProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'rating')
    search_fields = ('user__email', 'phone')

