from rest_framework_mongoengine import serializers

from goals.models import Goal, Objective, Tracking

# Serializers define the API representation.


class GoalSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Goal
        fields = ['id', 'title', 'description', 'unit', 'type',
                  'creationDate', 'startDate', 'deadline', 'createdBy']


class ObjectiveSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Objective
        fields = ['id', 'quantity', 'frequency', 'goal']


class TrackingSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Tracking
        fields = ['id', 'date', 'amount', 'goal']
