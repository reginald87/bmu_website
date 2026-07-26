from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import JobPosting, JobApplication
from .serializers import (
    JobPostingSerializer, JobPostingListSerializer,
    JobApplicationSerializer, JobApplicationCreateSerializer,
    JobApplicationListSerializer
)
from accounts.models import UserActivity, Notification


# Job Posting Views
class JobListView(generics.ListAPIView):
    """List open job postings with filtering"""
    serializer_class = JobPostingListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['job_type', 'department', 'college']
    search_fields = ['title', 'description', 'department']

    def get_queryset(self):
        from django.utils import timezone
        # Only show published and open jobs
        return JobPosting.objects.filter(
            status='published',
            application_deadline__gte=timezone.now().date()
        )

    def get_serializer_class(self):
        if self.request.query_params.get('detailed'):
            return JobPostingSerializer
        return JobPostingListSerializer


class JobDetailView(generics.RetrieveAPIView):
    """Get job posting details"""
    queryset = JobPosting.objects.filter(status='published')
    serializer_class = JobPostingSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([AllowAny])
def open_jobs(request):
    """Get list of open job postings"""
    from django.utils import timezone
    jobs = JobPosting.objects.filter(
        status='published',
        application_deadline__gte=timezone.now().date()
    )
    serializer = JobPostingListSerializer(jobs, many=True)
    return Response(serializer.data)


# Job Application Views
class JobApplicationCreateView(generics.CreateAPIView):
    """Submit a job application"""
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationCreateSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        application = serializer.save()
        
        # Update job's application count
        job = application.job
        job.applications_count += 1
        job.save(update_fields=['applications_count'])
        
        return application


class JobApplicationListView(generics.ListAPIView):
    """List job applications for authenticated user"""
    serializer_class = JobApplicationListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Filter by email to allow non-registered users to check their applications
        email = self.request.query_params.get('email')
        if email:
            return JobApplication.objects.filter(email=email)
        return JobApplication.objects.none()


class JobApplicationDetailView(generics.RetrieveAPIView):
    """Get job application details"""
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [AllowAny]


@api_view(['POST'])
@permission_classes([AllowAny])
def check_application_status(request):
    """Check job application status by email and application ID"""
    application_id = request.data.get('application_id')
    email = request.data.get('email')
    
    if not application_id or not email:
        return Response(
            {'error': 'Application ID and email are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        application = JobApplication.objects.get(
            id=application_id,
            email__iexact=email
        )
        serializer = JobApplicationSerializer(application)
        return Response({
            'application_id': application.id,
            'job_title': application.job.title,
            'status': application.status,
            'status_display': application.get_status_display(),
            'submitted_at': application.submitted_at,
            'interview_date': application.interview_date
        })
    except JobApplication.DoesNotExist:
        return Response(
            {'error': 'Application not found'},
            status=status.HTTP_404_NOT_FOUND
        )
