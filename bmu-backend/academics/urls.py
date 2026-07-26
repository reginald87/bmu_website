from django.urls import path
from . import views

urlpatterns = [
    # Colleges
    path('colleges/', views.CollegeListView.as_view(), name='college-list'),
    path('colleges/<slug:slug>/', views.CollegeDetailView.as_view(), name='college-detail'),
    
    # Departments
    path('departments/', views.DepartmentListView.as_view(), name='department-list'),
    
    # Programs
    path('programs/', views.ProgramListView.as_view(), name='program-list'),
    path('programs/<slug:slug>/', views.ProgramDetailView.as_view(), name='program-detail'),
    path('programs/level/<str:level>/', views.programs_by_level, name='programs-by-level'),
    
    # Faculty
    path('faculty/', views.FacultyListView.as_view(), name='faculty-list'),
    path('faculty/<int:pk>/', views.FacultyDetailView.as_view(), name='faculty-detail'),
    path('faculty/college/<slug:slug>/', views.faculty_by_college, name='faculty-by-college'),
    
    # SDG Metrics
    path('sdg-metrics/', views.SDGMetricsListView.as_view(), name='sdg-metrics'),
    
    # Home Stats
    path('home-stats/', views.home_stats, name='home-stats'),

    # Calendar PDF Download
    path('calendar/download/', views.download_calendar_pdf, name='calendar-download'),
]
