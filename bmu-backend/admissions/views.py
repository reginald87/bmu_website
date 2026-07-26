from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .serializers import ApplicationSerializer
from .models import Application, ApplicationDocument, ApplicationStep, ApplicationMessage, AcademicRecord
from .serializers import (
    ApplicationSerializer, ApplicationCreateSerializer, ApplicationListSerializer,
    ApplicationStatusSerializer, ApplicationDocumentSerializer,
    DocumentUploadSerializer, ApplicationPaymentSerializer,
    AcademicRecordSerializer, ApplicationUpdateSerializer,
    DocumentReplaceSerializer
)
from accounts.models import UserActivity, Notification


class ApplicationCreateView(generics.CreateAPIView):
    """Create a new application or resume existing draft"""
    queryset = Application.objects.all()
    serializer_class = ApplicationCreateSerializer
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, *args, **kwargs):
        # Check for existing draft application
        existing_application = Application.objects.filter(
            applicant=request.user,
            status='draft'
        ).first()
        
        if existing_application:
            # Return existing application data
            serializer = ApplicationSerializer(existing_application)
            return Response(serializer.data)
        
        # No existing application, return empty response
        return Response({'message': 'No existing application found'})
    
    def post(self, request, *args, **kwargs):
        # Check if user already has a draft application
        existing_application = Application.objects.filter(
            applicant=request.user,
            status='draft'
        ).first()
        
        if existing_application:
            # Resume existing application
            serializer = self.get_serializer(existing_application)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({
                'message': 'Application resumed successfully',
                'application_id': existing_application.id
            })
        
        # No existing application, create new one
        return self.create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        application = serializer.save()
        
        # Create application steps
        step_names = [
            'application_submitted', 'payment_verified', 'documents_verified',
            'academic_review', 'interview', 'final_decision'
        ]
        for name in step_names:
            ApplicationStep.objects.create(
                application=application,
                name=name,
                status='pending' if name != 'application_submitted' else 'completed',
                completed_at=None if name != 'application_submitted' else application.created_at
            )
        
        # Create welcome message
        ApplicationMessage.objects.create(
            application=application,
            type='info',
            text='Your application has been received and is being processed.',
            from_name='Admissions Office'
        )
        
        return application


class ApplicationListView(generics.ListAPIView):
    """List applications for authenticated user"""
    serializer_class = ApplicationListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Application.objects.filter(applicant=self.request.user)


class ApplicationDetailView(generics.RetrieveAPIView):
    """Get application details"""
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    lookup_field = 'pk'
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        obj = super().get_object()
        # Ensure user can only access their own applications
        if obj.applicant != self.request.user and not self.request.user.is_staff:
            from django.core.exceptions import PermissionDenied
            raise PermissionDenied("You don't have permission to view this application.")
        return obj


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_pending_applications(request):
    """Get pending applications for the current user"""
    applications = Application.objects.filter(
        applicant=request.user,
        status='draft'
    ).select_related('program')
    
    serializer = ApplicationListSerializer(applications, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def application_status(request, application_id):
    """Check application status by ID (public endpoint)"""
    try:
        application = Application.objects.get(id=application_id)
        serializer = ApplicationStatusSerializer(application)
        return Response(serializer.data)
    except Application.DoesNotExist:
        return Response(
            {'error': 'Application not found'},
            status=status.HTTP_404_NOT_FOUND
        )


class DocumentUploadView(generics.CreateAPIView):
    """Upload a document for an application"""
    serializer_class = DocumentUploadSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, application_id):
        try:
            application = Application.objects.get(
                id=application_id,
                applicant=request.user
            )
        except Application.DoesNotExist:
            return Response(
                {'error': 'Application not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create document
        document = ApplicationDocument.objects.create(
            application=application,
            name=serializer.validated_data['document_type'],
            file=serializer.validated_data['file']
        )
        
        # Log activity
        UserActivity.objects.create(
            user=request.user,
            action='document_upload',
            description=f'Uploaded {document.get_name_display()} for {application.id}'
        )
        
        return Response(
            ApplicationDocumentSerializer(document).data,
            status=status.HTTP_201_CREATED
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_application_payment(request, application_id):
    """Submit payment for an application"""
    try:
        application = Application.objects.get(
            id=application_id,
            applicant=request.user
        )
    except Application.DoesNotExist:
        return Response(
            {'error': 'Application not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = ApplicationPaymentSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    # Update application payment info
    application.payment_method = serializer.validated_data['payment_method']
    application.payment_reference = serializer.validated_data.get('payment_reference', '')
    
    # For now, simulate successful payment
    # In production, verify with payment gateway
    application.payment_status = 'completed'
    application.paid_at = __import__('datetime').datetime.now()
    application.payment_amount = (
        application.program.application_fee_local 
        if application.student_type == 'LOCAL' 
        else application.program.application_fee_intl
    )
    application.save()
    
    # Update payment step
    payment_step = application.steps.filter(name='payment_verified').first()
    if payment_step:
        payment_step.status = 'completed'
        payment_step.completed_at = __import__('datetime').datetime.now()
        payment_step.save()
    
    # Update application status
    if application.status == 'draft':
        application.status = 'submitted'
        application.submitted_at = __import__('datetime').datetime.now()
        application.save()
    
    # Create notification
    UserActivity.objects.create(
        user=request.user,
        action='payment',
        description=f'Payment completed for {application.id}'
    )
    
    return Response({
        'message': 'Payment processed successfully',
        'application_id': application.id,
        'status': application.status
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_application(request, application_id):
    """Submit application for review"""
    try:
        application = Application.objects.get(
            id=application_id,
            applicant=request.user
        )
    except Application.DoesNotExist:
        return Response(
            {'error': 'Application not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if payment is completed
    if application.payment_status != 'completed':
        return Response(
            {'error': 'Payment must be completed before submission'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Update application
    was_revision = application.status == 'revision_requested'
    application.status = 'submitted'
    if not was_revision:
        application.submitted_at = __import__('datetime').datetime.now()
    application.save()
    
    # Create notification
    Notification.objects.create(
        user=request.user,
        type='success',
        title='Application Submitted',
        message=f'Your application {application.id} has been submitted successfully.'
    )
    
    return Response({
        'message': 'Application submitted successfully',
        'application_id': application.id,
        'status': application.status
    })


# Admin views for managing applications
class ApplicationAdminListView(generics.ListAPIView):
    """List all applications (admin only)"""
    queryset = Application.objects.all()
    serializer_class = ApplicationListSerializer
    permission_classes = [permissions.IsAdminUser]


def generate_matric_number(year=None):
    """Generate matriculation number in format UG/YY/XXXX"""
    from datetime import datetime
    yy = (str(year) if year else str(datetime.now().year))[-2:]
    
    from accounts.models import StudentProfile
    last_profile = StudentProfile.objects.filter(
        matric_number__startswith=f'UG/{yy}/'
    ).order_by('-matric_number').first()
    
    if last_profile and last_profile.matric_number:
        try:
            last_num = int(last_profile.matric_number.split('/')[-1])
            new_num = last_num + 1
        except (ValueError, IndexError):
            new_num = 1
    else:
        new_num = 1
    
    return f'UG/{yy}/{new_num:04d}'


def create_student_record(application):
    """Create student user account and profile when application is accepted"""
    from accounts.models import User, StudentProfile
    from academics.models import Program
    from django.utils import timezone
    
    # Check if user already exists for this email
    user, created = User.objects.get_or_create(
        email=application.email,
        defaults={
            'username': application.email,
            'first_name': application.first_name,
            'last_name': application.last_name,
            'phone': application.phone,
            'role': 'student',
            'student_status': 'active',
            'program': application.program,
            'is_email_verified': True,
        }
    )
    
    if not created:
        # Update existing user
        user.first_name = application.first_name
        user.last_name = application.last_name
        user.phone = application.phone
        user.role = 'student'
        user.student_status = 'active'
        user.program = application.program
        user.is_email_verified = True
        user.save()
    
    # Generate matric number
    matric_number = generate_matric_number()
    
    # Create or update student profile
    profile, _ = StudentProfile.objects.get_or_create(
        user=user,
        defaults={
            'matric_number': matric_number,
            'admission_date': timezone.now().date(),
            'admission_type': 'utme',  # default, can be updated later
            'current_level': 100,
            'current_semester': 'first',
            'state_of_origin': application.address.split(',')[-1].strip() if application.address else None,
        }
    )
    
    if not profile.matric_number:
        profile.matric_number = matric_number
        profile.save(update_fields=['matric_number'])
    
    # Link application to user
    application.applicant = user
    application.save(update_fields=['applicant'])
    
    # Create admission message
    ApplicationMessage.objects.create(
        application=application,
        type='success',
        text=f'Congratulations! You have been offered admission. Your matriculation number is {matric_number}.',
        from_name='Admissions Office'
    )
    
    return user, profile, matric_number


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def update_application_status(request, application_id):
    """Update application status (admin only)"""
    try:
        application = Application.objects.get(id=application_id)
    except Application.DoesNotExist:
        return Response(
            {'error': 'Application not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    new_status = request.data.get('status')
    if new_status not in dict(Application.STATUS_CHOICES):
        return Response(
            {'error': 'Invalid status'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    old_status = application.status
    application.status = new_status
    application.save()
    
    # If status changed to accepted, create student record
    matric_number = None
    if new_status == 'accepted' and old_status != 'accepted':
        user, profile, matric_number = create_student_record(application)
    
    # Create message for applicant
    ApplicationMessage.objects.create(
        application=application,
        type='info',
        text=f'Application status updated to {application.get_status_display()}',
        from_name='Admissions Office'
    )
    
    response_data = {
        'message': 'Status updated successfully',
        'new_status': application.status,
        'status_display': application.get_status_display()
    }
    
    if matric_number:
        response_data['matric_number'] = matric_number
        response_data['message'] = f'Application accepted! Matriculation number generated: {matric_number}'
    
    return Response(response_data)


class ApplicationUpdateView(generics.RetrieveUpdateAPIView):
    """Get or update application (applicant can edit when draft or revision_requested)"""
    queryset = Application.objects.all()
    lookup_field = 'pk'
    lookup_url_kwarg = 'application_id'
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ('PATCH', 'PUT'):
            return ApplicationUpdateSerializer
        return ApplicationSerializer

    def get_object(self):
        obj = super().get_object()
        if obj.applicant != self.request.user and not self.request.user.is_staff:
            from django.core.exceptions import PermissionDenied
            raise PermissionDenied("You don't have permission to access this application.")
        return obj

    def patch(self, request, *args, **kwargs):
        application = self.get_object()
        if application.applicant != request.user:
            return Response({'error': 'You can only edit your own applications'}, status=status.HTTP_403_FORBIDDEN)
        if application.status not in ('draft', 'revision_requested'):
            return Response({'error': 'Application can only be edited in draft or revision_requested status'}, status=status.HTTP_400_BAD_REQUEST)
        return self.partial_update(request, *args, **kwargs)

    def perform_update(self, serializer):
        application = serializer.save()
        if application.status == 'revision_requested':
            application.status = 'submitted'
            application.submitted_at = __import__('datetime').datetime.now()
            application.save()


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def replace_application_document(request, application_id, document_id):
    """Replace the file on an existing document"""
    try:
        application = Application.objects.get(id=application_id, applicant=request.user)
    except Application.DoesNotExist:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

    if application.status not in ('draft', 'revision_requested'):
        return Response({'error': 'Documents can only be replaced in draft or revision_requested status'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        document = ApplicationDocument.objects.get(id=document_id, application=application)
    except ApplicationDocument.DoesNotExist:
        return Response({'error': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = DocumentReplaceSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    document.file = serializer.validated_data['file']
    document.status = 'pending'
    document.save()

    return Response(ApplicationDocumentSerializer(document).data)
