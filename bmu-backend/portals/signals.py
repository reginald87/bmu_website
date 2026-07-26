from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Count

from .models import StudentCourse
from academics.models import Course, Department


def _sync_course_count(course):
    """Sync enrolled_count for a course"""
    count = StudentCourse.objects.filter(course=course).count()
    Course.objects.filter(pk=course.pk).update(enrolled_count=count)


def _sync_department_counts(course):
    """Sync department student_count"""
    dept = course.department
    if not dept:
        return
    unique_students = StudentCourse.objects.filter(
        course__department=dept
    ).values('student').distinct().count()
    Department.objects.filter(pk=dept.pk).update(student_count=unique_students)


@receiver(post_save, sender=StudentCourse)
@receiver(post_delete, sender=StudentCourse)
def update_enrollment_counts(sender, instance, **kwargs):
    _sync_course_count(instance.course)
    _sync_department_counts(instance.course)
