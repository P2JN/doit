from datetime import datetime

from bson import ObjectId
from rest_framework.exceptions import ParseError
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView

from media.models import Media
# Custom endpoint
from utils.utils import handle_uploaded_file


class MediaUploadApi(APIView):
    parser_class = (FileUploadParser,)

    def post(self, request, format=None):
        if 'file' not in request.data:
            raise ParseError("Empty content")
        file = request.data['file']
        extension = file.name.split('.')[-1]
        file.name = str(ObjectId.from_datetime(datetime.now())) + '.' + extension
        url = handle_uploaded_file(file)
        media = Media(url=url).save()
        return Response(str(media.id))


class MediaApi(APIView):

    def delete(self, request, media_id, format=None):
        media = Media.objects.filter(id=media_id).first()
        if media:
            media.delete()
        return Response(status=204)
