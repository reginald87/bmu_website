from django.db import migrations


def seed_research_development_center(apps, schema_editor):
    ResearchAndDevelopment = apps.get_model('research', 'ResearchAndDevelopment')
    ResearchAndDevelopment.objects.get_or_create(
        slug='research-development-center',
        defaults=dict(
            name='Research & Development Center',
            code='RDC',
            director_display_name='Prof. Emmanuel Okpako',
            description=(
                'The Research & Development Center (RDC) is the flagship research arm of '
                'Bayelsa Medical University, dedicated to advancing medical knowledge through '
                'cutting-edge research, innovation, and collaboration. The center addresses '
                'critical health challenges facing the Niger Delta region and Nigeria at large, '
                'with a focus on translating research findings into tangible health outcomes '
                'and policy recommendations.'
            ),
            mission=(
                'To conduct innovative, impactful research that addresses pressing health '
                'challenges in the Niger Delta and beyond, while fostering a culture of '
                'scientific excellence and collaboration.'
            ),
            vision=(
                'To be a leading center for medical research and innovation in Africa, '
                'recognized for our contributions to global health knowledge and the '
                'development of sustainable healthcare solutions.'
            ),
            research_areas=(
                'Malaria & Vector-Borne Diseases, Non-Communicable Diseases, '
                'Maternal & Child Health, Infectious Diseases & Epidemiology, '
                'Neuroscience & Mental Health, Environmental Health & Climate Impact, '
                'Health Systems & Policy Research, Genomics & Precision Medicine'
            ),
            email='rdc@bmu.edu.ng',
            phone='+234 803 111 0030',
            location='Research & Development Complex, BMU Main Campus, Elebele, Yenagoa',
            total_publications=500,
            ongoing_projects_count=50,
            completed_projects_count=120,
            is_active=True,
            is_featured=True,
            established_date='2018-09-01',
        ),
    )


class Migration(migrations.Migration):

    dependencies = [
        ('research', '0004_publication_category'),
    ]

    operations = [
        migrations.RunPython(seed_research_development_center, reverse_code=migrations.RunPython.noop),
    ]
