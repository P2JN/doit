import random
from datetime import datetime, timedelta

from goals.models import Frequency, Goal, GoalType, Objective, Tracking
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


def populate_followers(users):
    for user in users:
        for follow_option in users:
            if follow_option.id != user.id and random.random() < 0.25:
                follow = Follow(user=follow_option, follower=user)
                follow.save()


def populate_goals(users):
    for i in range(users.count()):

        start_date = datetime.utcnow() + timedelta(days=random.randint(1, 30))
        deadline = start_date + timedelta(days=random.randint(1, 30))

        goal = Goal(
            title='Goal ' + str(i),
            description='This is a goal description',
            startDate=start_date,
            deadline=deadline,
            unit=random.choice(list(["km", "hours", "repetitions", "times"])),
            type=GoalType.CHALLENGE,
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


def populate_trackings(participations):
    for participation in participations:
        for _ in range(int(random.random() * 3)):
            if random.random() < 0.25:
                tracking = Tracking(amount=int(
                    random.random() * 100), goal=participation.goal, user=participation.user)
                tracking.save()


def populate_posts(users, goals):
    for user in users:
        for _ in range(int(random.random() * 3)):
            post = Post(
                title='Post ' + str(int(random.random() * 100)),
                content='This is a post description',
                createdBy=user,
            )
            if random.random() < 0.5:
                post.goal = random.choice(list(goals))
            post.save()


def populate_notifications(users):
    for user in users:
        for i in range(int(random.random() * 8)):
            notification = Notification(
                title='Notification ' + str(i),
                content='This is a notification description for ' + user.username,
                user=user,
            )
            notification.save()


def populate_likes(users, trackings, posts):
    for user in users:
        for tracking in trackings:
            if random.random() < 0.35:
                like_tracking = LikeTracking(user=user, tracking=tracking)
                like_tracking.save()
        for post in posts:
            if random.random() < 0.35:
                like_post = LikePost(user=user, post=post)
                like_post.save()


def drop_all():
    print("dropping all data")

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

    populate_followers(users)

    populate_goals(users)
    goals = Goal.objects.all()
    print("Populated goals:", goals.count())

    populate_objectives(goals)
    populate_participations(users, goals)
    participations = Participate.objects.all()

    populate_posts(users, goals)
    populate_trackings(participations)
    posts = Post.objects.all()
    trackings = Tracking.objects.all()

    populate_likes(users, trackings, posts)
    populate_notifications(users)
