import datetime

from django.http import Http404

from goals.models import Tracking, Frequency
from social.serializers import UserSerializer


def get_obj_or_404(klass, *args, **kwargs):
    try:
        return klass.objects.get(*args, **kwargs)
    except klass.DoesNotExist:
        raise Http404


def handle_uploaded_file(f):
    url = 'media/uploaded/' + f.name
    with open(url, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
    return url


def get_trackings(progress, goal, user, today, start_week, end_week):
    trackings = Tracking.objects
    if user:
        trackings = trackings.filter(createdBy=user)

    if Frequency.TOTAL in progress:
        return trackings.filter(goal=goal)
    elif Frequency.YEARLY in progress:
        return trackings.filter(goal=goal, date__lte=today.replace(month=12, day=31, hour=23, minute=59, second=59),
                                date__gte=today.replace(month=1, day=1, hour=0, minute=0, second=0))
    elif Frequency.MONTHLY in progress:
        return trackings.filter(goal=goal, date__lte=today.replace(day=31, hour=23, minute=59, second=59),
                                date__gte=today.replace(day=1, hour=0, minute=0, second=0))
    elif Frequency.WEEKLY in progress:
        return trackings.filter(goal=goal, date__lte=end_week.replace(hour=23, minute=59, second=59),
                                date__gte=start_week.replace(hour=0, minute=0, second=0))
    elif Frequency.DAILY in progress:
        return trackings.filter(goal=goal, date__gte=today.replace(hour=0, minute=0, second=0))
    else:
        return []


def set_amount(user, amount):
    user = UserSerializer(user).data
    if amount:
        user['amount'] = amount
    else:
        user['amount'] = 0.0
    return user


frequency_order = {Frequency.DAILY: 0, Frequency.WEEKLY: 1, Frequency.MONTHLY: 2, Frequency.YEARLY: 3,
                   Frequency.TOTAL: 4}


def get_frequency_order(frequency):
    return frequency_order[frequency]


def get_progress(goal, objectives, user):
    progress = dict()

    for objective in objectives:
        progress[objective.frequency] = 0.0

    today = datetime.datetime.now()
    start_week = today - datetime.timedelta(days=today.weekday())
    end_week = start_week + datetime.timedelta(days=6)
    if goal.type != 'cooperative':
        trackings = get_trackings(progress.keys(), goal, user, today, start_week, end_week)
    else:
        trackings = get_trackings(progress.keys(), goal, None, today, start_week, end_week)

    for tracking in trackings:
        if Frequency.DAILY in progress and (today - tracking.date).days == 0:
            progress[Frequency.DAILY] += tracking.amount
        if Frequency.WEEKLY in progress and start_week <= today <= end_week:
            progress[Frequency.WEEKLY] += tracking.amount
        if Frequency.MONTHLY in progress and today.month == tracking.date.month and today.year == tracking.date.year:
            progress[Frequency.MONTHLY] += tracking.amount
        if Frequency.YEARLY in progress and today.year == tracking.date.year:
            progress[Frequency.YEARLY] += tracking.amount
        if Frequency.TOTAL in progress:
            progress[Frequency.TOTAL] += tracking.amount
    return progress
