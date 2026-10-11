"""Validation helpers for admission data (e.g. JAMB registration numbers)."""
import re

from django.core.exceptions import ValidationError
from django.utils import timezone

# JAMB/UTME registration numbers look like ``202660304236IE``:
# a 4-digit year, 8 more digits, then 2 uppercase letters (12 digits + 2 letters).
JAMB_REGISTRATION_RE = re.compile(r'^\d{12}[A-Z]{2}$')
JAMB_MIN_YEAR = 2010

# JAMB Direct Entry registration numbers: e.g. DE/2026/123456 or 2026/DE/123456
DE_JAMB_REGISTRATION_RE = re.compile(r'^(DE/)?\d{4}/?DE/?\d{6}$|^DE/\d{4}/\d{6}$', re.IGNORECASE)


def normalize_jamb_registration_number(value):
    """Trim and upper-case a JAMB registration number.

    Returns ``None`` for empty input so that "no JAMB number" is stored as NULL
    (allowing several legacy/PG rows to share the absence without colliding on a
    unique constraint).
    """
    cleaned = (value or '').strip().upper()
    return cleaned or None


def normalize_de_jamb_registration_number(value):
    """Normalize a JAMB Direct Entry registration number.

    Accepts formats like ``DE/2026/123456``, ``2026/DE/123456``, ``DE2026123456``.
    Returns normalized ``DE/YYYY/NNNNNN`` or ``None`` for empty input.
    """
    cleaned = (value or '').strip().upper()
    if not cleaned:
        return None
    # Remove any existing DE prefix and slashes to extract year + number
    digits = ''.join(c for c in cleaned if c.isdigit())
    if len(digits) >= 10:
        year = digits[:4]
        num = digits[4:10].zfill(6)
        return f'DE/{year}/{num}'
    # If it already looks like DE/YYYY/NNNNNN, normalize slashes
    parts = [p for p in cleaned.split('/') if p]
    if len(parts) == 3 and parts[0] == 'DE' and len(parts[1]) == 4 and len(parts[2]) == 6:
        return f'DE/{parts[1]}/{parts[2].zfill(6)}'
    return cleaned


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


def validate_de_jamb_registration_number(value):
    """Validate a JAMB Direct Entry registration number."""
    normalized = normalize_de_jamb_registration_number(value)
    if not normalized:
        return None
    if not DE_JAMB_REGISTRATION_RE.match(normalized):
        raise ValidationError(
            'Enter a valid JAMB Direct Entry registration number, e.g. DE/2026/123456.'
        )
    year = int(normalized[3:7])
    max_year = timezone.now().year + 1
    if year < JAMB_MIN_YEAR or year > max_year:
        raise ValidationError(
            'The JAMB Direct Entry registration number contains an invalid year.'
        )
    return normalized
