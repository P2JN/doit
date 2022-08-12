from mongoengine import Document, fields, CASCADE


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
