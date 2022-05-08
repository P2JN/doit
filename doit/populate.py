import random
from datetime import datetime

from goals.models import Frequency, Goal, Objective, Tracking
from social.models import Follow, LikePost, LikeTracking, Participate, Post, User, Notification


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


def populate_goals(users):
    for i in range(users.count()):
        goal = Goal(
            title='Goal ' + str(i),
            description='This is a goal description',
            deadline=str(int(random.random() * 12) + 1) + '/' + str(int(random.random()
                                                                        * 28) + 1) + '/' + str(
                int(random.random() * 100) + 1900),
            unit='km',
            type='private',
            createdBy=users[i],
        )
        goal.save()


def populate_objectives(goals):
    for goal in goals:
        for _ in range(int(random.random() * 3)):
            objective = Objective(
                quantity=int(random.random() * 100),
                frequency=random.choice(list(Frequency)),
                goal=goal,
            )
            objective.save()


def populate_participations(users, goals):
    for user in users:
        for goal in goals:
            if (user.id == goal.createdBy.id) or (random.random() < 0.15):
                participation = Participate(user=user, goal=goal)
                participation.save()


def drop_all():
    LikePost.objects.all().delete()
    LikeTracking.objects.all().delete()
    Follow.objects.all().delete()

    Participate.objects.all().delete()
    Post.objects.all().delete()
    Notification.objects.all().delete()

    Objective.objects.all().delete()
    Tracking.objects.all().delete()
    Goal.objects.all().delete()

    User.objects.all().delete()


def populate():
    print("--- POPULATE DATABASE ---")
    drop_all()

    populate_users(20)
    users = User.objects.all()
    print("Populated users:", users.count())

    populate_goals(users)
    goals = Goal.objects.all()
    print("Populated goals:", goals.count())

    populate_objectives(goals)
    populate_participations(users, goals)
