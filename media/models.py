from datetime import datetime
from mongoengine import Document, fields


# Models
class Media(Document):
    creationDate = fields.DateTimeField(default=datetime.utcnow)
    url = fields.StringField(required=True)
