from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import PastEvent, ArchivedNews, HistoricalDocument, UniversityTimeline, PastLeader
from .serializers import (
    PastEventSerializer, ArchivedNewsSerializer,
    HistoricalDocumentSerializer, UniversityTimelineSerializer,
    PastLeaderSerializer
)


# Past Event Views
class PastEventListView(generics.ListAPIView):
    """List past/archived events"""
    queryset = PastEvent.objects.all()
    serializer_class = PastEventSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'event_type', 'event_date']
    search_fields = ['title', 'description', 'summary']


class PastEventDetailView(generics.RetrieveAPIView):
    """Get past event details"""
    queryset = PastEvent.objects.all()
    serializer_class = PastEventSerializer
    permission_classes = [AllowAny]


# Archived News Views
class ArchivedNewsListView(generics.ListAPIView):
    """List archived news"""
    queryset = ArchivedNews.objects.all()
    serializer_class = ArchivedNewsSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'original_published_at']
    search_fields = ['title', 'excerpt', 'content']


class ArchivedNewsDetailView(generics.RetrieveAPIView):
    """Get archived news details"""
    queryset = ArchivedNews.objects.all()
    serializer_class = ArchivedNewsSerializer
    permission_classes = [AllowAny]


# Historical Document Views
class HistoricalDocumentListView(generics.ListAPIView):
    """List historical documents"""
    queryset = HistoricalDocument.objects.all()
    serializer_class = HistoricalDocumentSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['document_type', 'document_year', 'is_public']
    search_fields = ['title', 'description', 'tags', 'keywords']


class HistoricalDocumentDetailView(generics.RetrieveAPIView):
    """Get historical document details"""
    queryset = HistoricalDocument.objects.all()
    serializer_class = HistoricalDocumentSerializer
    permission_classes = [AllowAny]


# University Timeline Views
class UniversityTimelineListView(generics.ListAPIView):
    """List university timeline events"""
    queryset = UniversityTimeline.objects.all()
    serializer_class = UniversityTimelineSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'year', 'is_featured']
    search_fields = ['title', 'description']


# Past Leader Views
class PastLeaderListView(generics.ListAPIView):
    """List past university leaders"""
    queryset = PastLeader.objects.all()
    serializer_class = PastLeaderSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['position', 'start_year']
