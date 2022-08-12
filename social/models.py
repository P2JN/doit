from datetime import datetime
from enum import Enum

from mongoengine import Document, fields, CASCADE, NULLIFY

from goals.models import Tracking, Goal

from media.models import Media


class NotificationIconType(str, Enum):
    FOLLOW = 'follow'
    LIKE = 'like'
    POST = 'post'
    INFO = 'info'
    COMMENT = 'comment'
    COMPLETED = 'completed'
    GOAL = 'goal'
    TRACKING = 'tracking'


class User(Document):
    user_id = fields.IntField()
    username = fields.StringField(max_length=30, required=True, unique=True)
    email = fields.EmailField(required=True)
    password = fields.StringField()
    birthDate = fields.DateTimeField()
    firstName = fields.StringField(max_length=30, required=True)
    lastName = fields.StringField(max_length=60)
    media = fields.ReferenceField(
        'Media', reverse_delete_rule=NULLIFY, required=False)

    meta = {'indexes': [
        {'fields': ['$username', "$email", "$firstName", "$lastName"],
         'default_language': 'spanish',
         'weights': {'username': 10, 'email': 8, 'firstName': 5, 'lastName': 5}
         }
    ]}


class Post(Document):
    title = fields.StringField(max_length=30, required=True)
    content = fields.StringField(max_length=1250)
    creationDate = fields.DateTimeField(default=datetime.utcnow)

    createdBy = fields.ReferenceField('User', required=True)
    goal = fields.ReferenceField('Goal', reverse_delete_rule=CASCADE, required=False)
    media = fields.ReferenceField('Media', reverse_delete_rule=NULLIFY)

    meta = {'indexes': [
        {'fields': ['$title', "$content"],
         'default_language': 'spanish',
         'weights': {'title': 10, 'content': 2}
         }
    ]}


class Notification(Document):
    title = fields.StringField(max_length=50, required=True)
    content = fields.StringField(max_length=1250)
    creationDate = fields.DateTimeField(default=datetime.utcnow)
    checked = fields.BooleanField(default=False)
    user = fields.ReferenceField('User', required=True)

    iconType = fields.EnumField(
        NotificationIconType, default=NotificationIconType.INFO)


class LikeTracking(Document):
    tracking = fields.ReferenceField('Tracking', required=True)
    createdBy = fields.ReferenceField('User', required=True)

    meta = {
        'indexes': [
            {'fields': ['tracking', 'createdBy'], 'unique': True}
        ]
    }


class LikePost(Document):
    post = fields.ReferenceField('Post', required=True)
    createdBy = fields.ReferenceField('User', required=True)

    meta = {
        'indexes': [
            {'fields': ['post', 'createdBy'], 'unique': True}
        ]
    }


class Follow(Document):
    user = fields.ReferenceField(
        'User', required=True, reverse_delete_rule=CASCADE)
    follower = fields.ReferenceField(
        'User', required=True, reverse_delete_rule=CASCADE)

    meta = {
        'indexes': [
            {'fields': ['user', 'follower'], 'unique': True}
        ]
    }


class Participate(Document):
    createdBy = fields.ReferenceField(
        'User', required=True, reverse_delete_rule=CASCADE)
    goal = fields.ReferenceField(
        'Goal', required=True, reverse_delete_rule=CASCADE)
    creationDate = fields.DateTimeField(default=datetime.utcnow)
    meta = {
        'indexes': [
            {'fields': ['createdBy', 'goal'], 'unique': True}
        ]
    }


class Comment(Document):
    content = fields.StringField(max_length=1250)
    creationDate = fields.DateTimeField(default=datetime.utcnow)
    createdBy = fields.ReferenceField('User', required=True)
    post = fields.ReferenceField('Post', required=True, reverse_delete_rule=CASCADE)

    meta = {'indexes': [
        {'fields': ['$content'],
         'default_language': 'spanish',
         'weights': {'content': 10}
         }
    ]}
