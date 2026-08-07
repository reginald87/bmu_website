"""Add Webmaster placeholder to the contact page's department_contacts section."""
from django.db import migrations


def add_webmaster(apps, schema_editor):
    PS = apps.get_model('content', 'PageSection')
    section = PS.objects.filter(page_key='contact', section_key='department_contacts').first()
    if section is None:
        return
    data = list(section.data or [])
    if any(d.get('name') == 'Webmaster' for d in data):
        return
    data.append({'name': 'Webmaster', 'email': 'webmaster@bmu.edu.ng', 'phone': '+234 803 123 4573'})
    section.data = data
    section.save(update_fields=['data'])


def remove_webmaster(apps, schema_editor):
    PS = apps.get_model('content', 'PageSection')
    section = PS.objects.filter(page_key='contact', section_key='department_contacts').first()
    if section is None:
        return
    data = [d for d in (section.data or []) if d.get('name') != 'Webmaster']
    section.data = data
    section.save(update_fields=['data'])


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0025_contactinfo'),
    ]

    operations = [
        migrations.RunPython(add_webmaster, remove_webmaster),
    ]
