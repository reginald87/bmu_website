from ninja.security import HttpBearer
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model


class JWTAuth(HttpBearer):
    """JWT Authentication for Django Ninja"""

    def authenticate(self, request, token):
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            user = get_user_model().objects.get(id=user_id)
            if user.is_active:
                request.user = user
                return user
        except Exception:
            return None
        return None
