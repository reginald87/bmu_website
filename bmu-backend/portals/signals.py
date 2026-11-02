from django.db.models import Sum
from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from academics.models import Course, Department
from portals.models import FeeStructure, FeeStructureItem, StudentCourse


def _sync_course_count(course):
    """Sync enrolled_count for a course."""
    count = StudentCourse.objects.filter(course=course).count()
    Course.objects.filter(pk=course.pk).update(enrolled_count=count)


def _sync_department_counts(course):
    """Sync department student_count."""
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
    if instance.course_id:
        _sync_course_count(instance.course)
        _sync_department_counts(instance.course)


@receiver(pre_save, sender=FeeStructure)
def _auto_fee_structure_total(sender, instance, **kwargs):
    """Auto-compute FeeStructure.total_amount from its FeeStructureItems."""
    if not instance.pk:
        return
    total = (
        FeeStructureItem.objects.filter(fee_structure=instance)
        .aggregate(total=Sum("amount"))["total"]
        or 0
    )
    instance.total_amount = total


@receiver(post_save, sender=FeeStructureItem)
@receiver(post_delete, sender=FeeStructureItem)
def _sync_fee_structure_total(sender, instance, **kwargs):
    """Recompute the parent structure total whenever a line item changes."""
    if instance.fee_structure_id:
        instance.fee_structure.recompute_total()
