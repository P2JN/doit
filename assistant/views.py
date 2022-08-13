from datetime import datetime, timedelta

from rest_framework.response import Response
from rest_framework.views import APIView
import random

from goals.models import Tracking, Goal, Objective
from social.models import User, Participate, Follow, Post, LikePost, Notification
from stats.models import Stats
from stats.serializers import StatsSerializer
from utils.notifications import translate_objective_frequency
from utils.utils import get_progress, get_leader_board, set_amount, get_trackings


# Custom endpoint
class HomeAssistantAPI(APIView):
    def get(self, request, user_id):
        probability = random.random()
        user = User.objects.filter(id=user_id).first()

        if probability < 0.25:
            message = "Hola de nuevo " + user.firstName + ", te conectaste por ultima vez el " + str(
                request.user.last_login)
        elif probability < 0.5:
            participates = Participate.objects.filter(createdBy=user_id,
                                                      goal__nin=Tracking.objects.filter(createdBy=user_id).values_list(
                                                          "goal")).values_list("goal").order_by(
                '-creationDate')[:30]
            if len(participates) > 0:
                goal = random.choice(participates)
                message = "Veo poco movimiento en la meta " + goal.title +\
                          ", ¿que tal si empezamos a registrar progresos?"
            else:
                message = "Veo que estas generando progreso en todas tus metas, ¡Sigue asi!"
        elif probability < 0.75:
            participates = Participate.objects.filter(createdBy=user_id).order_by('-creationDate')[:30]
            if len(participates) > 0:
                participate = random.choice(participates)
                objectives = Objective.objects.filter(goal=participate.goal)
                if objectives:
                    progress = get_progress(participate.goal, objectives, user)
                    objectives_completed = [objective for objective in objectives if
                                            progress[objective.frequency] >= objective.quantity]
                    if len(objectives_completed) / len(objectives) == 1:
                        message = "Has completado todos los objetivos de la meta " + participate.goal.title +\
                                  ", ¡Felicidades!"
                    elif len(objectives_completed) > 0:
                        message = "Has completado los objetivos " + " ".join(
                            translate_objective_frequency(objective.frequency) for objective in
                            objectives_completed) + " de la meta " + participate.goal.title + ", ¡Felicidades!"
                    else:
                        message = "No has completado ningún objetivo de la meta " + participate.goal.title +\
                                  ", ¿Podrías registrar mas progresos para intentar completar el objetivo?"
                else:
                    message = "La meta " + participate.goal.title + \
                              " no tiene objetivos, ¿Porque no añades uno o hablas con el creador para que lo añada?"
            else:
                message = "Veo que no estas participando en ninguna meta," \
                          " ¿Porque no empezamos a crear metas o " \
                          "buscamos alguna que te interese en la pagina de explora?"
        elif probability < 0.9:
            message = "Puedes cliquear en las metas para verlas en detalle"
        else:
            user_goals = Participate.objects.filter(createdBy=user_id,
                                                    creationDate__gt=datetime.utcnow() - timedelta(90))
            num_user_goals = user_goals.count()
            if len([goal for goal in user_goals if goal.createdBy == user_id]) == num_user_goals:
                message = "Puedes participar en metas de otros usuarios,"
            elif num_user_goals > 10:
                message = "Veo que estas participando en " + str(num_user_goals) + " metas, debes estar ocupado"
            else:
                message = "Veo que estas participando en " + str(
                    num_user_goals) + " metas, ¿Porque no empezamos a crear metas o" \
                                      " buscamos alguna que te interese en la pagina de explora?"
        return Response({"message": message})


class FeedAssistantAPI(APIView):
    def get(self, request, user_id):
        probability = random.random()
        if probability < 1/9:
            post = max(Post.objects.filter(
                createdBy__in=list(Follow.objects.filter(follower=user_id).values_list("user")) + [user_id]).order_by(
                '-creationDate')[:30], key=lambda x: LikePost.objects.filter(post=x).count())
            message = "Esta ultima publicación " + post.title + " esta obteniendo bastantes likes, podría gustarte"
        elif probability < 2/9:
            post = max(Post.objects.filter(createdBy=user_id).order_by('-creationDate')[:30],
                       key=lambda x: LikePost.objects.filter(post=x).count())
            message = "Esta ultima publicación tuya " + post.title + " esta obteniendo bastantes likes,¡Felicidades!"
        elif probability < 3/9:
            user = max(Follow.objects.filter(follower=user_id).values_list("user"),
                       key=lambda x: Post.objects.filter(createdBy=x).count())
            message = "El usuario " + user.username + " es el usuario al que sigues con mas posts, podría gustarte"
        elif probability < 4/9:
            user = max(Follow.objects.filter(follower=user_id).values_list("user"),
                       key=lambda x: LikePost.objects.filter(createdBy=x).count())
            message = "El usuario " + user.username + " es el usuario al que sigues con mas likes en post," \

        elif probability < 5/9:
            follows = Follow.objects.filter(follower=user_id).count()
            if follows < 10:
                message = "Veo que sigues a poca gente, puedes seguir a mas gente para ver mas contenido"
            else:
                message = "Veo que sigues a mucha gente interesante, " \
                          "pero podrían interesarte otros usuarios de la vista de explora"

        elif probability < 6/9:
            num_post = Post.objects.filter(
                createdBy__in=Follow.objects.filter(follower=user_id).values_list("user")).count()
            if num_post < 10:
                message = "Veo que tus seguidos no son muy activos, puedes seguir a mas gente " \
                          "para ver mas contenido usando la vista de explora"
            else:
                message = "Tus seguidores son muy activos teniendo entre todos " + str(
                    num_post) + " posts, ¿A que es increíble?"
        elif probability < 7/9:
            message = "Sabias que puedes dar like a los post de otros usuarios cliqueando en el botón" \
                      " del corazon al lado de cada post"
        elif probability < 8/9:
            message = "Sabias que puedes escribir comentarios en los post de otros usuarios escribiendo" \
                      " en el cuadrado de texto de cada post"
        else:
            post = min(Post.objects.filter(createdBy=user_id).order_by('-creationDate')[:30],
                       key=lambda x: LikePost.objects.filter(post=x).count())
            message = "Esta ultima publicación tuya " + post.title + \
                      " no tiene muchos likes, sigue esforzándote y conseguirás muchos más"

        return Response({"message": message})


class ExploreAssistantAPI(APIView):
    def get(self, request):
        probability = random.random()
        if probability < 0.5:
            message = "En esta pagina puedes explorar post,usuarios y metas relacionadas contigo"
        else:
            message = "Si no encuentras lo que buscas puedes clicar en el botón de buscar y " \
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
        if user_id == request.query_params.get("userId"):
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
                        followers) + " personas, ¿Porque no subimos más publicaciones o goals y aumentamos ese numero?"
        else:
            other_user = User.objects.filter(id=request.query_params.get("userId")).first()
            if probability < 0.5:
                follows = Follow.objects.filter(user=user_id, follower=request.query_params.get("userId")).first()
                follower = Follow.objects.filter(user=request.query_params.get("userId"), follower=user_id).first()
                if follows and follower:
                    message = "Os seguís mutuamente tu y " + other_user.username
                elif follows:
                    message = "Este" + other_user.username + "te sigue, ¿Porque no le sigues tu a el?"
                elif follower:
                    message = "Sigues a " + other_user.username + ", pero el a ti no te sigue"
                else:
                    message = "No os seguís mutuamente, ¿porque no le empiezas a seguir?"
            else:
                goals_in_common = Participate.objects.filter(createdBy=user_id, goal__in=Goal.objects.filter(
                    createdBy=request.query_params.get("userId")).values_list("id")).count()
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
            tracking_num = Tracking.objects.filter(createdBy=user_id).count()
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
                message = "La mayor cantidad de progresos registrados últimamente son en metas de tipo " + max_type
            else:
                message = "Veo que no tienes progresos registrados, ¿Porque no empiezas a registrar en alguna meta?"
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
            num_post_goal = Post.objects.filter(createdBy=user_id, goal__ne=None).count()
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
        if following.count() == 0 and followers.count() == 0:
            message = "Veo que no sigues a mucha gente, ¿Porque no sigues a mas gente usando la vista de explora?"
            return Response({"message": message})
        if probability < 0.25:
            if followers.count() > 30:
                message = "Veo que tienes muchos seguidos, ¡Felicidades sigue asi!"
            else:
                message = "Veo que no sigues a mucha gente, ¿Porque no sigues a mas gente usando la vista de explora?"
        elif probability < 0.5:
            mutual = following & followers
            if mutual.count() > 0:
                message = "Veo que tu y " + mutual.order_by('?').first().username + " os seguís mutuamente"
            else:
                message = "Veo que no tienes ninguna persona que os sigáis mutuamente, " \
                          "¿Porque no buscas a alguien que te siga?"
        elif probability < 0.75:
            not_following = random.choice(list(set(following).difference(set(followers))))
            if not_following:
                message = "Veo que no te sigue " + not_following.username + ", aunque tu le sigues "
            else:
                message = "Todos los usuarios que sigues te siguen, ¡Guau!"
        else:
            not_followers = random.choice(list(set(followers).difference(set(following))))
            if not_followers:
                message = "Veo que no sigues a " + not_followers.username + ", ¿Porque no le sigues?"
            else:
                message = "Todos los usuarios que te siguen los sigues tu, ¡Guau!"
        return Response({"message": message})


class UserStatsAssistantAPI(APIView):
    def get(self, request, user_id):
        user = User.objects.filter(id=user_id).first()
        stats = Stats.objects.filter(createdBy=user_id).first()
        stats_serializer = StatsSerializer(stats).data
        probability = random.random()
        if probability < 0.25:
            total_objectives = {"diario": stats.dailyObjectivesCompleted, "semanal": stats.weeklyObjectivesCompleted,
                                "mensual": stats.monthlyObjectivesCompleted, "anual": stats.yearlyObjectivesCompleted,
                                "total": stats.totalObjectivesCompleted}
            if sum(total_objectives.values()) == 0:
                message = "Veo que no has completado ninguna objetivo todavía, " \
                          "¿Porque no empezamos a registrar en alguna meta?"
            else:
                sorted(total_objectives, key=total_objectives.get, reverse=True)
                message = "Veo que has completado muchos objetivos de tipo " + list(total_objectives.keys())[
                    0] + "tal vez te gustaría probar con otra frecuencia"

        elif probability < 0.5:
            if stats_serializer.get("numPosts") == 0:
                message = "Veo que no has publicado ninguna publicación todavía, ¿Porque no publicas alguna?"
            else:
                ranking = list(Follow.objects.filter(follower=user_id).values_list("user")) + [user]
                sorted(ranking, key=lambda x: Post.objects().filter(createdBy=x).count(), reverse=True)
                message = "Eres el " + str(
                    ranking.index(user) + 1) + "º usuario que publica más entre tus seguidos"
        elif probability < 0.75:
            if stats_serializer.get("numTrackings") == 0:
                message = "Veo que no has registrado ningún progreso todavía, ¿Porque no registras en alguna meta?"
            else:
                ranking = list(Follow.objects.filter(follower=user_id).values_list("user")) + [user]
                sorted(ranking, key=lambda x: Tracking.objects().filter(createdBy=x).count(), reverse=True)
                message = "Eres el " + str(
                    ranking.index(user) + 1) + "º usuario que registra más progresos entre tus seguidos"
        else:
            if stats_serializer.get("numLikes") == 0:
                message = "Veo que no te han dado like a ninguna publicación todavía, " \
                          "ya verás como pronto recibirás más likes"
            else:
                ranking = list(Follow.objects.filter(follower=user_id).values_list("user")) + [user]
                sorted(ranking, key=lambda x: LikePost.objects().filter(createdBy=x).count(), reverse=True)
                message = "Eres el " + str(
                    ranking.index(user) + 1) + "º usuario que recibe más likes en publicaciones entre tus seguidos"
        return Response({"message": message})


# Leaderboard
class LeaderboardAssistantAPI(APIView):
    def get(self, request, goal_id):
        today = datetime.now()
        start_week = today - timedelta(days=today.weekday())
        end_week = start_week + timedelta(days=6)
        frequency = request.query_params.get('frequency')
        query, amount = get_leader_board(goal_id, today, start_week, end_week, frequency)
        res = [set_amount(user, amount[user.username]) for user in query]
        user = User.objects.filter(id=request.query_params.get("userId")).first()
        probability = random.random()

        if probability < 0.25:
            if user.username != res[0].get("username"):
                message = "Veo que el líder de la meta es " + res[0][
                    'username'] + " que ha registrado " + str(get_trackings([frequency], goal_id, res[0].get("id"),
                                                                            today, start_week, end_week).count()) +\
                          " progresos"
            else:
                message = "Veo que eres el líder de la meta, ¡Felicidades!"
        elif probability < 0.5:
            if user.username != res[1].get("username"):
                message = "Veo que el segundo en la meta es " + res[1][
                    'username'] + " que ha registrado " + str(get_trackings([frequency], goal_id, res[1].get("id"), today,
                                                                            start_week, end_week).count()) +\
                          " progresos"
            else:
                message = "Veo que eres el segundo de la meta, ¡Felicidades!"
        elif probability < 0.75:
            if user.username != res[2].get("username"):
                message = "Veo que el tercero de la meta es " + res[2][
                    'username'] + " que ha registrado " + str(get_trackings([frequency], goal_id, res[2].get("id"),
                                                                            today, start_week, end_week).count()) + \
                          " progresos"
            else:
                message = "Veo que eres el tercero de la meta, ¡Felicidades!"
        else:
            message = "Te encuentras en el " + \
                      str([list_user.get("username") for list_user in res].index(user.username) + 1) + \
                      "º lugar de la meta"
        return Response({"message": message})
