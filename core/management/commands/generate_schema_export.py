"""
Genere un export SQL du SCHEMA seul (CREATE TABLE, index...), sans les
donnees (INSERT) — destine a un extrait pour le rapport ecrit (le prof
demande explicitement de ne pas mettre les INSERT dans ce document).

Le dump complet structure + donnees (usage reel, import dans une autre
base) reste dump.sql, genere separement via `sqlite3 db.sqlite3 .dump`.

Usage :
    python manage.py generate_schema_export
    python manage.py generate_schema_export --output chemin/vers/fichier.sql
"""

import sqlite3

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

DEFAULT_OUTPUT = 'schema.sql'


class Command(BaseCommand):
    help = "Genere schema.sql (structure seule, sans INSERT) pour le rapport."

    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            default=DEFAULT_OUTPUT,
            help=f"Chemin du fichier SQL genere (defaut : {DEFAULT_OUTPUT}).",
        )

    def handle(self, *args, **options):
        db_config = settings.DATABASES['default']
        if db_config['ENGINE'] != 'django.db.backends.sqlite3':
            raise CommandError(
                "Cette commande ne gere que SQLite (moteur configure : "
                f"{db_config['ENGINE']})."
            )

        output_path = options['output']
        conn = sqlite3.connect(db_config['NAME'])
        try:
            lines = [
                line for line in conn.iterdump()
                if not line.startswith('INSERT INTO')
            ]
        finally:
            conn.close()

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines) + '\n')

        self.stdout.write(self.style.SUCCESS(
            f'Schema (sans donnees) genere : {output_path} '
            f'({len(lines)} lignes SQL).'
        ))
