import datetime

from rest_framework_mongoengine import viewsets
from rest_framework.response import Response
from rest_framework_mongoengine.generics import get_object_or_404

from goals.serializers import GoalSerializer, ObjectiveSerializer, TrackingSerializer
from utils.filters import FilterSet
from goals.models import Goal, Objective, Tracking, Frequency

from social.models import Participate, LikeTracking, User


# ViewSet views
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


# Custom endpoints
class GoalProgress(viewsets.GenericAPIView):

    def get(self, request, goal_id, *args, **kwargs):
        user = User.objects.get(id=request.query_params.get('userId'))
        objectives = Objective.objects.filter(goal=goal_id)
        trackings = Tracking.objects.filter(user=user, goal=goal_id)
        progress = {Frequency.DAILY: -1.0, Frequency.WEEKLY: -1.0, Frequency.MONTHLY: -1.0, Frequency.YEARLY: -1.0,
                    Frequency.TOTAL: -1.0}
        for objective in objectives:
            progress[objective.frequency] = 0.0
        today = datetime.datetime.now()
        startWeek = today - datetime.timedelta(days=today.weekday())
        endWeek = startWeek + datetime.timedelta(days=6)
        for tracking in trackings:
            if progress[Frequency.DAILY] != -1.0 and tracking.date - today == 0:
                progress[Frequency.DAILY] += tracking.amount
            if progress[Frequency.WEEKLY] != -1.0 and startWeek <= today <= endWeek:
                progress[Frequency.WEEKLY] += tracking.amount
            if progress[Frequency.MONTHLY] != -1.0 and today.month == tracking.date.month and today.year == tracking.date.year:
                progress[Frequency.MONTHLY] += tracking.amount
            if progress[Frequency.YEARLY] != -1.0 and today.year == tracking.date.year:
                progress[Frequency.YEARLY] += tracking.amount
            if progress[Frequency.TOTAL] != -1.0:
                progress[Frequency.TOTAL] += tracking.amount
        return Response(progress, status=200)
