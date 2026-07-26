from django.urls import path
from . import views

urlpatterns = [
    # Research Centers
    path('centers/', views.ResearchAndDevelopmentListView.as_view(), name='research-center-list'),
    path('centers/<slug:slug>/', views.ResearchAndDevelopmentDetailView.as_view(), name='research-center-detail'),
    
    # Research Projects
    path('projects/', views.ResearchProjectListView.as_view(), name='research-project-list'),
    path('projects/<int:pk>/', views.ResearchProjectDetailView.as_view(), name='research-project-detail'),
    
    # Publications
    path('publications/', views.PublicationListView.as_view(), name='publication-list'),
    path('publications/featured/', views.featured_publications, name='publications-featured'),
    path('publications/<int:pk>/', views.PublicationDetailView.as_view(), name='publication-detail'),
    path('publications/faculty/<int:faculty_id>/', views.publications_by_faculty, name='publications-by-faculty'),
    
    # Research Grants
    path('grants/', views.ResearchGrantListView.as_view(), name='research-grant-list'),
    
    # Collaborations
    path('collaborations/', views.CollaborationListView.as_view(), name='collaboration-list'),
]
