import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bmu_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create or update agent user
user, created = User.objects.get_or_create(
    email='agent@bmu.edu.ng',
    defaults={
        'first_name': 'Agent',
        'last_name': 'User',
        'is_staff': True
    }
)

user.set_password('agent123')
user.save()

if created:
    print('Created agent user with email: agent@bmu.edu.ng')
else:
    print('Updated existing agent user password')

print('Password: agent123')
