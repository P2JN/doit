from rest_framework import status
from rest_framework.response import Response

from goals.models import Frequency, Goal, Objective
from social.models import Participate, Notification, User, NotificationIconType
from social.serializers import NotificationSerializer

import datetime

from utils.utils import get_progress


def create_user_notification(user, title, content, icon_type, goal=None):
    notification = Notification(user=user, title=title, content=content, goal=goal, iconType=icon_type)
    notification.save()
    return NotificationSerializer(notification)


def delete_notification(self, instance, request, title, content, icon_type, *args, **kwargs):
    self.perform_destroy(instance)
    notification = create_user_notification(instance.createdBy, title, content, icon_type)
    return Response({"notification": notification.data}, status=status.HTTP_200_OK)


def create_notification(self, serializer, request, model, title, content, icon_type, *args, **kwargs):
    headers = self.get_success_headers(serializer.data)
    notification = create_user_notification(serializer.data.get("createdBy"), title, content, icon_type)
    res = {"notification": notification.data, model.lower(): serializer.data}
    return Response(res, status=status.HTTP_201_CREATED, headers=headers)


def create_notification_tracking(self, serializer, request, *args, **kwargs):
    headers = self.get_success_headers(serializer.data)
    notification = create_user_notification(serializer.data.get("createdBy"), "¡Nuevo progreso registrado!",
                                            "Has registrado '" + str(
                                                serializer.instance.amount).replace(".",
                                                                                    ",") + " " + serializer.instance.goal.unit +
                                            "' a la meta '" + serializer.instance.goal.title + "'.",
                                            NotificationIconType.INFO).data
    goal_id = serializer.data.get("goal")
    goal = Goal.objects.get(id=goal_id)
    objectives = Objective.objects.filter(goal=goal_id)
    user = User.objects.get(id=serializer.data.get("createdBy"))
    progress = get_progress(goal, objectives, user)
    notifications = notify_completed_objectives(progress, objectives, goal, user, serializer)
    notifications.append(notification)
    res = {"notification": notifications, "tracking": serializer.data}
    return Response(res, status=status.HTTP_201_CREATED, headers=headers)


def notify_completed_objectives(progress, objectives, goal, user, tracking):
    objectives_to_notify = [objective for objective in objectives if
                            progress[objective.frequency] >= objective.quantity >
                            progress[objective.frequency] - tracking.instance.amount]
    notifications = []
    for objective in objectives_to_notify:
        if goal.type == 'cooperative':
            participants = list(Participate.objects.filter(goal=goal, createdBy__ne=user))
            for participant in participants:
                create_user_notification(participant.createdBy, "Objetivo " + translate_objective_frequency(
                    objective.frequency) + " completado",
                                         "Has completado el objetivo " + translate_objective_frequency(
                                             objective.frequency) + " de la meta '" + goal.title + "'",
                                         NotificationIconType.COMPLETED, str(goal.id))
        notifications.append(create_user_notification(user, "Objetivo " + translate_objective_frequency(
            objective.frequency) + " completado", "Has completado el objetivo " + translate_objective_frequency(
            objective.frequency) + " de la meta '" + goal.title + "'", NotificationIconType.COMPLETED,
                                                      str(goal.id)).data)
    return notifications


def translate_objective_frequency(frequency):
    match frequency:
        case Frequency.TOTAL:
            return "total"
        case Frequency.YEARLY:
            return "anual"
        case Frequency.MONTHLY:
            return "mensual"
        case Frequency.WEEKLY:
            return "semanal"
        case Frequency.DAILY:
            return "diario"
