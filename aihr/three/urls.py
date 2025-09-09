from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path("admin-login/", views.admin_login_api, name="admin_login_api"),
    path("api/voice/", views.voice_api, name="voice_api"),
    path("api/analyze_resume/", views.analyze_resume, name="analyze_resume"),
    path("api/schedule_meeting/", views.schedule_meeting, name="schedule_meeting"),
]