from io import BytesIO
from datetime import date
from django.template.loader import render_to_string
from django.http import HttpResponse
from xhtml2pdf import pisa
from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import College, Department, Program, Faculty, SDGMetric, HomeStats, AcademicCalendar
from .serializers import (
    CollegeSerializer, CollegeListSerializer, DepartmentSerializer,
    ProgramSerializer, ProgramListSerializer,
    FacultySerializer, FacultyListSerializer, SDGMetricSerializer,
    HomeStatsSerializer
)


# College Views
class CollegeListView(generics.ListAPIView):
    """List all colleges"""
    queryset = College.objects.filter(is_active=True)
    serializer_class = CollegeListSerializer
    permission_classes = [AllowAny]


class CollegeDetailView(generics.RetrieveAPIView):
    """Get college details with departments"""
    queryset = College.objects.filter(is_active=True)
    serializer_class = CollegeSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]


# Department Views
class DepartmentListView(generics.ListAPIView):
    """List all departments"""
    queryset = Department.objects.filter(is_active=True)
    serializer_class = DepartmentSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['college']


# Program Views
class ProgramListView(generics.ListAPIView):
    """List all programs with filtering"""
    queryset = Program.objects.filter(is_active=True)
    serializer_class = ProgramListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['level', 'college', 'department']
    search_fields = ['title', 'description']

    def get_serializer_class(self):
        if self.request.query_params.get('detailed'):
            return ProgramSerializer
        return ProgramListSerializer


class ProgramDetailView(generics.RetrieveAPIView):
    """Get program details by slug"""
    queryset = Program.objects.filter(is_active=True)
    serializer_class = ProgramSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([AllowAny])
def programs_by_level(request, level):
    """Get programs grouped by level or filtered by level"""
    valid_levels = ['undergraduate', 'masters', 'phd', 'certificate']
    
    if level == 'all':
        programs = Program.objects.filter(is_active=True)
        data = {
            'undergraduate': ProgramListSerializer(
                programs.filter(level='undergraduate'), many=True
            ).data,
            'masters': ProgramListSerializer(
                programs.filter(level='masters'), many=True
            ).data,
            'phd': ProgramListSerializer(
                programs.filter(level='phd'), many=True
            ).data,
            'certificate': ProgramListSerializer(
                programs.filter(level='certificate'), many=True
            ).data,
        }
        return Response(data)
    
    if level in valid_levels:
        programs = Program.objects.filter(level=level, is_active=True)
        serializer = ProgramListSerializer(programs, many=True)
        return Response(serializer.data)
    
    return Response({'error': 'Invalid level'}, status=status.HTTP_400_BAD_REQUEST)


# Faculty Views
class FacultyListView(generics.ListAPIView):
    """List all faculty with filtering and search"""
    queryset = Faculty.objects.filter(is_active=True)
    serializer_class = FacultyListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['college', 'department', 'position']
    search_fields = ['first_name', 'last_name', 'email', 'research_interests']

    def get_serializer_class(self):
        if self.request.query_params.get('detailed'):
            return FacultySerializer
        return FacultyListSerializer


class FacultyDetailView(generics.RetrieveAPIView):
    """Get faculty details by ID"""
    queryset = Faculty.objects.filter(is_active=True)
    serializer_class = FacultySerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([AllowAny])
def faculty_by_college(request, slug):
    """Get faculty members by college"""
    try:
        college = College.objects.get(slug=slug, is_active=True)
        faculty = Faculty.objects.filter(college=college, is_active=True)
        serializer = FacultyListSerializer(faculty, many=True)
        return Response(serializer.data)
    except College.DoesNotExist:
        return Response({'error': 'College not found'}, status=status.HTTP_404_NOT_FOUND)


# SDG Metrics Views
class SDGMetricsListView(generics.ListAPIView):
    """List all SDG metrics grouped by SDG"""
    queryset = SDGMetric.objects.filter(is_active=True)
    serializer_class = SDGMetricSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Group by SDG code
        sdg_data = {
            'sdg3': {
                'title': 'Good Health & Well-being',
                'metrics': SDGMetricSerializer(
                    queryset.filter(sdg_code='sdg3'), many=True
                ).data
            },
            'sdg4': {
                'title': 'Quality Education',
                'metrics': SDGMetricSerializer(
                    queryset.filter(sdg_code='sdg4'), many=True
                ).data
            },
            'sdg5': {
                'title': 'Gender Equality',
                'metrics': SDGMetricSerializer(
                    queryset.filter(sdg_code='sdg5'), many=True
                ).data
            },
            'sdg17': {
                'title': 'Partnerships for the Goals',
                'metrics': SDGMetricSerializer(
                    queryset.filter(sdg_code='sdg17'), many=True
                ).data
            },
        }
        
        return Response(sdg_data)


# Home Stats View
@api_view(['GET'])
@permission_classes([AllowAny])
def home_stats(request):
    """Get homepage statistics"""
    stats = HomeStats.objects.first()
    if stats:
        serializer = HomeStatsSerializer(stats)
        return Response(serializer.data)
    
    # Return default stats if none exist
    return Response({
        'research_papers': 0,
        'students': 0,
        'faculty': 0,
        'partners': 0,
        'updated_at': None
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def download_calendar_pdf(request):
    """Generate and download academic calendar as PDF"""
    academic_year = request.GET.get('academic_year', '')

    events = AcademicCalendar.objects.filter(is_active=True)
    if academic_year:
        events = events.filter(academic_year=academic_year)

    events = events.order_by('term', 'start_date', 'display_order')

    grouped_events = {}
    for event in events:
        term_key = event.get_term_display() or 'Other Dates'
        if term_key not in grouped_events:
            grouped_events[term_key] = []
        grouped_events[term_key].append(event)

    if not grouped_events:
        latest_year = AcademicCalendar.objects.filter(is_active=True).values_list('academic_year', flat=True).first()
        academic_year = latest_year or 'Current'

    html = render_to_string('academics/calendar_pdf.html', {
        'academic_year': academic_year or (events.first().academic_year if events.exists() else 'Current'),
        'grouped_events': grouped_events,
        'generated_date': date.today(),
    })

    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html.encode('UTF-8')), result)

    if pdf.err:
        return HttpResponse('Error generating PDF', status=500)

    response = HttpResponse(result.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="academic_calendar_{academic_year.replace("/", "_")}.pdf"'
    return response
