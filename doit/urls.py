"""doit URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework_mongoengine import routers

from auth.googleOAuth2Adapter import GoogleLogin
from doit.views import PopulateDB
from frontend.views import app

from social.views import PostViewSet, UserViewSet, NotificationViewSet, FollowViewSet, ParticipateViewSet, \
    LikePostViewSet, LikeTrackingViewSet
from goals.views import GoalViewSet, ObjectiveViewSet, TrackingViewSet, GoalProgress

router = routers.DefaultRouter()

# Social API
router.register(r'post', PostViewSet, "post")
router.register(r'user', UserViewSet, "user")
router.register(r'notification', NotificationViewSet, "notification")
router.register(r'follow', FollowViewSet, 'follow')
router.register(r'participate', ParticipateViewSet, 'participate')
router.register(r'likePost', LikePostViewSet, 'likePost')
router.register(r'likeTracking', LikeTrackingViewSet, 'likeTracking')

# Goals API
router.register(r'goal', GoalViewSet, "goal")
router.register(r'objective', ObjectiveViewSet, "objective")
router.register(r'tracking', TrackingViewSet, "tracking")


urlpatterns = [
    path('api/goal/<str:goal_id>/my-progress', GoalProgress.as_view()),
    path('api/', include(router.urls)),
    
    path('admin/', admin.site.urls),
    path('populate/', PopulateDB.as_view()),
    path('accounts/', include('allauth.urls')),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/signup/', include('dj_rest_auth.registration.urls')),
    path('api/auth/google/', GoogleLogin.as_view(), name='google_login'),

]
