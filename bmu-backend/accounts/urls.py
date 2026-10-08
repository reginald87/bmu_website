from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('login/', views.login_view, name='user-login'),
    path('logout/', views.logout_view_html, name='user-logout'),
    path('verify-email/', views.verify_email, name='verify-email'),
    
    # Profile
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('profile/update/', views.UserProfileUpdateView.as_view(), name='user-profile-update'),
    
    # Password
    path('password/change/', views.ChangePasswordView.as_view(), name='password-change'),
    path('password/reset/', views.PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password/reset/confirm/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # Activity & Notifications
    path('activities/', views.UserActivityListView.as_view(), name='user-activities'),
    path('notifications/', views.NotificationListView.as_view(), name='user-notifications'),
    path('notifications/<int:pk>/read/', views.mark_notification_read, name='mark-notification-read'),
    
    # Admin
    path('users/', views.UserListView.as_view(), name='user-list'),
]
