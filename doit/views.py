from rest_framework.response import Response
from rest_framework.views import APIView

from .populate import populate, drop_all


class PopulateDB(APIView):

    def post(self, request):
        """
        DB population
        """
        populate()
        return Response({"message": "DB populated"})

    def delete(self, request):
        """
        DB clear
        """
        drop_all()
        return Response({"message": "DB cleared"})
