from django.urls import path
from . import views

urlpatterns = [
    # Application CRUD
    path('applications/', views.ApplicationCreateView.as_view(), name='application-create'),
    path('applications/list/', views.ApplicationListView.as_view(), name='application-list'),
    path('applications/<str:application_id>/', views.ApplicationDetailView.as_view(), name='application-detail'),
    
    # Application Status (public)
    path('applications/<str:application_id>/status/', views.application_status, name='application-status'),
    
    # User pending applications
    path('applications/user/pending/', views.user_pending_applications, name='user-pending-applications'),
    
    # Documents
    path('applications/<str:application_id>/documents/', views.DocumentUploadView.as_view(), name='document-upload'),
    path('applications/<str:application_id>/documents/<int:document_id>/replace/', views.replace_application_document, name='document-replace'),
    
    # Application update
    path('applications/<str:application_id>/update/', views.ApplicationUpdateView.as_view(), name='application-update'),

    # Admission documents (accepted applications only)
    path('applications/<str:application_id>/success-letter/', views.download_success_letter, name='application-success-letter'),
    path('applications/<str:application_id>/oath-form/', views.download_oath_form, name='application-oath-form'),
    
    # Payment
    path('applications/<str:application_id>/payment/', views.submit_application_payment, name='application-payment'),
    
    # Submit
    path('applications/<str:application_id>/submit/', views.submit_application, name='application-submit'),
    
    # Admin
    path('admin/applications/', views.ApplicationAdminListView.as_view(), name='application-admin-list'),
    path('admin/applications/<str:application_id>/status/', views.update_application_status, name='application-update-status'),
]
