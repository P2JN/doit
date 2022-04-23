from rest_framework_mongoengine import viewsets

from goals.serializers import GoalSerializer, ObjectiveSerializer, TrackingSerializer
from goals.models import Goal, Objective, Tracking


class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer


class ObjectiveViewSet(viewsets.ModelViewSet):
    queryset = Objective.objects.all()
    serializer_class = ObjectiveSerializer


class TrackingViewSet(viewsets.ModelViewSet):
    queryset = Tracking.objects.all()
    serializer_class = TrackingSerializer
