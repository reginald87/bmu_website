"""Validation helpers for admission data (e.g. JAMB registration numbers)."""
import re

from django.core.exceptions import ValidationError
from django.utils import timezone

# JAMB/UTME registration numbers look like ``202660304236IE``:
# a 4-digit year, 8 more digits, then 2 uppercase letters (12 digits + 2 letters).
JAMB_REGISTRATION_RE = re.compile(r'^\d{12}[A-Z]{2}$')
JAMB_MIN_YEAR = 2010


def normalize_jamb_registration_number(value):
    """Trim and upper-case a JAMB registration number.

    Returns ``None`` for empty input so that "no JAMB number" is stored as NULL
    (allowing several legacy/PG rows to share the absence without colliding on a
    unique constraint).
    """
    cleaned = (value or '').strip().upper()
    return cleaned or None


def validate_jamb_registration_number(value):
    """Validate a JAMB registration number, returning the normalized value.

    Empty input is allowed (returns ``None``). Raises
    ``django.core.exceptions.ValidationError`` when a non-empty value does not
    match the expected 12-digit + 2-letter pattern, or when the leading year is
    implausible.
    """
    normalized = normalize_jamb_registration_number(value)
    if not normalized:
        return None
    if not JAMB_REGISTRATION_RE.match(normalized):
        raise ValidationError(
            'Enter a valid JAMB registration number, e.g. 202660304236IE.'
        )
    year = int(normalized[:4])
    max_year = timezone.now().year + 1
    if year < JAMB_MIN_YEAR or year > max_year:
        raise ValidationError(
            'The JAMB registration number contains an invalid year.'
        )
    return normalized
