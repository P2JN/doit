from datetime import datetime

from mongoengine import Document, fields, CASCADE

from goals.models import Tracking, Goal


class User(Document):
    user_id = fields.IntField()
    username = fields.StringField(max_length=30, required=True)
    email = fields.EmailField(required=True)
    password = fields.StringField()
    birthDate = fields.DateTimeField()
    firstName = fields.StringField(max_length=30, required=True)
    lastName = fields.StringField(max_length=60)

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
    goal = fields.ReferenceField('Goal')

    meta = {'indexes': [
        {'fields': ['$title', "$content"],
         'default_language': 'spanish',
         'weights': {'title': 10, 'content': 2}
         }
    ]}


class Notification(Document):
    title = fields.StringField(max_length=30, required=True)
    content = fields.StringField(max_length=1250)
    creationDate = fields.DateTimeField(default=datetime.utcnow)

    user = fields.ReferenceField('User', required=True)


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
    meta = {
        'indexes': [
            {'fields': ['createdBy', 'goal'], 'unique': True}
        ]
    }


class Comment(Document):
    content = fields.StringField(max_length=1250)
    creationDate = fields.DateTimeField(default=datetime.utcnow)
    createdBy = fields.ReferenceField('User', required=True)
    post = fields.ReferenceField('Post', required=True)

    meta = {'indexes': [
        {'fields': ['$content'],
         'default_language': 'spanish',
         'weights': {'content': 10}
         }
    ]}
