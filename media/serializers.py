from rest_framework_mongoengine import serializers

from media.models import Media


class MediaSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Media
        fields = ['id', 'creationDate', 'url']
