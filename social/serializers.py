from rest_framework_mongoengine import serializers
from social.models import Post, User, Notification, Follow, Participate, LikeTracking, LikePost, Comment


# Serializers define the API representation.


class PostSerializer(serializers.DocumentSerializer):
    likes = serializers.serializers.SerializerMethodField()
    numComments = serializers.serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content',
                  'creationDate', 'createdBy', 'goal', 'likes', 'numComments']
        read_only_fields = ['creationDate']

    def get_likes(self, obj):
        return LikePost.objects(post=obj).count()

    def get_numComments(self, obj):
        return Comment.objects(post=obj).count()


class UserSerializer(serializers.DocumentSerializer):
    numFollowers = serializers.serializers.SerializerMethodField()
    numFollowing = serializers.serializers.SerializerMethodField()
    numPosts = serializers.serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password',
                  'birthDate', 'firstName', 'lastName', 'numFollowers', 'numFollowing', 'numPosts']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def get_numFollowers(self, obj):
        return Follow.objects(user=obj).count()

    def get_numFollowing(self, obj):
        return Follow.objects(follower=obj).count()

    def get_numPosts(self, obj):
        return Post.objects(createdBy=obj).count()


class NotificationSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'content', 'creationDate', 'user']
        read_only_fields = ['creationDate']


class FollowSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'user', 'follower']


class ParticipateSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Participate
        fields = ['id', 'createdBy', 'goal']


class LikeTrackingSerializer(serializers.DocumentSerializer):
    class Meta:
        model = LikeTracking
        fields = ['id', 'createdBy', 'tracking']


class LikePostSerializer(serializers.DocumentSerializer):
    class Meta:
        model = LikePost
        fields = ['id', 'createdBy', 'post']


class CommentSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'content', 'createdBy', 'creationDate', 'post']
        read_only_fields = ['creationDate']
