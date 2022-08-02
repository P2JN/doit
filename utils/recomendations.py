from datetime import datetime, timedelta
from difflib import SequenceMatcher

from goals.models import Tracking
from goals.serializers import GoalSerializer
from social.models import Participate


def get_users_affinity(logged_user_goals, user, max_followers, max_posts, max_trackings):
    user_score = (user.get("numFollowers") / max_followers) * 0.4 + (user.get("numPosts") / max_posts) * 0.2 \
                 + (user.get("numTrackings") / max_trackings) * 0.4
    last_goals = [GoalSerializer(goal) for goal in
                  Participate.objects.filter(createdBy=user.get("id")).order_by('-creationDate')[0:10].values_list(
                      'goal')]
    affinity = 0.0
    for goal in last_goals:
        for logged_goal in logged_user_goals:
            affinity += goal_affinity(logged_goal, goal)
    return user_score * 0.25 + affinity * 0.75


def goal_affinity(logged_goal, goal):
    return SequenceMatcher(None, logged_goal.get("title"), goal.get("title")).ratio() * 0.3 + \
           SequenceMatcher(None, logged_goal.get("description"), goal.get("description")).ratio() * 0.3 + \
           (logged_goal.type == goal.type) * 0.2 + \
           (logged_goal.get("numParticipants") - goal.get("numParticipants")) * 0.1


def get_tracking_score_by_goal(goal):
    trackings = Tracking.objects.filter(goal=goal)
    total = trackings.count()
    last_year = trackings.filter(date__gte=datetime.now() - timedelta(days=365)).count()
    last_month = trackings.filter(date__gte=datetime.now() - timedelta(days=30)).count()
    last_week = trackings.filter(date__gte=datetime.now() - timedelta(days=7)).count()
    return total * 0.5 + abs(total - last_year) * 0.25 \
           + abs(total - last_month) * 0.125 + abs(total - last_week) * 0.125


def get_goals_affinity(user_goals, goal):
    score = 0.0
    for user_goal in user_goals:
        score += goal_affinity(user_goal, goal)
    return score
