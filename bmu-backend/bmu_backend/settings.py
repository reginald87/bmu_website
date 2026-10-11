"""
Django settings for bmu_backend project.

Production-ready configuration. All secrets via environment variables.
"""
import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ── Security ──────────────────────────────────────────────────────────────────
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is required")

DEBUG = os.getenv('DEBUG', 'False').lower() in ('true', '1', 'yes')

ALLOWED_HOSTS = [
    h.strip()
    for h in os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
    if h.strip()
]

# ── Application definition ────────────────────────────────────────────────────
INSTALLED_APPS = [
    'daphne',
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'django_filters',
    'rest_framework_simplejwt.token_blacklist',
    'channels',
    'chat',
    'core',
    'accounts',
    'admissions',
    'academics',
    'content',
    'research',
    'careers',
    'archive',
    'library',
    'portals',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'bmu_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'bmu_backend.wsgi.application'
ASGI_APPLICATION = 'bmu_backend.asgi.application'

# ── Channel Layers (Redis in production, in-memory fallback for dev) ──────────
REDIS_URL = os.getenv('REDIS_URL', '')

if REDIS_URL:
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels_redis.core.RedisChannelLayer',
            'CONFIG': {
                'hosts': [REDIS_URL],
                'capacity': 1500,
                'expiry': 10,
            },
        },
    }
else:
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels.layers.InMemoryChannelLayer',
        },
    }

# ── Cache ─────────────────────────────────────────────────────────────────────
# DRF throttles rely on a shared cache so rate limits hold across workers.
# When REDIS_URL is set (production) use Redis; otherwise keep per-process
# local memory for development.
CACHES = {
    'default': {
        'BACKEND': (
            'django.core.cache.backends.redis.RedisCache' if REDIS_URL
            else 'django.core.cache.backends.locmem.LocMemCache'
        ),
        'LOCATION': REDIS_URL if REDIS_URL else 'bmu-local-cache',
    }
}

# ── Database ──────────────────────────────────────────────────────────────────
DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': os.getenv('DB_NAME', str(BASE_DIR / 'db.sqlite3')),
        'USER': os.getenv('DB_USER', ''),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', ''),
        'PORT': os.getenv('DB_PORT', ''),
        'OPTIONS': {},
    }
}

# ── DRF Configuration ────────────────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
    'DEFAULT_THROTTLE_CLASSES': (
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ),
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
    },
}

# ── Password validation ───────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ── Internationalization ──────────────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ── Static & Media files ─────────────────────────────────────────────────────
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
        'OPTIONS': {
            'location': str(MEDIA_ROOT),
            'base_url': MEDIA_URL,
        },
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedStaticFilesStorage',
    },
}

# ── CORS ──────────────────────────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174'
    ).split(',')
    if origin.strip()
]
CORS_ALLOW_CREDENTIALS = True

# CSRF origins (production origins come from the environment; dev origins are
# added automatically when running in DEBUG).
CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.getenv('CSRF_TRUSTED_ORIGINS', '').split(',')
    if origin.strip()
]

if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
    CSRF_TRUSTED_ORIGINS += [
        'http://localhost:5173', 'http://localhost:5174',
        'http://127.0.0.1:5173', 'http://127.0.0.1:5174',
    ]

# ── JWT ───────────────────────────────────────────────────────────────────────
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=int(os.getenv('JWT_ACCESS_TOKEN_LIFETIME', '60'))),
    'REFRESH_TOKEN_LIFETIME': timedelta(minutes=int(os.getenv('JWT_REFRESH_TOKEN_LIFETIME', '1440'))),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': os.getenv('JWT_SECRET_KEY', SECRET_KEY),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ── Custom User Model ────────────────────────────────────────────────────────
AUTH_USER_MODEL = 'accounts.User'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ── Email ─────────────────────────────────────────────────────────────────────
# Supports both EMAIL_* and SMTP_* env var names (SMTP_* checked as fallback).
EMAIL_HOST = os.getenv('EMAIL_HOST') or os.getenv('SMTP_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT') or os.getenv('SMTP_PORT', '587'))
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER') or os.getenv('SMTP_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD') or os.getenv('SMTP_PASS', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL') or os.getenv('SMTP_FROM', 'noreply@bmu.edu.ng')
# Port 465 => implicit SSL; anything else (587/25) => STARTTLS.
EMAIL_USE_SSL = (os.getenv('EMAIL_USE_SSL', 'True' if EMAIL_PORT == 465 else 'False') == 'True')
EMAIL_USE_TLS = (os.getenv('EMAIL_USE_TLS', 'False' if EMAIL_USE_SSL else 'True') == 'True')
# Use real SMTP when credentials are configured, otherwise print to console (dev).
EMAIL_BACKEND = os.getenv(
    'EMAIL_BACKEND',
    'django.core.mail.backends.smtp.EmailBackend' if EMAIL_HOST_USER and EMAIL_HOST_PASSWORD
    else 'django.core.mail.backends.console.EmailBackend',
)
# Frontend origin used to build absolute links in outgoing emails
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
# Error-reporting recipients (comma-separated emails; empty in dev).
ADMINS = [('BMU Admin', email.strip()) for email in os.getenv('ADMINS_EMAILS', '').split(',') if email.strip()]
SERVER_EMAIL = DEFAULT_FROM_EMAIL
# Internal alerts (comma-separated). Applicant replies should go elsewhere.
ADMISSIONS_OFFICE_EMAIL = os.getenv('ADMISSIONS_OFFICE_EMAIL', 'admissions@bmu.edu.ng')

# ── Payments (Paystack) ───────────────────────────────────────────────────────
PAYSTACK_SECRET_KEY = os.getenv('PAYSTACK_SECRET_KEY', '')
PAYSTACK_PUBLIC_KEY = os.getenv('PAYSTACK_PUBLIC_KEY', '')
# Demo/simulation mode is an explicit opt-in only. When the secret key is set,
# payments are ALWAYS verified against the gateway unless this is True.
PAYSTACK_TEST_MODE = os.getenv('PAYSTACK_TEST_MODE', 'False') == 'True'
# Application fee used only as a fallback when a programme has no fee set.
PAYSTACK_APPLICATION_FEE = os.getenv('PAYSTACK_APPLICATION_FEE', '0')
# Administrative/service fee added on top of the application fee (per currency).
PAYSTACK_ADMIN_FEE = os.getenv('PAYSTACK_ADMIN_FEE', '0')
PAYSTACK_ADMIN_FEE_USD = os.getenv('PAYSTACK_ADMIN_FEE_USD', '0')
# Convenience fee added on top of (application fee + service fee) to cover the
# gateway's own transaction charge (1.5% by default).
PAYSTACK_GATEWAY_FEE_RATE = os.getenv('PAYSTACK_GATEWAY_FEE_RATE', '0.015')
# Paystack split payments: route the service portion to a subaccount. Split
# codes are NGN-only.
USE_SPLIT_PAYMENT = os.getenv('USE_SPLIT_PAYMENT', 'False') == 'True'
PAYSTACK_SPLIT_CODE = os.getenv('PAYSTACK_SPLIT_CODE', '')

# ── Celery ────────────────────────────────────────────────────────────────────
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

# ── Production Security Headers (only when not DEBUG) ─────────────────────────
if not DEBUG:
    # Serve static files from STATIC_ROOT (reverse proxy / CDN still handles media).
    MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
    # Terminated-TLS at the reverse proxy.
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_SSL_REDIRECT = os.getenv('SECURE_SSL_REDIRECT', 'False') == 'True'
    SECURE_HSTS_SECONDS = int(os.getenv('SECURE_HSTS_SECONDS', '0'))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = os.getenv('SECURE_HSTS_INCLUDE_SUBDOMAINS', 'False') == 'True'
    SECURE_HSTS_PRELOAD = os.getenv('SECURE_HSTS_PRELOAD', 'False') == 'True'

# ── Jazzmin Admin Configuration ──────────────────────────────────────────────
# BMU brand colours
#   Primary dark:  #1E1E1E  (almost-black)
#   Brand red:     #A51C30  (burgundy)
#   SDG green:     #4c9f38
#   SDG orange:    #ff3a21
#   Light background: #FDFDFD / #ffffff
#   Muted:         #e5e4e7
JAZZMIN_SETTINGS = {
    "site_title": "BMU Admin",
    "site_header": "Bayelsa Medical University",
    "site_brand": "BMU",
    "site_logo": None,
    "site_icon": None,
    "site_title_logo": None,
    "welcome_sign": "Welcome to Bayelsa Medical University Admin",
    "copyright": "Bayelsa Medical University © 2024 ASPIRE Administration",
    "user_avatar": None,
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],
    "icons": {
        "auth": "fas fa-users-cog",
        "accounts.User": "fas fa-user",
        "accounts.StudentProfile": "fas fa-user-graduate",
        "accounts.AlumniProfile": "fas fa-user-tie",
        "content.NewsItem": "fas fa-newspaper",
        "content.Event": "fas fa-calendar-alt",
        "content.PublicDocument": "fas fa-file-pdf",
        "content.SDG": "fas fa-bullseye",
        "content.ImpactProgram": "fas fa-hands-helping",
        "content.HeroSlide": "fas fa-images",
        "content.Testimonial": "fas fa-quote-left",
        "content.Partner": "fas fa-handshake",
        "content.FAQ": "fas fa-question-circle",
        "content.ContactEnquiry": "fas fa-envelope",
        "content.MenuItems": "fas fa-sitemap",
        "content.PageContent": "fas fa-layer-group",
        "academics.College": "fas fa-university",
        "academics.Department": "fas fa-building",
        "academics.Program": "fas fa-chalkboard",
        "academics.Faculty": "fas fa-chalkboard-teacher",
        "academics.Course": "fas fa-book",
        "academics.SDGMetric": "fas fa-chart-line",
        "academics.HomeStats": "fas fa-tachometer-alt",
        "academics.Leadership": "fas fa-user-tie",
        "admissions.Application": "fas fa-file-alt",
        "admissions.AdmissionRequirement": "fas fa-clipboard-list",
        "research.FundedProject": "fas fa-flask",
        "research.ResearchPublication": "fas fa-microscope",
        "research.ResearchGrant": "fas fa-grant",
        "careers.JobPosting": "fas fa-briefcase",
        "library.Book": "fas fa-book-open",
        "library.DigitalResource": "fas fa-desktop",
        "portals.Announcement": "fas fa-bell",
        "portals.MenuItems": "fas fa-sitemap",
    },
    "order_with_respect_to": [
        "accounts", "content", "academics",
        "admissions", "research", "careers",
        "library", "portals", "archive",
    ],
    "language_chooser": False,
    "show_ui_toggle": True,
    "navbar_compact_style": False,
    "navbar_fixed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "custom_css": "jazzmin/custom.css",
}

# Custom CSS
# Jazzmin allows a custom CSS/JS file path (relative to static root)
# We use it to fully apply BMU brand colours (#1E1E1E, #A51C30, #4c9f38)
JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": False,
    "accent": "accent-primary",
    "navbar": "navbar-white navbar-light",
    "no_navbar_border": False,
    "navbar_fixed": False,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": False,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": False,
    "theme": "default",
    "default_theme_mode": "light",
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success",
    },
}
