from django.contrib import admin
from .models import PastEvent, ArchivedNews, HistoricalDocument, UniversityTimeline, PastLeader


@admin.register(PastEvent)
class PastEventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_date', 'event_type', 'category', 'attendees_count']
    list_filter = ['event_type', 'category', 'event_date']
    search_fields = ['title', 'description', 'summary']
    date_hierarchy = 'event_date'


@admin.register(ArchivedNews)
class ArchivedNewsAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'original_published_at', 'archived_at']
    list_filter = ['category', 'original_published_at']
    search_fields = ['title', 'excerpt', 'content']
    date_hierarchy = 'original_published_at'


@admin.register(HistoricalDocument)
class HistoricalDocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'document_type', 'document_year', 'is_public', 'created_at']
    list_filter = ['document_type', 'is_public', 'document_year']
    search_fields = ['title', 'description', 'tags', 'keywords']


@admin.register(UniversityTimeline)
class UniversityTimelineAdmin(admin.ModelAdmin):
    list_display = ['year', 'title', 'category', 'is_featured', 'display_order']
    list_filter = ['category', 'is_featured', 'year']
    search_fields = ['title', 'description']


@admin.register(PastLeader)
class PastLeaderAdmin(admin.ModelAdmin):
    list_display = ['name', 'title', 'position', 'specific_role', 'start_year', 'end_year']
    list_filter = ['position', 'start_year']
    search_fields = ['name', 'specific_role', 'biography']
