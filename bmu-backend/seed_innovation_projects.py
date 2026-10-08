"""
Seed script: Innovation Programs (Technology & Innovation page) and
University Projects (University Projects page).

Creates placeholder rows that can be edited later via the Django admin
(/admin/content/innovationprogram/ and /admin/content/universityproject/).
"""
import base64
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bmu_backend.settings')
django.setup()

from django.core.files.base import ContentFile
from content.models import (
    InnovationProgram, InnovationProgramImage,
    UniversityProject, UniversityProjectImage,
)

TINY_PNG = base64.b64decode(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk'
    '+A8AAQUBAScY42YAAAAASUVORK5CYII='
)


def set_placeholder_image(obj, field, name):
    """Attach a tiny placeholder file to an ImageField if it is empty."""
    file_field = getattr(obj, field)
    if file_field and file_field.name:
        return False
    file_field.save(f'{name}.png', ContentFile(TINY_PNG), save=False)
    return True


def seed_innovation_programs():
    programs = [
        dict(
            slug='digital-health-innovation',
            title='Digital Health Innovation Programme',
            subtitle='Telemedicine, health informatics and AI-powered diagnostics',
            description='A flagship programme driving the digitisation of healthcare delivery in the Niger Delta through telemedicine platforms, electronic health records, and AI-assisted diagnostic tools developed with BMU clinical and engineering teams.',
            program_type='digital_health', status='ongoing', year=2022,
            lead_unit='Innovation & Technology Centre',
            objectives=[
                'Deploy telemedicine hubs across rural health centres',
                'Develop locally-tuned AI diagnostic assistants',
                'Build an interoperable electronic health record system',
            ],
            achievements=[
                '12 rural health centres connected to telemedicine hubs',
                'AI malaria microscopy model achieving 96% accuracy',
                '8,000+ patient consultations delivered remotely',
            ],
            partners=['NITDA', 'TETFUND', 'Google Health', 'Bayelsa State Ministry of Health'],
            stat_1_label='Communities Connected', stat_1_value='12',
            stat_2_label='Remote Consultations', stat_2_value='8,000+',
            stat_3_label='Diagnostic Accuracy', stat_3_value='96%',
            display_order=1, is_featured=True,
        ),
        dict(
            slug='medical-devices-prototyping',
            title='Affordable Medical Devices & Prototyping',
            subtitle='Design and prototyping of low-cost medical equipment',
            description='Using our makerspace and 3D printing facilities, the programme designs, prototypes and pilots low-cost medical equipment for resource-limited settings, including oxygen concentrators, incubator sensors and point-of-care diagnostics.',
            program_type='medical_devices', status='ongoing', year=2023,
            lead_unit='Innovation & Technology Centre',
            objectives=[
                'Prototype low-cost vital-signs monitors',
                'Pilot locally manufactured neonatal incubator components',
                'Transfer designs to local manufacturers',
            ],
            achievements=[
                '5 medical device prototypes developed',
                '2 designs licensed to local manufacturers',
                'Patent application filed for oxygen monitor',
            ],
            partners=['NCDMB', 'Medical Engineering Hub', 'Federal Ministry of Science'],
            stat_1_label='Prototypes Built', stat_1_value='5',
            stat_2_label='Patents Filed', stat_2_value='1',
            stat_3_label='Designs Licensed', stat_3_value='2',
            display_order=2, is_featured=False,
        ),
        dict(
            slug='biotech-genomics-research',
            title='Biotech & Genomics Research Programme',
            subtitle='Molecular diagnostics, genomics and personalised medicine',
            description='A research-driven programme applying genomic sequencing and molecular diagnostics to infectious disease surveillance, pharmacogenomics and personalised medicine for the Bayelsa population.',
            program_type='biotech', status='ongoing', year=2021,
            lead_unit='Research Institutes',
            objectives=[
                'Sequence circulating pathogens of regional importance',
                'Establish a genomic surveillance database',
                'Train postgraduate researchers in bioinformatics',
            ],
            achievements=[
                'Genomic lab commissioned with NextSeq capability',
                '3 regional pathogen datasets published',
                '20 postgraduate researchers trained in bioinformatics',
            ],
            partners=['WHO', 'TETFUND', 'Niger Delta University', 'Broad Institute'],
            stat_1_label='Genomes Sequenced', stat_1_value='1,200+',
            stat_2_label='Publications', stat_2_value='18',
            stat_3_label='Researchers Trained', stat_3_value='20',
            display_order=3, is_featured=False,
        ),
        dict(
            slug='ai-machine-learning-health',
            title='AI & Machine Learning for Health',
            subtitle='Applied artificial intelligence in medical education and care',
            description='The university is embedding artificial intelligence across medical education, clinical decision support and administration, including simulation-based training, automated assessment and AI tutors.',
            program_type='ai_ml', status='proposed', year=2025,
            lead_unit='Innovation & Technology Centre',
            objectives=[
                'Deploy AI-assisted virtual patient simulations',
                'Build an institutional AI usage policy and ethics framework',
                'Launch an AI literacy programme for faculty and students',
            ],
            achievements=[],
            partners=['Microsoft', 'NITDA', 'TETFUND'],
            stat_1_label='Planned Pilots', stat_1_value='3',
            stat_2_label='Faculty Training', stat_2_value='150',
            stat_3_label='Simulation Modules', stat_3_value='12',
            display_order=4, is_featured=False,
        ),
        dict(
            slug='telemedicine-niger-delta',
            title='Niger Delta Telemedicine Network',
            subtitle='Specialist care delivered to underserved communities',
            description='A collaborative network linking BMU specialists with community health centres across Bayelsa State, enabling remote consultations, second opinions and continuous professional development for rural clinicians.',
            program_type='telemedicine', status='ongoing', year=2023,
            lead_unit='Community Health & Innovation & Technology Centre',
            objectives=[
                'Connect every LGA health centre to a specialist hub',
                'Deliver CPD to rural clinicians via the network',
                'Reduce referral travel burden on patients',
            ],
            achievements=[
                '5 telemedicine hubs operational',
                '3,400 remote consultations completed',
                '60 rural clinicians onboarded',
            ],
            partners=['Bayelsa State Government', 'Nigerian Medical Association'],
            stat_1_label='Hubs Operational', stat_1_value='5',
            stat_2_label='Remote Consultations', stat_2_value='3,400+',
            stat_3_label='Clinicians Onboarded', stat_3_value='60',
            display_order=5, is_featured=False,
        ),
        dict(
            slug='health-entrepreneurship-hub',
            title='Health Entrepreneurship & Startup Support',
            subtitle='Nurturing the next generation of health-tech startups',
            description='A startup incubation programme supporting student and community entrepreneurs building health solutions, offering co-working space, mentorship, seed funding and access to clinical validation partners.',
            program_type='health_entrepreneurship', status='ongoing', year=2022,
            lead_unit='Innovation & Technology Centre',
            objectives=[
                'Incubate 10 health-tech startups annually',
                'Provide seed grants and business mentorship',
                'Bridge startups with clinical validation partners',
            ],
            achievements=[
                '15 startups supported',
                '2 startups raised external funding',
                '120 jobs created in the local innovation ecosystem',
            ],
            partners=['NITDA', 'Bank of Industry', 'Venco Hub'],
            stat_1_label='Startups Supported', stat_1_value='15',
            stat_2_label='External Funding Raised', stat_2_value='₦120M',
            stat_3_label='Jobs Created', stat_3_value='120',
            display_order=6, is_featured=False,
        ),
    ]

    created = updated = 0
    for data in programs:
        slug = data.pop('slug')
        obj, was_created = InnovationProgram.objects.update_or_create(slug=slug, defaults=data)
        if was_created:
            created += 1
        else:
            updated += 1
        if set_placeholder_image(obj, 'cover_image', f'{slug}-cover'):
            obj.save()
        if not obj.gallery_images.exists():
            img = InnovationProgramImage(program=obj, order=0, caption=f'{obj.title} — overview')
            img.image.save(f'{slug}-gallery', ContentFile(TINY_PNG), save=True)
        print(f"  {'Created' if was_created else 'Updated'} InnovationProgram: {obj.title}")
    print(f"{created} created, {updated} updated")


def seed_university_projects():
    projects = [
        dict(
            slug='university-teaching-hospital',
            title='University Teaching Hospital Development',
            subtitle='A 350-bed teaching hospital complex',
            description='The flagship infrastructure project of Bayelsa Medical University, establishing a modern teaching hospital complex supporting clinical training, specialist care and community services across the Niger Delta.',
            category='infrastructure', status='ongoing', year=2020,
            lead_unit='Office of the Vice-Chancellor',
            budget=25_000_000_000,
            highlights=[
                '350-bed capacity with dedicated maternity, surgical and ICU wings',
                'Full radiology suite (MRI, CT, ultrasound and X-ray)',
                'Clinical skills and simulation laboratories',
            ],
            display_order=1, is_featured=True,
        ),
        dict(
            slug='computer-based-testing-centre',
            title='Computer-Based Testing (CBT) Centre',
            subtitle='A digital examination centre for seamless assessments',
            description='A purpose-built computer-based testing centre supporting university examinations, professional examinations and JUPEB assessments, reinforcing BMU\u2019s technology-driven ASPIRE agenda.',
            category='technology', status='completed', year=2024,
            lead_unit='Centre for Foundation Studies',
            budget=350_000_000,
            highlights=[
                '300 workstations with continuous power backup',
                'Proctoring software and secure assessment platform',
                'Served 172 JUPEB students in the first Physics CBT session',
            ],
            display_order=2, is_featured=True,
        ),
        dict(
            slug='sampou-campus-development',
            title='Sampou Campus Development',
            subtitle='Expanding the specialised campus at Sampou',
            description='Development of the Sampou campus, housing the Pharmacognosy/Herbal Medicine Laboratory, Pharmaceutical/Medicine Chemistry Laboratory, Clinical Pharmacy Laboratory and faculty buildings, visited by the TETFUND delegation in 2026.',
            category='infrastructure', status='ongoing', year=2021,
            lead_unit='Sampou Campus Administration',
            budget=12_000_000_000,
            highlights=[
                'Pharmacognosy and herbal medicine laboratory',
                'Pharmaceutical and medicine chemistry laboratories',
                'Clinical pharmacy laboratory and faculty buildings',
            ],
            display_order=3, is_featured=False,
        ),
        dict(
            slug='malaria-research-network',
            title='Artemisinin Resistance Surveillance Network',
            subtitle='Monitoring antimalarial drug resistance in the Niger Delta',
            description='A WHO-supported surveillance network monitoring antimalarial drug resistance patterns across the Niger Delta, providing data that informs national malaria treatment guidelines.',
            category='research', status='ongoing', year=2022,
            lead_unit='Centre for Malaria Research',
            budget=120_000_000,
            highlights=[
                'Molecular surveillance across 8 LGAs',
                'Critical data for national treatment guidelines',
                'Collaboration with the WHO and national malaria programme',
            ],
            display_order=4, is_featured=True,
        ),
        dict(
            slug='free-medical-outreach',
            title='Free Medical Outreach Programme',
            subtitle='Annual free medical missions to underserved communities',
            description='The university\u2019s flagship community outreach, delivering free consultations, surgeries and medications to underserved communities, including the ASPIRE anniversary outreach attended by over 300 registered patients at the University Gate.',
            category='community', status='completed', year=2025,
            lead_unit='Community Health Outreach Directorate',
            budget=150_000_000,
            highlights=[
                '300+ patients registered at the Yenagoa anniversary outreach',
                'Screeening for blood pressure, malaria, eye and TB conditions',
                'Replicated statewide across the 8 LGAs of Bayelsa',
            ],
            display_order=5, is_featured=False,
        ),
        dict(
            slug='smart-classroom-ai-integration',
            title='Smart Classrooms & AI Integration',
            subtitle='Technology-enhanced learning across all programmes',
            description='Rollout of smart classrooms, virtual reality medical training suites and AI-assisted learning platforms, providing students with technology-enhanced, hands-on training aligned to BMU\u2019s innovation-driven agenda.',
            category='technology', status='ongoing', year=2023,
            lead_unit='Academic Affairs',
            budget=800_000_000,
            highlights=[
                'VR/AR medical simulation suite commissioned',
                'Smart boards and lecture capture in lecture halls',
                'AI tutors piloted for anatomy and physiology',
            ],
            display_order=6, is_featured=False,
        ),
    ]

    created = updated = 0
    for data in projects:
        slug = data.pop('slug')
        obj, was_created = UniversityProject.objects.update_or_create(slug=slug, defaults=data)
        if was_created:
            created += 1
        else:
            updated += 1
        if set_placeholder_image(obj, 'image', f'{slug}-cover'):
            obj.save()
        if not obj.gallery_images.exists():
            img = UniversityProjectImage(project=obj, order=0, caption=f'{obj.title} — overview')
            img.image.save(f'{slug}-gallery', ContentFile(TINY_PNG), save=True)
        print(f"  {'Created' if was_created else 'Updated'} UniversityProject: {obj.title}")
    print(f"{created} created, {updated} updated")


if __name__ == '__main__':
    print("=== Seeding Innovation Programs ===")
    seed_innovation_programs()
    print("\n=== Seeding University Projects ===")
    seed_university_projects()
    print("\n=== Summary ===")
    print(f"InnovationPrograms: {InnovationProgram.objects.filter(is_active=True).count()}")
    print(f"UniversityProjects: {UniversityProject.objects.filter(is_active=True).count()}")