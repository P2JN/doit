from rest_framework_mongoengine import viewsets, generics

from goals.serializers import GoalSerializer, ObjectiveSerializer, TrackingSerializer
from goals.filters import FilterSet
from goals.models import Goal, Objective, Tracking

from social.models import Post, User, Notification, Follow, Participate, LikeTracking, LikePost


class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    filter_fields = ['title', 'description',
                     'creationDate', 'createdBy', 'goal']
    custom_filter_fields = [
        ('participant', lambda value: [goal.id for goal in Participate.objects.filter(
            user=value).values_list('goal')])]

    def filter_queryset(self, queryset):
        goal_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return goal_filter.filter()


class ObjectiveViewSet(viewsets.ModelViewSet):
    queryset = Objective.objects.all()
    serializer_class = ObjectiveSerializer


class TrackingViewSet(viewsets.ModelViewSet):
    queryset = Tracking.objects.all()
    serializer_class = TrackingSerializer
