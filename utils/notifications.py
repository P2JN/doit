from rest_framework import status
from rest_framework.response import Response

from goals.models import Frequency
from social.models import Participate, Notification
from social.serializers import NotificationSerializer

import datetime


def create_user_notification(user, title, content, goal=None):
    notification = Notification(user=user, title=title, content=content, goal=goal)
    notification.save()
    return NotificationSerializer(notification)


def delete_notification(self, instance, request, title, content, *args, **kwargs):
    self.perform_destroy(instance)
    notification = create_user_notification(instance.createdBy, title, content)
    return Response({"notification": notification.data}, status=status.HTTP_200_OK)


def create_notification(self, serializer, request, model, title, content, *args, **kwargs):
    headers = self.get_success_headers(serializer.data)
    notification = create_user_notification(serializer.data.get("createdBy"), title, content)
    res = {"notification": notification.data, model.lower(): serializer.data}
    return Response(res, status=status.HTTP_201_CREATED, headers=headers)


def notify_completed_objectives(progress, objectives, goal, user):
    # Only Notify user that their objectives have been completed one time

    objectives_to_notify = [objective for objective in objectives if
                            progress[objective.frequency] >= objective.quantity and has_been_notified(user, objective,
                                                                                                      goal)]
    notifications = []
    for objective in objectives_to_notify:
        if goal.type == 'cooperative':
            participants = list(Participate.objects.filter(goal=goal, createdBy__ne=user))
            for participant in participants:
                create_user_notification(participant.createdBy, "Objetivo " + translate_objective_frequency(
                    objective.frequency) + " completado",
                                         "Has completado el objetivo " + translate_objective_frequency(
                                             objective.frequency) + " de la meta " + goal.title, str(goal.id))
        notifications.append(create_user_notification(user, "Objetivo " + translate_objective_frequency(
            objective.frequency) + " completado", "Has completado el objetivo " + translate_objective_frequency(
            objective.frequency) + " de la meta " + goal.title, str(goal.id)).data)
    return notifications


def has_been_notified(user, objective, goal):
    today = datetime.datetime.now()
    start_week = today - datetime.timedelta(days=today.weekday())
    end_week = start_week + datetime.timedelta(days=6)
    title = "Objetivo " + translate_objective_frequency(objective.frequency) + " completado"
    content = "Has completado el objetivo " + translate_objective_frequency(
        objective.frequency) + " de la meta " + goal.title
    id_goal = str(goal.id)
    match objective.frequency:
        case Frequency.TOTAL:
            return Notification.objects.filter(user=user, title=title,
                                               content=content, goal=id_goal).first() is None
        case Frequency.YEARLY:
            return Notification.objects.filter(user=user, title=title,
                                               content=content, goal=id_goal,
                                               creationDate__lte=today.replace(month=12, day=31, hour=23, minute=59,
                                                                               second=59),
                                               creationDate__gte=today.replace(month=1, day=1, hour=00, minute=00,
                                                                               second=00)) \
                       .first() is None
        case Frequency.MONTHLY:
            return Notification.objects.filter(user=user, title=title,
                                               content=content, goal=id_goal,
                                               creationDate__lte=today.replace(day=31, hour=23, minute=59, second=59),
                                               creationDate__gte=today.replace(day=1, hour=00,
                                                                               minute=00, second=00)).first() is None
        case Frequency.WEEKLY:
            return Notification.objects.filter(user=user, title=title,
                                               content=content, goal=id_goal,
                                               creationDate__lte=end_week.replace(hour=23, minute=59, second=59),
                                               creationDate__gte=start_week.replace(hour=00, minute=00,
                                                                                    second=00)).first() is None
        case Frequency.DAILY:
            return Notification.objects.filter(user=user, title=title,
                                               content=content, goal=id_goal,
                                               creationDate__gte=today.replace(hour=00, minute=00,
                                                                               second=00)).first() is None


def translate_objective_frequency(frequency):
    match frequency:
        case Frequency.TOTAL:
            return "Total"
        case Frequency.YEARLY:
            return "Anual"
        case Frequency.MONTHLY:
            return "Mensual"
        case Frequency.WEEKLY:
            return "Semanal"
        case Frequency.DAILY:
            return "Diario"
