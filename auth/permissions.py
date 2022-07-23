from bson import ObjectId
from rest_framework import permissions

from goals.models import Goal
from social.models import User, Participate


class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'POST':
            if request.data.get("createdBy") and ObjectId.is_valid(request.data.get("createdBy")):
                mongo_user = User.objects.filter(id=request.data.get("createdBy")).first()
                return mongo_user and mongo_user.user_id == request.user.id
            elif request.data.get("goal") and ObjectId.is_valid(request.data.get("goal")):
                goal = Goal.objects.filter(id=request.data.get("goal")).first()
                return goal and goal.createdBy and goal.createdBy.user_id == request.user.id
            else:
                return True
        else:
            return True

    def has_object_permission(self, request, view, obj):

        # if the request is not a get request, the user must be the owner
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            # Objects that has an owner can't be modified by other users
            mongo_user = User.objects.filter(user_id=request.user.id).first()
            if mongo_user is None:
                return False
            elif hasattr(obj, 'createdBy'):
                return mongo_user == obj.createdBy
            elif hasattr(obj, 'goal') and obj.goal:
                goal = Goal.objects.get(id=obj.goal.id)
                return goal and goal.createdBy == mongo_user
            else:
                return True


class IsPrivateGoal(permissions.BasePermission):
    # You can't participate in a private goal if you are not the owner of the goal
    def has_permission(self, request, view):
        if request.method != "POST":
            return True
        elif ObjectId.is_valid(request.data.get("goal")) and ObjectId.is_valid(request.data.get("createdBy")):
            goal_id = request.data.get("goal")
            goal = Goal.objects.filter(id=goal_id).first()
            if goal is None:
                return False
            elif goal.type == "private":
                user_id = request.data.get("createdBy")
                user = User.objects.filter(id=user_id).first()
                return user and user == goal.createdBy and user.user_id == request.user.id
            else:
                return True
        else:
            return False


class IsParticipating(permissions.BasePermission):
    # You can't track a goal if you are not participating in it
    def has_permission(self, request, view):
        if request.method != "POST":
            return True
        elif ObjectId.is_valid(request.data.get("goal")) and ObjectId.is_valid(request.data.get("createdBy")):
            goal_id = request.data.get("goal")
            goal = Goal.objects.filter(id=goal_id).first()
            user_id = request.data.get("createdBy")
            user = User.objects.filter(id=user_id).first()
            if goal and user:
                participate = Participate.objects.filter(createdBy=user, goal=goal).first()
                return participate is not None
            else:
                return False
        else:
            return False
