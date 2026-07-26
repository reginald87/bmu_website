"""Seed menu items and utility links from existing hardcoded data."""
from django.db import migrations


def seed_utility_links(apps, schema_editor):
    UtilityLink = apps.get_model('content', 'UtilityLink')
    links = [
        {'label': 'Student Portal', 'url': 'https://portal.bmu.edu.ng', 'display_order': 1},
        {'label': 'Staff Portal', 'url': 'https://staff.bmu.edu.ng', 'display_order': 2},
        {'label': 'Applicant Portal', 'url': 'https://applicant.bmu.edu.ng', 'display_order': 3},
        {'label': 'E-Library', 'url': 'https://library.bmu.edu.ng', 'display_order': 4},
        {'label': 'Webmail', 'url': 'https://mail.bmu.edu.ng', 'display_order': 5},
    ]
    for link in links:
        UtilityLink.objects.get_or_create(
            url=link['url'],
            defaults={'label': link['label'], 'display_order': link['display_order'], 'is_active': True},
        )


def seed_menu_items(apps, schema_editor):
    MenuItem = apps.get_model('content', 'MenuItem')

    # Top-level menu items
    top_items = [
        {'label': 'About', 'url': '/about', 'icon': 'University', 'display_order': 1, 'description': 'Discover our mission, leadership, and commitment to medical education excellence.'},
        {'label': 'Academics', 'url': '/academics', 'icon': 'GraduationCap', 'display_order': 2, 'description': 'Explore our comprehensive academic programs and world-class faculty.'},
        {'label': 'Research', 'url': '/research', 'icon': 'FlaskConical', 'display_order': 3, 'description': 'Driving innovation through groundbreaking research and partnerships.'},
        {'label': 'Colleges', 'url': '/academics/colleges', 'icon': 'Building2', 'display_order': 4, 'description': 'Our distinguished colleges and academic units.'},
        {'label': 'Campus Life', 'url': '/about/campus', 'icon': 'Users', 'display_order': 5, 'description': 'Experience vibrant campus living at BMU.'},
        {'label': 'International', 'url': '/international', 'icon': 'Globe', 'display_order': 6, 'description': 'Connecting BMU with the global academic community.'},
        {'label': 'News & Events', 'url': '/news', 'icon': 'Newspaper', 'display_order': 7, 'description': 'Stay updated with the latest from BMU.'},
        {'label': 'Impact', 'url': '/impact', 'icon': 'HeartHandshake', 'display_order': 8, 'description': 'Making a difference in healthcare and communities.'},
        {'label': 'Portals', 'url': '/portals', 'icon': 'LogIn', 'display_order': 9, 'description': 'Access your BMU portals and services.'},
    ]

    created_items = {}
    for item in top_items:
        obj, _ = MenuItem.objects.get_or_create(
            label=item['label'],
            parent=None,
            defaults={
                'url': item['url'],
                'is_external': False,
                'location': 'navbar',
                'icon': item['icon'],
                'description': item['description'],
                'column': 1,
                'display_order': item['display_order'],
                'is_active': True,
            },
        )
        created_items[item['label']] = obj

    # Submenu items
    submenus = [
        # About
        {'parent': 'About', 'label': 'History', 'url': '/about/history', 'column': 1, 'order': 1},
        {'parent': 'About', 'label': 'Mission & Vision', 'url': '/about/vision-mission', 'column': 1, 'order': 2},
        {'parent': 'About', 'label': 'Governance', 'url': '/about/governance', 'column': 1, 'order': 3},
        {'parent': 'About', 'label': 'Leadership', 'url': '/about/leadership', 'column': 1, 'order': 4},
        {'parent': 'About', 'label': 'Rankings & Accreditations', 'url': '/about/rankings', 'column': 1, 'order': 5},
        {'parent': 'About', 'label': 'Campus Gallery', 'url': '/gallery', 'column': 2, 'order': 6},
        {'parent': 'About', 'label': 'Campus Life', 'url': '/about/campus', 'column': 2, 'order': 7},
        {'parent': 'About', 'label': 'People', 'url': '/people', 'column': 2, 'order': 8},
        {'parent': 'About', 'label': 'Staff Directory', 'url': '/about/staff', 'column': 2, 'order': 9},
        {'parent': 'About', 'label': 'Contact Us', 'url': '/contact', 'column': 2, 'order': 10},

        # Academics
        {'parent': 'Academics', 'label': 'Programs', 'url': '/academics/programs', 'column': 1, 'order': 1},
        {'parent': 'Academics', 'label': 'Admissions', 'url': '/academics/admissions', 'column': 1, 'order': 2},
        {'parent': 'Academics', 'label': 'Academic Calendar', 'url': '/academics/calendar', 'column': 1, 'order': 3},
        {'parent': 'Academics', 'label': 'Library', 'url': '/academics/library', 'column': 1, 'order': 4},
        {'parent': 'Academics', 'label': 'All Colleges', 'url': '/academics/colleges', 'column': 2, 'order': 5},
        {'parent': 'Academics', 'label': 'All Faculties', 'url': '/academics/faculties', 'column': 2, 'order': 6},
        {'parent': 'Academics', 'label': 'All Departments', 'url': '/academics/departments', 'column': 2, 'order': 7},
        {'parent': 'Academics', 'label': 'Academic Units', 'url': '/academic-units', 'column': 2, 'order': 8},

        # Research
        {'parent': 'Research', 'label': 'Research & Development', 'url': '/research/centers', 'column': 1, 'order': 1},
        {'parent': 'Research', 'label': 'Publications', 'url': '/research/publications', 'column': 1, 'order': 2},
        {'parent': 'Research', 'label': 'Research Funding', 'url': '/research/funding', 'column': 1, 'order': 3},
        {'parent': 'Research', 'label': 'Collaborations', 'url': '/research/collaborations', 'column': 1, 'order': 4},
        {'parent': 'Research', 'label': 'Faculty Directory', 'url': '/research/faculty', 'column': 2, 'order': 5},
        {'parent': 'Research', 'label': 'Research Centers', 'url': '/research/centers', 'column': 2, 'order': 6},
        {'parent': 'Research', 'label': 'Grants & Funding', 'url': '/research/funding', 'column': 2, 'order': 7},
        {'parent': 'Research', 'label': 'Ethics Committee', 'url': '/research/collaborations', 'column': 2, 'order': 8},

        # Colleges
        {'parent': 'Colleges', 'label': 'All Colleges', 'url': '/academics/colleges', 'column': 1, 'order': 1},
        {'parent': 'Colleges', 'label': 'All Faculties', 'url': '/academics/faculties', 'column': 1, 'order': 2},
        {'parent': 'Colleges', 'label': 'All Departments', 'url': '/academics/departments', 'column': 1, 'order': 3},
        {'parent': 'Colleges', 'label': 'Institute of Foreign Languages', 'url': '/institutes/foreign-languages', 'column': 2, 'order': 4},
        {'parent': 'Colleges', 'label': 'Research Institutes', 'url': '/institutes/research', 'column': 2, 'order': 5},
        {'parent': 'Colleges', 'label': 'BMU Career Centre', 'url': '/centres/career', 'column': 2, 'order': 6},
        {'parent': 'Colleges', 'label': 'Centre for Foundation Studies', 'url': '/centres/foundation-studies', 'column': 2, 'order': 7},
        {'parent': 'Colleges', 'label': 'CPD Centre', 'url': '/centres/cpd', 'column': 2, 'order': 8},
        {'parent': 'Colleges', 'label': 'Innovation & Technology Centre', 'url': '/centres/innovation', 'column': 2, 'order': 9},

        # Campus Life
        {'parent': 'Campus Life', 'label': 'Residential Life', 'url': '/about/campus#housing', 'column': 1, 'order': 1},
        {'parent': 'Campus Life', 'label': 'Dining & Nutrition', 'url': '/about/campus#dining', 'column': 1, 'order': 2},
        {'parent': 'Campus Life', 'label': 'Health & Wellness', 'url': '/about/campus#wellness', 'column': 1, 'order': 3},
        {'parent': 'Campus Life', 'label': 'Student Organizations', 'url': '/about/campus#organizations', 'column': 1, 'order': 4},
        {'parent': 'Campus Life', 'label': 'Diversity & Inclusion', 'url': '/about/campus#diversity', 'column': 1, 'order': 5},
        {'parent': 'Campus Life', 'label': 'Safety & Security', 'url': '/about/campus#safety', 'column': 1, 'order': 6},
        {'parent': 'Campus Life', 'label': 'Campus Gallery', 'url': '/gallery', 'column': 2, 'order': 7},
        {'parent': 'Campus Life', 'label': 'Contact Campus Life', 'url': '/contact', 'column': 2, 'order': 8},

        # International
        {'parent': 'International', 'label': 'Why BMU?', 'url': '/international', 'column': 1, 'order': 1},
        {'parent': 'International', 'label': 'Admissions', 'url': '/international/students', 'column': 1, 'order': 2},
        {'parent': 'International', 'label': 'Visitors & Delegations', 'url': '/international/visitors', 'column': 1, 'order': 3},
        {'parent': 'International', 'label': 'Exchange Programs', 'url': '/international/exchange', 'column': 1, 'order': 4},
        {'parent': 'International', 'label': 'Global Partnerships', 'url': '/international/partnerships', 'column': 2, 'order': 5},

        # News & Events
        {'parent': 'News & Events', 'label': 'Latest News', 'url': '/news', 'column': 1, 'order': 1},
        {'parent': 'News & Events', 'label': 'Announcements', 'url': '/news/announcements', 'column': 1, 'order': 2},
        {'parent': 'News & Events', 'label': 'Press Releases', 'url': '/news/press-releases', 'column': 1, 'order': 3},
        {'parent': 'News & Events', 'label': 'Upcoming Events', 'url': '/events', 'column': 2, 'order': 4},
        {'parent': 'News & Events', 'label': 'Event Calendar', 'url': '/events/calendar', 'column': 2, 'order': 5},
        {'parent': 'News & Events', 'label': 'Past Events', 'url': '/events/past', 'column': 2, 'order': 6},

        # Impact
        {'parent': 'Impact', 'label': 'SDG Dashboard', 'url': '/impact/sdg-dashboard', 'column': 1, 'order': 1},
        {'parent': 'Impact', 'label': 'Community Outreach', 'url': '/impact/community', 'column': 1, 'order': 2},
        {'parent': 'Impact', 'label': 'Sustainability', 'url': '/impact/sustainability', 'column': 1, 'order': 3},
        {'parent': 'Impact', 'label': 'Health Initiatives', 'url': '/impact/health', 'column': 1, 'order': 4},
        {'parent': 'Impact', 'label': 'Impact Overview', 'url': '/impact', 'column': 2, 'order': 5},
        {'parent': 'Impact', 'label': 'External Partners', 'url': '/impact/external-partners', 'column': 2, 'order': 6},

        # Portals
        {'parent': 'Portals', 'label': 'Applicant Portal', 'url': '/portals/applicant', 'column': 1, 'order': 1},
        {'parent': 'Portals', 'label': 'Student Portal', 'url': '/portals/login', 'column': 1, 'order': 2},
        {'parent': 'Portals', 'label': 'Alumni Portal', 'url': '/portals/alumni', 'column': 1, 'order': 3},
        {'parent': 'Portals', 'label': 'All Portals', 'url': '/portals', 'column': 1, 'order': 4},
        {'parent': 'Portals', 'label': 'Jobs', 'url': '/careers/jobs', 'column': 2, 'order': 5},
        {'parent': 'Portals', 'label': 'Archive', 'url': '/archive', 'column': 2, 'order': 6},
        {'parent': 'Portals', 'label': 'Announcements', 'url': '/announcements', 'column': 2, 'order': 7},
        {'parent': 'Portals', 'label': 'External Partners', 'url': '/impact/external-partners', 'column': 2, 'order': 8},
    ]

    for sub in submenus:
        parent = created_items.get(sub['parent'])
        if parent:
            MenuItem.objects.get_or_create(
                label=sub['label'],
                parent=parent,
                defaults={
                    'url': sub['url'],
                    'is_external': False,
                    'location': 'navbar',
                    'icon': '',
                    'description': '',
                    'column': sub['column'],
                    'display_order': sub['order'],
                    'is_active': True,
                },
            )


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0021_utilitylink_menuitem'),
    ]

    operations = [
        migrations.RunPython(seed_utility_links, migrations.RunPython.noop),
        migrations.RunPython(seed_menu_items, migrations.RunPython.noop),
    ]
