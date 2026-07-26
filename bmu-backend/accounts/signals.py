from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import StudentProfile
from academics.models import Department


def _update_department_count(user, delta):
    if user and user.program and user.program.department:
        dept = user.program.department
        Department.objects.filter(pk=dept.pk).update(
            student_count=models.F('student_count') + delta
        )


@receiver(post_save, sender=StudentProfile)
def increment_student_count(sender, instance, created, **kwargs):
    if created:
        _update_department_count(instance.user, 1)


@receiver(post_delete, sender=StudentProfile)
def decrement_student_count(sender, instance, **kwargs):
    _update_department_count(instance.user, -1)
