"""
Registration Engine Service
Handles prerequisites, capacity, credit limits, timetable conflict checking,
auto-loading compulsory courses, and approval workflow.

Grade & GPA Engine Service
Handles score-to-grade mapping, GPA/CGPA computation, carryover/probation.
"""

from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from django.db.models import Sum, Avg, Q
from django.db.models.functions import Coalesce

from .models import (
    Registration, RegistrationCourse, StudentCourse, StudentResult,
    GradingScale, FeeStructure, FeeStructureItem, StudentFeePayment,
)
from academics.models import Course, CourseSchedule, ProgramCurriculumYear, ProgramCurriculumCourse


MAX_CREDIT_UNITS = 24


class RegistrationError(Exception):
    pass


class RegistrationService:

    def __init__(self, registration: Registration):
        self.registration = registration
        self.student = registration.student
        self.errors: list[str] = []

    # ── Validation ──────────────────────────────────────────────

    def check_prerequisites(self, course: Course) -> list[str]:
        errors = []
        for prereq in course.prerequisites.all():
            passed = StudentCourse.objects.filter(
                student=self.student,
                course=prereq,
                grade__in=['A', 'B+', 'B', 'C+', 'C', 'D'],
            ).exists()
            if not passed:
                errors.append(f"Prerequisite {prereq.code} ({prereq.title}) not fulfilled")
        return errors

    def check_capacity(self, course: Course) -> list[str]:
        if course.capacity == 0:
            return []
        current_count = StudentCourse.objects.filter(course=course).count()
        if current_count >= course.capacity:
            return [f"{course.code} is full ({current_count}/{course.capacity})"]
        return []

    def check_credit_limit(self, additional_units: int) -> list[str]:
        current_units = RegistrationCourse.objects.filter(
            registration=self.registration,
            approval_status='approved',
        ).aggregate(total=Sum('course__credit_units'))['total'] or 0

        if current_units + additional_units > MAX_CREDIT_UNITS:
            return [f"Adding {additional_units} units exceeds max of {MAX_CREDIT_UNITS} (currently {current_units})"]
        return []

    def check_timetable_conflict(self, course: Course) -> list[str]:
        """Check if course schedules overlap with already-selected courses"""
        from datetime import time, timedelta

        # Get schedules for courses already selected in this registration
        selected_schedules = CourseSchedule.objects.filter(
            course__in=self.registration.courses.values('course')
        ).values('day', 'start_time', 'end_time')

        new_schedules = CourseSchedule.objects.filter(course=course)

        errors = []
        for new_slot in new_schedules:
            for selected in selected_schedules:
                if new_slot.day != selected['day']:
                    continue
                # Check time overlap
                if new_slot.start_time < selected['end_time'] and new_slot.end_time > selected['start_time']:
                    errors.append(
                        f"Timetable conflict: {course.code} {new_slot.get_day_display()} "
                        f"{new_slot.start_time:%H:%M}-{new_slot.end_time:%H:%M} clashes "
                        f"with an already-selected course"
                    )
                    break
        return errors

    def validate_course(self, course: Course, additional_units: int | None = None) -> list[str]:
        errors = []
        errors.extend(self.check_prerequisites(course))
        errors.extend(self.check_capacity(course))
        errors.extend(self.check_timetable_conflict(course))
        errors.extend(self.check_credit_limit(additional_units or course.credit_units))
        # Phase 5: fee check — block registration if fees outstanding
        if not FeeService.is_fee_clear(
            self.student,
            self.registration.academic_year,
            self.registration.semester,
        ):
            total = FeeService.total_outstanding(
                self.student,
                self.registration.academic_year,
                self.registration.semester,
            )
            errors.append(f"Fee hold: outstanding balance of ₦{total:,.2f}. Please clear all fees before registering.")
        return errors

    # ── Course Selection ────────────────────────────────────────

    @transaction.atomic
    def add_course(self, course: Course, is_compulsory: bool = False) -> RegistrationCourse:
        if RegistrationCourse.objects.filter(registration=self.registration, course=course).exists():
            raise RegistrationError(f"{course.code} already selected")

        errors = self.validate_course(course)
        if errors:
            raise RegistrationError("; ".join(errors))

        rc = RegistrationCourse.objects.create(
            registration=self.registration,
            course=course,
            is_compulsory=is_compulsory,
            approval_status='approved' if is_compulsory else 'pending',
        )

        self.registration.total_credit_units += course.credit_units
        self.registration.save(update_fields=['total_credit_units'])

        return rc

    @transaction.atomic
    def remove_course(self, course: Course):
        rc = RegistrationCourse.objects.filter(
            registration=self.registration, course=course
        ).first()
        if not rc:
            raise RegistrationError(f"{course.code} not in registration")

        if rc.is_compulsory:
            raise RegistrationError(f"{course.code} is compulsory and cannot be removed")

        rc.delete()
        self.registration.total_credit_units = max(
            0, self.registration.total_credit_units - course.credit_units
        )
        self.registration.save(update_fields=['total_credit_units'])

    # ── Auto-load Compulsory Courses ────────────────────────────

    @transaction.atomic
    def load_compulsory_courses(self):
        """Auto-load compulsory courses from the program curriculum"""
        program = self.student.program
        if not program:
            raise RegistrationError("Student has no assigned program")

        curriculum_courses = ProgramCurriculumCourse.objects.filter(
            curriculum_year__program=program,
            curriculum_year__year_number=self.registration.level // 100,
            course__isnull=False,
        ).select_related('course')

        loaded = 0
        for cc in curriculum_courses:
            if RegistrationCourse.objects.filter(
                registration=self.registration, course=cc.course
            ).exists():
                continue
            try:
                RegistrationCourse.objects.create(
                    registration=self.registration,
                    course=cc.course,
                    is_compulsory=True,
                    approval_status='approved',
                )
                self.registration.total_credit_units += cc.course.credit_units
                loaded += 1
            except Exception:
                pass

        if loaded:
            self.registration.save(update_fields=['total_credit_units'])

        return loaded

    # ── Approval Workflow ───────────────────────────────────────

    @transaction.atomic
    def submit(self):
        if self.registration.status != 'draft':
            raise RegistrationError("Registration is not in draft status")
        self.registration.status = 'submitted'
        self.registration.submitted_at = timezone.now()
        self.registration.save(update_fields=['status', 'submitted_at'])

    @transaction.atomic
    def approve_by_advisor(self, user):
        if self.registration.status not in ('submitted',):
            raise RegistrationError("Registration must be submitted first")
        self.registration.status = 'advisor_approved'
        self.registration.advisor = user
        self.registration.advisor_approved_at = timezone.now()
        self.registration.save(update_fields=['status', 'advisor', 'advisor_approved_at'])

    @transaction.atomic
    def approve_by_hod(self, user):
        if self.registration.status not in ('advisor_approved',):
            raise RegistrationError("Registration must be advisor-approved first")
        self.registration.status = 'hod_approved'
        self.registration.hod = user
        self.registration.hod_approved_at = timezone.now()
        self.registration.save(update_fields=['status', 'hod', 'hod_approved_at'])

    @transaction.atomic
    def approve_by_dean(self, user):
        if self.registration.status not in ('hod_approved',):
            raise RegistrationError("Registration must be HOD-approved first")
        self.registration.status = 'dean_approved'
        self.registration.dean = user
        self.registration.dean_approved_at = timezone.now()
        self.registration.save(update_fields=['status', 'dean', 'dean_approved_at'])

    @transaction.atomic
    def finalize(self):
        """Create StudentCourse records from approved registration courses"""
        if self.registration.status != 'dean_approved':
            raise RegistrationError("Registration must be dean-approved first")

        reg_courses = RegistrationCourse.objects.filter(
            registration=self.registration,
            approval_status='approved',
        )

        created = 0
        for rc in reg_courses:
            _, was_created = StudentCourse.objects.get_or_create(
                student=self.student,
                course=rc.course,
                session=self.registration.academic_year,
                semester=self.registration.semester,
                defaults={
                    'registration': self.registration,
                    'is_compulsory': rc.is_compulsory,
                    'approval_status': 'approved',
                },
            )
            if was_created:
                created += 1

        self.registration.status = 'registered'
        self.registration.registered_at = timezone.now()
        self.registration.save(update_fields=['status', 'registered_at'])

        return created


# ═══════════════════════════════════════════════════════════════
# GRADE & GPA ENGINE
# ═══════════════════════════════════════════════════════════════

DEFAULT_GRADING_SCALE = [
    {'grade': 'A', 'min': 70, 'max': 100, 'point': Decimal('4.00'), 'remark': 'Excellent'},
    {'grade': 'B+', 'min': 65, 'max': 69.99, 'point': Decimal('3.50'), 'remark': 'Very Good'},
    {'grade': 'B', 'min': 60, 'max': 64.99, 'point': Decimal('3.25'), 'remark': 'Good'},
    {'grade': 'C+', 'min': 55, 'max': 59.99, 'point': Decimal('3.00'), 'remark': 'Credit'},
    {'grade': 'C', 'min': 50, 'max': 54.99, 'point': Decimal('2.50'), 'remark': 'Credit'},
    {'grade': 'D', 'min': 45, 'max': 49.99, 'point': Decimal('2.00'), 'remark': 'Pass'},
    {'grade': 'E', 'min': 40, 'max': 44.99, 'point': Decimal('1.50'), 'remark': 'Concession'},
    {'grade': 'F', 'min': 0, 'max': 39.99, 'point': Decimal('0.00'), 'remark': 'Fail'},
]


class GradeService:

    @staticmethod
    def compute_grade(total_score: Decimal) -> dict:
        """Map a total score to grade letter and grade point using GradingScale or defaults."""
        scales = GradingScale.objects.filter(is_active=True).order_by('-sort_order', '-grade_point')
        if not scales.exists():
            scales = DEFAULT_GRADING_SCALE

        total = float(total_score)
        for entry in scales:
            if isinstance(entry, dict):
                if entry['min'] <= total <= entry['max']:
                    return {'grade': entry['grade'], 'grade_point': entry['point'], 'remark': entry['remark']}
            else:
                if float(entry.min_score) <= total <= float(entry.max_score):
                    return {'grade': entry.grade, 'grade_point': entry.grade_point, 'remark': entry.remark}

        return {'grade': 'F', 'grade_point': Decimal('0.00'), 'remark': 'Fail'}

    @staticmethod
    def compute_total(assignment_score: Decimal | None, exam_score: Decimal | None) -> Decimal | None:
        """Sum assignment and exam scores (40% + 60% or raw)."""
        if assignment_score is None or exam_score is None:
            return None
        return assignment_score + exam_score

    @staticmethod
    def update_course_result(student_course: StudentCourse) -> StudentCourse:
        """Re-compute total, grade, and grade_point for a StudentCourse."""
        total = GradeService.compute_total(student_course.assignment_score, student_course.exam_score)
        if total is not None:
            student_course.total_score = total
            result = GradeService.compute_grade(total)
            student_course.grade = result['grade']
            student_course.grade_point = result['grade_point']
        return student_course


class GpaService:

    @staticmethod
    def compute_gpa(student, session: str, semester: str) -> Decimal:
        """Compute GPA for a student in a given session/semester from published/draft results."""
        courses = StudentCourse.objects.filter(
            student=student, session=session, semester=semester,
            result_status__in=['senate_approved', 'published'],
        ).select_related('course')

        total_quality_points = Decimal('0')
        total_credit_units = Decimal('0')

        for sc in courses:
            if sc.grade_point is not None and sc.grade != 'F':
                cu = Decimal(str(sc.course.credit_units))
                total_quality_points += sc.grade_point * cu
                total_credit_units += cu

        if total_credit_units == 0:
            return Decimal('0.00')

        return (total_quality_points / total_credit_units).quantize(Decimal('0.01'))

    @staticmethod
    def compute_cgpa(student) -> Decimal:
        """Compute cumulative GPA across all semesters."""
        results = StudentResult.objects.filter(student=student)
        total_quality_points = Decimal('0')
        total_units = Decimal('0')

        for r in results:
            cu = Decimal(str(r.total_units))
            total_quality_points += Decimal(str(r.gpa)) * cu
            total_units += cu

        if total_units == 0:
            return Decimal('0.00')

        return (total_quality_points / total_units).quantize(Decimal('0.01'))

    @staticmethod
    def detect_carryover(student, session: str, semester: str) -> list[dict]:
        """Detect courses the student failed (grade F or E) in a given session."""
        failed = StudentCourse.objects.filter(
            student=student, session=session, semester=semester,
            grade__in=['F', 'E'],
        ).select_related('course')

        return [{
            'course_id': sc.course_id,
            'course_code': sc.course.code,
            'course_title': sc.course.title,
            'credit_units': sc.course.credit_units,
            'grade': sc.grade,
            'session': sc.session,
            'semester': sc.semester,
        } for sc in failed]

    @staticmethod
    def detect_probation(gpa: Decimal) -> bool:
        """GPA < 1.0 triggers probation."""
        return gpa < Decimal('1.00')

    @staticmethod
    def get_academic_status(gpa: Decimal) -> str:
        """Classify academic status based on GPA."""
        if gpa >= Decimal('3.50'):
            return 'excellent'
        elif gpa >= Decimal('3.00'):
            return 'very_good'
        elif gpa >= Decimal('2.00'):
            return 'good'
        elif gpa >= Decimal('1.00'):
            return 'pass'
        else:
            return 'probation'

    @staticmethod
    @transaction.atomic
    def publish_semester_results(student, session: str, semester: str, approved_by=None) -> StudentResult:
        """Compute GPA, detect carryover/probation, create/update StudentResult."""
        gpa = GpaService.compute_gpa(student, session, semester)
        cgpa = GpaService.compute_cgpa(student)
        status = GpaService.get_academic_status(gpa)

        courses = StudentCourse.objects.filter(
            student=student, session=session, semester=semester,
            result_status__in=['senate_approved', 'published'],
        )
        total_units = sum(sc.course.credit_units for sc in courses.select_related('course'))
        courses_taken = courses.count()

        result, _ = StudentResult.objects.update_or_create(
            student=student,
            session=session,
            semester=semester,
            defaults={
                'level': courses.first().course.level if courses.exists() else 100,
                'courses_taken': courses_taken,
                'total_units': total_units,
                'gpa': gpa,
                'cgpa': cgpa,
                'academic_status': status,
                'is_published': True,
            },
        )

        StudentCourse.objects.filter(
            student=student, session=session, semester=semester,
            result_status__in=['senate_approved', 'published'],
        ).update(is_published=True, result_status='published')

        return result


# ═══════════════════════════════════════════════════════════════
# PROGRESSION ENGINE
# ═══════════════════════════════════════════════════════════════

class ProgressionService:

    MAX_CARRYOVER_UNITS = 9
    MIN_CGPA_PROMOTE = Decimal('1.50')
    MIN_CGPA_PROBATION = Decimal('1.00')
    LEVEL_STEP = 100

    @staticmethod
    def evaluate_student(student, session: str, *, processed_by=None) -> 'ProgressionRecord':
        """Evaluate a single student's progression after a completed session."""
        from .models import ProgressionRecord

        results = StudentResult.objects.filter(student=student, session=session).order_by('semester')
        if not results.exists():
            raise ValueError(f"No published results for {student.full_name} in {session}")

        last = results.last()
        gpa = last.gpa
        cgpa = GpaService.compute_cgpa(student)
        current_level = last.level

        carryover = GpaService.detect_carryover(student, session, 'First')
        carryover += GpaService.detect_carryover(student, session, 'Second')
        carryover_units = sum(c['credit_units'] for c in carryover)

        probations_this_session = ProgressionRecord.objects.filter(
            student=student, decision='probation',
        ).count()
        prev_withdrawn = ProgressionRecord.objects.filter(
            student=student, decision='withdrawn',
        ).exists()

        if prev_withdrawn:
            decision = 'withdrawn'
            reason = "Previously withdrawn; no automatic progression."
            to_level = current_level
        elif cgpa < ProgressionService.MIN_CGPA_PROBATION and probations_this_session >= 1:
            decision = 'withdrawn'
            reason = f"CGPA ({cgpa}) below {ProgressionService.MIN_CGPA_PROBATION} after previous probation."
            to_level = current_level
        elif cgpa < ProgressionService.MIN_CGPA_PROBATION:
            decision = 'probation'
            reason = f"CGPA ({cgpa}) below {ProgressionService.MIN_CGPA_PROBATION} minimum."
            to_level = current_level
        elif carryover_units > ProgressionService.MAX_CARRYOVER_UNITS:
            decision = 'referred'
            reason = f"Carryover units ({carryover_units}) exceed max of {ProgressionService.MAX_CARRYOVER_UNITS}."
            to_level = current_level
        elif cgpa < ProgressionService.MIN_CGPA_PROMOTE:
            decision = 'referred'
            reason = f"CGPA ({cgpa}) below promotion threshold of {ProgressionService.MIN_CGPA_PROMOTE}."
            to_level = current_level
        else:
            decision = 'promoted'
            to_level = current_level + ProgressionService.LEVEL_STEP
            reason = f"CGPA {cgpa} meets requirement. Promoted to {to_level} level."

        record, _ = ProgressionRecord.objects.update_or_create(
            student=student,
            session=session,
            defaults={
                'from_level': current_level,
                'to_level': to_level,
                'decision': decision,
                'reason': reason,
                'gpa': gpa,
                'cgpa': cgpa,
                'carryover_units': carryover_units,
                'total_units': last.total_units,
                'processed_by': processed_by,
            },
        )
        return record

    @staticmethod
    def evaluate_session(session: str, *, processed_by=None, student_ids: list[int] | None = None) -> list['ProgressionRecord']:
        """Evaluate all students in a session."""
        from django.contrib.auth import get_user_model
        from .models import ProgressionRecord

        User = get_user_model()
        students = User.objects.filter(role='student')
        if student_ids:
            students = students.filter(id__in=student_ids)

        records = []
        for student in students:
            try:
                rec = ProgressionService.evaluate_student(student, session, processed_by=processed_by)
                records.append(rec)
            except ValueError:
                continue

        return records


# ═══════════════════════════════════════════════════════════════
# FEE SERVICE (Phase 5)
# ═══════════════════════════════════════════════════════════════


class FeeService:

    @staticmethod
    def _get_student_level(student, session: str) -> int:
        """Detect student's current level from progression → profile → result."""
        level = None
        try:
            from .models import ProgressionRecord
            last_prog = ProgressionRecord.objects.filter(
                student=student, session=session,
            ).order_by('-session').first()
            if last_prog:
                level = last_prog.to_level
        except Exception:
            pass
        if not level:
            p = getattr(student, 'student_profile', None)
            if p:
                level = getattr(p, 'current_level', None)
        if not level:
            try:
                from .models import StudentResult
                last = StudentResult.objects.filter(student=student).order_by('-session', '-semester').first()
                if last:
                    level = int(last.level) if last.level else 100
            except Exception:
                level = 100
        return level or 100

    @staticmethod
    def _is_indigene(student) -> bool:
        """Check if student is a Bayelsa indigene."""
        p = getattr(student, 'student_profile', None)
        if p and p.state_of_origin:
            return p.state_of_origin.strip().lower() == 'bayelsa'
        return False

    @staticmethod
    def get_student_fee_structure(student, session: str, semester: str = '') -> dict | None:
        """Get the applicable fee structure for a student."""
        from .models import FeeStructure, FeeStructureItem

        level = FeeService._get_student_level(student, session)
        is_indigene = FeeService._is_indigene(student)
        prog = getattr(student, 'program', None)

        qs = FeeStructure.objects.filter(
            session=session, level=level, is_indigene=is_indigene, is_active=True,
        )
        if semester:
            qs = qs.filter(Q(semester=semester) | Q(semester=''))
        if prog:
            qs = qs.filter(Q(program=prog) | Q(program__isnull=True))
        else:
            qs = qs.filter(program__isnull=True)

        structure = qs.first()
        if not structure:
            return None

        items = FeeStructureItem.objects.filter(fee_structure=structure).select_related('fee_type').order_by('sort_order')

        return {
            'id': structure.id,
            'session': structure.session,
            'level': structure.level,
            'semester': structure.semester,
            'is_indigene': structure.is_indigene,
            'total_amount': float(structure.total_amount),
            'max_installments': structure.max_installments,
            'items': [
                {
                    'fee_type': item.fee_type.name,
                    'category': item.fee_type.get_category_display(),
                    'amount': float(item.amount),
                }
                for item in items
            ],
        }

    @staticmethod
    def is_fee_clear(student, session: str, semester: str = '') -> bool:
        """Check if student has paid the full amount for the session."""
        from .models import StudentFeePayment

        structure = FeeService.get_student_fee_structure(student, session, semester)
        if not structure:
            return True  # No fee structure = free

        total_due = structure['total_amount']
        total_paid = StudentFeePayment.objects.filter(
            student=student, session=session, status='completed',
        ).aggregate(total=Sum('amount_paid'))['total'] or 0

        return float(total_paid) >= total_due

    @staticmethod
    def total_outstanding(student, session: str, semester: str = '') -> float:
        """Remaining balance for the session."""
        from .models import StudentFeePayment

        structure = FeeService.get_student_fee_structure(student, session, semester)
        if not structure:
            return 0

        total_due = structure['total_amount']
        total_paid = StudentFeePayment.objects.filter(
            student=student, session=session, status='completed',
        ).aggregate(total=Sum('amount_paid'))['total'] or 0

        return max(0, total_due - float(total_paid))

    @staticmethod
    def get_installment_due(student, session: str, semester: str = '') -> float:
        """Amount due for the next installment."""
        from .models import StudentFeePayment

        structure = FeeService.get_student_fee_structure(student, session, semester)
        if not structure:
            return 0

        total_due = structure['total_amount']
        installments = structure['max_installments']

        paid_count = StudentFeePayment.objects.filter(
            student=student, session=session, status='completed',
        ).count()

        per_installment = total_due / max(installments, 1)
        next_installment = 1 + paid_count if paid_count < installments else installments
        return per_installment if paid_count < installments else 0

    @staticmethod
    def get_defaulter_report(session: str, semester: str = '', level: int | None = None) -> list[dict]:
        """Generate fee defaulter report for a session."""
        from django.contrib.auth import get_user_model

        User = get_user_model()
        students = User.objects.filter(role='student')
        if level:
            students = students.filter(student_profile__current_level=level)

        report = []
        for student in students:
            outstanding = FeeService.total_outstanding(student, session, semester)
            if outstanding > 0:
                p = getattr(student, 'student_profile', None)
                report.append({
                    'student_id': student.id,
                    'student_name': student.full_name,
                    'matric_number': p.matric_number if p else '',
                    'level': FeeService._get_student_level(student, session),
                    'outstanding_amount': outstanding,
                })

        report.sort(key=lambda x: -x['outstanding_amount'])
        return report


# ═══════════════════════════════════════════════════════════════
# REMITA PAYMENT GATEWAY (Phase 5)
# ═══════════════════════════════════════════════════════════════

import hashlib
import json
import requests
from django.conf import settings


class RemitaService:
    """Remita payment gateway integration alongside Paystack."""

    BASE_URL = getattr(settings, 'REMITA_BASE_URL', 'https://login.remita.net/remita/exapp/api/v1/send/api/loansvc/echannel/api/v1/fi')
    MERCHANT_ID = getattr(settings, 'REMITA_MERCHANT_ID', '')
    API_KEY = getattr(settings, 'REMITA_API_KEY', '')
    SERVICE_TYPE_ID = getattr(settings, 'REMITA_SERVICE_TYPE_ID', '4430731')

    @classmethod
    def _hash(cls, order_id: str, amount: str) -> str:
        """Generate Remita API hash: SHA512(merchantId + apiKey + orderId + amount)."""
        raw = f"{cls.MERCHANT_ID}{cls.API_KEY}{order_id}{amount}"
        return hashlib.sha512(raw.encode()).hexdigest()

    @classmethod
    def initialize_payment(cls, student_name: str, email: str, amount: Decimal,
                           order_id: str) -> dict:
        """Initialize a Remita payment and return the RRR."""
        amount_kobo = str(int(amount * 100))
        api_hash = cls._hash(order_id, amount_kobo)

        payload = {
            'merchantId': cls.MERCHANT_ID,
            'serviceTypeId': cls.SERVICE_TYPE_ID,
            'amount': amount_kobo,
            'orderId': order_id,
            'payerName': student_name,
            'payerEmail': email,
            'payerPhone': '',
            'hash': api_hash,
        }

        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {cls.API_KEY}',
        }

        # For test/fallback: generate a mock RRR
        if settings.DEBUG or not cls.MERCHANT_ID:
            rrr = f"RRR-TEST-{order_id[:20]}"
            return {'status': 'success', 'rrr': rrr, 'order_id': order_id}

        try:
            resp = requests.post(
                f'{cls.BASE_URL}/remita/exapp/api/v1/send/api/loansvc/echannel/api/v1/fi',
                json=payload,
                headers=headers,
                timeout=30,
            )
            data = resp.json()
            return {
                'status': 'success' if data.get('status') == 'success' else 'failed',
                'rrr': data.get('RRR', ''),
                'order_id': order_id,
                'raw': data,
            }
        except requests.RequestException as e:
            return {'status': 'failed', 'message': str(e), 'order_id': order_id}

    @classmethod
    def verify_payment(cls, rrr: str) -> dict:
        """Verify a Remita payment by RRR."""
        if settings.DEBUG or not cls.MERCHANT_ID:
            return {
                'status': 'success',
                'rrr': rrr,
                'amount': 0,
                'message': 'Test mode - payment verified',
            }

        try:
            resp = requests.get(
                f'{cls.BASE_URL}/remita/exapp/api/v1/send/api/loansvc/echannel/api/v1/fi/{rrr}',
                headers={'Content-Type': 'application/json'},
                timeout=30,
            )
            data = resp.json()
            return {
                'status': 'success' if data.get('status') == 'success' else 'failed',
                'rrr': rrr,
                'amount': data.get('amount', 0),
                'message': data.get('message', ''),
                'raw': data,
            }
        except requests.RequestException as e:
            return {'status': 'failed', 'message': str(e), 'rrr': rrr}
