from django.db import migrations


def seed_campus_stats(apps, schema_editor):
    CampusStat = apps.get_model('content', 'CampusStat')
    default_stats = [
        {'label': 'Students', 'value': '3,500+', 'display_order': 1},
        {'label': 'Student Organizations', 'value': '50+', 'display_order': 2},
        {'label': 'Campus Size', 'value': '200+ Acres', 'display_order': 3},
        {'label': 'Residential Halls', 'value': '6', 'display_order': 4},
        {'label': 'Dining Options', 'value': '4', 'display_order': 5},
        {'label': 'Sports Facilities', 'value': '8', 'display_order': 6},
    ]
    for stat in default_stats:
        CampusStat.objects.get_or_create(
            label=stat['label'],
            defaults=stat,
        )


def reverse_seed(apps, schema_editor):
    CampusStat = apps.get_model('content', 'CampusStat')
    labels = ['Students', 'Student Organizations', 'Campus Size', 'Residential Halls', 'Dining Options', 'Sports Facilities']
    CampusStat.objects.filter(label__in=labels).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('content', '0008_campuscontactinfo_campusfeature_campusstat_and_more'),
    ]
    operations = [
        migrations.RunPython(seed_campus_stats, reverse_seed),
    ]
