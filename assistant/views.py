from datetime import datetime, timedelta

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import random

from goals.models import Tracking, Goal, Objective
from social.models import User, Participate, Follow, Post, LikePost, Notification
from stats.models import Stats
from stats.serializers import StatsSerializer
from utils.notifications import translate_objective_frequency
from utils.utils import get_progress, get_leader_board, set_amount, get_trackings, get_of_set, weekly_gte_date, \
    weekly_lte_date, yearly_gte_date, yearly_lte_date, get_obj_or_404


# Custom endpoint
class HomeAssistantAPI(APIView):
    def get(self, request):
        probability = random.random()
        user = User.objects.filter(user_id=request.user.id).first()
        user_id = user.id
        if probability < 1 / 6:
            time_zone = get_of_set(request.headers.get("timezone"))
            ult_conexion = request.user.last_login - timedelta(hours=time_zone)
            message = "Hola de nuevo " + user.firstName + ", te conectaste por ultima vez el " + \
                      ult_conexion.strftime("%d/%m/%Y a las %H:%M")
        elif probability < 2 / 6:
            participates = Participate.objects.filter(createdBy=user_id,
                                                      goal__nin=Tracking.objects.filter(createdBy=user_id).values_list(
                                                          "goal")).values_list("goal").order_by(
                '-creationDate')[:30]
            if len(participates) > 0:
                goal = random.choice(participates)
                message = "Generas poco movimiento en la meta " + goal.title + \
                          ", ¿que tal si empezamos a registrar progresos?"
            else:
                message = "Estas generando progreso en todas tus metas, ¡Sigue asi!"
        elif probability < 3 / 6:
            participates = Participate.objects.filter(
                createdBy=user_id).order_by('-creationDate')[:30]
            if len(participates) > 0:
                participate = random.choice(participates)
                objectives = Objective.objects.filter(goal=participate.goal)
                if objectives:
                    progress = get_progress(participate.goal, objectives, user,
                                            get_of_set(request.headers.get("timezone")))
                    objectives_completed = [objective for objective in objectives if
                                            progress[objective.frequency] >= objective.quantity]
                    if len(objectives_completed) / len(objectives) == 1:
                        message = "Has completado todos los objetivos de la meta " + participate.goal.title + \
                                  ", ¡Felicidades!"
                    elif len(objectives_completed) > 0:
                        message = "Has completado los objetivos " + " ".join(
                            translate_objective_frequency(objective.frequency) for objective in
                            objectives_completed) + " de la meta " + participate.goal.title + ", ¡Felicidades!"
                    else:
                        message = "No has completado ningún objetivo de la meta " + participate.goal.title + \
                                  ", ¿Podrías registrar mas progresos para intentar completar el objetivo?"
                else:
                    message = "La meta " + participate.goal.title + \
                              " no tiene objetivos temporales, el creador puede editarla y añadirlos"
            else:
                message = "No estas participando en ninguna meta," \
                          " puedes empezar creando una nueva meta o " \
                          "buscando alguna que te interese en la pagina de explora"
        elif probability < 4 / 6:
            message = "Puedes hacer clic en las metas para verlas en detalle"
        elif probability < 5 / 6:
            user_goals = Participate.objects.filter(createdBy=user_id,
                                                    creationDate__gt=datetime.utcnow() - timedelta(90))
            num_user_goals = user_goals.count()
            if len([goal for goal in user_goals if goal.createdBy == user_id]) == num_user_goals:
                message = "Puedes participar en metas de otros usuarios,"
            elif num_user_goals > 10:
                message = "Estas participando en " + \
                          str(num_user_goals) + " metas, debes estar ocupado"
            else:
                message = "Estas participando en " + str(
                    num_user_goals) + " metas, ¿quieres añadir alguna más a la lista?" \
                                      " puedes buscar en la pagina de explora"
        else:
            message = "Sabias que clickeando en nuevo," \
                      " puedes crear metas nuevas propias"
        return Response({"message": message})


class FeedAssistantAPI(APIView):
    def get(self, request):
        user = User.objects.filter(user_id=request.user.id).first()
        user_id = user.id
        probability = random.random()
        if probability < 1 / 9:
            posts = Post.objects.filter(
                createdBy__in=list(Follow.objects.filter(follower=user_id).values_list("user")) + [user_id]).order_by(
                '-creationDate')[:30]
            if posts and len(posts) > 0:
                post = max(
                    posts, key=lambda x: LikePost.objects.filter(post=x).count())
                message = "Esta última publicación " + post.title + \
                          " esta obteniendo bastantes likes, podría gustarte"
            else:
                message = "Tus seguidos no han publicado nada, " \
                          "¿sabias que puedes buscar nuevas personas a las que seguir en la vista de explora?"
        elif probability < 2 / 9:
            posts = Post.objects.filter(
                createdBy=user_id).order_by('-creationDate')[:30]
            if posts and len(posts) > 0:
                post = max(
                    posts, key=lambda x: LikePost.objects.filter(post=x).count())
                message = "Esta ultima publicación tuya " + post.title + \
                          " esta obteniendo bastantes likes,¡Felicidades!"
            else:
                message = "Todavía No has publicado nada, ¿te gustaría publicar algo?"
        elif probability < 3 / 9:
            follows = Follow.objects.filter(
                follower=user_id).values_list("user")
            if follows and len(follows) > 0:
                user = max(follows,
                           key=lambda x: Post.objects.filter(createdBy=x).count())
                message = "El usuario " + user.username + \
                          " es el usuario al que sigues con más posts, podría gustarte"
            else:
                message = "No estas siguiendo a nadie, " \
                          "¿sabias que puedes buscar nuevas personas a las que seguir en la vista de explora?"
        elif probability < 4 / 9:
            follows = Follow.objects.filter(
                follower=user_id).values_list("user")
            if follows and len(follows) > 0:
                user = max(follows,
                           key=lambda x: LikePost.objects.filter(post__in=Post.objects.filter(createdBy=user)).count())
                message = user.username + " es el usuario que más me gusta tiene en sus publicaciones," \
                                          " de los que sigues"
            else:
                message = "No estas siguiendo a nadie, " \
                          "¿sabias que puedes buscar nuevas personas a las que seguir en la vista de explora?"
        elif probability < 5 / 9:
            follows = Follow.objects.filter(follower=user_id).count()
            if follows < 10:
                message = "Sigues a pocos usuarios, puedes seguir a más para ver más contenido"
            else:
                message = "Sigues a muchos usuarios interesantes, " \
                          "pero podrían interesarte otros usuarios de la vista de explora"

        elif probability < 6 / 9:
            num_post = Post.objects.filter(
                createdBy__in=Follow.objects.filter(follower=user_id).values_list("user")).count()
            if num_post < 10:
                message = "Los usuarios que sigues no son muy activos, puedes seguir a mas usuarios " \
                          "para ver mas contenido usando la vista de explora"
            else:
                message = "Tus seguidores son muy activos, suman " + str(
                    num_post) + " posts entre todos, por lo que tienes mucho contenido que ver"
        elif probability < 7 / 9:
            message = "Puedes dar like a las publicaciones de otros usuarios haciendo clic en el botón" \
                      " del corazón al lado de cada post"
        elif probability < 8 / 9:
            message = "Puedes escribir comentarios en las publicaciones de otros usuarios"
        else:
            posts = Post.objects.filter(
                createdBy=user_id).order_by('-creationDate')[:30]
            if posts and len(posts) > 0:
                post = min(
                    posts, key=lambda x: LikePost.objects.filter(post=x).count())
                message = "Esta ultima publicación tuya " + post.title + \
                          " no tiene muchos likes, sigue esforzándote y conseguirás muchos más"
            else:
                message = "Todavía no has publicado nada, ¿te gustaría publicar algo?"

        return Response({"message": message})


class ExploreAssistantAPI(APIView):
    def get(self, request, **kwargs):
        probability = random.random()
        if probability < 0.25:
            message = "En esta pagina puedes explorar publicaciones, usuarios y metas relacionadas contigo"
        elif probability < 0.5:
            message = "Si no encuentras lo que buscas puedes hacer clic en el botón de buscar y " \
                      "hacer una búsqueda personalizada"
        elif probability < 0.75:
            message = "Puedes ver los objetivos o usuarios en detalle si haces clic sobre ellos"
        else:
            message = "Puedes cambiar entre las distintas pestañas para navegar entre los distintos tipos de contenido"

        return Response({"message": message})


class NotificationsAssistantAPI(APIView):
    def get(self, request):
        user = User.objects.filter(user_id=request.user.id).first()
        user_id = user.id
        probability = random.random()
        if probability < 0.5:
            unchecked_notifications = Notification.objects.filter(
                checked=False, user=user_id).count()
            if unchecked_notifications > 10:
                message = "Quedan notificaciones sin leer en la siguiente pagina, ¡No te olvides de revisarlas!"
            elif unchecked_notifications > 0:
                message = "Tienes " + str(
                    unchecked_notifications) + " notificaciones sin revisar"
            else:
                message = "¡Estás al día!, no tienes notificaciones pendientes de revisar"
        else:
            message = "Aquí podrás revisar en detalle tu actividad"
        return Response({"message": message})


class UserInfoAssistantAPI(APIView):
    def get(self, request, user_id):
        probability = random.random()
        user = User.objects.filter(id=user_id).first()
        logged_user = User.objects.filter(user_id=request.user.id).first()
        if logged_user and user_id == str(logged_user.id):
            if probability < 0.5:
                if user and user.media:
                    message = "¡Ya tienes una foto de perfil!, si quieres puedes actualizarla o eliminarla"
                else:
                    message = "No tienes una foto de perfil, ¿Por qué no subes una?"
            else:
                followers = Follow.objects.filter(user=user_id).count()
                if followers > 20:
                    message = "Te siguen " + \
                              str(followers) + \
                        " personas, estas hecho un influencer"
                else:
                    message = "Te siguen " + str(
                        followers) + " personas, puedes seguir a usuarios o generar actividad en alguna meta y " \
                                     "aumentamos ese numero."
        else:
            other_user = user
            if probability < 0.5:
                follows = Follow.objects.filter(
                    user=user_id, follower=logged_user).first()
                follower = Follow.objects.filter(
                    user=logged_user, follower=user_id).first()
                if follows and follower:
                    message = "Os seguís mutuamente tu y " + other_user.username
                elif follows:
                    message = "Este" + other_user.username + \
                              "te sigue, ¿Por qué no le sigues tu a el?"
                elif follower:
                    message = "Sigues a " + other_user.username + ", pero el a ti no te sigue"
                else:
                    message = "Aún no os conoceis, ¿Por qué no le empiezas a seguir?"
            else:
                goals_in_common = Participate.objects.filter(createdBy=user_id, goal__in=Goal.objects.filter(
                    createdBy=logged_user).values_list("id")).count()
                if goals_in_common > 0:
                    message = "Tienes " + str(
                        goals_in_common) + " metas en común con " + logged_user.username + \
                        ", os podríais llevar muy bien"
                else:
                    message = "No tienes metas en común con " + other_user.username
        return Response({"message": message})


class UserTrackingsAssistantAPI(APIView):
    def get(self, request, user_id):
        probability = random.random()

        if probability < 0.5:
            tracking_num = Tracking.objects.filter(createdBy=user_id).count()
            if tracking_num == 0:
                message = "No tienes ningún progreso registrado," \
                          " ¿Por qué no empiezas a registrar en alguna meta?"
            elif tracking_num < 10:
                message = "Tienes pocos progresos registrados, puedes añadir progreso en cualquiera de tus metas"
            else:
                message = "Tienes muchos progresos registrados, ¡Felicidades sigue así!"
        else:
            trackings = Tracking.objects.filter(
                createdBy=user_id).order_by('-creationDate')[:30]
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
                message = "No tienes progresos registrados, ¿Por qué no empiezas a registrar en alguna meta?"
        return Response({"message": message})


class UserFeedAssistantAPI(APIView):
    def get(self, request, user_id):
        probability = random.random()
        if probability < 0.5:
            post_num = Post.objects.filter(createdBy=user_id).count()
            if post_num == 0:
                message = "No tienes ninguna publicación, pudes crear una nueva pulsando en 'NUEVO'"
            elif post_num < 10:
                message = "Tienes pocas publicaciones, puedes crear una nueva haciendo clic en 'NUEVO'"
            else:
                message = "Tienes muchas publicaciones, ¡Felicidades sigue asi!"
        else:
            num_post_goal = Post.objects.filter(
                createdBy=user_id, goal__ne=None).count()
            num_post = Post.objects.filter(
                createdBy=user_id, goal=None).count()
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
            message = "Aún no sigues a nigún usuario, ¿Por qué no buscas algunos usando la vista de explora?"
            return Response({"message": message})
        if probability < 0.25:
            if followers.count() > 30:
                message = "Tienes muchos seguidores, ¡Felicidades sigue asi!"
            else:
                message = "No te siguen muchos usuarios, " \
                          "puedes buscar algunos usando la vista de explora y comenzar a seguirlos"
        elif probability < 0.5:
            mutual = following & followers
            if mutual.count() > 0:
                message = "Tú y " + \
                          mutual.order_by('?').first().username + \
                          " os seguís mutuamente"
            else:
                message = "Parece que aún no tienes seguidores mutuos, " \
                          "puedes seguir a tus seguidores o interactuar con tus seguidos y conoceros mejor"
        elif probability < 0.75:
            not_following = random.choice(
                list(set(following).difference(set(followers))))
            if not_following:
                message = not_following.username + "no te sigue, aunque tú le sigues "
            else:
                message = "Te siguen todos los usuarios a los que sigues, ¡Guau!"
        else:
            not_followers = random.choice(
                list(set(followers).difference(set(following))))
            if not_followers:
                message = "No sigues a " + \
                          not_followers.username + ", quizá pueda interesarte su contenido"
            else:
                message = "Sigues a todos los usuarios que te siguen, ¡Guau!"
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
                message = "No has completado ningun objetivo todavía, " \
                          "¿Por qué no empezamos a registrar en alguna meta?"
            else:
                sorted(total_objectives, key=total_objectives.get, reverse=True)
                message = "La mayoría de objetivos completados son de tipo " + list(total_objectives.keys())[
                    0] + ", tal vez te gustaría probar con otra frecuencia"

        elif probability < 0.5:
            if stats_serializer.get("numPosts") == 0:
                message = "Aún no has realizado ninguna publicación, puedes hacerlo pulsando en 'NUEVO'"
            else:
                ranking = list(Follow.objects.filter(
                    follower=user_id).values_list("user")) + [user]
                sorted(ranking, key=lambda x: Post.objects().filter(
                    createdBy=x).count(), reverse=True)
                message = "Eres el " + str(
                    ranking.index(user) + 1) + "º usuario que publica más entre tus seguidos"
        elif probability < 0.75:
            if stats_serializer.get("numTrackings") == 0:
                message = "Aún no has registrado ningún progreso, ¡empecemos con alguna de tus metas!"
            else:
                ranking = list(Follow.objects.filter(
                    follower=user_id).values_list("user")) + [user]
                sorted(ranking, key=lambda x: Tracking.objects().filter(
                    createdBy=x).count(), reverse=True)
                message = "Eres el " + str(
                    ranking.index(user) + 1) + "º usuario que registra más progresos entre tus seguidos"
        else:
            if stats_serializer.get("numLikes") == 0:
                message = "Tu publicación aún no le ha gustado a nadie, " \
                          "no te preocupes, sigue generando actividad y contenido para llegar a más usuarios"
            else:
                ranking = list(Follow.objects.filter(
                    follower=user_id).values_list("user")) + [user]
                sorted(ranking, key=lambda x: LikePost.objects().filter(
                    createdBy=x).count(), reverse=True)
                message = "Eres el " + str(
                    ranking.index(user) + 1) + "º usuario que recibe más likes en publicaciones entre tus seguidos"
        return Response({"message": message})


# Leaderboard
class LeaderboardAssistantAPI(APIView):
    def get(self, request, goal_id):
        today = datetime.utcnow()
        start_week = today - timedelta(days=today.weekday())
        end_week = start_week + timedelta(days=6)
        frequency = request.query_params.get('frequency')
        time_zone = get_of_set(request.headers.get('timezone'))
        user = User.objects.filter(user_id=request.user.id).first()
        query, amount = get_leader_board(
            goal_id, today, start_week, end_week, frequency, time_zone)
        res = [set_amount(user, amount[user.username]) for user in query]
        probability = random.random()

        if probability < 0.25:
            if user.username != res[0].get("username"):
                message = "El líder de la meta es " + res[0][
                    'username'] + ", pero aún puedes superarlo, ¡comienza a generar progreso ahora!"
            else:
                message = "Eres el líder de la meta, ¡Felicidades!"
        elif probability < 0.5:
            if user.username != res[1].get("username"):
                message = "El segundo en la meta es " + res[1][
                    'username'] + " que ha registrado " + str(
                    get_trackings([frequency], goal_id, res[1].get("id"), today,
                                  start_week, end_week, time_zone).count()) + \
                    " progresos"
            else:
                message = "Eres el segundo en la tabla de líderes, ¡Felicidades, a por el primer puesto!"
        elif probability < 0.75:
            if user.username != res[2].get("username"):
                message = "El tercero de la meta es " + res[2][
                    'username']
            else:
                message = "Eres el tercero, ¡Felicidades, sigue así!"
        else:
            message = "Eres el " + \
                      str([list_user.get("username") for list_user in res].index(user.username) + 1) + \
                      "º en la tabla de líderes, sigue generando progreso para llegar al podio"
        return Response({"message": message})


# Goals Stats
class GoalsStatsAssistantAPI(APIView):
    def get(self, request, goal_id, *args, **kwargs):
        today = datetime.utcnow()
        start_week = today - timedelta(days=today.weekday())
        end_week = start_week + timedelta(days=6)
        time_zone = get_of_set(request.headers.get('timezone'))
        user = User.objects.filter(user_id=request.user.id).first()
        probability = random.random()

        if probability < 0.25:
            message = "Estas son tus estadísticas de progreso en la meta durante una semana, puedes navegar a semanas anteiores si lo deseas"
        elif probability < 0.5:
            trackings_semanales = Tracking.objects.filter(createdBy=user, goal=goal_id,
                                                          date__gte=weekly_gte_date(
                                                              start_week, time_zone),
                                                          date__lte=weekly_lte_date(end_week, time_zone)) \
                .count()
            if trackings_semanales > 0:
                message = "¡Wow!, has registrado esta semana un total de " + str(
                    trackings_semanales) + " progresos en la meta," \
                                           " ¡sigue así!"
            else:
                message = "Aún no has registrado progresos en la meta esta semana, " \
                          "¡Date prisa e intenta ser el primero en la tabla de lideres"
        elif probability < 0.75:
            trackings_anuales = Tracking.objects.filter(createdBy=user, goal=goal_id,
                                                        date__gte=yearly_gte_date(
                                                            today, time_zone),
                                                        date__lte=yearly_lte_date(today, time_zone)).count()
            if trackings_anuales > 0:
                message = "¡Wow!, has registrado este año un total de " + str(trackings_anuales) + \
                          " progresos en la meta, ¡sigue así!"
            else:
                message = "Aún no has registrado progresos en la meta este año, " \
                          "¡Date prisa e intenta ser el primero en la tabla de lideres"
        else:
            total_trackings = Tracking.objects.filter(
                createdBy=user, goal=goal_id).count()
            if total_trackings > 0:
                message = "¿Sabias que has registrado un total de " + \
                    str(total_trackings) + " progresos en esta meta?"
            else:
                message = "Aún no has registrado progresos en esta meta, " \
                          "¡Date prisa e intenta ser el primero en la tabla de lideres"
        return Response({"message": message})


class GoalsInfoAssistantAPI(APIView):
    def get(self, request, goal_id, *args, **kwargs):
        probability = random.random()
        goal = Goal.objects.filter(id=goal_id).first()
        if not goal:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if probability < 0.2:
            if goal.createdBy.username == request.user.username:
                message = "Puedes actualizar los datos de la meta si lo necesitas, pulsa en 'EDITAR'"
            else:
                message = "Estos son los datos básicos de la meta"
        elif probability < 0.4:
            if goal.createdBy.username == request.user.username:
                if goal.type != "cooperative":
                    message = "Puedes hacer que tu meta sea cooperativa, así podrás " \
                              "completar la meta con la colaboración de otros usuarios"
                else:
                    message = "Puedes hacer que tu meta sea un reto, así otros usuarios podrán " \
                              "participar y siempre podreis comparar vuestro progreso en la tabla de líderes"
            else:
                if goal.type == "cooperative":
                    message = "En las metas colaborativas el progreso es compartido por " \
                              "todos los usuarios que participan"
                else:
                    message = "En las metas de tipo reto el progreso es individual pero otros usuarios " \
                              "podrán participar y generar registros de progreso"
        elif probability < 0.6:
            if Participate.objects.filter(createdBy=User.objects.filter(user_id=request.user.id).first(),
                                          goal=goal_id).first():
                message = "Puedes hacer clic en nuevo progreso para añadir registros a la meta"
            else:
                message = "Puedes hacer clic en participar para unirte a la meta"
        elif probability < 0.8:
            if goal.createdBy.username == request.user.username:
                message = "Puedes actualizar los datos de los objetivos de tu meta, " \
                          "haz clic en el botón 'EDITAR' a la derecha de 'OBJETIVOS'"
            else:
                message = "Puedes ver que objetivos temporales tiene la meta"
        else:
            participates = Participate.objects.filter(goal=goal_id).count()
            if participates > 1:
                message = "Actualmente participan " + \
                    str(participates) + " usuarios en esta meta"
            else:
                message = "Aún no hay muchos participantes en esta meta"
        return Response({"message": message})


class GoalsTrackingAssistantAPI(APIView):
    def get(self, request, goal_id, *args, **kwargs):
        probability = random.random()
        not_participating = ["Debes participar para poder registrar progresos a la meta desde esta vista",
                             "Aquí podrás ver los progresos registrados en esta meta"]
        if probability < 0.25:
            participate = Participate.objects.filter(
                createdBy=User.objects.filter(user_id=request.user.id).first()).first()
            if participate:
                message = "Puedes añadir nuevos progresos pulsando en 'NUEVO' y " \
                          "también eliminarlos pulsando en la papelera"
            else:
                message = random.choice(not_participating)
        elif probability < 0.5:
            tracking = Tracking.objects.filter(
                goal=goal_id).order_by('-date').first()
            if tracking:
                message = tracking.createdBy.username + \
                    " ha sido el último que ha registrado progresos en esta meta"
            else:
                message = "Aún no hay progresos registrados en esta meta"
        elif probability < 0.75:
            participate = Participate.objects.filter(
                createdBy=User.objects.filter(user_id=request.user.id).first()).first()
            if participate:
                tracking = Tracking.objects.filter(createdBy=User.objects.filter(user_id=request.user.id).first(),
                                                   goal=goal_id).order_by('-date').first()
                if tracking:
                    message = "Tu último progreso registrado fue el " + str(tracking.date) + " con un valor de " + str(
                        tracking.amount)
                else:
                    message = "Aún no has registrado progresos en esta meta, ¿por qué no registras algún progreso?"
            else:
                message = random.choice(not_participating)
        else:
            trackings = Tracking.objects.filter(goal=goal_id).count()
            if trackings < 5:
                message = "Los participantes de esta meta no parecen muy activos, han registrado un total de " \
                          + str(trackings) + " progresos"
            else:
                message = "Los participantes de esta meta han registrado un total de " + \
                    str(trackings) + " progresos"

        return Response({"message": message})


class GoalsFeedAssistantAPI(APIView):
    def get(self, request, goal_id, *args, **kwargs):
        messages = ["Estos son los posts que están relacionados a la meta",
                    "Puedes indicar que los posts te gustan haciendo clic en el "
                    "botón del corazón",
                    "Puedes acceder al perfil del autor de una publicación haciendo clic en el "
                    "nombre de usuario del autor",
                    "Puedes crear nuevas publicaciones relacionadas a la meta, pulsa en el botón 'NUEVO'",
                    "Hay un total de " +
                    str(Post.objects.filter(goal=goal_id).count()) +
                    " publicaciones relacionadas con esta "
                    "meta"]
        return Response({"message": random.choice(messages)})
