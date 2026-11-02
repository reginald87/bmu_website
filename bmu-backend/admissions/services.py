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


def acceptance_fee_level(application):
    """Return the numeric level used to look up an acceptance fee structure."""
    if application.entry_mode in ('DE', 'TRANSFER'):
        return 200
    return 100


def acceptance_fee_for(application):
    """Resolve ``(amount, currency, session)`` for an application's acceptance fee.

    Local applicants use the session's ``acceptance`` line item when one exists;
    otherwise (and for international applicants, whose fee structures are NGN
    only) the fee falls back to ``ACCEPTANCE_FEE_LOCAL``/``ACCEPTANCE_FEE_INTL``.
    """
    from decimal import Decimal, InvalidOperation

    from django.conf import settings
    from django.db.models import Q

    from .documents import academic_session

    session = academic_session()
    currency = 'USD' if application.student_type == 'INTL' else 'NGN'

    if currency == 'NGN':
        from portals.models import FeeStructure

        level = acceptance_fee_level(application)
        structures = (
            FeeStructure.objects
            .filter(session=session, level=level, is_active=True,
                    is_indigene=bool(application.is_indigene))
            .filter(Q(program=application.program) | Q(program__isnull=True))
            .filter(Q(semester='') | Q(semester__iexact='first'))
            .order_by('-program_id')
        )
        for structure in structures:
            item = structure.items.filter(fee_type__category='acceptance').first()
            if item is not None:
                amount = Decimal(item.amount)
                if amount > 0:
                    return amount, currency, session

        raw = getattr(settings, 'ACCEPTANCE_FEE_LOCAL', '50000')
    else:
        raw = getattr(settings, 'ACCEPTANCE_FEE_INTL', '100')

    try:
        amount = Decimal(str(raw))
    except (InvalidOperation, TypeError, ValueError):
        amount = Decimal('0')
    return amount, currency, session


def _decimal(value):
    """Return a settings/fee value as a ``Decimal``."""
    from decimal import Decimal, InvalidOperation

    try:
        return Decimal(str(value if value not in (None, '') else '0'))
    except (InvalidOperation, TypeError, ValueError):
        return Decimal('0')


def _money(value):
    """Return a settings/fee value as a two-decimal ``Decimal``."""
    from decimal import Decimal

    return _decimal(value).quantize(Decimal('0.01'))


def acceptance_fee_breakdown(amount, currency):
    """Return the full acceptance-fee charge, including admin and gateway fees."""
    from decimal import Decimal, ROUND_HALF_UP

    from django.conf import settings

    base = _money(amount)
    admin_raw = (
        getattr(settings, 'PAYSTACK_ADMIN_FEE_USD', '0')
        if currency == 'USD'
        else getattr(settings, 'PAYSTACK_ADMIN_FEE', '0')
    )
    admin_fee = _money(admin_raw)
    rate = _decimal(getattr(settings, 'PAYSTACK_GATEWAY_FEE_RATE', '0.015'))
    gateway_fee = ((base + admin_fee) * rate).quantize(
        Decimal('0.01'), rounding=ROUND_HALF_UP,
    )
    total = (base + admin_fee + gateway_fee).quantize(
        Decimal('0.01'), rounding=ROUND_HALF_UP,
    )
    return {
        'base': base,
        'admin_fee': admin_fee,
        'gateway_fee': gateway_fee,
        'total': total,
        'currency': currency,
    }


def ensure_acceptance_fee(application, force=False):
    """Freeze the acceptance-fee amount and charge breakdown on an application.

    The base fee is resolved once so it cannot change between payment
    initialisation and verification. A paid/waived fee is never re-priced.
    """
    if application.acceptance_fee_status in ('completed', 'waived'):
        return (
            application.acceptance_fee_amount,
            application.acceptance_fee_currency,
            application.acceptance_fee_session,
        )

    needs_base = force or application.acceptance_fee_amount is None
    if needs_base:
        amount, currency, session = acceptance_fee_for(application)
    else:
        amount = application.acceptance_fee_amount
        currency = application.acceptance_fee_currency
        session = application.acceptance_fee_session

    if needs_base or application.acceptance_fee_total is None:
        breakdown = acceptance_fee_breakdown(amount, currency)
        application.acceptance_fee_amount = amount
        application.acceptance_fee_admin_fee = breakdown['admin_fee']
        application.acceptance_fee_gateway_fee = breakdown['gateway_fee']
        application.acceptance_fee_total = breakdown['total']
        application.acceptance_fee_currency = currency
        application.acceptance_fee_session = session
        application.save(update_fields=[
            'acceptance_fee_amount',
            'acceptance_fee_admin_fee',
            'acceptance_fee_gateway_fee',
            'acceptance_fee_total',
            'acceptance_fee_currency',
            'acceptance_fee_session',
        ])

    return (
        application.acceptance_fee_amount,
        application.acceptance_fee_currency,
        application.acceptance_fee_session,
    )
