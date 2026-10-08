"""JWT helpers shared across apps."""
import logging

logger = logging.getLogger(__name__)


def blacklist_user_refresh_tokens(user):
    """Blacklist all outstanding refresh tokens for ``user``.

    Called after password changes/resets so previously issued sessions cannot
    be refreshed. Access tokens remain valid only until their short expiry.
    """
    try:
        from rest_framework_simplejwt.token_blacklist.models import (
            BlacklistedToken, OutstandingToken,
        )
    except Exception:
        return
    try:
        for token in OutstandingToken.objects.filter(user=user):
            BlacklistedToken.objects.get_or_create(token=token)
    except Exception:
        logger.exception('Failed to blacklist refresh tokens for user %s', getattr(user, 'pk', user))
