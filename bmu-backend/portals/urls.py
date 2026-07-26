from django.urls import path
from . import views

urlpatterns = [
    path('registration/slip/', views.download_combined_slip, name='registration-slip'),
]
