from bson import DBRef
from rest_framework_mongoengine import serializers
from social.models import Post, User, Notification, Follow, Participate, LikeTracking, LikePost


# Serializers define the API representation.


class PostSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'content',
                  'creationDate', 'createdBy', 'goal']


class UserSerializer(serializers.DocumentSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password',
                  'birthDate', 'firstName', 'lastName', 'followers']
        read_only_fields = ['followers']


class NotificationSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'content', 'creationDate', 'user']


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
