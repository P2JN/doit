from allauth.account.forms import SignupForm, LoginForm
from social.models import User


class InterceptorSignupForm(SignupForm):

    def save(self, request):
        # Ensure you call the parent class's save.
        # .save() returns a User object.
        user = super(InterceptorSignupForm, self).save(request)

        # Add your own processing here.
        mongoUser = User(user_id=user.id, username=user.username, email=user.email, password=user.password)
        mongoUser.save()
        # You must return the original result.
        return user


class InterceptorLoginForm(LoginForm):

    def save(self, request):
        # Ensure you call the parent class's save.
        # .save() returns a User object.
        user = super(InterceptorLoginForm, self).login(request)

        mongoUser = User.objects().get(user_id=user.id)
        if mongoUser:
            mongoUser = User(user_id=user.id, username=user.username, email=user.email, password=user.password)
            mongoUser.save()

        # You must return the original result.
        return user
