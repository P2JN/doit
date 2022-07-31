from rest_framework.permissions import IsAuthenticated
from rest_framework_mongoengine import viewsets
from rest_framework.response import Response

from auth.permissions import IsOwnerOrReadOnly, IsPrivateGoal
from goals.models import Goal
from social.models import Post, User, Notification, Follow, Participate, LikeTracking, LikePost, Comment
from social.serializers import PostSerializer, UserSerializer, NotificationSerializer, FollowSerializer, \
    ParticipateSerializer, LikeTrackingSerializer, LikePostSerializer, CommentSerializer
from utils.filters import FilterSet
from utils.notifications import delete_notification, create_notification, create_user_notification


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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        content = "La publicacion " + serializer.data.get("title") + " ha sido añadida"
        if serializer.instance.goal:
            content = "La publicacion " + serializer.data.get("title") + " ha sido añadida a la meta " + \
                      serializer.instance.goal.title + "."
        return create_notification(self, serializer, request, "Post", "¡Has creado una nueva publicacion!", content)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        content = "La publicacion " + instance.title + " ha sido eliminada"
        if instance.goal:
            content = "La publicacion " + instance.title + " ha sido eliminada de la meta " + \
                      instance.goal.title + "."
        return delete_notification(self, instance, request, "¡Post eliminado!",
                                   content)


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

    filter_fields = ['title', 'content', 'creationDate', 'user', 'checked']
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

    def perform_create(self, serializer):
        serializer.save()
        instance = serializer.instance
        create_user_notification(instance.user, instance.follower.username + " ha empezado a seguirte.",
                                 instance.follower.username + " te ha seguido.")

    def perform_destroy(self, instance):
        instance.delete()
        create_user_notification(instance.user, instance.follower.username + " ha dejado de seguirte.",
                                 instance.follower.username + " ya no te sigue.")


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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return create_notification(self, serializer, request, "Participate", "¡Has empezado a participar en esta meta!",
                                   "Empezaste a participar en la meta: " + serializer.instance.goal.title + ".")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        return delete_notification(self, instance, request, "¡Has dejado de participar en esta meta!",
                                   "Dejaste de participar en la meta: " + instance.goal.title + ".")


class LikeTrackingViewSet(viewsets.ModelViewSet):
    queryset = LikeTracking.objects.all()
    serializer_class = LikeTrackingSerializer

    filter_fields = ['createdBy', 'tracking']
    custom_filter_fields = []

    def filter_queryset(self, queryset):
        post_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return post_filter.filter()

    def perform_create(self, serializer):
        serializer.save()
        instance = serializer.instance
        create_user_notification(instance.tracking.createdBy,
                                 instance.createdBy.username + " te ha dado like a un tracking.",
                                 instance.createdBy.username + " te dio un like en tu tracking del " + str(
                                     instance.tracking.date)
                                 + " en el que conseguiste " + str(instance.tracking.amount)
                                 + " " + instance.tracking.goal.unit + ".")


class LikePostViewSet(viewsets.ModelViewSet):
    queryset = LikePost.objects.all()
    serializer_class = LikePostSerializer

    filter_fields = ['createdBy', 'post']
    custom_filter_fields = []

    def filter_queryset(self, queryset):
        post_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return post_filter.filter()

    def perform_create(self, serializer):
        serializer.save()
        instance = serializer.instance
        create_user_notification(instance.post.createdBy, instance.createdBy.username + " te ha dado like a un post.",
                                 "Al usuario "+instance.createdBy.username + " le ha gustado tu publicacion " + instance.post.title + ".")


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    filter_fields = ['content', 'createdBy', 'creationDate', 'post']
    custom_filter_fields = []

    def filter_queryset(self, queryset):
        post_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset, search_text=True)

        return post_filter.filter()

    def perform_create(self, serializer):
        serializer.save()
        instance = serializer.instance
        create_user_notification(instance.post.createdBy,
                                 instance.createdBy.username + " ha comentado en tu post " + instance.post.title + ".",
                                 instance.createdBy.username + " ha comentado: " + instance.content + ".")


# Custom endpoints
class UserIsParticipating(viewsets.GenericAPIView):
    def get(self, request, goal_id, *args, **kwargs):
        user = User.objects.get(id=request.query_params.get("user_id"))
        goal = Goal.objects.get(id=goal_id)
        if len(Participate.objects.filter(createdBy=user, goal=goal)) > 0:
            return Response(True)
        return Response(False)
