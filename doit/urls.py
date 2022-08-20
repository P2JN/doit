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
from django.conf.urls.static import static

from rest_framework_mongoengine import routers

from assistant.views import HomeAssistantAPI, FeedAssistantAPI, ExploreAssistantAPI, NotificationsAssistantAPI, \
    UserInfoAssistantAPI, UserTrackingsAssistantAPI, UserFeedAssistantAPI, UserRelatedAssistantAPI, \
    UserStatsAssistantAPI, LeaderboardAssistantAPI, GoalsStatsAssistantAPI, GoalsInfoAssistantAPI, \
    GoalsTrackingAssistantAPI, GoalsFeedAssistantAPI, PostDetailsAssistantAPI
from auth.googleOAuth2Adapter import GoogleLogin
from doit.settings import MEDIA_ROOT, MEDIA_URL
from doit.views import PopulateDB
from frontend.views import app
from goals.views import GoalViewSet, ObjectiveViewSet, TrackingViewSet, GoalProgress, LeaderBoard, GoalsRecommendations
from media.views import MediaUploadApi, MediaApi
from social.views import PostViewSet, UserViewSet, NotificationViewSet, FollowViewSet, ParticipateViewSet, \
    LikePostViewSet, LikeTrackingViewSet, CommentViewSet, UserIsParticipating, UserRecommendations, PostRecommendations, \
    UncheckedNotifications
from stats.views import UserStatsApi, GoalStatsApi

router = routers.DefaultRouter()

# Social API
router.register(r'post', PostViewSet, "post")
router.register(r'user', UserViewSet, "user")
router.register(r'notification', NotificationViewSet, "notification")
router.register(r'follow', FollowViewSet, 'follow')
router.register(r'participate', ParticipateViewSet, 'participate')
router.register(r'like-post', LikePostViewSet, 'like-post')
router.register(r'like-tracking', LikeTrackingViewSet, 'like-tracking')
router.register(r'comment', CommentViewSet, 'comment')

# Goals API
router.register(r'goal', GoalViewSet, "goal")
router.register(r'objective', ObjectiveViewSet, "objective")
router.register(r'tracking', TrackingViewSet, "tracking")

urlpatterns = [
    # Customs endpoints
    path('api/goal/<str:goal_id>/my-progress', GoalProgress.as_view()),
    path('api/goal/<str:goal_id>/leaderboard', LeaderBoard.as_view()),
    path('api/goal/<goal_id>/is-participating', UserIsParticipating.as_view()),
    path('api/user/<str:user_id>/user-recommendations',
         UserRecommendations.as_view()),
    path('api/user/<str:user_id>/goal-recommendations',
         GoalsRecommendations.as_view()),
    path('api/user/<str:user_id>/post-recommendations',
         PostRecommendations.as_view()),
    path('api/user/<str:user_id>/unchecked-notifications',
         UncheckedNotifications.as_view()),
    path('api/user/<str:user_id>/stats', UserStatsApi.as_view()),
    path('api/goal/<str:goal_id>/stats', GoalStatsApi.as_view()),
    path('api/media/', MediaUploadApi.as_view()),
    path('api/media/<media_id>', MediaApi.as_view()),

    # Assistant API
    path('api/assistant/home', HomeAssistantAPI.as_view()),
    path('api/assistant/feed', FeedAssistantAPI.as_view()),
    path('api/assistant/explore/<str:ignore>', ExploreAssistantAPI.as_view()),

    path('api/assistant/notifications', NotificationsAssistantAPI.as_view()),
    path('api/assistant/users/<str:user_id>/info',
         UserInfoAssistantAPI.as_view()),
    path('api/assistant/users/<str:user_id>/trackings',
         UserTrackingsAssistantAPI.as_view()),
    path('api/assistant/users/<str:user_id>/feed',
         UserFeedAssistantAPI.as_view()),
    path('api/assistant/users/<str:user_id>/related',
         UserRelatedAssistantAPI.as_view()),
    path('api/assistant/users/<str:user_id>/stats',
         UserStatsAssistantAPI.as_view()),

    path('api/assistant/goals/<str:goal_id>/leaderboard',
         LeaderboardAssistantAPI.as_view()),

    path('api/assistant/goals/<str:goal_id>/stats/<str:refDate>', GoalsStatsAssistantAPI.as_view()),

    path('api/assistant/goals/<str:goal_id>/info', GoalsInfoAssistantAPI.as_view()),
    path('api/assistant/goals/<str:goal_id>/trackings', GoalsTrackingAssistantAPI.as_view()),
    path('api/assistant/goals/<str:goal_id>/feed', GoalsFeedAssistantAPI.as_view()),
    path('api/assistant/posts/<str:post_id>', PostDetailsAssistantAPI.as_view()),

    # ViewSet endpoints
    path('api/', include(router.urls)),

    # Auth
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/signup/', include('dj_rest_auth.registration.urls')),
    path('api/auth/google/', GoogleLogin.as_view(), name='google_login'),

    # Other urls
    path('admin/', admin.site.urls),
    path('populate/', PopulateDB.as_view()),
    path('accounts/', include('allauth.urls')),
]

# Serve media files
urlpatterns = urlpatterns + static(MEDIA_URL, document_root=MEDIA_ROOT)

# Frontend
urlpatterns = urlpatterns + [re_path('', app)]
