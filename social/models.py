from datetime import datetime

from mongoengine import Document, fields

from goals.models import Tracking, Goal


class User(Document):
    user_id = fields.StringField(required=True, unique=True)
    username = fields.StringField(max_length=30, required=True)
    email = fields.EmailField(required=True)
    password = fields.StringField()
    birthDate = fields.DateTimeField()
    firstName = fields.StringField(max_length=30, required=True)
    lastName = fields.StringField(max_length=60, required=True)


class Post(Document):
    title = fields.StringField(max_length=30, required=True)
    content = fields.StringField(max_length=1250)
    creationDate = fields.DateTimeField(default=datetime.utcnow)

    createdBy = fields.ReferenceField('User', required=True)
    goal = fields.ReferenceField('Goal')


class Notification(Document):
    title = fields.StringField(max_length=30, required=True)
    content = fields.StringField(max_length=1250)
    creationDate = fields.DateTimeField(default=datetime.utcnow)

    user = fields.ReferenceField('User', required=True)


class LikeTracking(Document):
    tracking = fields.ReferenceField('Tracking', required=True)
    user = fields.ReferenceField('User', required=True)

    meta = {
        'indexes': [
            {'fields': ['tracking', 'user'], 'unique': True}
        ]
    }


class LikePost(Document):
    post = fields.ReferenceField('Post', required=True)
    user = fields.ReferenceField('User', required=True)

    meta = {
        'indexes': [
            {'fields': ['post', 'user'], 'unique': True}
        ]
    }


class Follow(Document):
    user = fields.ReferenceField('User', required=True)
    follower = fields.ReferenceField('User', required=True)

    meta = {
        'indexes': [
            {'fields': ['user', 'follower'], 'unique': True}
        ]
    }


class Participate(Document):
    user = fields.ReferenceField('User', required=True)
    goal = fields.ReferenceField('Goal', required=True)
    meta = {
        'indexes': [
            {'fields': ['user', 'goal'], 'unique': True}
        ]
    }
