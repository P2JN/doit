from rest_framework_mongoengine import serializers

from goals.models import Goal, Objective, Tracking
from social.models import LikeTracking


class GoalSerializer(serializers.DocumentSerializer):
    objectives = serializers.serializers.SerializerMethodField()

    class Meta:
        model = Goal
        fields = ['id', 'title', 'description', 'unit', 'type',
                  'creationDate', 'startDate', 'deadline', 'createdBy', 'objectives']
        read_only_fields = ['creationDate']

    def get_objectives(self, obj):
        objectives = Objective.objects.filter(goal=obj)
        return ObjectiveSerializer(objectives, many=True).data


class ObjectiveSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Objective
        fields = ['id', 'quantity', 'frequency', 'goal']


class TrackingSerializer(serializers.DocumentSerializer):
    likes = serializers.serializers.SerializerMethodField()

    class Meta:
        model = Tracking
        fields = ['id', 'date', 'amount', 'createdBy', 'goal', 'likes']
        read_only_fields = ['date']

    def get_likes(self, obj):
        likes = LikeTracking.objects.filter(tracking=obj).count()
        return likes
