"""Seed SDG 17 (Partnerships for the Goals)."""
from django.db import migrations


SDG_17 = {
    'number': 17,
    'title': 'Partnerships for the Goals',
    'short_title': 'Partnerships',
    'color': '#19486a',
    'icon': 'Handshake',
    'description': (
        'Strengthen the means of implementation and revitalize the global '
        'partnership for sustainable development.'
    ),
    'contributions': [
        'Active partnerships with 10 international institutions, NGOs and government agencies advancing health research and education.',
        'Collaboration with WHO, UNICEF and UNFPA on disease surveillance, maternal and child health, and immunization programmes.',
        'Academic partnerships with institutions such as the London School of Hygiene & Tropical Medicine for joint research and faculty exchange.',
        'Student and staff exchange programmes that build global capacity and share best practice in medical education.',
    ],
    'metric_1_label': 'International partnerships',
    'metric_1_value': '10',
    'metric_1_target': '15',
    'metric_2_label': 'Joint research projects',
    'metric_2_value': '12',
    'metric_2_target': '20',
    'metric_3_label': 'Student exchange programmes',
    'metric_3_value': '2',
    'metric_3_target': '6',
    'progress_data': [
        {'year': '2020', 'partnerships': 4, 'projects': 3},
        {'year': '2021', 'partnerships': 6, 'projects': 5},
        {'year': '2022', 'partnerships': 7, 'projects': 8},
        {'year': '2023', 'partnerships': 9, 'projects': 10},
        {'year': '2024', 'partnerships': 10, 'projects': 12},
    ],
    'display_order': 17,
    'is_active': True,
    'is_featured': True,
}


def seed_sdg17(apps, schema_editor):
    SDG = apps.get_model('content', 'SDG')
    SDG.objects.update_or_create(number=SDG_17['number'], defaults=SDG_17)


def reverse_seed(apps, schema_editor):
    SDG = apps.get_model('content', 'SDG')
    SDG.objects.filter(number=17).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('content', '0032_update_menus_and_add_research_items'),
    ]

    operations = [
        migrations.RunPython(seed_sdg17, reverse_seed),
    ]
