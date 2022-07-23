from bson import ObjectId
from rest_framework import permissions

from goals.models import Goal
from social.models import User


class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        # Objects that has an owner can't be modified by other users
        mongo_user = User.objects.get(user_id=request.user.id)
        # if the request is not a get request, the user must be the owner

        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            if hasattr(obj, 'createdBy'):
                return mongo_user == obj.createdBy
            elif hasattr(obj, 'goal') and obj.goal:
                goal = Goal.objects.get(id=obj.goal.id)
                return goal and goal.createdBy == mongo_user
            else:
                return True
