from mongoengine import NotUniqueError

from goals.models import Tracking
from social.models import Post, LikePost, Participate, NotificationIconType
from stats.models import Stats, AchievementUser, Achievement


def save_achievement(user, achievement):
    try:
        AchievementUser(createdBy=user, achievement=achievement).save()
        from utils.notifications import create_user_notification
        create_user_notification(user, "Nuevo logro conseguido", "Has desbloqueado el logro '" +
                                 Achievement.objects.filter(
                                     id=achievement).first().title + "'",
                                 NotificationIconType.ACHIEVEMENT)
    except NotUniqueError:
        pass


def update_goal_stats_achievement(goal):
    stats = Stats.objects.filter(createdBy=goal.createdBy).first()
    if stats:
        if stats.createdGoals == 0:
            save_achievement(goal.createdBy, 1)
        elif stats.createdGoals == 25:
            save_achievement(goal.createdBy, 7)
        elif stats.createdGoals == 50:
            save_achievement(goal.createdBy, 13)
    Stats.objects.filter(createdBy=goal.createdBy).update_one(
        inc__createdGoals=1)


def update_objectives_achievement(progress, tracking, objectives_to_notify, user):
    stats = Stats.objects.filter(createdBy=user).first()
    try:
        if stats:
            total_objectives = stats.dailyObjectivesCompleted + stats.weeklyObjectivesCompleted + \
                stats.monthlyObjectivesCompleted + stats.yearlyObjectivesCompleted + \
                stats.totalObjectivesCompleted + len(objectives_to_notify)
            if total_objectives > 0:
                save_achievement(user, 3)
            if total_objectives > 200:
                save_achievement(user, 9)
            if total_objectives > 500:
                save_achievement(user, 15)
        for objectives in objectives_to_notify:
            if progress[objectives.frequency] - tracking.instance.amount <= 0:
                save_achievement(user, 20)
                break
    except NotUniqueError as e:
        print(e)


def update_posts_achievement(user):
    created_posts = Post.objects.filter(createdBy=user).count()
    if created_posts == 1:
        save_achievement(user, 4)
    elif created_posts == 25:
        save_achievement(user, 10)
    elif created_posts == 50:
        save_achievement(user, 16)


def update_comments_achievement(user):
    created_comments = Post.objects.filter(createdBy=user).count()
    if created_comments == 1:
        save_achievement(user, 5)
    elif created_comments == 500:
        save_achievement(user, 11)
    elif created_comments == 1000:
        save_achievement(user, 17)


def update_like_achievement(user):
    user_likes = LikePost.objects.filter(
        post__in=Post.objects.filter(createdBy=user)).count()
    if user_likes == 1:
        save_achievement(user, 6)
    elif user_likes == 500:
        save_achievement(user, 12)
    elif user_likes == 1000:
        save_achievement(user, 18)


def update_participants_achievement(participate):
    if participate.goal.type == 'cooperative':
        participants = Participate.objects.filter(
            goal=participate.goal).count()
        if participants == 20:
            save_achievement(participate.goal.createdBy, 21)


def update_trackings_achievement(tracking):
    trackings = Tracking.objects.filter(createdBy=tracking.createdBy).count()
    if trackings == 1:
        save_achievement(tracking.createdBy, 2)
    elif trackings == 200:
        save_achievement(tracking.createdBy, 8)
    elif trackings == 500:
        save_achievement(tracking.createdBy, 14)
