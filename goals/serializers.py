from rest_framework_mongoengine import serializers

from goals.models import Goal, Objective, Tracking

# Serializers define the API representation.


class GoalSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Goal
        depth = 2
        fields = ['title', 'description', 'unit', 'type',
                  'creationDate', 'startDate', 'deadline',
                  'objectives', 'createdBy', 'participants', 'posts', 'trackings']


class ObjectiveSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Objective
        fields = ['quantity', 'frequency', 'goal']


class TrackingSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Tracking
        fields = ['date', 'amount', 'goal']
