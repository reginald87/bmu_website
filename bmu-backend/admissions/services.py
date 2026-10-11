"""University identity helpers.

Key rule: **an offer of admission is not matriculation.** Undergraduates are
only issued a matriculation number (``UG/<YY>/<NNNN>``) when the university
matriculates them — a batch event run by the admission officer, long after the
application is accepted. Until then their JAMB registration number is their
reference.

Postgraduate and certificate applicants, by contrast, receive their permanent
university number on acceptance using the ``<PREFIX>/BMU/<YEAR>/<NNNN>`` format
(``MSC``, ``PHD``, ``CERT``, ``PROF``).
"""
from django.utils import timezone

# Prefixes used for the permanent number of non-undergraduate programmes.
LEVEL_PREFIXES = {
    'masters': 'MSC',
    'phd': 'PHD',
    'certificate': 'CERT',
    'professional': 'PROF',
}


def _next_sequence(model, field, stem):
    """Return the next zero-padded sequence integer for ``<stem>NNNN`` values."""
    last = (
        model.objects
        .filter(**{f'{field}__startswith': stem})
        .order_by(f'-{field}')
        .values_list(field, flat=True)
        .first()
    )
    if last:
        try:
            return int(str(last).split('/')[-1]) + 1
        except (TypeError, ValueError):
            return model.objects.filter(**{f'{field}__startswith': stem}).count() + 1
    return 1


def generate_postgraduate_number(level, year=None):
    """Return ``<PREFIX>/BMU/<YEAR>/<NNNN>`` for a postgraduate/cert level.

    Returns ``None`` for levels that do not use this format (e.g. undergraduate).
    """
    prefix = LEVEL_PREFIXES.get(level)
    if not prefix:
        return None
    from accounts.models import StudentProfile

    year = year or timezone.now().year
    stem = f'{prefix}/BMU/{year}/'
    return f'{stem}{_next_sequence(StudentProfile, "matric_number", stem):04d}'


def generate_undergraduate_matric_number(year=None):
    """Return the next ``UG/<YY>/<NNNN>`` matriculation number (issued on matriculation)."""
    from accounts.models import StudentProfile

    yy = str(year or timezone.now().year)[-2:]
    stem = f'UG/{yy}/'
    return f'{stem}{_next_sequence(StudentProfile, "matric_number", stem):04d}'
