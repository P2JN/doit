import datetime

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_mongoengine import viewsets

from auth.permissions import IsOwnerOrReadOnly, IsParticipating
from goals.models import Goal, Objective, Tracking, Frequency
from goals.serializers import GoalSerializer, ObjectiveSerializer, TrackingSerializer
from social.models import Participate, LikeTracking, User
from social.serializers import UserSerializer
from utils.filters import FilterSet

# ViewSet views
from utils.utils import get_trackings, set_amount


class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    filter_fields = ['title', 'description',
                     'creationDate', 'createdBy', 'goal']
    custom_filter_fields = [
        ('participant', lambda value: [goal.id for goal in Participate.objects.filter(
            createdBy=value).values_list('goal')]),
        ('likedBy', lambda value: [goal.id for goal in LikeTracking.objects.filter(
            createdBy=value).values_list('goal')]),
        ('search', lambda value: Goal.objects.search_text(value).values_list('id')),
    ]

    def filter_queryset(self, queryset):
        goal_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset, search_text=True)

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
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly, IsParticipating)

    filter_fields = ['date', 'amount', 'goal', 'createdBy']
    custom_filter_fields = [('likes', lambda value: [tracking.id for tracking in LikeTracking.objects.filter(
        createdBy=value).values_list('tracking')])]

    def filter_queryset(self, queryset):
        tracking_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return tracking_filter.filter()


# Custom endpoints
class GoalProgress(viewsets.GenericAPIView):

    def get(self, request, goal_id, *args, **kwargs):
        user = User.objects.get(id=request.query_params.get('user_id'))
        goal = Goal.objects.get(id=goal_id)
        objectives = Objective.objects.filter(goal=goal_id)

        trackings = []
        progress = dict()

        for objective in objectives:
            progress[objective.frequency] = 0.0

        today = datetime.datetime.now().date()
        start_week = today - datetime.timedelta(days=today.weekday())
        end_week = start_week + datetime.timedelta(days=6)
        if goal.type != 'cooperative':
            trackings = get_trackings(progress.keys(), goal, user, today, start_week, end_week)
        else:
            trackings = get_trackings(progress.keys(), goal, None, today, start_week, end_week)

        for tracking in trackings:
            if Frequency.DAILY in progress and (tracking.date.date() - today).days == 0:
                progress[Frequency.DAILY] += tracking.amount
            if Frequency.WEEKLY in progress and start_week <= today <= end_week:
                progress[Frequency.WEEKLY] += tracking.amount
            if Frequency.MONTHLY in progress and today.month == tracking.date.month and today.year == tracking.date.year:
                progress[Frequency.MONTHLY] += tracking.amount
            if Frequency.YEARLY in progress and today.year == tracking.date.year:
                progress[Frequency.YEARLY] += tracking.amount
            if Frequency.TOTAL in progress:
                progress[Frequency.TOTAL] += tracking.amount

        return Response(progress, status=200)


class LeaderBoard(viewsets.GenericAPIView):
    def get(self, request, goal_id, *args, **kwargs):
        today = datetime.datetime.now().date()
        start_week = today - datetime.timedelta(days=today.weekday())
        end_week = start_week + datetime.timedelta(days=6)
        trackings = get_trackings([request.query_params.get('frequency')], goal_id, None, today, start_week, end_week)

        users = {user.username: set_amount(user) for user in
                 Participate.objects.filter(goal=goal_id).values_list('createdBy')}

        for tracking in trackings:
            if 'amount' in users[tracking.createdBy.username]:
                users[tracking.createdBy.username]['amount'] += tracking.amount
        users = dict(sorted(users.items(), key=lambda x: x[1]['amount'], reverse=True))

        return Response(users.values(), status=200)
