import datetime

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_mongoengine import viewsets

from auth.permissions import IsOwnerOrReadOnly, IsParticipating
from goals.models import Goal, Objective, Tracking, Frequency
from goals.serializers import GoalSerializer, ObjectiveSerializer, TrackingSerializer
from social.models import Participate, LikeTracking, User, Follow
from utils.filters import FilterSet
from utils.recomendations import get_tracking_score_by_goal, get_goals_affinity
from utils.utils import get_trackings, set_amount


# ViewSet views
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
        participants = Participate.objects.filter(goal=goal_id).values_list('createdBy')
        amount = {participant.username: trackings.filter(createdBy=participant).sum('amount') for participant in
                  participants}
        query = sorted(participants, key=lambda x: amount[x.username], reverse=True)
        query = self.paginate_queryset(query)
        res = [set_amount(user, amount[user.username]) for user in query]
        return self.get_paginated_response(res)


class GoalsRecommendations(viewsets.GenericAPIView):
    def get(self, request, user_id, *args, **kwargs):
        user_goals = Participate.objects.filter(createdBy=user_id).values_list('goal')
        goals = [GoalSerializer(goal) for goal in Goal.objects.filter(createdBy__ne=user_id, goal__nin=user_goals)]
        sorted_by_participants = sorted(goals, key=lambda x: x.get("numParticipants"), reverse=True)
        goals_by_followers = GoalSerializer(Participate.objects.filter(
            createdBy__in=Follow.objects(user=user_id).values_list('follower').values_list('id')
            , goal__nin=user_goals).order_by('?')[0:10].values_list('goal'), many=True)
        goals_by_affinity = sorted(goals, key=lambda x: get_goals_affinity(user_goals, x), reverse=True)
        goals_by_tracking = sorted(goals, key=lambda x: get_tracking_score_by_goal(x), reverse=True)
        res = {
            "participants": sorted_by_participants,
            "followers": goals_by_followers,
            "affinity": goals_by_affinity,
            "tracking": goals_by_tracking
        }
        return Response(res, status=200)
