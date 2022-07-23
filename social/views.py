from rest_framework.permissions import IsAuthenticated
from rest_framework_mongoengine import viewsets
from rest_framework.response import Response

from auth.permissions import IsOwnerOrReadOnly, IsPrivateGoal
from goals.models import Goal
from social.models import Post, User, Notification, Follow, Participate, LikeTracking, LikePost
from social.serializers import PostSerializer, UserSerializer, NotificationSerializer, FollowSerializer, \
    ParticipateSerializer, LikeTrackingSerializer, LikePostSerializer
from utils.filters import FilterSet


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    filter_fields = ['title', 'content', 'creationDate', 'createdBy', 'goal']
    custom_filter_fields = [('likes', lambda value: [post.id for post in LikePost.objects.filter(
        post=value).values_list('post')]), ('follows', lambda value: [post.id for post in Post.objects.filter(
        createdBy__in=Follow.objects.filter(
            follower=value).values_list('user'))])]

    def filter_queryset(self, queryset):
        post_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset,
            search_text=True)

        return post_filter.filter()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    filter_fields = ['username', 'email', 'password',
                     'birthDate', 'firstName', 'lastName']
    custom_filter_fields = [
        ('postLikes', lambda value: [post.id for post in LikePost.objects.filter(post=value)
         .values_list('createdBy')]),
        ('trackLikes', lambda value: [track.id for track in LikeTracking.objects.filter(
            tracking=value).values_list('createdBy')]),
        ('goal', lambda value: [user.id for user in Participate.objects.filter(goal=value)
         .values_list('createdBy')]),
        ('followers', lambda value: [user.id for user in Follow.objects.filter(user=value)
         .values_list('follower')]),
        ('following', lambda value: [user.id for user in Follow.objects.filter(follower=value)
         .values_list('user')]),
        ('postCreator', lambda value: [post.id for post in Post.objects.filter(id=value)
         .values_list('createdBy')])
    ]

    def filter_queryset(self, queryset):
        post_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset, search_text=True)

        return post_filter.filter()


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    filter_fields = ['title', 'content', 'creationDate', 'user']
    custom_filter_fields = []

    def filter_queryset(self, queryset):
        post_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return post_filter.filter()


class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer

    filter_fields = ['user', 'follower']
    custom_filter_fields = []

    def filter_queryset(self, queryset):
        post_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return post_filter.filter()


class ParticipateViewSet(viewsets.ModelViewSet):
    queryset = Participate.objects.all()
    serializer_class = ParticipateSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly, IsPrivateGoal,)

    filter_fields = ['createdBy', 'goal']
    custom_filter_fields = []

    def filter_queryset(self, queryset):
        post_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return post_filter.filter()


class LikeTrackingViewSet(viewsets.ModelViewSet):
    queryset = LikeTracking.objects.all()
    serializer_class = LikeTrackingSerializer

    filter_fields = ['createdBy', 'tracking']
    custom_filter_fields = []

    def filter_queryset(self, queryset):
        post_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return post_filter.filter()


class LikePostViewSet(viewsets.ModelViewSet):
    queryset = LikePost.objects.all()
    serializer_class = LikePostSerializer

    filter_fields = ['createdBy', 'post']
    custom_filter_fields = []

    def filter_queryset(self, queryset):
        post_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return post_filter.filter()


# Custom endpoints
class UserIsParticipating(viewsets.GenericAPIView):
    def get(self, request, goal_id, *args, **kwargs):
        user = User.objects.get(id=request.query_params.get("user_id"))
        goal = Goal.objects.get(id=goal_id)
        if len(Participate.objects.filter(createdBy=user, goal=goal)) > 0:
            return Response(True)
        return Response(False)
