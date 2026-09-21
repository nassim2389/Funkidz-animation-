"""
Genere le dictionnaire de donnees du projet a partir des modeles Django.

Le schema reel (models.py) est la source de verite : plutot que de
retranscrire les tables a la main dans le rapport (et de devoir le refaire a
chaque champ ajoute), cette commande introspecte les modeles et produit un
Markdown a jour.

Usage :
    python manage.py generate_data_dictionary
    python manage.py generate_data_dictionary --output chemin/vers/fichier.md
"""

from django.apps import apps
from django.core.management.base import BaseCommand
from django.db.models.fields import NOT_PROVIDED

# Ordre metier plutot qu'alphabetique : suit le cycle de vie d'une
# reservation (qui, quoi, quand, combien, avis, medias, contact).
APP_ORDER = [
    'users',
    'services',
    'bookings',
    'availability',
    'payments',
    'reviews',
    'media',
    'contact',
]

DEFAULT_OUTPUT = 'dictionnaire-donnees.md'


def _constraints(field, is_pk):
    parts = []
    if is_pk:
        parts.append('cle primaire')
    if getattr(field, 'unique', False) and not is_pk:
        parts.append('unique')
    parts.append('obligatoire' if not field.null and not is_pk else 'optionnel')
    if getattr(field, 'max_length', None):
        parts.append(f'max {field.max_length} caracteres')
    if field.default is not NOT_PROVIDED and not callable(field.default):
        parts.append(f'defaut = {field.default!r}')
    if getattr(field, 'choices', None):
        values = ', '.join(str(c[0]) for c in field.choices)
        parts.append(f'choix : {values}')
    return ' · '.join(parts)


def _field_type(field):
    if field.is_relation:
        target = f'{field.related_model._meta.app_label}.{field.related_model.__name__}'
        return f'{field.get_internal_type()} → {target}'
    return field.get_internal_type()


def _description(field):
    if field.help_text:
        return str(field.help_text)
    if field.verbose_name:
        return str(field.verbose_name).capitalize()
    return ''


class Command(BaseCommand):
    help = "Genere docs/dictionnaire-donnees.md a partir des modeles Django."

    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            default=DEFAULT_OUTPUT,
            help=f"Chemin du fichier Markdown genere (defaut : {DEFAULT_OUTPUT}).",
        )

    def handle(self, *args, **options):
        output_path = options['output']
        lines = ['# Dictionnaire de donnees', '']
        relations = []

        for app_label in APP_ORDER:
            app_config = apps.get_app_config(app_label)
            models = sorted(app_config.get_models(), key=lambda m: m.__name__)
            if not models:
                continue

            for model in models:
                meta = model._meta
                lines.append(f'## {meta.verbose_name_plural} (`{meta.db_table}`)')
                lines.append('')
                lines.append('| Champ | Type | Contraintes | Description |')
                lines.append('|---|---|---|---|')

                for field in meta.get_fields():
                    if not getattr(field, 'concrete', False):
                        continue

                    is_pk = getattr(field, 'primary_key', False)
                    lines.append(
                        f'| `{field.name}` | {_field_type(field)} | '
                        f'{_constraints(field, is_pk)} | {_description(field)} |'
                    )

                    if field.is_relation and field.related_model:
                        relations.append(
                            f'`{meta.app_label}.{model.__name__}.{field.name}` → '
                            f'`{field.related_model._meta.app_label}.{field.related_model.__name__}`'
                        )

                lines.append('')

        lines.append('## Relations entre tables')
        lines.append('')
        for rel in relations:
            lines.append(f'- {rel}')
        lines.append('')

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))

        self.stdout.write(self.style.SUCCESS(
            f'Dictionnaire de donnees genere : {output_path} '
            f'({len(relations)} relations trouvees).'
        ))
