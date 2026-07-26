from rest_framework import serializers
from .models import NewsItem, Event, PageContentSimple, Testimonial, Partner, FAQ


class NewsItemSerializer(serializers.ModelSerializer):
    """Serializer for NewsItem model"""
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = NewsItem
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'category', 'category_display',
            'featured_image', 'author', 'published_at', 'is_featured',
            'views_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['views_count', 'created_at', 'updated_at']


class NewsItemListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for news lists"""
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = NewsItem
        fields = [
            'id', 'title', 'slug', 'excerpt', 'category', 'category_display',
            'featured_image', 'author', 'published_at', 'is_featured'
        ]


class EventSerializer(serializers.ModelSerializer):
    """Serializer for Event model"""
    event_type_display = serializers.CharField(source='get_event_type_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    time_display = serializers.CharField(source='time_display', read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'description',
            'event_date', 'start_time', 'end_time', 'time_display',
            'location', 'event_type', 'event_type_display',
            'category', 'category_display',
            'featured_image', 'registration_open', 'max_attendees', 'registered_count',
            'is_featured', 'speakers', 'agenda', 'registration_link',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class EventListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for event lists"""
    event_type_display = serializers.CharField(source='get_event_type_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'event_date', 'start_time',
            'location', 'event_type', 'event_type_display',
            'category', 'category_display',
            'featured_image', 'registration_open', 'is_featured'
        ]


class PageContentSimpleSerializer(serializers.ModelSerializer):
    """Serializer for PageContentSimple model"""
    page_key_display = serializers.CharField(source='get_page_key_display', read_only=True)
    
    class Meta:
        model = PageContentSimple
        fields = [
            'id', 'page_key', 'page_key_display', 'title', 'content',
            'meta_description', 'meta_keywords', 'updated_at'
        ]
        read_only_fields = ['updated_at']


class TestimonialSerializer(serializers.ModelSerializer):
    """Serializer for Testimonial model"""
    
    class Meta:
        model = Testimonial
        fields = ['id', 'name', 'role', 'quote', 'photo', 'is_active', 'display_order']


class PartnerSerializer(serializers.ModelSerializer):
    """Serializer for Partner model"""
    
    class Meta:
        model = Partner
        fields = ['id', 'name', 'logo', 'website', 'description', 'is_active', 'display_order']


class FAQSerializer(serializers.ModelSerializer):
    """Serializer for FAQ model"""
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'category', 'category_display', 'is_active', 'display_order']
