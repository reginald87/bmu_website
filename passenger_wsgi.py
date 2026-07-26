import os
import sys

# Add project to path
APP_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, APP_DIR)
sys.path.insert(0, os.path.join(APP_DIR, 'bmu-backend'))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bmu_backend.settings')

# Activate virtual environment if present
venv_path = os.path.join(APP_DIR, 'bmu-backend', 'venv')
if os.path.exists(os.path.join(venv_path, 'bin', 'activate')):
    activate_this = os.path.join(venv_path, 'bin', 'activate_this.py')
    if os.path.exists(activate_this):
        exec(open(activate_this).read(), {'__file__': activate_this})

# Django WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
