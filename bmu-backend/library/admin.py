from django.contrib import admin
from .models import BookCategory, Book, DigitalResource, LibraryService, LibraryStat, LibraryHour, LibraryGuideline


@admin.register(BookCategory)
class BookCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'parent']
    search_fields = ['name', 'code']


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'authors', 'isbn', 'resource_type', 'publication_year']
    list_filter = ['resource_type', 'publication_year']
    search_fields = ['title', 'authors', 'isbn', 'keywords']
    filter_horizontal = ['categories']


@admin.register(DigitalResource)
class DigitalResourceAdmin(admin.ModelAdmin):
    list_display = ['name', 'resource_type', 'is_active']
    list_filter = ['resource_type', 'is_active']


@admin.register(LibraryService)
class LibraryServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'display_order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['title']


@admin.register(LibraryStat)
class LibraryStatAdmin(admin.ModelAdmin):
    list_display = ['label', 'value', 'display_order', 'is_active']
    list_filter = ['is_active']


@admin.register(LibraryHour)
class LibraryHourAdmin(admin.ModelAdmin):
    list_display = ['day', 'hours', 'display_order', 'is_active']
    list_filter = ['is_active']


@admin.register(LibraryGuideline)
class LibraryGuidelineAdmin(admin.ModelAdmin):
    list_display = ['title', 'display_order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['title']
