"""Rename Impact & Colleges menus, add Technology & Innovation and University Projects."""
from django.db import migrations


def update_menus(apps, schema_editor):
    MenuItem = apps.get_model('content', 'MenuItem')

    # Rename top-level menus
    MenuItem.objects.filter(label='Impact', parent__isnull=True, location='navbar').update(
        label='Impact & Community',
        description='Creating measurable impact through SDG-aligned initiatives, community outreach and partnerships.',
    )
    MenuItem.objects.filter(label='Colleges', parent__isnull=True, location='navbar').update(
        label='Colleges & Institutes',
        description='Our distinguished colleges, faculties, institutes and centres.',
    )

    # Add Technology & Innovation + University Projects under Research
    research = MenuItem.objects.filter(label='Research', parent__isnull=True, location='navbar').first()
    if research:
        MenuItem.objects.get_or_create(
            label='Technology & Innovation',
            parent=research,
            defaults=dict(
                url='/research/innovation',
                is_external=False,
                location='navbar',
                icon='',
                description='',
                column=2,
                display_order=9,
                is_active=True,
            ),
        )
        MenuItem.objects.get_or_create(
            label='University Projects',
            parent=research,
            defaults=dict(
                url='/research/university-projects',
                is_external=False,
                location='navbar',
                icon='',
                description='',
                column=2,
                display_order=10,
                is_active=True,
            ),
        )


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0031_innovationprogram_universityproject_and_more'),
    ]

    operations = [
        migrations.RunPython(update_menus, migrations.RunPython.noop),
    ]