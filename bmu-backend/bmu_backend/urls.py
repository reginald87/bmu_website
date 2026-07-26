from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from api import api, public_api

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Django Ninja API
    path('api/', api.urls),
    path('api/public/', public_api.urls),
    
    # Accounts (for login/logout)
    path('accounts/', include('accounts.urls')),
    
    # DRF API (legacy - can be removed once Ninja migration is complete)
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/academics/', include('academics.urls')),
    path('api/v1/admissions/', include('admissions.urls')),
    path('api/v1/content/', include('content.urls')),
    path('api/v1/research/', include('research.urls')),
    path('api/v1/careers/', include('careers.urls')),
    path('api/v1/archive/', include('archive.urls')),
    path('api/v1/portals/', include('portals.urls')),
    
    # Chat system
    path('chat/', include('chat.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
