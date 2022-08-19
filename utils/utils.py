import datetime

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from django.http import Http404
import calendar
from goals.models import Tracking, Frequency
from social.models import Participate
from social.serializers import UserSerializer
from stats.models import Stats
from social.models import User as MongoUser


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


def get_trackings(progress, goal, user, today, start_week, end_week, time_zone):
    trackings = Tracking.objects
    if user:
        trackings = trackings.filter(createdBy=user)

    if Frequency.TOTAL in progress:
        return trackings.filter(goal=goal)
    elif Frequency.YEARLY in progress:
        return trackings.filter(goal=goal, date__lte=yearly_lte_date(today, time_zone),
                                date__gte=yearly_gte_date(today, time_zone))
    elif Frequency.MONTHLY in progress:
        return trackings.filter(goal=goal, date__lte=monthly_lte_date(today, time_zone),
                                date__gte=monthly_gte_date(today, time_zone))
    elif Frequency.WEEKLY in progress:
        return trackings.filter(goal=goal, date__lte=weekly_lte_date(end_week, time_zone),
                                date__gte=weekly_gte_date(start_week, time_zone))
    elif Frequency.DAILY in progress:
        return trackings.filter(goal=goal, date__gte=daily_gte_date(today, time_zone))
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


def get_progress(goal, objectives, user, time_zone):
    progress = dict()

    for objective in objectives:
        progress[objective.frequency] = 0.0

    today = datetime.datetime.utcnow()
    start_week = today - datetime.timedelta(days=today.weekday())
    end_week = start_week + datetime.timedelta(days=6)
    if goal.type != 'cooperative':
        trackings = get_trackings(progress.keys(), goal, user, today, start_week, end_week, time_zone)
    else:
        trackings = get_trackings(progress.keys(), goal, None, today, start_week, end_week, time_zone)

    daily_date = daily_gte_date(today, time_zone)
    for tracking in trackings:
        if Frequency.DAILY in progress and daily_date <= tracking.date:
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


def update_stats(user, frecuency):
    if Frequency.TOTAL == frecuency:
        Stats.objects.filter(createdBy=user).update_one(inc__totalObjectivesCompleted=1)
    elif Frequency.YEARLY == frecuency:
        Stats.objects.filter(createdBy=user).update_one(inc__yearlyObjectivesCompleted=1)
    elif Frequency.MONTHLY == frecuency:
        Stats.objects.filter(createdBy=user).update_one(inc__monthlyObjectivesCompleted=1)
    elif Frequency.WEEKLY == frecuency:
        Stats.objects.filter(createdBy=user).update_one(inc__weeklyObjectivesCompleted=1)
    elif Frequency.DAILY == frecuency:
        Stats.objects.filter(createdBy=user).update_one(inc__dailyObjectivesCompleted=1)


def yearly_lte_date(date, time_zone=-2):
    return date.replace(month=12, day=calendar.monthrange(date.year, 12)[1],
                        hour=23, minute=59, second=59) + datetime.timedelta(hours=time_zone)


def yearly_gte_date(date, time_zone=2):
    return date.replace(month=1, day=1, hour=0, minute=0, second=0) + datetime.timedelta(hours=time_zone)


def monthly_lte_date(date, time_zone=2):
    return date.replace(day=calendar.monthrange(date.year, date.month)[1],
                        hour=23, minute=59, second=59) + datetime.timedelta(hours=time_zone)


def monthly_gte_date(date, time_zone=2):
    return date.replace(day=1, hour=0, minute=0, second=0) + datetime.timedelta(hours=time_zone)


def weekly_lte_date(date, time_zone=2):
    return date.replace(hour=23, minute=59, second=59) + datetime.timedelta(hours=time_zone)


def weekly_gte_date(date, time_zone=2):
    return date.replace(hour=0, minute=0, second=0) + datetime.timedelta(hours=time_zone)


def daily_gte_date(date, time_zone=2):
    if date > date.replace(hour=23, minute=59, second=59) + datetime.timedelta(hours=time_zone):
        return date.replace(day=date.day + 1, hour=0, minute=0, second=0) + datetime.timedelta(hours=time_zone)
    elif date <= date.replace(hour=0, minute=0, second=0) + datetime.timedelta(hours=time_zone):
        return date.replace(day=date.day - 1, hour=23, minute=59, second=59) + datetime.timedelta(hours=time_zone)
    else:
        return date.replace(hour=0, minute=0, second=0) + datetime.timedelta(hours=time_zone)


def set_up_test(self):
    self.user = User.objects.create(username='test', email='test@gmail.com',
                                    first_name='test',
                                    last_name='test')
    self.token = Token.objects.create(user=self.user)
    self.password = 'test'
    self.user.set_password(self.password)

    self.mongo_user = MongoUser(username='test', email='test@gmail.com',
                                firstName='test',
                                lastName='test', user_id=self.user.id)
    self.mongo_user.save()

    self.mongo_user_2 = MongoUser(username='test2', email='test2@gmail.com',
                                  firstName='test2', lastName='test2', user_id=self.user.id)
    self.mongo_user_2.save()

    stats = Stats(createdBy=self.mongo_user)
    stats.save()


def get_leader_board(goal_id, today, start_week, end_week, frequency, time_zone):
    trackings = get_trackings([frequency], goal_id, None, today, start_week, end_week, time_zone)
    participants = Participate.objects.filter(goal=goal_id).values_list('createdBy')
    amount = {participant.username: trackings.filter(createdBy=participant).sum('amount') for participant in
              participants}
    query = sorted(participants, key=lambda x: amount[x.username], reverse=True)
    return [query, amount]
