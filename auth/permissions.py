from bson import ObjectId
from rest_framework import permissions

from goals.models import Goal
from social.models import User, Participate


class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        # if the request is not a get request, the user must be the owner
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            # Objects that has an owner can't be modified by other users
            mongo_user = User.objects.get(user_id=request.user.id)
            if hasattr(obj, 'createdBy'):
                return mongo_user == obj.createdBy
            elif hasattr(obj, 'goal') and obj.goal:
                goal = Goal.objects.get(id=obj.goal.id)
                return goal and goal.createdBy == mongo_user
            else:
                return True


class IsPrivateGoal(permissions.BasePermission):
    # You can't participate in a private goal if you are not the owner of the goal
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'goal'):
            goal = Goal.objects.get(id=obj.goal.id)
            return goal and goal.isPrivate
        else:
            return False


class IsParticipating(permissions.BasePermission):
    # You can't track a goal if you are not participating in it
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'goal'):
            goal = Goal.objects.get(id=obj.goal.id)
            user = obj.user
            participate = Participate.objects.get(goal=goal, user=user)
            return participate is not None
        else:
            return False
