from datetime import datetime
from mongoengine import Document, fields
from utils.filters import zona_horaria


# Models


class Media(Document):
    creationDate = fields.DateTimeField(default=datetime.now(zona_horaria))
    url = fields.StringField(required=True)
