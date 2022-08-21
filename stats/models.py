from datetime import datetime
from enum import Enum

from mongoengine import Document, fields, CASCADE


class AchievementType(str, Enum):
    GOLD = 'gold'
    SILVER = 'silver'
    BRONZE = 'bronze'
    SPECIAL = 'special'


# Models
class Stats(Document):
    createdGoals = fields.LongField(required=True, default=0)
    participatedGoals = fields.LongField(required=True, default=0)
    totalObjectivesCompleted = fields.LongField(required=True, default=0)
    yearlyObjectivesCompleted = fields.LongField(required=True, default=0)
    monthlyObjectivesCompleted = fields.LongField(required=True, default=0)
    weeklyObjectivesCompleted = fields.LongField(required=True, default=0)
    dailyObjectivesCompleted = fields.LongField(required=True, default=0)
    createdBy = fields.ReferenceField('User', required=True, reverse_delete_rule=CASCADE)


class Achievement(Document):
    id = fields.IntField(required=True, primary_key=True)
    title = fields.StringField(max_length=120, required=True)
    description = fields.StringField(max_length=1250)
    media = fields.ReferenceField('Media', reverse_delete_rule=CASCADE)
    type = fields.EnumField(AchievementType)


class AchievementUser(Document):
    createdBy = fields.ReferenceField('User', required=True, reverse_delete_rule=CASCADE)
    achievement = fields.ReferenceField('Achievement', required=True, reverse_delete_rule=CASCADE)
    creationDate = fields.DateTimeField(default=datetime.utcnow)
    checked = fields.BooleanField(default=False)

    meta = {
        'indexes': [
            {'fields': ['createdBy', 'achievement'], 'unique': True}
        ]
    }
