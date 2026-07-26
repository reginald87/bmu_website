from rest_framework import serializers
from .models import (
    College, Department, Program, Faculty, 
    FacultyPublication, SDGMetric, HomeStats
)


class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for Department model"""
    
    hod_name = serializers.CharField(source='hod_display_name', read_only=True)
    
    class Meta:
        model = Department
        fields = ['id', 'name', 'slug', 'description', 'hod_name', 'is_active']


class CollegeSerializer(serializers.ModelSerializer):
    """Serializer for College model"""
    departments = DepartmentSerializer(many=True, read_only=True)
    leadership_name = serializers.CharField(source='leadership_name', read_only=True)
    leadership_title = serializers.CharField(source='leadership_title', read_only=True)
    
    class Meta:
        model = College
        fields = [
            'id', 'name', 'slug', 'subdomain', 'description',
            'leadership_name', 'leadership_title', 'established_year',
            'faculty_count', 'student_count', 'faculty_members_count',
            'departments', 'primary_color', 'secondary_color', 'icon_name',
            'is_active'
        ]


class CollegeListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for college lists"""
    leadership_name = serializers.CharField(source='leadership_name', read_only=True)
    
    class Meta:
        model = College
        fields = [
            'id', 'name', 'slug', 'subdomain', 'description',
            'leadership_name', 'established_year', 'faculty_count',
            'student_count', 'faculty_members_count', 'icon_name'
        ]


class ProgramSerializer(serializers.ModelSerializer):
    """Serializer for Program model"""
    college = CollegeListSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    level_display = serializers.CharField(source='get_level_display', read_only=True)
    
    class Meta:
        model = Program
        fields = [
            'id', 'title', 'slug', 'level', 'level_display',
            'duration', 'requirements',
            'application_fee_local', 'application_fee_intl',
            'tuition_per_year_local', 'tuition_per_year_intl',
            'tuition_fee_local', 'tuition_fee_intl',
            'college', 'department', 'is_active'
        ]


class ProgramListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for program lists"""
    college_name = serializers.SerializerMethodField()
    level_display = serializers.CharField(source='get_level_display', read_only=True)
    
    def get_college_name(self, obj):
        return obj.college.name if obj.college else None
    
    class Meta:
        model = Program
        fields = [
            'id', 'title', 'slug', 'level', 'level_display',
            'duration', 'college_name', 'application_fee_local', 'application_fee_intl'
        ]


class FacultyPublicationSerializer(serializers.ModelSerializer):
    """Serializer for FacultyPublication model"""
    
    class Meta:
        model = FacultyPublication
        fields = ['id', 'title', 'year', 'journal', 'citations', 'doi', 'url']


class FacultySerializer(serializers.ModelSerializer):
    """Serializer for Faculty model"""
    college_name = serializers.CharField(source='college.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    position_display = serializers.CharField(source='get_position_display', read_only=True)
    title_display = serializers.CharField(source='get_title_display', read_only=True)
    full_name = serializers.CharField(source='full_name', read_only=True)
    publications = FacultyPublicationSerializer(many=True, read_only=True)
    
    class Meta:
        model = Faculty
        fields = [
            'id', 'title', 'title_display', 'first_name', 'last_name', 'full_name',
            'email', 'college', 'college_name', 'department', 'department_name',
            'position', 'position_display', 'research_interests', 'bio',
            'orcid_id', 'google_scholar_url', 'researchgate_url',
            'citations', 'h_index', 'i10_index',
            'profile_image', 'publications', 'is_active'
        ]


class FacultyListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for faculty lists"""
    college_name = serializers.CharField(source='college.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    full_name = serializers.CharField(source='full_name', read_only=True)
    
    class Meta:
        model = Faculty
        fields = [
            'id', 'title', 'first_name', 'last_name', 'full_name',
            'college_name', 'department_name', 'position',
            'research_interests', 'profile_image'
        ]


class SDGMetricSerializer(serializers.ModelSerializer):
    """Serializer for SDGMetric model"""
    sdg_display = serializers.CharField(source='get_sdg_code_display', read_only=True)
    progress_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = SDGMetric
        fields = [
            'id', 'sdg_code', 'sdg_display', 'label',
            'current_value', 'target_value', 'unit',
            'description', 'progress_percentage'
        ]


class HomeStatsSerializer(serializers.ModelSerializer):
    """Serializer for HomeStats model"""
    
    class Meta:
        model = HomeStats
        fields = ['research_papers', 'students', 'faculty', 'partners', 'updated_at']
