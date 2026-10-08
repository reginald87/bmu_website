"""Lightweight cache-based rate limiting for Django Ninja public endpoints.

DRF views are already covered by REST_FRAMEWORK DEFAULT_THROTTLE_*; Ninja
endpoints are not, so this provides a small fixed-window limiter backed by the
Django cache. If the cache backend fails, requests are allowed through (fail-open).
"""
import time
from functools import wraps

from django.core.cache import cache
from ninja.errors import HttpError


def _client_ip(request):
    forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if forwarded:
        return forwarded.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', 'unknown')


def enforce(request, key, limit, window):
    """Raise HttpError(429) when the caller exceeds ``limit`` per ``window`` seconds."""
    ident = _client_ip(request)
    bucket = int(time.time() // window)
    cache_key = f'throttle:{key}:{ident}:{bucket}'
    try:
        if cache.add(cache_key, 1, timeout=window + 5):
            count = 1
        else:
            try:
                count = cache.incr(cache_key)
            except ValueError:
                cache.set(cache_key, 1, timeout=window + 5)
                count = 1
    except Exception:
        return
    if count > limit:
        raise HttpError(429, 'Too many requests. Please slow down and try again later.')


def ratelimit(key, limit=20, window=60):
    """Decorator for Ninja endpoints; ``request`` must be the first argument."""
    def decorator(view):
        @wraps(view)
        def wrapper(request, *args, **kwargs):
            enforce(request, key, limit, window)
            return view(request, *args, **kwargs)
        return wrapper
    return decorator