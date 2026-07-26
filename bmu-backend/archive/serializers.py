from rest_framework import serializers
from .models import (
    PastEvent, ArchivedNews, HistoricalDocument,
    UniversityTimeline, PastLeader
)


class PastEventSerializer(serializers.ModelSerializer):
    """Serializer for PastEvent model"""
    event_type_display = serializers.CharField(source='get_event_type_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = PastEvent
        fields = [
            'id', 'title', 'description',
            'event_date', 'end_date', 'location',
            'event_type', 'event_type_display',
            'category', 'category_display',
            'featured_image', 'gallery_images', 'video_url',
            'summary', 'key_highlights', 'attendees_count',
            'proceedings_document', 'presentations_zip',
            'speakers', 'archived_by'
        ]


class ArchivedNewsSerializer(serializers.ModelSerializer):
    """Serializer for ArchivedNews model"""
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = ArchivedNews
        fields = [
            'id', 'title', 'excerpt', 'content', 'category', 'category_display',
            'featured_image', 'author', 'original_published_at',
            'archived_at', 'archived_by', 'original_id'
        ]


class HistoricalDocumentSerializer(serializers.ModelSerializer):
    """Serializer for HistoricalDocument model"""
    document_type_display = serializers.CharField(source='get_document_type_display', read_only=True)
    
    class Meta:
        model = HistoricalDocument
        fields = [
            'id', 'title', 'description',
            'document_type', 'document_type_display',
            'document_date', 'document_year',
            'document_file', 'tags', 'keywords',
            'is_public', 'created_at'
        ]
        read_only_fields = ['created_at']


class UniversityTimelineSerializer(serializers.ModelSerializer):
    """Serializer for UniversityTimeline model"""
    
    class Meta:
        model = UniversityTimeline
        fields = [
            'id', 'year', 'month', 'day',
            'title', 'description', 'image',
            'category', 'display_order', 'is_featured'
        ]


class PastLeaderSerializer(serializers.ModelSerializer):
    """Serializer for PastLeader model"""
    position_display = serializers.CharField(source='get_position_display', read_only=True)
    tenure_display = serializers.CharField(source='tenure_display', read_only=True)
    
    class Meta:
        model = PastLeader
        fields = [
            'id', 'name', 'title', 'position', 'position_display',
            'specific_role', 'start_year', 'end_year', 'tenure_display',
            'photo', 'biography', 'achievements', 'current_email',
            'display_order'
        ]
