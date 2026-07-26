from rest_framework import serializers
from .models import JobPosting, JobApplication


class JobPostingSerializer(serializers.ModelSerializer):
    """Serializer for JobPosting model"""
    job_type_display = serializers.CharField(source='get_job_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    college_name = serializers.CharField(source='college.name', read_only=True)
    is_open = serializers.BooleanField(source='is_open', read_only=True)
    
    class Meta:
        model = JobPosting
        fields = [
            'id', 'title', 'department', 'college', 'college_name',
            'job_type', 'job_type_display', 'location',
            'salary_min', 'salary_max', 'salary_currency', 'salary_display',
            'description', 'requirements', 'responsibilities',
            'education_requirements', 'experience_requirements', 'benefits',
            'posted_date', 'application_deadline',
            'status', 'status_display', 'is_open',
            'contact_email', 'contact_phone',
            'applications_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['applications_count', 'created_at', 'updated_at']


class JobPostingListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for job posting lists"""
    job_type_display = serializers.CharField(source='get_job_type_display', read_only=True)
    college_name = serializers.CharField(source='college.name', read_only=True)
    is_open = serializers.BooleanField(source='is_open', read_only=True)
    
    class Meta:
        model = JobPosting
        fields = [
            'id', 'title', 'department', 'college_name',
            'job_type', 'job_type_display', 'location',
            'salary_display', 'posted_date', 'application_deadline', 'is_open'
        ]


class JobApplicationSerializer(serializers.ModelSerializer):
    """Serializer for JobApplication model"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title',
            'first_name', 'last_name', 'full_name', 'email', 'phone',
            'address', 'city', 'state', 'country',
            'highest_qualification', 'years_of_experience',
            'current_employer', 'current_position',
            'resume', 'cover_letter', 'additional_documents',
            'linkedin_url', 'portfolio_url',
            'status', 'status_display',
            'review_notes', 'interview_date', 'interview_notes',
            'submitted_at', 'updated_at'
        ]
        read_only_fields = ['submitted_at', 'updated_at']


class JobApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating job applications"""
    
    class Meta:
        model = JobApplication
        fields = [
            'job', 'first_name', 'last_name', 'email', 'phone',
            'address', 'city', 'state', 'country',
            'highest_qualification', 'years_of_experience',
            'current_employer', 'current_position',
            'resume', 'cover_letter', 'additional_documents',
            'linkedin_url', 'portfolio_url'
        ]


class JobApplicationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for job application lists"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job_title', 'full_name', 'email',
            'status', 'status_display', 'submitted_at'
        ]
