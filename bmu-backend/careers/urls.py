from django.urls import path
from . import views

urlpatterns = [
    # Job Postings
    path('jobs/', views.JobListView.as_view(), name='job-list'),
    path('jobs/open/', views.open_jobs, name='jobs-open'),
    path('jobs/<int:pk>/', views.JobDetailView.as_view(), name='job-detail'),
    
    # Job Applications
    path('applications/', views.JobApplicationCreateView.as_view(), name='job-application-create'),
    path('applications/list/', views.JobApplicationListView.as_view(), name='job-application-list'),
    path('applications/<int:pk>/', views.JobApplicationDetailView.as_view(), name='job-application-detail'),
    path('applications/status/', views.check_application_status, name='job-application-status'),
]
