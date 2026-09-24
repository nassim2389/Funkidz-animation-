from django.db import migrations


def lowercase_emails(apps, schema_editor):
    """
    Passe les adresses existantes en minuscules. Une adresse dont la version
    en minuscules appartient déjà à un autre compte est laissée inchangée,
    afin de ne jamais fusionner ni écraser de compte.
    """
    User = apps.get_model('users', 'User')
    for user in User.objects.all().only('id', 'email'):
        normalized = (user.email or '').strip().lower()
        if normalized == user.email:
            continue
        if User.objects.filter(email=normalized).exclude(pk=user.pk).exists():
            continue
        User.objects.filter(pk=user.pk).update(email=normalized)


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_animateurprofile_options_alter_user_options_and_more'),
    ]

    operations = [
        migrations.RunPython(lowercase_emails, migrations.RunPython.noop),
    ]
