from rest_framework_mongoengine import serializers
from utils.querys import get_obj_or_404
from social.models import Post, User, Notification


# Serializers define the API representation.


class PostSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'creationDate']


class UserSerializer(serializers.DocumentSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'birthDate', 'firstName', 'lastName']


class NotificationSerializer(serializers.DocumentSerializer):
    user = serializers.serializers.CharField(source="user.id", read_only=True)
    userId = serializers.serializers.CharField(required=False)

    class Meta:
        model = Notification
        fields = ['id', 'title', 'content', 'creationDate', 'user', 'userId']

    def create(self, validated_data):
        user_id = validated_data.pop('userId')
        user = get_obj_or_404(User, id=user_id)
        instance = super(NotificationSerializer, self).create(validated_data)
        instance.user = user
        instance.save()
        return instance
