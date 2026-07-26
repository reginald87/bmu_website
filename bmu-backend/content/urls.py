from django.urls import path
from . import views

urlpatterns = [
    # News
    path('news/', views.NewsListView.as_view(), name='news-list'),
    path('news/featured/', views.featured_news, name='news-featured'),
    path('news/<slug:slug>/', views.NewsDetailView.as_view(), name='news-detail'),
    
    # Events
    path('events/', views.EventListView.as_view(), name='event-list'),
    path('events/featured/', views.featured_event, name='event-featured'),
    path('events/upcoming/', views.upcoming_events, name='events-upcoming'),
    path('events/<slug:slug>/', views.EventDetailView.as_view(), name='event-detail'),
    
    # Pages
    path('pages/<str:page_key>/', views.PageContentDetailView.as_view(), name='page-content'),
    
    # Testimonials
    path('testimonials/', views.TestimonialListView.as_view(), name='testimonial-list'),
    
    # Partners
    path('partners/', views.PartnerListView.as_view(), name='partner-list'),
    
    # FAQs
    path('faqs/', views.FAQListView.as_view(), name='faq-list'),
]
