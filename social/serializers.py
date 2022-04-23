from rest_framework_mongoengine import serializers

from social.models import Post

# Serializers define the API representation.


class PostSerializer(serializers.DocumentSerializer):

    class Meta:
        model = Post
        fields = ['title', 'content', 'creationDate']
