from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .forms import email_already_used
from .models import User, AnimateurProfile


def _validate_unique_email(email, instance=None):
    email = User.objects.normalize_email(email)
    if email_already_used(email, exclude_pk=getattr(instance, 'pk', None)):
        raise serializers.ValidationError("Un compte existe déjà avec cette adresse e-mail.")
    return email


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'is_verified', 'created_at')
        # Le rôle détermine les droits d'accès : il n'est modifiable que par l'administration.
        read_only_fields = ('id', 'role', 'is_verified', 'created_at')

    def validate_email(self, value):
        return _validate_unique_email(value, self.instance)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'first_name', 'last_name')

    def validate_email(self, value):
        return _validate_unique_email(value)

    def validate(self, attrs):
        validate_password(attrs['password'], user=User(email=attrs.get('email', '')))
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
