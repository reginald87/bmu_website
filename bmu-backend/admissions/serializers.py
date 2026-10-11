from rest_framework import serializers
from .models import Application, ApplicationDocument, ApplicationStep, ApplicationMessage, AcademicRecord


class ApplicationDocumentSerializer(serializers.ModelSerializer):
    """Serializer for ApplicationDocument model"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    name_display = serializers.CharField(source='get_name_display', read_only=True)
    
    class Meta:
        model = ApplicationDocument
        fields = [
            'id', 'name', 'name_display', 'file', 'status', 'status_display',
            'review_notes', 'uploaded_at', 'updated_at'
        ]
        read_only_fields = ['uploaded_at', 'updated_at']


class ApplicationStepSerializer(serializers.ModelSerializer):
    """Serializer for ApplicationStep model"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    name_display = serializers.CharField(source='get_name_display', read_only=True)
    
    class Meta:
        model = ApplicationStep
        fields = [
            'id', 'name', 'name_display', 'status', 'status_display',
            'completed_at', 'notes', 'decision'
        ]


class ApplicationMessageSerializer(serializers.ModelSerializer):
    """Serializer for ApplicationMessage model"""
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = ApplicationMessage
        fields = [
            'id', 'type', 'type_display', 'text', 'from_name',
            'is_from_applicant', 'created_at', 'read_at'
        ]


class AcademicRecordSerializer(serializers.ModelSerializer):
    """Serializer for AcademicRecord model"""
    
    class Meta:
        model = AcademicRecord
        fields = [
            'id', 'type', 'institution_name', 'year_of_completion',
            'subjects', 'grade', 'status'
        ]
    
    def validate(self, attrs):
        type = attrs.get('type')
        
        if type in ['ssce', 'waec', 'neco']:
            # For SSCE/WAEC/NECO, require subjects
            if not attrs.get('subjects'):
                raise serializers.ValidationError("Subjects are required for SSCE/WAEC/NECO records")
            # Validate subjects format (at most 9 subjects)
            subjects = attrs.get('subjects', [])
            if len(subjects) > 9:
                raise serializers.ValidationError("At most 9 subjects are allowed for SSCE/WAEC/NECO")
            
            # Validate each subject has subject and grade
            for i, subject_data in enumerate(subjects):
                if not subject_data.get('subject'):
                    raise serializers.ValidationError(f"Subject name required for subject {i+1}")
                if not subject_data.get('grade'):
                    raise serializers.ValidationError(f"Grade required for subject {subject_data.get('subject', f'{i+1}')}")
        
        elif type in ['bsc', 'msc', 'masters', 'bachelors']:
            # For Bachelors/Masters, require grade
            if not attrs.get('grade'):
                raise serializers.ValidationError("Grade is required for Bachelors/Masters records")
        
        return attrs


class ApplicationSerializer(serializers.ModelSerializer):
    """Serializer for Application model"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    student_type_display = serializers.CharField(source='get_student_type_display', read_only=True)
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    
    documents = ApplicationDocumentSerializer(many=True, read_only=True)
    steps = ApplicationStepSerializer(many=True, read_only=True)
    messages = ApplicationMessageSerializer(many=True, read_only=True)
    academic_records = AcademicRecordSerializer(many=True, read_only=True)
    
    program_title = serializers.CharField(source='program.title', read_only=True)
    program_college = serializers.SerializerMethodField()

    def get_program_college(self, obj):
        return obj.program.college.name if obj.program.college else None
    
    class Meta:
        model = Application
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone',
            'date_of_birth', 'gender', 'gender_display', 'address',
            'nationality', 'state_of_origin', 'lga', 'is_indigene',
            'student_type', 'student_type_display',
            'program', 'program_title', 'program_college',
            'previous_institution',
            'status', 'status_display', 'progress_percentage',
            'payment_status', 'payment_status_display',
            'payment_amount', 'payment_currency', 'payment_method', 'paid_at',
            'documents', 'steps', 'messages', 'academic_records',
            'created_at', 'updated_at', 'submitted_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new applications"""
    academic_records = AcademicRecordSerializer(many=True, required=False, write_only=True)
    passport = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = Application
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone',
            'date_of_birth', 'gender', 'address',
            'nationality', 'state_of_origin', 'lga',
            'student_type', 'program',
            'previous_institution', 'academic_records', 'passport'
        ]
        read_only_fields = ['id']

    def validate_program(self, program):
        if not program.is_active:
            raise serializers.ValidationError("This program is not available.")
        if not program.applications_open:
            raise serializers.ValidationError(
                "Applications for this program are currently closed."
            )
        return program

    def create(self, validated_data):
        academic_records_data = validated_data.pop('academic_records', [])
        passport = validated_data.pop('passport', None)
        
        # Link applicant from the request user
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['applicant'] = request.user
        
        # Create application
        application = Application.objects.create(**validated_data)
        
        # Create academic records
        for record_data in academic_records_data:
            AcademicRecord.objects.create(application=application, **record_data)
        
        # Set passport if provided
        if passport:
            application.passport = passport
            application.save(update_fields=['passport'])
        
        return application


class ApplicationListSerializer(serializers.ModelSerializer):
    """Serializer for application lists with nested data"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    student_type_display = serializers.CharField(source='get_student_type_display', read_only=True)
    program_title = serializers.CharField(source='program.title', read_only=True)
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    
    documents = ApplicationDocumentSerializer(many=True, read_only=True)
    steps = ApplicationStepSerializer(many=True, read_only=True)
    messages = ApplicationMessageSerializer(many=True, read_only=True)
    academic_records = AcademicRecordSerializer(many=True, read_only=True)
    
    class Meta:
        model = Application
        fields = [
            'id', 'public_id', 'first_name', 'last_name', 'email', 'phone',
            'date_of_birth', 'gender', 'gender_display', 'address',
            'nationality', 'state_of_origin', 'lga', 'is_indigene',
            'student_type', 'student_type_display',
            'program', 'program_title',
            'status', 'status_display', 'progress_percentage',
            'payment_status', 'payment_status_display',
            'payment_amount', 'payment_currency', 'payment_method',
            'payment_reference', 'paid_at',
            'documents', 'steps', 'messages', 'academic_records',
            'created_at', 'updated_at', 'submitted_at'
        ]


class ApplicationStatusSerializer(serializers.ModelSerializer):
    """Serializer for application status check"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    steps = ApplicationStepSerializer(many=True, read_only=True)
    
    class Meta:
        model = Application
        fields = ['id', 'status', 'status_display', 'progress_percentage', 'steps', 'submitted_at']


class ApplicationPaymentSerializer(serializers.Serializer):
    """Serializer for application payment"""
    payment_method = serializers.ChoiceField(choices=[('paystack', 'Paystack'), ('bank_deposit', 'Bank Deposit')])
    payment_reference = serializers.CharField(required=False, allow_blank=True)


class ApplicationUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating an existing application"""
    academic_records = AcademicRecordSerializer(many=True, required=False)
    passport = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Application
        fields = [
            'first_name', 'last_name', 'email', 'phone',
            'date_of_birth', 'gender', 'address',
            'previous_institution', 'academic_records', 'passport'
        ]

    def update(self, instance, validated_data):
        academic_records_data = validated_data.pop('academic_records', None)
        passport = validated_data.pop('passport', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if passport is not None:
            instance.passport = passport

        instance.save()

        if academic_records_data is not None:
            instance.academic_records.all().delete()
            for record_data in academic_records_data:
                AcademicRecord.objects.create(application=instance, **record_data)

        return instance


class DocumentUploadSerializer(serializers.Serializer):
    """Serializer for document upload"""
    document_type = serializers.ChoiceField(choices=[
        ('passport_photo', 'Passport Photograph'),
        ('birth_certificate', 'Birth Certificate'),
        ('academic_transcripts', 'Academic Transcripts'),
        ('certificate_of_origin', 'Certificate of Origin'),
        ('english_proficiency', 'English Proficiency'),
        ('reference_letters', 'Reference Letters'),
        ('other', 'Other'),
    ])
    file = serializers.FileField()


class DocumentReplaceSerializer(serializers.Serializer):
    """Serializer for replacing a document file"""
    file = serializers.FileField()
