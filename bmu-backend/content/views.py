from rest_framework import generics, status, filters, pagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import NewsItem, Event, PageContentSimple, Testimonial, Partner, FAQ
from .serializers import (
    NewsItemSerializer, NewsItemListSerializer,
    EventSerializer, EventListSerializer,
    PageContentSimpleSerializer, TestimonialSerializer,
    PartnerSerializer, FAQSerializer
)


# Pagination class
class StandardResultsSetPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


# News Views
class NewsListView(generics.ListAPIView):
    """List all news items with filtering"""
    queryset = NewsItem.objects.filter(is_published=True)
    serializer_class = NewsItemListSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['published_at', 'created_at']
    ordering = ['-published_at']

    def get_serializer_class(self):
        if self.request.query_params.get('detailed'):
            return NewsItemSerializer
        return NewsItemListSerializer


class NewsDetailView(generics.RetrieveAPIView):
    """Get news item details by slug"""
    queryset = NewsItem.objects.filter(is_published=True)
    serializer_class = NewsItemSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def featured_news(request):
    """Get featured news items"""
    news = NewsItem.objects.filter(is_published=True, is_featured=True)[:5]
    serializer = NewsItemListSerializer(news, many=True)
    return Response(serializer.data)


# Event Views
class EventListView(generics.ListAPIView):
    """List all events with filtering"""
    queryset = Event.objects.filter(is_published=True)
    serializer_class = EventListSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'event_type', 'registration_open']
    search_fields = ['title', 'description', 'location']

    def get_queryset(self):
        queryset = Event.objects.filter(is_published=True)
        
        # Filter by upcoming/past
        upcoming = self.request.query_params.get('upcoming')
        from django.utils import timezone
        
        if upcoming == 'true':
            queryset = queryset.filter(event_date__gte=timezone.now().date())
        elif upcoming == 'false':
            queryset = queryset.filter(event_date__lt=timezone.now().date())
        
        return queryset

    def get_serializer_class(self):
        if self.request.query_params.get('detailed'):
            return EventSerializer
        return EventListSerializer


class EventDetailView(generics.RetrieveAPIView):
    """Get event details by slug"""
    queryset = Event.objects.filter(is_published=True)
    serializer_class = EventSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([AllowAny])
def featured_event(request):
    """Get featured upcoming event"""
    from django.utils import timezone
    event = Event.objects.filter(
        is_published=True,
        is_featured=True,
        event_date__gte=timezone.now().date()
    ).first()
    
    if event:
        serializer = EventSerializer(event)
        return Response(serializer.data)
    
    return Response(None)


@api_view(['GET'])
@permission_classes([AllowAny])
def upcoming_events(request):
    """Get upcoming events (limit by query param)"""
    from django.utils import timezone
    limit = int(request.query_params.get('limit', 6))
    
    events = Event.objects.filter(
        is_published=True,
        event_date__gte=timezone.now().date()
    ).order_by('event_date')[:limit]
    
    serializer = EventListSerializer(events, many=True)
    return Response(serializer.data)


# Page Content Views
class PageContentDetailView(generics.RetrieveAPIView):
    """Get page content by key"""
    queryset = PageContentSimple.objects.all()
    serializer_class = PageContentSimpleSerializer
    lookup_field = 'page_key'
    permission_classes = [AllowAny]


# Testimonial Views
class TestimonialListView(generics.ListAPIView):
    """List active testimonials"""
    queryset = Testimonial.objects.filter(is_active=True)
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]


# Partner Views
class PartnerListView(generics.ListAPIView):
    """List active partners"""
    queryset = Partner.objects.filter(is_active=True)
    serializer_class = PartnerSerializer
    permission_classes = [AllowAny]


# FAQ Views
class FAQListView(generics.ListAPIView):
    """List active FAQs with filtering by category"""
    queryset = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']
