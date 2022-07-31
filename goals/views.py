import datetime

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_mongoengine import viewsets

from auth.permissions import IsOwnerOrReadOnly, IsParticipating
from goals.models import Goal, Objective, Tracking, Frequency
from goals.serializers import GoalSerializer, ObjectiveSerializer, TrackingSerializer
from social.models import Participate, LikeTracking, User
from utils.filters import FilterSet

# ViewSet views
from utils.notifications import notify_completed_objectives, create_notification, translate_objective_frequency, \
    create_user_notification, delete_notification


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
        return create_notification(self, serializer, request, "Goal", "¡Nueva meta creada!",
                                   "La meta " + serializer.data.get("title") + " ha sido creada.")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        return delete_notification(self, instance, request, "¡Meta eliminada!",
                                   "La meta " + instance.title + " ha sido eliminada.")


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
        notification = create_user_notification(serializer.instance.goal.createdBy, "¡Nuevo objectivo creado!",
                                                "Has añadido un objetivo " + translate_objective_frequency(
                                                    serializer.instance.frequency) + " a la meta +"
                                                + serializer.instance.goal.title + ".")

        return Response({"notification": notification.data, "objective": serializer.data}, status=201)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        notification = create_user_notification(instance.goal.createdBy, "¡Objectivo eliminado!",
                                                "Has borrado un objetivo " + translate_objective_frequency(
                                                    instance.frequency) + " a la meta " + instance.goal.title + ".")
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
        return create_notification(self, serializer, request, "Tracking", "¡Nuevo progreso registrado!",
                                   "Has registrado " + str(
                                       serializer.instance.amount) + " " + serializer.instance.goal.unit +
                                   " a la meta "+serializer.instance.goal.title+"+.")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        return delete_notification(self, instance, request, "¡Progreso eliminado!",
                                   "Has eliminado " + str(instance.amount) + " " + instance.goal.unit +
                                   " a la meta "+instance.goal.title+"+.")


# Custom endpoints
class GoalProgress(viewsets.GenericAPIView):

    def get(self, request, goal_id, *args, **kwargs):
        user = User.objects.get(id=request.query_params.get('user_id'))
        goal = Goal.objects.get(id=goal_id)
        objectives = Objective.objects.filter(goal=goal_id)

        progress = dict()

        for objective in objectives:
            progress[objective.frequency] = 0.0

        today = datetime.datetime.now()
        start_week = today - datetime.timedelta(days=today.weekday())
        end_week = start_week + datetime.timedelta(days=6)
        trackings = Tracking.objects
        if goal.type != 'cooperative':
            trackings = trackings.filter(createdBy=user)

        if Frequency.TOTAL in progress:
            trackings = trackings.filter(goal=goal)
        elif Frequency.YEARLY in progress:
            trackings = trackings.filter(goal=goal, date__lte=today.replace(month=12, day=31, hour=23, minute=59, second=59),
                                         date__gte=today.replace(month=1, day=1, hour=0, minute=0, second=0))
        elif Frequency.MONTHLY in progress:
            trackings = trackings.filter(goal=goal, date__lte=today.replace(day=31, hour=23, minute=59, second=59),
                                         date__gte=today.replace(day=1, hour=0, minute=0, second=0))
        elif Frequency.WEEKLY in progress:
            trackings = trackings.filter(goal=goal, date__lte=end_week.replace(hour=23, minute=59, second=59),
                                         date__gte=start_week.replace(hour=0, minute=0, second=0))
        elif Frequency.DAILY in progress:
            trackings = trackings.filter(goal=goal, date__gte=today.replace(hour=0, minute=0, second=0))

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
        notification = notify_completed_objectives(progress, objectives, goal, user)
        return Response({"notification": notification, "progress": progress}, status=200)
