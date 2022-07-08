from rest_framework_mongoengine import viewsets

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
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return post_filter.filter()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    filter_fields = ['username', 'email', 'password',
                     'birthDate', 'firstName', 'lastName']
    custom_filter_fields = [
        ('postLikes', lambda value: [post.id for post in LikePost.objects.filter(post=value)
         .values_list('user')]),
        ('trackLikes', lambda value: [track.id for track in LikeTracking.objects.filter(
            tracking=value).values_list('user')]),
        ('goal', lambda value: [user.id for user in Participate.objects.filter(goal=value)
         .values_list('user')]),
        ('followers', lambda value: [user.id for user in Follow.objects.filter(user=value)
         .values_list('follower')]),
        ('following', lambda value: [user.id for user in Follow.objects.filter(follower=value)
         .values_list('user')]),
        ('postCreator', lambda value: [post.id for post in Post.objects.filter(id=value)
         .values_list('createdBy')])
    ]

    def filter_queryset(self, queryset):
        post_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

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

    filter_fields = ['user', 'goal']
    custom_filter_fields = []

    def filter_queryset(self, queryset):
        post_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return post_filter.filter()


class LikeTrackingViewSet(viewsets.ModelViewSet):
    queryset = LikeTracking.objects.all()
    serializer_class = LikeTrackingSerializer

    filter_fields = ['like', 'tracking']
    custom_filter_fields = []

    def filter_queryset(self, queryset):
        post_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return post_filter.filter()


class LikePostViewSet(viewsets.ModelViewSet):
    queryset = LikePost.objects.all()
    serializer_class = LikePostSerializer

    filter_fields = ['like', 'post']
    custom_filter_fields = []

    def filter_queryset(self, queryset):
        post_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return post_filter.filter()
