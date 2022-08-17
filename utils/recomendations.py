from datetime import datetime, timedelta
from difflib import SequenceMatcher

from goals.models import Tracking
from goals.serializers import GoalSerializer
from social.models import Participate, LikePost, Post
from social.serializers import PostSerializer


def get_users_affinity(logged_user_goals, user, max_followers, max_posts, max_trackings):
    user_score = ((user.get("numFollowers") + 1) / (max_followers + 1)) * 0.4 + (
            (user.get("numPosts") + 1) / (max_posts + 1)) * 0.2 \
                 + ((user.get("numTrackings") + 1) / (max_trackings + 1)) * 0.4
    last_goals = [GoalSerializer(goal).data for goal in
                  Participate.objects.filter(createdBy=user.get("id")).order_by('-creationDate')[0:10].values_list(
                      'goal')]
    max_participants = max(logged_user_goals + last_goals, key=lambda goal: goal.get("numParticipants")).get(
        "numParticipants") if logged_user_goals + last_goals else 0
    affinity = 0.0
    for goal in last_goals:
        for logged_goal in logged_user_goals:
            affinity += goal_affinity(logged_goal, goal, max_participants)
    return user_score * 0.25 + affinity * 0.75


def goal_affinity(logged_goal, goal, max_participants):
    title_score = 0.0
    if logged_goal.get("title") and goal.get("title"):
        title_score = SequenceMatcher(None, logged_goal.get("title"), goal.get("title")).ratio()

    description_score = 0.0
    if logged_goal.get("description") and goal.get("description"):
        description_score = SequenceMatcher(None, logged_goal.get("description"), goal.get("description")).ratio()

    num_participants_score = 0.0
    if logged_goal.get("numParticipants") and goal.get("numParticipants"):
        num_participants_score = 1 - abs((logged_goal.get("numParticipants") + 1) / (max_participants + 1) - (goal.get("numParticipants") + 1) / (max_participants + 1))

    goal_type_score = logged_goal.get("type") == goal.get("type")

    return title_score * 0.4 + description_score * 0.4 + num_participants_score * 0.1 + goal_type_score * 0.1


def get_tracking_score_by_goal(goal):
    trackings = Tracking.objects.filter(goal=goal.get("id"))
    total = trackings.count()
    last_year = trackings.filter(date__gte=datetime.now() - timedelta(days=365)).count()
    last_month = trackings.filter(date__gte=datetime.now() - timedelta(days=30)).count()
    last_week = trackings.filter(date__gte=datetime.now() - timedelta(days=7)).count()
    return total * 0.1 + abs(total - last_year) * 0.2 \
           + abs(total - last_month) * 0.3 + abs(total - last_week) * 0.4


def get_goals_affinity(user_goals, goal, max_participants):
    score = 0.0
    for user_goal in user_goals:
        score += goal_affinity(user_goal, goal, max_participants)
    return score


def get_post_recomendations(posts, user_id, max_likes, max_comments):
    last_posts_liked = [PostSerializer(post).data for post in
                        LikePost.objects.filter(createdBy=user_id).order_by('-creationDate')[0:20].values_list(
                            'post')]
    last_posts_created = [PostSerializer(post).data for post in
                          Post.objects.filter(createdBy=user_id,
                                              id__nin=[post.get("id") for post in last_posts_liked]).order_by(
                              '-creationDate')[0:20]]
    user_posts = last_posts_created + last_posts_liked
    return sorted(posts, key=lambda post: sum(
        [post_affinity(post, user_post, max_likes, max_comments) for user_post in user_posts]),
                  reverse=True)


def post_affinity(logged_post, post, max_likes, max_comments):
    title_score = 0.0
    if logged_post.get("title") and post.get("title"):
        title_score = SequenceMatcher(None, logged_post.get("title"), post.get("title")).ratio() * 0.4

    content_score = 0.0
    if logged_post.get("content") and post.get("content"):
        content_score = SequenceMatcher(None, logged_post.get("content"), post.get("content")).ratio() * 0.4
    likes_score = 0.0
    if logged_post.get("numLikes") and post.get("numLikes"):
        likes_score = 1 - abs((logged_post.get("numLikes") + 1) / (max_likes + 1) - (post.get("numLikes") + 1) / (max_likes + 1))
    comments_score = 0.0
    if logged_post.get("numComments") and post.get("numComments"):
        comments_score = 1 - abs((logged_post.get("numComments") + 1) / (max_comments + 1) - (post.get("numComments") + 1) / (max_comments + 1))

    return title_score * 0.4 + content_score * 0.4 + likes_score * 0.05 + comments_score * 0.05
