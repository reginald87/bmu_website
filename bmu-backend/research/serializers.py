from rest_framework import serializers
from .models import (
    ResearchAndDevelopment, ResearchProject, Publication, 
    ResearchGrant, Collaboration
)


class ResearchAndDevelopmentSerializer(serializers.ModelSerializer):
    """Serializer for ResearchCenter model"""
    director_name = serializers.CharField(source='director.full_name', read_only=True)
    
    class Meta:
        model = ResearchAndDevelopment
        fields = [
            'id', 'name', 'slug', 'director', 'director_name',
            'description', 'mission', 'vision', 'research_areas',
            'email', 'phone', 'location', 'featured_image',
            'total_publications', 'ongoing_projects_count',
            'is_active', 'established_date'
        ]


class ResearchAndDevelopmentListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for research center lists"""
    director_name = serializers.CharField(source='director.full_name', read_only=True)
    
    class Meta:
        model = ResearchAndDevelopment
        fields = [
            'id', 'name', 'slug', 'director_name', 'description',
            'total_publications', 'ongoing_projects_count'
        ]


class ResearchProjectSerializer(serializers.ModelSerializer):
    """Serializer for ResearchProject model"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    pi_name = serializers.CharField(source='principal_investigator.full_name', read_only=True)
    
    class Meta:
        model = ResearchProject
        fields = [
            'id', 'title', 'slug', 'description',
            'center', 'principal_investigator', 'pi_name',
            'co_investigators', 'start_date', 'end_date',
            'funding_amount', 'funding_currency', 'funding_agency',
            'status', 'status_display',
            'objectives', 'methodology', 'expected_outcomes',
            'is_featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class PublicationSerializer(serializers.ModelSerializer):
    """Serializer for Publication model"""
    publication_type_display = serializers.CharField(source='get_publication_type_display', read_only=True)
    authors_list = serializers.SerializerMethodField()
    
    class Meta:
        model = Publication
        fields = [
            'id', 'title', 'authors', 'authors_list', 'external_authors',
            'publication_type', 'publication_type_display',
            'journal_name', 'conference_name', 'volume', 'issue', 'pages',
            'publisher', 'year', 'month',
            'doi', 'pmid', 'url', 'citations',
            'research_center', 'is_featured', 'is_peer_reviewed',
            'abstract', 'keywords', 'pdf_file',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_authors_list(self, obj):
        return [f"{author.title} {author.full_name}" for author in obj.authors.all()]


class PublicationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for publication lists"""
    publication_type_display = serializers.CharField(source='get_publication_type_display', read_only=True)
    first_author = serializers.SerializerMethodField()
    
    class Meta:
        model = Publication
        fields = [
            'id', 'title', 'first_author', 'publication_type', 'publication_type_display',
            'journal_name', 'year', 'citations', 'doi'
        ]
    
    def get_first_author(self, obj):
        first = obj.authors.first()
        return f"{first.title} {first.full_name}" if first else "Unknown"


class ResearchGrantSerializer(serializers.ModelSerializer):
    """Serializer for ResearchGrant model"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    pi_name = serializers.CharField(source='principal_investigator.full_name', read_only=True)
    
    class Meta:
        model = ResearchGrant
        fields = [
            'id', 'title', 'description',
            'amount', 'currency', 'funding_agency', 'grant_number',
            'principal_investigator', 'pi_name',
            'start_date', 'end_date', 'status', 'status_display',
            'proposal_document', 'award_letter',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class CollaborationSerializer(serializers.ModelSerializer):
    """Serializer for Collaboration model"""
    collaboration_type_display = serializers.CharField(source='get_collaboration_type_display', read_only=True)
    coordinator_name = serializers.CharField(source='bmu_coordinator.full_name', read_only=True)
    
    class Meta:
        model = Collaboration
        fields = [
            'id', 'partner_name', 'partner_country',
            'collaboration_type', 'collaboration_type_display',
            'description', 'bmu_coordinator', 'coordinator_name',
            'start_date', 'end_date', 'is_active',
            'logo', 'website', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
