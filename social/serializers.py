from rest_framework_mongoengine import serializers
from social.models import Post, User, Notification, Follow, Participate, LikeTracking, LikePost


# Serializers define the API representation.


class PostSerializer(serializers.DocumentSerializer):
    likes = serializers.serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content',
                  'creationDate', 'createdBy', 'goal', 'likes']

    def get_likes(self, obj):
        likes = LikePost.objects(post=obj).count()
        return likes


class UserSerializer(serializers.DocumentSerializer):
    numFollowers = serializers.serializers.SerializerMethodField()
    numFollowing = serializers.serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password',
                  'birthDate', 'firstName', 'lastName', 'numFollowers', 'numFollowing']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def get_numFollowers(self, obj):
        numFollowers = Follow.objects(user=obj).count()
        return numFollowers

    def get_numFollowing(self, obj):
        numFollowing = Follow.objects(follower=obj).count()
        return numFollowing


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
        fields = ['id', 'user', 'goal']


class LikeTrackingSerializer(serializers.DocumentSerializer):
    class Meta:
        model = LikeTracking
        fields = ['id', 'user', 'tracking']


class LikePostSerializer(serializers.DocumentSerializer):
    class Meta:
        model = LikePost
        fields = ['id', 'user', 'post']
