import calendar
from datetime import timedelta

from dateutil import parser
from dateutil.parser import ParserError
from rest_framework.response import Response
from rest_framework.views import APIView

from goals.models import Goal, Tracking
from social.models import User
from stats.models import Stats
from stats.serializers import StatsSerializer


# Custom endpoint


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
                                                                         date__gte=days.replace(hour=0, minute=0,
                                                                                                second=0)-timedelta(hours=2),
                                                                         date__lte=days.replace(hour=23, minute=59,
                                                                                                second=59)-timedelta(hours=2)).sum(
                    "amount")

            else:
                res[days.strftime('%Y-%m-%d')] = Tracking.objects.filter(createdBy=user, goal=goal,
                                                                         date__gte=days.replace(hour=0, minute=0,
                                                                                                second=0)-timedelta(hours=2),
                                                                         date__lte=days.replace(hour=23, minute=59,
                                                                                                second=59)-timedelta(hours=2)).sum(
                    "amount")

        if goal.type == 'cooperative':
            res["totalMonth"] = Tracking.objects.filter(goal=goal,
                                                        date__gte=ref_day.replace(day=1, hour=0, minute=0,
                                                                                  second=0) - timedelta(hours=2),
                                                        date__lte=ref_day.replace(
                                                            day=calendar.monthrange(ref_day.year, ref_day.month)[
                                                                1],
                                                            hour=23, minute=59, second=59) - timedelta(
                                                            hours=2)).sum(
                "amount")
            res["totalYear"] = Tracking.objects.filter(goal=goal,
                                                       date__gte=ref_day.replace(month=1, day=1, hour=0, minute=0,
                                                                                 second=0) - timedelta(hours=2),
                                                       date__lte=ref_day.replace(month=12, day=
                                                       calendar.monthrange(ref_day.year, 12)[1],
                                                                                 hour=23, minute=59,
                                                                                 second=59) - timedelta(
                                                           hours=2)).sum(
                "amount")
        else:
            res["totalMonth"] = Tracking.objects.filter(createdBy=user, goal=goal,
                                                        date__gte=ref_day.replace(day=1, hour=0, minute=0,
                                                                                  second=0) - timedelta(hours=2),
                                                        date__lte=ref_day.replace(
                                                            day=calendar.monthrange(ref_day.year, ref_day.month)[
                                                                1],
                                                            hour=23, minute=59, second=59) - timedelta(
                                                            hours=2)).sum(
                "amount")
            res["totalYear"] = Tracking.objects.filter(createdBy=user, goal=goal,
                                                       date__gte=ref_day.replace(month=1, day=1, hour=0, minute=0,
                                                                                 second=0) - timedelta(hours=2),
                                                       date__lte=ref_day.replace(month=12, day=
                                                       calendar.monthrange(ref_day.year, 12)[1],
                                                                                 hour=23, minute=59,
                                                                                 second=59) - timedelta(
                                                           hours=2)).sum(
                "amount")
        return Response(res)
