from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers

from social.models import User


class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    def get_cleaned_data(self):
        super(CustomRegisterSerializer, self).get_cleaned_data()
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'password2': self.validated_data.get('password2', ''),
            'email': self.validated_data.get('email', ''),
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', '')
        }

    def save(self, request):
        user = super(CustomRegisterSerializer, self).save(request)
        mongo_user = User(user_id=user.id, username=user.username, email=user.email, password=user.password,
                          firstName=user.first_name)
        mongo_user.save()
        return user
