from mongoengine import NotUniqueError

from goals.models import Tracking
from social.models import Post, LikePost, Participate
from stats.models import Stats, AchievementUser


def save_achievement(user, achievement):
    try:
        AchievementUser(createdBy=user, achievement=achievement).save()
    except NotUniqueError:
        pass


def update_goal_stats_achievement(goal):
    stats = Stats.objects.filter(createdBy=goal.createdBy).first()
    if stats:
        if stats.createdGoals == 0:
            save_achievement(goal.createdBy, 1)
        elif stats.createdGoals == 100:
            save_achievement(goal.createdBy, 10)
    Stats.objects.filter(createdBy=goal.createdBy).update_one(inc__createdGoals=1)


def update_objectives_achievement(progress, tracking, objectives_to_notify, user):
    stats = Stats.objects.filter(createdBy=user).first()
    try:
        if stats:
            total_objectives = stats.dailyObjectivesCompleted + stats.weeklyObjectivesCompleted + \
                               stats.monthlyObjectivesCompleted + stats.yearlyObjectivesCompleted + \
                               stats.totalObjectivesCompleted
            if total_objectives == 0:
                save_achievement(user, 2)
            elif total_objectives == 100:
                save_achievement(user, 9)
        for objectives in objectives_to_notify:
            if progress[objectives.frequency] - tracking.amount <= 0:
                save_achievement(user, 7)
                break
    except NotUniqueError as e:
        print(e)


def update_posts_achievement(user):
    created_posts = Post.objects.filter(createdBy=user).count()
    if created_posts == 1:
        save_achievement(user, 4)
    elif created_posts == 101:
        save_achievement(user, 12)


def update_comments_achievement(user):
    created_comments = Post.objects.filter(createdBy=user).count()
    if created_comments == 1:
        save_achievement(user, 5)
    elif created_comments == 101:
        save_achievement(user, 13)


def update_like_achievement(user):
    user_likes = LikePost.objects.filter(post__in=Post.objects.filter(createdBy=user)).count()
    if user_likes == 1:
        save_achievement(user, 6)


def update_participants_achievement(participate):
    if participate.goal.type == 'cooperative':
        participants = Participate.objects.filter(goal=participate.goal).count()
        if participants == 20:
            save_achievement(participate.goal.createdBy, 11)


def update_trackings_achievement(tracking):
    trackings = Tracking.objects.filter(createdBy=tracking.createdBy).count()
    if trackings == 1:
        save_achievement(tracking.createdBy, 8)
    elif trackings == 501:
        save_achievement(tracking.createdBy, 14)
