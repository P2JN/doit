from datetime import datetime
from enum import Enum
from mongoengine import Document, fields

# Enums


class Frequency(str, Enum):
    DAILY = 'daily'
    WEEKLY = 'weekly'
    MONTHLY = 'monthly'
    YEARLY = 'yearly'
    TOTAL = 'total'


class GoalType(str, Enum):
    CHALLENGE = 'challenge'
    COOP = 'cooperative'
    PRIVATE = 'private'

# Models


class Goal(Document):
    title = fields.StringField(required=True, max_length=30)
    description = fields.StringField(max_length=750)
    unit = fields.StringField(required=True, max_length=15)
    type = fields.EnumField(GoalType, default=GoalType.PRIVATE)
    creationDate = fields.DateTimeField(default=datetime.utcnow)
    startDate = fields.DateTimeField(default=datetime.utcnow)
    deadline = fields.DateTimeField(future=True)

    createdBy = fields.ReferenceField('User')


class Objective(Document):
    quantity = fields.FloatField(required=True, min_value=0)
    frequency = fields.EnumField(Frequency, default=Frequency.TOTAL)

    goal = fields.ReferenceField('Goal')


class Tracking (Document):
    date = fields.DateTimeField(default=datetime.utcnow)
    amount = fields.FloatField(required=True, min_value=0)

    user = fields.ReferenceField('User')
    goal = fields.ReferenceField('Goal')
