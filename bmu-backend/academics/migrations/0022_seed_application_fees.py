"""Seed default application fees per programme level.

Undergraduate matches the fee already configured on current programmes
(NGN 2,500 / USD 50). The other levels are seeded with the same values as
placeholders — edit them in Django admin → Application Fees to set the real
Masters / PhD / Certificate / Professional amounts.
"""
from django.db import migrations


LEVEL_FEES = [
    ('undergraduate', 2500, 50),
    ('masters', 2500, 50),
    ('phd', 2500, 50),
    ('certificate', 2500, 50),
    ('professional', 2500, 50),
]


def seed_application_fees(apps, schema_editor):
    ApplicationFee = apps.get_model('academics', 'ApplicationFee')
    for level, local_fee, intl_fee in LEVEL_FEES:
        ApplicationFee.objects.update_or_create(
            level=level,
            defaults={'local_fee': local_fee, 'intl_fee': intl_fee},
        )


def reverse_seed(apps, schema_editor):
    ApplicationFee = apps.get_model('academics', 'ApplicationFee')
    ApplicationFee.objects.filter(level__in=[lvl for lvl, _, _ in LEVEL_FEES]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('academics', '0021_applicationfee'),
    ]

    operations = [
        migrations.RunPython(seed_application_fees, reverse_seed),
    ]
