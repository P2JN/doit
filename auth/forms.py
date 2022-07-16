from allauth.account.forms import SignupForm
from allauth.socialaccount.forms import SignupForm as SignupFormGoogle
from social.models import User


class InterceptorSignupForm(SignupForm):

    def save(self, request):
        user = super(InterceptorSignupForm, self).save(request)

        # Saving user in mongo database
        mongo_user = User(user_id=user.id, username=user.username, email=user.email, password=user.password,
                          firstName=user.username)
        # TODO cuando los formularios de front esten listos pillar el firstname del user
        mongo_user.save()

        return user


class InterceptorSignupFormGoogle(SignupFormGoogle):

    def save(self, request):
        user = super(InterceptorSignupFormGoogle, self).save(request)

        # Saving user in mongo database
        google_data = self.sociallogin.account.extra_data
        mongo_user = User(user_id=user.id, username=user.username, email=user.email, password=user.password,
                          firstName=google_data.get("name"))
        mongo_user.save()

        return user
