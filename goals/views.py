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
class ObjectiveProgress(viewsets.GenericAPIView):

    def get(self, request, *args, **kwargs):
        user = User.objects.get(id=request.query_params.get('userId'))
        objective = get_object_or_404(Objective.objects.filter(id=request.query_params.get('objectiveId')))
        trackings = Tracking.objects.filter(user=user, goal=objective.goal)
        progress = 0.0
        today = datetime.datetime.now()
        for tracking in trackings:
            if objective.frequency == Frequency.DAILY and (tracking.date - today).days == 0:
                progress += tracking.amount
            elif objective.frequency == Frequency.WEEKLY:
                start = tracking.date - datetime.timedelta(days=tracking.date.weekday())
                end = start + datetime.timedelta(days=6)
                if start <= today <= end:
                    progress += tracking.amount
            elif objective.frequency == Frequency.MONTHLY and (
                    today.month == tracking.date.month and today.year == tracking.date.year):
                progress += tracking.amount
            elif objective.frequency == Frequency.YEARLY and today.year == tracking.date.year:
                progress += tracking.amount
            elif objective.frequency == Frequency.TOTAL:
                progress += tracking.amount
        return Response(
            {'progress': progress}, status=200)
