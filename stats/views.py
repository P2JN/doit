from rest_framework.response import Response
from rest_framework.views import APIView
from stats.models import Stats
from stats.serializers import StatsSerializer


# Custom endpoint
class UserStatsApi(APIView):
    def get(self, request, user_id, *args, **kwargs):
        stats = Stats.objects.filter(createdBy=user_id).first()
        if not stats:
            return Response(status=404)
        return Response(StatsSerializer(stats).data)
