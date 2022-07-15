from allauth.socialaccount.forms import SignupForm


class MyCustomSocialSignupForm(SignupForm):

    def save(self, request):
        # Ensure you call the parent class's save.
        # .save() returns a User object.
        user = super(MyCustomSocialSignupForm, self).save(request)

        # Add your own processing here.

        # You must return the original result.
        return user
