from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

from social.models import User


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def get_app(self, request, provider):
        # NOTE: Avoid loading models at top due to registry boot...
        from allauth.socialaccount.models import SocialApp

        # 1 added line here
        from allauth.socialaccount import app_settings

        config = app_settings.PROVIDERS.get(provider, {}).get('APP')
        app = SocialApp.objects.get_or_create(provider=provider)[0]
        app.client_id = config['client_id']
        app.secret = config['secret']
        app.key = config.get('key', '')
        return app

    def save_user(self, request, sociallogin, form=None):
        user = super(CustomSocialAccountAdapter, self).save_user(request, sociallogin, form)
        mongo_user = User(user_id=user.id, username=user.username, email=user.email, password=user.password,
                          firstName=user.first_name)
        mongo_user.save()
        return user
