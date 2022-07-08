from rest_framework_mongoengine import viewsets

from goals.serializers import GoalSerializer, ObjectiveSerializer, TrackingSerializer
from utils.filters import FilterSet
from goals.models import Goal, Objective, Tracking

from social.models import Participate, LikeTracking


class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    filter_fields = ['title', 'description',
                     'creationDate', 'createdBy', 'goal']
    custom_filter_fields = [
        ('participant', lambda value: [goal.id for goal in Participate.objects.filter(
            user=value).values_list('goal')]),
        ('likedBy', lambda value: [goal.id for goal in LikeTracking.objects.filter(
            user=value).values_list('goal')]),
        ('search', lambda value: Goal.objects.search_text(value).values_list('id')),
    ]

    def filter_queryset(self, queryset):
        goal_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return goal_filter.filter()


class ObjectiveViewSet(viewsets.ModelViewSet):
    queryset = Objective.objects.all()
    serializer_class = ObjectiveSerializer

    filter_fields = ['quantity', 'frequency', 'goal']
    custom_filter_fields = []

    def filter_queryset(self, queryset):
        objective_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return objective_filter.filter()


class TrackingViewSet(viewsets.ModelViewSet):
    queryset = Tracking.objects.all()
    serializer_class = TrackingSerializer

    filter_fields = ['date', 'amount', 'goal', 'user']
    custom_filter_fields = [('likes', lambda value: [tracking.id for tracking in LikeTracking.objects.filter(
        user=value).values_list('tracking')])]

    def filter_queryset(self, queryset):
        tracking_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return tracking_filter.filter()
