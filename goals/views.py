import datetime

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_mongoengine import viewsets

from auth.permissions import IsOwnerOrReadOnly, IsParticipating
from goals.models import Goal, Objective, Tracking
from goals.serializers import GoalSerializer, ObjectiveSerializer, TrackingSerializer
from social.models import Follow
from social.models import Participate, LikeTracking, User, NotificationIconType
from utils.achievement import update_goal_stats_achievement, save_achievement, update_trackings_achievement
from utils.filters import FilterSet
from utils.notifications import create_notification, translate_objective_frequency, \
    create_user_notification, delete_notification, create_notification_tracking
from utils.recomendations import get_tracking_score_by_goal, get_goals_affinity
from utils.utils import set_amount, get_progress, get_leader_board, get_of_set


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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        update_goal_stats_achievement(serializer.instance)
        return create_notification(self, serializer, request, "Goal", "¡Nueva meta creada!",
                                   "La meta '" + serializer.data.get("title") + "' ha sido creada.",
                                   NotificationIconType.GOAL)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        return delete_notification(self, instance, request, "¡Meta eliminada!",
                                   "La meta '" + instance.title + "' ha sido eliminada.", NotificationIconType.GOAL)


class ObjectiveViewSet(viewsets.ModelViewSet):
    queryset = Objective.objects.all()
    serializer_class = ObjectiveSerializer

    filter_fields = ['quantity', 'frequency', 'goal']
    custom_filter_fields = []

    def filter_queryset(self, queryset):
        objective_filter = FilterSet(
            self.filter_fields, self.custom_filter_fields, self.request.query_params, queryset)

        return objective_filter.filter()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        notification = create_user_notification(serializer.instance.goal.createdBy, "¡Nuevo objetivo creado!",
                                                "Has añadido un objetivo " + translate_objective_frequency(
                                                    serializer.instance.frequency) + " a la meta '"
                                                + serializer.instance.goal.title + "'.", NotificationIconType.INFO)

        return Response({"notification": notification.data, "objective": serializer.data}, status=201)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        notification = create_user_notification(instance.goal.createdBy, "¡Objetivo eliminado!",
                                                "Has borrado un objetivo " + translate_objective_frequency(
                                                    instance.frequency) + " a la meta '" + instance.goal.title + "'.",
                                                NotificationIconType.INFO)
        return Response({"notification": notification.data}, status=200)


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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        update_trackings_achievement(serializer.instance)
        return create_notification_tracking(self, serializer, request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        return delete_notification(self, instance, request, "¡Progreso eliminado!",
                                   "Has eliminado " + str(instance.amount).replace(".",
                                                                                   ",") + " " + instance.goal.unit +
                                   " a la meta '" + instance.goal.title + "'.", NotificationIconType.INFO)


# Custom endpoints
class GoalProgress(viewsets.GenericAPIView):

    def get(self, request, goal_id, *args, **kwargs):
        user = User.objects.get(id=request.query_params.get('user_id'))
        goal = Goal.objects.get(id=goal_id)
        objectives = Objective.objects.filter(goal=goal_id)
        time_zone = get_of_set(request.headers.get("timezone"))
        progress = get_progress(goal, objectives, user, time_zone)
        return Response(progress, status=200)


class LeaderBoard(viewsets.GenericAPIView):
    def get(self, request, goal_id, *args, **kwargs):
        today = datetime.datetime.utcnow()
        start_week = today - datetime.timedelta(days=today.weekday())
        end_week = start_week + datetime.timedelta(days=6)
        time_zone = get_of_set(request.headers.get('timezone'))
        query, amount = get_leader_board(goal_id, today, start_week, end_week,
                                         request.query_params.get('frequency'), time_zone)
        save_achievement(query[0], 19)
        query = self.paginate_queryset(query)
        res = [set_amount(user, amount[user.username]) for user in query]
        return self.get_paginated_response(res)


class GoalsRecommendations(viewsets.GenericAPIView):
    def get(self, request, user_id, *args, **kwargs):
        user_goals = [GoalSerializer(goal).data for goal in
                      Participate.objects.filter(createdBy=user_id).values_list('goal')]
        user_goals_ids = [user_goal.get("id") for user_goal in user_goals]
        goals = [GoalSerializer(goal).data for goal in
                 Goal.objects.filter(createdBy__ne=user_id, id__nin=user_goals_ids,
                                     creationDate__gte=datetime.datetime.utcnow() - datetime.timedelta(
                                         weeks=12))]
        sorted_by_participants = sorted(goals, key=lambda x: x.get("numParticipants"), reverse=True)
        max_participants = sorted_by_participants[0].get("numParticipants") if sorted_by_participants else 0
        goals_by_followers = GoalSerializer(Participate.objects.filter(
            createdBy__in=Follow.objects(follower=user_id).values_list('user')
            , goal__nin=user_goals_ids, creationDate__gte=datetime.datetime.utcnow() - datetime.timedelta(
                weeks=12)).order_by('?')[0:9].values_list('goal'), many=True).data
        goals_by_affinity = sorted(goals, key=lambda x: get_goals_affinity(user_goals, x, max_participants),
                                   reverse=True)
        goals_by_tracking = sorted(goals, key=lambda x: get_tracking_score_by_goal(x), reverse=True)
        res = {
            "affinity": goals_by_affinity[0:9],
            "participants": sorted_by_participants[0:9],
            "tracking": goals_by_tracking[0:9],
            "followers": goals_by_followers
        }
        return Response(res, status=200)
