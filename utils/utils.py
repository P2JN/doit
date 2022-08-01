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
        return trackings.filter(goal=goal, date__lte=today.replace(month=12, day=31),
                                date__gte=today.replace(month=1, day=1))
    elif Frequency.MONTHLY in progress:
        return trackings.filter(goal=goal, date__lte=today.replace(day=31),
                                date__gte=today.replace(day=1))
    elif Frequency.WEEKLY in progress:
        return trackings.filter(goal=goal, date__lte=end_week,
                                date__gte=start_week)
    elif Frequency.DAILY in progress:
        return trackings.filter(goal=goal, date__gte=today)
    else:
        return []


def set_amount(user):
    user = UserSerializer(user).data
    user['amount'] = 0.0
    return user
