import calendar
from datetime import timedelta

from dateutil import parser
from dateutil.parser import ParserError
from rest_framework.response import Response
from rest_framework.views import APIView

from goals.models import Goal, Tracking
from social.models import User
from stats.models import Stats, AchievementUser, Achievement
from stats.serializers import StatsSerializer, AchievementSerializer

# Custom endpoint
from utils.utils import yearly_gte_date, yearly_lte_date, monthly_gte_date, monthly_lte_date, weekly_gte_date, \
    weekly_lte_date, get_of_set


class UserStatsApi(APIView):
    def get(self, request, user_id, *args, **kwargs):
        stats = Stats.objects.filter(createdBy=user_id).first()
        if not stats:
            return Response(status=404)
        return Response(StatsSerializer(stats).data)


class GoalStatsApi(APIView):
    def get(self, request, goal_id, *args, **kwargs):
        user_id = request.query_params.get("userId")
        user = User.objects.filter(id=user_id).first()
        goal = Goal.objects.filter(id=goal_id).first()
        time_zone = get_of_set(request.headers.get("timezone"))
        try:
            ref_day = parser.parse(request.query_params.get('refDay'))
        except (OverflowError, ParserError):
            return Response(status=400)
        if not ref_day or not user or not goal:
            return Response(status=400)
        start_week = ref_day - timedelta(days=ref_day.weekday())
        end_week = start_week + timedelta(days=6)
        res = {}
        for days in [start_week + timedelta(days=i) for i in range((end_week - start_week).days + 1)]:
            if goal.type == 'cooperative':
                res[days.strftime('%Y-%m-%d')] = Tracking.objects.filter(goal=goal,
                                                                         date__gte=weekly_gte_date(days, time_zone),
                                                                         date__lte=weekly_lte_date(days,
                                                                                                   time_zone)).sum(
                    "amount")
            else:
                res[days.strftime('%Y-%m-%d')] = Tracking.objects.filter(createdBy=user, goal=goal,
                                                                         date__gte=weekly_gte_date(days, time_zone),
                                                                         date__lte=weekly_lte_date(days,
                                                                                                   time_zone)).sum(
                    "amount")

        if goal.type == 'cooperative':
            res["totalMonth"] = Tracking.objects.filter(goal=goal,
                                                        date__gte=monthly_gte_date(ref_day, time_zone),
                                                        date__lte=monthly_lte_date(ref_day, time_zone)).sum(
                "amount")
            res["totalYear"] = Tracking.objects.filter(goal=goal,
                                                       date__gte=yearly_gte_date(ref_day, time_zone),
                                                       date__lte=yearly_lte_date(ref_day, time_zone)).sum(
                "amount")
        else:
            res["totalMonth"] = Tracking.objects.filter(createdBy=user, goal=goal,
                                                        date__gte=monthly_gte_date(ref_day, time_zone),
                                                        date__lte=monthly_lte_date(ref_day, time_zone)).sum(
                "amount")
            res["totalYear"] = Tracking.objects.filter(createdBy=user, goal=goal,
                                                       date__gte=yearly_gte_date(ref_day, time_zone),
                                                       date__lte=yearly_lte_date(ref_day, time_zone)).sum(
                "amount")
        return Response(res)


class AchievementApi(APIView):
    def get(self, request, user_id, *args, **kwargs):
        achievements = AchievementSerializer(Achievement.objects.all(), many=True).data
        user_achievements = AchievementUser.objects.filter(createdBy=user_id).values_list('achievement')
        user_achievements_ids = [achievement.id for achievement in user_achievements]
        for achievement in achievements:
            if achievement['id'] in user_achievements_ids:
                achievement['completed'] = True
            else:
                achievement['completed'] = False
        return Response(achievements, status=200)
