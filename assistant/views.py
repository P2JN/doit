from datetime import datetime, timedelta

from rest_framework.response import Response
from rest_framework.views import APIView
import random

# Custom endpoint
from goals.models import Tracking, Goal, Objective
from social.models import User, Participate, Follow, Post, LikePost, Notification
from utils.notifications import translate_objective_frequency
from utils.utils import get_progress


class HomeAssistantAPI(APIView):
    def get(self, request, user_id):
        probability = random.random()
        user = User.objects.filter(id=user_id).first()

        if probability < 0.25:
            message = "Hola de nuevo " + user.firstName + ", te conectaste por ultima vez el " + str(
                request.user.last_login)
        elif probability < 0.5:
            goal = random.choice(Goal.objects.filter(id__nin=Tracking.objects.filter(user=user_id),
                                                     id__in=Participate.objects.filter(createdBy=user_id)).order_by(
                '-creationDate'))
            if goal:
                message = "Veo poco movimiento en la meta " + goal.title + ", ¿que tal si empezamos a registrar progresos?"
            else:
                message = "Veo que estas generando progreso en todas tus metas, ¡Sigue asi!"
        elif probability < 0.75:
            participate = random.choice(Participate.objects.filter(createdBy=user_id).order_by('-creationDate')[:30])
            if participate:
                objectives = Objective.objects.filter(goal=participate.goal)
                if objectives:
                    progress = get_progress(participate.goal, objectives, user)
                    objectives_completed = [objective for objective in objectives if
                                            progress[objective.frequency] == objective.quantity]
                    if len(objectives_completed) / len(objectives) == 1:
                        message = "Has completado todos los objetivos de la meta " + participate.goal.title + ", ¡Felicidades!"
                    elif len(objectives_completed) > 0:
                        message = "Has completado ".join(
                            translate_objective_frequency(objective.frequency) for objective in
                            objectives_completed) + " de los objetivos de la meta " + participate.goal.title + ", ¡Felicidades!"
                    else:
                        message = "No has completado ningún objetivo de la meta " + participate.goal.title + ", ¿Podrías registrar mas progresos para intentar completar el objetivo?"
                else:
                    message = "La meta " + participate.goal.title + " no tiene objetivos, ¿Porque no añades uno o hablas con el creador para que lo añada?"
            else:
                message = "Veo que no estas participando en ninguna meta, ¿Porque no empezamos a crear metas o buscamos alguna que te interese en la pagina de explora?"
        elif probability < 0.9:
            message = "Puedes clickear en las metas para verlas en detalle"
        else:
            user_goals = Participate.objects.filter(createdBy=user_id,
                                                    creationDate__gt=datetime.utcnow() - timedelta(90))
            if len([goal for goal in user_goals if goal.createdBy == user_id]) == len(user_goals):
                message = "Puedes participar en metas de otros usuarios,"
            elif len(user_goals) > 10:
                message = "Veo que estas participando en " + str(user_goals) + " metas, debes estar ocupado"
            else:
                message = "Veo que estas participando en " + str(
                    user_goals) + " metas, ¿Porque no empezamos a crear metas o buscamos alguna que te interese en la pagina de explora?"
        return Response({"message": message})


class FeedAssistantAPI(APIView):
    def get(self, request, user_id):
        probability = random.random()
        if probability < 0.25:
            post = max(Post.objects.filter(
                createdBy__in=list(Follow.objects.filter(follower=user_id).values_list("user")) + [user_id]).order_by(
                '-creationDate')[:30], key=lambda x: LikePost.objects.filter(post=x).count())
            message = "Esta ultima publicación " + post.title + " esta obteniendo bastantes likes, podría gustarte"
        elif probability < 0.5:
            post = max(Post.objects.filter(createdBy=user_id).order_by('-creationDate')[:30],
                       key=lambda x: LikePost.objects.filter(post=x).count())
            message = "Esta ultima publicación tuya" + post.title + " esta obteniendo bastantes likes,¡Felicidades!"
        elif probability < 0.75:
            user = max(Follow.objects.filter(follower=user_id).values_list("user"),
                       key=lambda x: Post.objects.filter(createdBy=x).count())
            message = "El usuario " + user.username + " es el usuario al que sigues con mas posts, podría gustarte"
            # Mas publiaciones
        elif probability < 0.75:
            user = max(Follow.objects.filter(follower=user_id).values_list("user"),
                       key=lambda x: LikePost.objects.filter(createdBy=x).count())
            message = "El usuario " + user.username + " es el usuario al que sigues con mas likes en post, podría gustarte"
            # Mas likes
        elif probability < 0.75:
            # Sigue a mas gente para ver mas contenido
            follows = Follow.objects.filter(follower=user_id).count()
            if follows < 10:
                message = "Veo que sigues a poca gente, puedes seguir a mas gente para ver mas contenido"
            else:
                message = "Veo que sigues a mucha gente interesante, pero podrian intersarte otros usuarios de la vista de explora"

        elif probability < 0.75:
            # Tus seguidos no son muy activos <10 post
            num_post = Post.objects.filter(
                createdBy__in=Follow.objects.filter(follower=user_id).values_list("user")).count()
            if num_post < 10:
                message = "Veo que tus seguidos no son muy activos, puedes seguir a mas gente para ver mas contenido usando la vista de explora"
            else:
                message = "Tus seguidores son muy activos teniendo entre todos " + str(
                    num_post) + " posts, ¿A que es increible?"
        elif probability < 0.75:
            message = "Sabias que puedes dar like a los post de otros usuarios clickeando en el boton del corazon al lado de cada post"
        elif probability < 0.75:
            message = "Sabias que puedes escribir comentarios en los post de otros usuarios escribiendo en el cuadrado de texto de cada post"
        else:
            post = min(Post.objects.filter(createdBy=user_id).order_by('-creationDate')[:30],
                       key=lambda x: LikePost.objects.filter(post=x).count())
            message = "Esta ultima publicación tuya " + post.title + " no tiene muchos likes, sigue esforzandote y conseguiras muchos mas"

        return Response({"message": message})


class ExploreAssistantAPI(APIView):
    def get(self, request, user_id):
        probability = random.random()
        if probability < 0.5:
            message = "En esta pagina puedes explorar post,usuarios y metas relacionadas contigo"
        else:
            message = "Si no encuentras lo que buscas puedes clicar en el boton de buscar y " \
                      "hacer una búsqueda personalizada"
        return Response({"message": message})

class NotificationsAssistantAPI(APIView):
    def get(self, request, user_id):
        probability = random.random()
        if probability < 0.5:
            unchecked_notifications = Notification.objects.filter(checked=False, user=user_id).count()
            if unchecked_notifications > 10:
                message = "Quedan notificaciones sin leer en la siguiente pagina, ¡No te olvides de revisarlas!"
            elif unchecked_notifications > 0:
                message = "Veo que tienes " + str(
                    unchecked_notifications) + " notificaciones sin revisar"
            else:
                message = "Uy, parece que no tienes notificaciones pendientes de revisar"
        else:
            message = "Aquí podrás revisar en detalle la actividad de la aplicación y la fecha en la que ocurrió"
        return Response({"message": message})


class UserInfoAssistantAPI(APIView):
    def get(self, request, user_id):
        probability = random.random()
        user = User.objects.filter(id=user_id).first()
        if user_id == request.params.get("user_id"):
            if probability < 0.5:
                if user and user.media:
                    message = "Veo que tienes una foto de perfil, ¿Porque no la actualizas?"
                else:
                    message = "Veo que no tienes una foto de perfil, ¿Porque no subes una?"
            else:
                followers = Follow.objects.filter(user=user_id).count()
                if followers > 20:
                    message = "Veo que te siguen " + str(followers) + " personas, estas hecho un influencer"
                else:
                    message = "Veo que te siguen " + str(
                        followers) + " personas, ¿Porque no subimos mas publicaciones o goals y aumentamos ese numero?"
        else:
            other_user = User.objects.filter(id=request.params.get("user_id")).first()
            if probability < 0.5:
                follows = Follow.objects.filter(user=user_id, follower=request.params.get("user_id")).first()
                follower = Follow.objects.filter(user=request.params.get("user_id"), follower=user_id).first()
                if follows and follower:
                    message = "Os seguís mutuamente tu y " + other_user.username
                elif follows:
                    message = "Este" + other_user.username + "te sigue, ¿Porque no le sigues tu a el?"
                elif follower:
                    message = "Sigues a " + other_user.username + ", pero el a ti no te sigue"
                else:
                    message = "No os seguís mutuamente, ¿porque no le empiezas a seguir?"
            else:
                goals_in_common = Participate.objects.filter(user=user_id, goal__in=Goal.objects.filter(
                    createdBy=request.params.get("user_id")).values_list("id")).count()
                if goals_in_common > 0:
                    message = "Veo que tienes " + str(
                        goals_in_common) + " goals en común con " + user.username + ", os podríais llevar muy bien"
                else:
                    message = "Veo que no tienes goals en común con " + other_user.username
        return Response({"message": message})


class UserTrackingsAssistantAPI(APIView):
    def get(self, request, user_id):
        probability = random.random()

        if probability < 0.5:
            tracking_num = Tracking.objects.filter(user=user_id).count()
            if tracking_num == 0:
                message = "Veo que no tienes ningún progreso registrado," \
                          " ¿Porque no empiezas a registrar en alguna meta?"
            elif tracking_num < 10:
                message = "Veo que tienes pocos progresos registrados, ¿Porque no registramos más?"
            else:
                message = "Veo que tienes muchos progresos registrados, ¡Felicidades sigue asi!"
        else:
            trackings = Tracking.objects.filter(createdBy=user_id).order_by('-creationDate')[:30]
            if trackings:
                goal_types = {}
                for tracking in trackings:
                    if tracking.goal.type not in goal_types:
                        goal_types[tracking.goal.type] = 1
                    else:
                        goal_types[tracking.goal.type] += 1
                max_type = max(goal_types, key=goal_types.get)
                message = "La mayor cantidad de progresos registrados ultimamente son en metas de tipo " + max_type
            else:
                message = "Veo que no tienes progresos registrados, ¿Porque no empezas a registrar en alguna meta?"
        return Response({"message": message})


class UserFeedAssistantAPI(APIView):
    def get(self, request, user_id):
        probability = random.random()
        if probability < 0.5:
            post_num = Post.objects.filter(createdBy=user_id).count()
            if post_num == 0:
                message = "Veo que no tienes ninguna publicación, ¿Porque no publicas alguna?"
            elif post_num < 10:
                message = "Veo que tienes pocas publicaciones, ¿Porque no publicas más?"
            else:
                message = "Veo que tienes muchas publicaciones, ¡Felicidades sigue asi!"
        else:
            num_post_goal = Post.objects.filter(createdBy=user_id, goal_ne=None).count()
            num_post = Post.objects.filter(createdBy=user_id, goal=None).count()
            if num_post_goal > num_post:
                message = "La mayoría de tus publicaciones están asociadas a metas, " \
                          "también puedes publicar sin asociar a una meta"
            else:
                message = "La mayoría de tus publicaciones no están asociadas a metas, " \
                          "también puedes publicar asociándola a una meta"
        return Response({"message": message})


class UserRelatedAssistantAPI(APIView):
    def get(self, request, user_id):
        probability = random.random()
        following = Follow.objects.filter(follower=user_id).values_list("user")
        followers = Follow.objects.filter(user=user_id).values_list("follower")
        if probability < 0.25:
            if followers.count() > 30:
                message = "Veo que tienes muchos seguidos, ¡Felicidades sigue asi!"

            else:
                message = "Veo que no sigues a mucha gente, ¿Porque no sigues a mas gente usando la vista de explora?"
        elif probability < 0.5:
            mutuals = following.intersection(followers).order_by('?').first()
            message = "Veo que tu y " + mutuals.username + " os seguis mutuamente"
        elif probability < 0.75:
            not_following = following.difference(followers).order_by('?').first()
            message = "Veo que no te sigue " + not_following.username + ", aunque tu le sigues "

        else:
            not_followers = followers.difference(following).order_by('?').first()
            message = "Veo que no sigues a " + not_followers.username + ", ¿Porque no le sigues a el?"
        return Response({"message": message})

# class UserStatsAssistantAPI(APIView):
#     def get(self, request,user_id):

# Lederboard
