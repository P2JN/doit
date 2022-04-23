from rest_framework_mongoengine import serializers, viewsets

# Serializers define the API representation.
from social.models import Post


class PostSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Post
        fields = ['title', 'content']
