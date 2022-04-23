from rest_framework.views import APIView

from social.models import Post


class PostCRUD(APIView):

    def post(self, request):
        tittle = request.data["tittle"]
        content = request.data["content"]

        post = Post(tittle=tittle, content=content)

        post.save()
