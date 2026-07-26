from io import BytesIO
from datetime import date, datetime
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.utils import timezone
from PIL import Image, ImageDraw, ImageFont


class Command(BaseCommand):
    help = 'Seed registration test data'

    def handle(self, *args, **options):
        from accounts.models import User, StudentProfile
        from academics.models import Course, Program, Department, RegistrationPeriod
        from portals.models import Registration, RegistrationCourse

        student = User.objects.get(id=2)

        program = Program.objects.filter(is_active=True).first()
        if not program:
            self.stdout.write(self.style.ERROR('No active program found'))
            return

        student.program = program
        student.save(update_fields=['program'])

        profile, _ = StudentProfile.objects.get_or_create(user=student)
        profile.matric_number = 'UG/25/0001'
        profile.current_level = 100
        profile.current_semester = 'first'
        profile.admission_date = date(2025, 9, 1)
        profile.save()
        self.stdout.write(f'Created StudentProfile: {profile.matric_number}')

        if not student.profile_image:
            img = Image.new('RGB', (200, 240), (200, 200, 200))
            draw = ImageDraw.Draw(img)
            draw.ellipse([40, 20, 160, 140], fill=(180, 180, 180))
            draw.rectangle([30, 140, 170, 240], fill=(160, 160, 160))
            buf = BytesIO()
            img.save(buf, format='PNG')
            student.profile_image.save('student_photo.png', ContentFile(buf.getvalue()))
            self.stdout.write('Created sample profile_image')
        else:
            self.stdout.write('profile_image already exists')

        program.courses.clear()

        course_data = [
            ('MED101', 'Human Anatomy I', 4, 100, 'first'),
            ('MED102', 'Physiology I', 3, 100, 'first'),
            ('MED103', 'Biochemistry I', 3, 100, 'first'),
            ('MED104', 'Medical Sociology', 2, 100, 'first'),
            ('MED105', 'Introduction to Medicine', 2, 100, 'first'),
            ('MED106', 'Anatomy II', 4, 100, 'second'),
            ('MED107', 'Physiology II', 3, 100, 'second'),
            ('MED108', 'Biochemistry II', 3, 100, 'second'),
            ('MED109', 'Pharmacology I', 3, 100, 'second'),
            ('MED110', 'Medical Ethics', 2, 100, 'second'),
        ]

        dept = Department.objects.first()
        courses_created = []
        for code, title, cu, level, sem in course_data:
            c, _ = Course.objects.get_or_create(
                code=code,
                defaults=dict(
                    title=title,
                    credit_units=cu,
                    level=level,
                    semester=sem,
                    capacity=100,
                    department=dept,
                )
            )
            c.programs.add(program)
            courses_created.append(c)

        self.stdout.write(f'Ensured {len(courses_created)} courses exist')

        RegistrationPeriod.objects.get_or_create(
            academic_year='2025/2026',
            semester='first',
            program=program,
            level=100,
            defaults=dict(
                opens_at=timezone.make_aware(datetime(2025, 9, 1)),
                closes_at=timezone.make_aware(datetime(2025, 12, 31)),
                is_active=True,
            )
        )
        RegistrationPeriod.objects.get_or_create(
            academic_year='2025/2026',
            semester='second',
            program=program,
            level=100,
            defaults=dict(
                opens_at=timezone.make_aware(datetime(2026, 1, 15)),
                closes_at=timezone.make_aware(datetime(2026, 6, 30)),
                is_active=True,
            )
        )
        self.stdout.write('Ensured RegistrationPeriods exist')

        for sem_name in ('first', 'second'):
            reg, created = Registration.objects.get_or_create(
                student=student,
                academic_year='2025/2026',
                semester=sem_name,
                defaults=dict(
                    level=100,
                    status='registered',
                    submitted_at=timezone.now(),
                    registered_at=timezone.now(),
                )
            )
            if created:
                self.stdout.write(f'Created {sem_name} registration')

            reg.courses.all().delete()
            sem_courses = Course.objects.filter(programs=program, semester=sem_name)
            for c in sem_courses:
                RegistrationCourse.objects.create(
                    registration=reg, course=c,
                    is_compulsory=True, approval_status='approved'
                )
            reg.total_credit_units = sum(rc.course.credit_units for rc in reg.courses.all())
            reg.save(update_fields=['total_credit_units'])
            self.stdout.write(f'  {sem_name}: {reg.courses.count()} courses, {reg.total_credit_units} CU')

        self.stdout.write(self.style.SUCCESS('Seeding complete'))
