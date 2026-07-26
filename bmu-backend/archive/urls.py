from django.urls import path
from . import views

urlpatterns = [
    # Past Events
    path('events/', views.PastEventListView.as_view(), name='past-event-list'),
    path('events/<int:pk>/', views.PastEventDetailView.as_view(), name='past-event-detail'),
    
    # Archived News
    path('news/', views.ArchivedNewsListView.as_view(), name='archived-news-list'),
    path('news/<int:pk>/', views.ArchivedNewsDetailView.as_view(), name='archived-news-detail'),
    
    # Historical Documents
    path('documents/', views.HistoricalDocumentListView.as_view(), name='historical-document-list'),
    path('documents/<int:pk>/', views.HistoricalDocumentDetailView.as_view(), name='historical-document-detail'),
    
    # University Timeline
    path('timeline/', views.UniversityTimelineListView.as_view(), name='university-timeline'),
    
    # Past Leaders
    path('leaders/', views.PastLeaderListView.as_view(), name='past-leader-list'),
]
