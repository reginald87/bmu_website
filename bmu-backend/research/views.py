from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import ResearchAndDevelopment, ResearchProject, Publication, ResearchGrant, Collaboration
from .serializers import (
    ResearchAndDevelopmentSerializer, ResearchAndDevelopmentListSerializer,
    ResearchProjectSerializer, PublicationSerializer,
    PublicationListSerializer, ResearchGrantSerializer,
    CollaborationSerializer
)


# Research Center Views
class ResearchAndDevelopmentListView(generics.ListAPIView):
    """List all research centers"""
    queryset = ResearchAndDevelopment.objects.filter(is_active=True)
    serializer_class = ResearchAndDevelopmentListSerializer
    permission_classes = [AllowAny]


class ResearchAndDevelopmentDetailView(generics.RetrieveAPIView):
    """Get research center details by slug"""
    queryset = ResearchAndDevelopment.objects.filter(is_active=True)
    serializer_class = ResearchAndDevelopmentSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]


# Research Project Views
class ResearchProjectListView(generics.ListAPIView):
    """List research projects with filtering"""
    queryset = ResearchProject.objects.all()
    serializer_class = ResearchProjectSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['center', 'status', 'is_featured']
    search_fields = ['title', 'description', 'objectives']


class ResearchProjectDetailView(generics.RetrieveAPIView):
    """Get research project details"""
    queryset = ResearchProject.objects.all()
    serializer_class = ResearchProjectSerializer
    permission_classes = [AllowAny]


# Publication Views
class PublicationListView(generics.ListAPIView):
    """List publications with filtering and search"""
    queryset = Publication.objects.all()
    serializer_class = PublicationListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['publication_type', 'year', 'research_center', 'is_featured']
    search_fields = ['title', 'abstract', 'keywords', 'authors__first_name', 'authors__last_name']
    ordering_fields = ['year', 'citations', 'created_at']
    ordering = ['-year']

    def get_serializer_class(self):
        if self.request.query_params.get('detailed'):
            return PublicationSerializer
        return PublicationListSerializer


class PublicationDetailView(generics.RetrieveAPIView):
    """Get publication details"""
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([AllowAny])
def publications_by_faculty(request, faculty_id):
    """Get publications by faculty member"""
    publications = Publication.objects.filter(authors__id=faculty_id)
    serializer = PublicationListSerializer(publications, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def featured_publications(request):
    """Get featured publications"""
    limit = int(request.query_params.get('limit', 6))
    publications = Publication.objects.filter(is_featured=True)[:limit]
    serializer = PublicationListSerializer(publications, many=True)
    return Response(serializer.data)


# Research Grant Views
class ResearchGrantListView(generics.ListAPIView):
    """List research grants"""
    queryset = ResearchGrant.objects.all()
    serializer_class = ResearchGrantSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'principal_investigator']


# Collaboration Views
class CollaborationListView(generics.ListAPIView):
    """List collaborations"""
    queryset = Collaboration.objects.filter(is_active=True)
    serializer_class = CollaborationSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['collaboration_type']
