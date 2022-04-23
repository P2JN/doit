from datetime import datetime

from mongoengine import Document, fields


class User(Document):
    username = fields.StringField(max_length=30, required=True)
    email = fields.EmailField(required=True)
    password = fields.StringField()
    birthDate = fields.DateTimeField()
    first_name = fields.StringField(max_length=30, required=True)
    lastName = fields.StringField(max_length=60, required=True)


class Post(Document):
    title = fields.StringField(max_length=30, required=True)
    content = fields.StringField(max_length=1250)
    creation_date = fields.DateTimeField(default=datetime.utcnow)


class Notification(Document):
    title = fields.StringField(max_length=30, required=True)
    content = fields.StringField(max_length=1250)
    creation_date = fields.DateTimeField(default=datetime.utcnow)
    user = fields.ReferenceField(User)
