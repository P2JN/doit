from django.db.models import Count, F
from rest_framework.permissions import IsAuthenticated
from rest_framework_mongoengine import viewsets
from rest_framework.response import Response

from auth.permissions import IsOwnerOrReadOnly, IsPrivateGoal
from goals.models import Goal
from goals.serializers import GoalSerializer
from social.models import Post, User, Notification, Follow, Participate, LikeTracking, LikePost, Comment
from social.serializers import PostSerializer, UserSerializer, NotificationSerializer, FollowSerializer, \
    ParticipateSerializer, LikeTrackingSerializer, LikePostSerializer, CommentSerializer
from utils.filters import FilterSet
from utils.recomendations import get_users_affinity, get_post_recomendations


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


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    filter_fields = ['content', 'createdBy', 'creationDate', 'post']
    custom_filter_fields = []

    def filter_queryset(self, queryset):
        post_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset, search_text=True)

        return post_filter.filter()


# Custom endpoints
class UserIsParticipating(viewsets.GenericAPIView):
    def get(self, request, goal_id, *args, **kwargs):
        user = User.objects.get(id=request.query_params.get("user_id"))
        goal = Goal.objects.get(id=goal_id)
        if len(Participate.objects.filter(createdBy=user, goal=goal)) > 0:
            return Response(True)
        return Response(False)


class UserRecommendations(viewsets.GenericAPIView):
    def get(self, request, user_id, *args, **kwargs):
        logged_user_goals = [GoalSerializer(goal).data for goal in
                             Participate.objects.filter(createdBy=user_id).order_by('-creationDate')[0:50].values_list(
                                 'goal')]
        follows = [follow.id for follow in Follow.objects().filter(follower=user_id).values_list('follower')]
        users = [UserSerializer(user).data for user in User.objects.filter(
            id__nin=follows, id__ne=user_id)]
        sort_by_followers = sorted(
            users, key=lambda x: x.get("numFollowers"), reverse=True)
        max_followers = sort_by_followers[0].get("numFollowers") if sort_by_followers else 0
        sort_by_posts = sorted(
            users, key=lambda x: x.get("numPosts"), reverse=True)
        max_posts = sort_by_posts[0].get("numPosts") if sort_by_posts else 0
        sort_by_trackings = sorted(
            users, key=lambda x: x.get("numTrackings"), reverse=True)
        max_trackings = sort_by_trackings[0].get("numTrackings") if sort_by_trackings else 0
        sort_by_activity = sorted(users, key=lambda x: ((x.get("numTrackings") + 1) / (max_trackings + 1)) + (
            (x.get("numPosts")+1) / (max_posts+1)) * 0.5, reverse=True)
        sort_by_affinity = sorted(users,
                                  key=lambda user: get_users_affinity(logged_user_goals, user, max_followers, max_posts,
                                                                      max_trackings), reverse=True)
        res = {"followers": sort_by_followers[0:9], "posts": sort_by_posts[0:9], "trackings": sort_by_trackings[0:9],
               "activity": sort_by_activity[0:9], "affinity": sort_by_affinity[0:9]}

        return Response(res)


class PostRecommendations(viewsets.GenericAPIView):

    def get(self, request, user_id, *args, **kwargs):
        follows = Follow.objects().filter(follower=user_id).values_list('user')
        liked_posts = [post.id for post in LikePost.objects().filter(createdBy=user_id).values_list('post')]
        posts = [PostSerializer(post).data for post in Post.objects.filter(id__nin=liked_posts, createdBy__ne=user_id,
                                                                           createdBy__nin=follows)]
        sort_by_likes = sorted(
            posts, key=lambda x: x.get("likes"), reverse=True)
        max_likes = sort_by_likes[0].get("likes") if sort_by_likes else 0
        sort_by_comments = sorted(posts, key=lambda x: x.get("numComments") * 0.5 + len(
            Comment.objects.filter(post=x.get("id"))
            .distinct("createdBy")), reverse=True)
        max_comments = max(posts, key=lambda x: x.get(
            "numComments")).get("numComments") if posts else 0
        sort_by_activity = sorted(posts, key=lambda x: ((x.get("likes") + 1) / (max_likes + 1)) + (
                (x.get("numComments") + 1) / (max_comments + 1)) * 0.5, reverse=True)
        post_by_followers = PostSerializer(Post.objects.filter(id__nin=liked_posts,
                                                               createdBy__in=Follow.objects().filter(
                                                                   follower__in=follows, user__ne=user_id,
                                                                   user__nin=follows)
                                                               .order_by('?')[0:10].values_list('user'))[0:9],
                                           many=True).data
        post_recomendations = get_post_recomendations(
            posts, user_id, max_likes, max_comments)
        res = {"likes": sort_by_likes[0:9], "comments": sort_by_comments[0:9],
               "activity": sort_by_activity[0:9], "followers": post_by_followers,
               "recomendations": post_recomendations}

        return Response(res)
