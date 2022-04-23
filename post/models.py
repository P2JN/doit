from mongoengine import Document, fields


class Meta:
    app_label = 'post'


class Post(Document):
    tittle = fields.StringField(max_length=30)
    content = fields.StringField(max_length=30)
    creation_date = fields.DateTimeField()
