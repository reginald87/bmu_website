"""Seed SDG 17 (Partnerships for the Goals) tracking metrics."""
from django.db import migrations


METRICS = [
    {'label': 'Active international partnerships', 'current_value': 10, 'target_value': 15, 'unit': 'partners'},
    {'label': 'Joint research projects', 'current_value': 12, 'target_value': 20, 'unit': 'projects'},
    {'label': 'Student exchange programmes', 'current_value': 2, 'target_value': 6, 'unit': 'programmes'},
    {'label': 'Countries with active partners', 'current_value': 6, 'target_value': 10, 'unit': 'countries'},
]


def seed_sdg17_metrics(apps, schema_editor):
    SDGMetric = apps.get_model('academics', 'SDGMetric')
    for metric in METRICS:
        SDGMetric.objects.update_or_create(
            sdg_code='sdg17',
            label=metric['label'],
            defaults={**metric, 'is_active': True},
        )


def reverse_seed(apps, schema_editor):
    SDGMetric = apps.get_model('academics', 'SDGMetric')
    SDGMetric.objects.filter(sdg_code='sdg17').delete()


class Migration(migrations.Migration):
    dependencies = [
        ('academics', '0018_alter_sdgmetric_sdg_code'),
    ]

    operations = [
        migrations.RunPython(seed_sdg17_metrics, reverse_seed),
    ]
