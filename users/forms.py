from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


def email_already_used(email, exclude_pk=None):
    """Vrai si l'adresse est déjà utilisée par un autre compte, quelle que soit la casse."""
    qs = User.objects.filter(email__iexact=User.objects.normalize_email(email))
    if exclude_pk is not None:
        qs = qs.exclude(pk=exclude_pk)
    return qs.exists()


class SignupForm(forms.Form):
    email = forms.EmailField(error_messages={
        'required': "L'adresse e-mail est obligatoire.",
        'invalid': "L'adresse e-mail n'est pas valide.",
    })
    password = forms.CharField(widget=forms.PasswordInput, error_messages={
        'required': "Le mot de passe est obligatoire.",
    })

    def clean_email(self):
        email = User.objects.normalize_email(self.cleaned_data['email'])
        if email_already_used(email):
            raise forms.ValidationError(
                "Un compte existe déjà avec cette adresse e-mail. Connectez-vous ou utilisez une autre adresse."
            )
        return email

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        password = cleaned_data.get('password')
        if password:
            try:
                validate_password(password, user=User(email=email or ''))
            except forms.ValidationError as exc:
                self.add_error('password', exc)
        return cleaned_data

    def save(self):
        return User.objects.create_user(
            email=self.cleaned_data['email'],
            password=self.cleaned_data['password'],
            is_verified=True,
        )


class UserAdminForm(forms.ModelForm):
    """Formulaire d'administration : refuse un doublon d'adresse différant seulement par la casse."""

    class Meta:
        model = User
        fields = '__all__'

    def clean_email(self):
        email = User.objects.normalize_email(self.cleaned_data.get('email'))
        if email_already_used(email, exclude_pk=self.instance.pk):
            raise forms.ValidationError("Un compte existe déjà avec cette adresse e-mail.")
        return email
