import random
from datetime import datetime, timedelta

from goals.models import Frequency, Goal, GoalType, Objective, Tracking
from social.models import Follow, LikePost, LikeTracking, Participate, Post, User, Notification, Comment


def populate_users(n):
    names = ['John', 'Jane', 'Jack', 'Jill', "Mary", "Alice",
             "Bob", "Tom", "Molly", "Rachel", "Sara", "Bob", "Peter"]
    last_names = ['Doe', 'Smith', 'Jones', 'Brown', "Smith", "Johanson",
                  "Williams", "Harris", "Davis", "Miller", "Wilson", "Moore", "Taylor"]

    for _ in range(n):
        name = names[int(random.random() * len(names))]
        last_name = last_names[int(random.random() * len(last_names))]

        initial = datetime(1975, 1, 1)
        final = datetime(2017, 1, 1)

        user = User(
            username=name.lower() + last_name.lower(),
            email=name.lower() + last_name.lower() + '@mail.com',
            password='123123123',
            birthDate=initial + (final - initial) * random.random(),
            firstName=name,
            lastName=last_name,
        )

        user.save()


def populate_followers(users):
    for user in users:
        for follow_option in users:
            if follow_option.id != user.id and random.random() < 0.25:
                follow = Follow(user=follow_option, follower=user)
                follow.save()


def populate_goals_objectives(users):
    start_date = datetime.utcnow() + timedelta(days=random.randint(1, 30))
    deadline = start_date + timedelta(days=random.randint(1, 30))

    goal = Goal(
        title='Correr la maratón',
        description='Correr la maratón de la ciudad de Buenos Aires',
        startDate=start_date,
        deadline=deadline,
        unit="m",
        type=GoalType.CHALLENGE,
        createdBy=users[1],
    )
    objective = Objective(
        quantity=int(42195),
        frequency=Frequency.TOTAL,
        goal=goal,
    )
    goal.save()
    objective.save()

    start_date = datetime.utcnow() + timedelta(days=random.randint(1, 30))
    deadline = start_date + timedelta(days=random.randint(1, 30))

    goal = Goal(
        title='Sentadilla con salto',
        description='Batir el record actual del ejercicio de la sentadilla con salto,'
                    ' mientras nos divertimos haciendo deporte',
        startDate=start_date,
        deadline=deadline,
        unit="repeticiones",
        type=GoalType.CHALLENGE,
        createdBy=users[2],
    )
    goal.save()
    objective = Objective(
        quantity=12,
        frequency=Frequency.DAILY,
        goal=goal,
    )
    objective.save()
    objective = Objective(
        quantity=4380,
        frequency=Frequency.YEARLY,
        goal=goal,
    )
    objective.save()

    start_date = datetime.utcnow() + timedelta(days=random.randint(1, 30))
    deadline = start_date + timedelta(days=random.randint(1, 30))

    goal = Goal(
        title='Vuelta ciclista',
        description='Practicar para la vuelta ciclista de España',
        startDate=start_date,
        deadline=deadline,
        unit="km",
        type=GoalType.PRIVATE,
        createdBy=users[1],
    )
    objective = Objective(
        quantity=float(3280.5),
        frequency=Frequency.WEEKLY,
        goal=goal,
    )
    goal.save()
    objective.save()

    start_date = datetime.utcnow() + timedelta(days=random.randint(1, 30))
    deadline = start_date + timedelta(days=random.randint(1, 30))

    goal = Goal(
        title='Nadar en la piscina a mariposa',
        description='Nadar a mariposa para conseguir completar el objetivo entre todos',
        startDate=start_date,
        deadline=deadline,
        unit="repeticiones",
        type=GoalType.PRIVATE,
        createdBy=users[3],
    )
    goal.save()
    objective = Objective(
        quantity=int(1000000),
        frequency=Frequency.TOTAL,
        goal=goal,
    )
    objective.save()

    start_date = datetime.utcnow() + timedelta(days=random.randint(1, 30))
    deadline = start_date + timedelta(days=random.randint(1, 30))

    goal = Goal(
        title='Plenos en los bolos',
        description='Conseguir el mayor numero de plenos en un dia,'
                    ' si se alcanza el objetivo actualizare la cantidad de plenos',
        startDate=start_date,
        deadline=deadline,
        unit="plenos",
        type=GoalType.CHALLENGE,
        createdBy=users[4],
    )
    goal.save()
    objective = Objective(
        quantity=int(10),
        frequency=Frequency.DAILY,
        goal=goal,
    )
    objective.save()

    start_date = datetime.utcnow() + timedelta(days=random.randint(1, 30))
    deadline = start_date + timedelta(days=random.randint(1, 30))

    goal = Goal(
        title='Correr 20 km diarios',
        description='Correr 20 km diarios durante un año, lo que supondría 7300 km',
        startDate=start_date,
        deadline=deadline,
        unit="km",
        type=GoalType.CHALLENGE,
        createdBy=users[5],
    )
    goal.save()

    objective = Objective(
        quantity=int(20),
        frequency=Frequency.DAILY,
        goal=goal,
    )

    objective.save()

    objective = Objective(
        quantity=int(7300),
        frequency=Frequency.YEARLY,
        goal=goal,
    )
    objective.save()

    start_date = datetime.utcnow() + timedelta(days=random.randint(1, 30))
    deadline = start_date + timedelta(days=random.randint(1, 30))

    goal = Goal(
        title='Competición de nado libre',
        description='Nadar con el estilo que prefieras mariposa, espalda etc al menos 10 repeticiones diarias',
        startDate=start_date,
        deadline=deadline,
        unit="repeticiones",
        type=GoalType.CHALLENGE,
        createdBy=users[6],
    )

    goal.save()

    objective = Objective(
        quantity=int(10),
        frequency=Frequency.DAILY,
        goal=goal,
    )
    objective.save()

    start_date = datetime.utcnow() + timedelta(days=random.randint(1, 30))
    deadline = start_date + timedelta(days=random.randint(1, 30))

    goal = Goal(
        title='Sentadillas cooperativas',
        description='Intentemos alcanzar 1 millón de sentadillas entre todos y divirtiéndonos haciendo deporte',
        startDate=start_date,
        deadline=deadline,
        unit="repeticiones",
        type=GoalType.COOP,
        createdBy=users[7],
    )
    goal.save()

    objective = Objective(
        quantity=int(1000000),
        frequency=Frequency.TOTAL,
        goal=goal,
    )
    objective.save()

    start_date = datetime.utcnow() + timedelta(days=random.randint(1, 30))
    deadline = start_date + timedelta(days=random.randint(1, 30))

    goal = Goal(
        title='Victorias a los bolos',
        description='Ganar el mayor numero de partidas a los bolos en un dia,'
                    ' si se alcanza el objetivo actualizare la cantidad de partidas',
        startDate=start_date,
        deadline=deadline,
        unit="victorias",
        type=GoalType.CHALLENGE,
        createdBy=users[8],
    )

    goal.save()
    objective = Objective(
        quantity=int(10),
        frequency=Frequency.DAILY,
        goal=goal,
    )
    objective.save()

    start_date = datetime.utcnow() + timedelta(days=random.randint(1, 30))
    deadline = start_date + timedelta(days=random.randint(1, 30))

    goal = Goal(
        title='Practicar ciclismo entre todos',
        description='Conseguir recorrer una vuelta ciclista a España entre todos en un mes',
        startDate=start_date,
        deadline=deadline,
        unit="km",
        type=GoalType.COOP,
        createdBy=users[9],
    )
    goal.save()

    objective = Objective(
        quantity=float(3280.5),
        frequency=Frequency.MONTHLY,
        goal=goal,
    )
    objective.save()

    start_date = datetime.utcnow() + timedelta(days=random.randint(1, 30))
    deadline = start_date + timedelta(days=random.randint(1, 30))

    goal = Goal(
        title='Victorias al tenis',
        description='Ganar el mayor numero de partidas al tenis en un dia,'
                    ' si se alcanza el objetivo actualizare la cantidad de partidas',
        startDate=start_date,
        deadline=deadline,
        unit="victorias",
        type=GoalType.CHALLENGE,
        createdBy=users[10],
    )
    goal.save()
    objective = Objective(
        quantity=int(10),
        frequency=Frequency.DAILY,
        goal=goal,
    )
    objective.save()

    start_date = datetime.utcnow() + timedelta(days=random.randint(1, 30))
    deadline = start_date + timedelta(days=random.randint(1, 30))

    goal = Goal(
        title='Victorias al padel',
        description='Ganar el mayor numero de partidas al padel en un dia,'
                    ' si se alcanza el objetivo actualizare la cantidad de partidas',
        startDate=start_date,
        deadline=deadline,
        unit="victorias",
        type=GoalType.CHALLENGE,
        createdBy=users[11],
    )
    goal.save()
    objective = Objective(
        quantity=int(10),
        frequency=Frequency.DAILY,
        goal=goal,
    )
    objective.save()

    start_date = datetime.utcnow() + timedelta(days=random.randint(1, 30))
    deadline = start_date + timedelta(days=random.randint(1, 30))

    goal = Goal(
        title='Jugar al tenis',
        description='Jugar este año mas de mil partidas al tenis',
        startDate=start_date,
        deadline=deadline,
        unit="partidas",
        type=GoalType.PRIVATE,
        createdBy=users[12],
    )
    goal.save()
    objective = Objective(
        quantity=int(1000),
        frequency=Frequency.YEARLY,
        goal=goal,
    )
    objective.save()

    start_date = datetime.utcnow() + timedelta(days=random.randint(1, 30))
    deadline = start_date + timedelta(days=random.randint(1, 30))

    goal = Goal(
        title='Flexiones cooperativas',
        description='Intentemos alcanzar 1 millón de flexiones entre todos y divirtiéndonos haciendo deporte',
        startDate=start_date,
        deadline=deadline,
        unit="repeticiones",
        type=GoalType.COOP,
        createdBy=users[13],
    )
    goal.save()

    objective = Objective(
        quantity=int(1000000),
        frequency=Frequency.TOTAL,
        goal=goal,
    )
    objective.save()


def populate_participations(users, goals):
    for user in users:
        for goal in goals:
            if (user.id == goal.createdBy.id) or (random.random() < 0.15):
                participation = Participate(createdBy=user, goal=goal)
                participation.save()


def populate_trackings(participations):
    for participation in participations:
        for _ in range(int(random.random() * 3)):
            if random.random() < 0.25:
                tracking = Tracking(amount=int(
                    random.random() * 100), goal=participation.goal, createdBy=participation.createdBy)
                tracking.save()


def populate_posts_comments(users, goals):
    post = Post(
        title='Maratón ciudad de buenos aires',
        content='Hoy os voy a hablar de curiosidades de la ciudad de buenos aires y de su maraton...',
        createdBy=random.choice(users),
        goal=goals[0]
    )
    post.save()
    comment = Comment(
        content="Que curiosidades más divertidas",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()
    comment = Comment(
        content="Me encanta buenos aires",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()

    post = Post(
        title='Ejercicio sentadilla con salto',
        content='Ya que veo que algunos no saben hacer este ejercicio, hoy he decidido escribir un post sobre como '
                'hacer la sentadilla con salto paso por paso',
        createdBy=random.choice(users),
        goal=goals[1]
    )
    post.save()
    comment = Comment(
        content="Muy bien explicado, ¡muchas gracias!",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()
    comment = Comment(
        content="Me encanta el ejercicio",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()
    comment = Comment(
        content="¿Podrías subir explicaciones de otros ejercicios?",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()

    post = Post(
        title='Vuelta ciclista en España',
        content='Queda cancelada la vuelta ciclista en España, por el momento hasta que se resuelva...',
        createdBy=random.choice(users),
        goal=goals[2]
    )
    post.save()

    comment = Comment(
        content="Que pena, no se puede hacer la vuelta ciclista en España",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()

    post = Post(
        title='Ejercicio del nado a mariposa',
        content='Ya que veo que algunos no saben hacer este ejercicio, hoy he decidido escribir un post sobre como '
                'hacer el nado a mariposa paso por paso',
        createdBy=random.choice(users),
        goal=goals[3]
    )
    post.save()

    comment = Comment(
        content="Muy bien explicado, muchas gracias!",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()

    post = Post(
        title='¿Alguien juga a los bolos?',
        content='Necesito jugadores para intentar alcanzar el mayor numero de plenos, ¿Alguien querría?',
        createdBy=random.choice(users),
        goal=goals[4]
    )
    post.save()

    comment = Comment(
        content="Si, me gustaria jugar a los bolos",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()

    post = Post(
        title='Consejos para correr',
        content='¿Alguien me podría dar algunos tips para correr? Para conseguir completar el objetivo',
        createdBy=random.choice(users),
        goal=goals[5]
    )
    post.save()

    comment = Comment(
        content="Si, yo te ayudare",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()

    comment = Comment(
        content="Para empezar deberías...",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()

    post = Post(
        title='Ejercicios de natación',
        content="A continuación os dejo una guia sobre los diversos ejercicios que podéis hacer",
        createdBy=random.choice(users),
        goal=goals[6],
    )
    post.save()

    comment = Comment(
        content="Hay muchos tipos de ejercicios, muchas gracias!",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()

    post = Post(
        title='Consejos para los bolos',
        content='¿Alguien me podría dar algunos consejos para jugar bien a los bolos?',
        createdBy=random.choice(users),
        goal=goals[8]
    )
    post.save()

    comment = Comment(
        content="Si, yo te ayudare",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()

    comment = Comment(
        content="Para empezar deberías...",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()

    post = Post(
        title='El mundial de tenis',
        content='El mundial de tenis comienza este finde y estoy muy emocionado',
        createdBy=random.choice(users),
        goal=goals[10]
    )
    post.save()

    comment = Comment(
        content="Que ganas de ver el mundial",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()

    comment = Comment(
        content="Algún dia jugare en el mundial",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()

    post = Post(
        title='¿Alguien juega al padel?',
        content='Estoy buscando personas para competir este fin de semana y alcanzar esta meta',
        createdBy=random.choice(users),
        goal=goals[11]
    )
    post.save()
    comment = Comment(
        content="Yo jugaría este fin de semana",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()
    comment = Comment(
        content="¡Yo también!",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()
    comment = Comment(
        content="¿Alguien para hoy?",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()

    post = Post(
        title='Consejos para hacer flexiones',
        content='A continuación os explico una serie de consejos para hacer flexiones...',
        createdBy=random.choice(users),
        goal=goals[13]
    )
    post.save()

    post = Post(
        title='¡Ya casi alcanzamos el millón!',
        content='Debemos seguir asi para alcanzar el millón',
        createdBy=random.choice(users),
        goal=goals[1]
    )
    post.save()
    comment = Comment(
        content="¡Si, sigamos asi!",
        createdBy=random.choice(users),
        post=post
    )
    comment.save()

def populate_likes(users, trackings, posts):
    for user in users:
        for tracking in trackings:
            if random.random() < 0.35:
                like_tracking = LikeTracking(createdBy=user, tracking=tracking)
                like_tracking.save()
        for post in posts:
            if random.random() < 0.35:
                like_post = LikePost(createdBy=user, post=post)
                like_post.save()


def drop_all():
    print("dropping all data")

    LikePost.objects.all().delete()
    LikeTracking.objects.all().delete()
    Follow.objects.all().delete()

    Participate.objects.all().delete()
    Post.objects.all().delete()
    Comment.objects.all().delete()
    Notification.objects.all().delete()

    Objective.objects.all().delete()
    Tracking.objects.all().delete()
    Goal.objects.all().delete()

    User.objects.filter(user_id=None).delete()


def populate():
    print("--- POPULATE DATABASE ---")

    drop_all()

    populate_users(20)
    users = User.objects.all()
    print("Populated users:", users.count())

    populate_followers(users)

    populate_goals_objectives(users)
    goals = Goal.objects.all()
    objectives = Objective.objects.all()
    print("Populated goals'" + str(goals.count()) + "' and objectives'" + str(objectives.count()) + "'", )

    populate_participations(users, goals)
    participations = Participate.objects.all()

    populate_posts_comments(users, goals)
    populate_trackings(participations)
    posts = Post.objects.all()
    trackings = Tracking.objects.all()

    populate_likes(users, trackings, posts)
