"""
Django settings for doit project.

Generated by 'django-admin startproject' using Django 4.0.4.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""

from pathlib import Path
import mongoengine
import os
from dotenv import load_dotenv
import sys

TEST = 'test' in sys.argv

load_dotenv()  # take environment variables from .env.
SITE_ID = 1
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
PWA_SERVICE_WORKER_PATH = os.path.join(BASE_DIR, 'static/js', 'serviceworker.js')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-3scat@+fq!!i8f9jj*0#uo2@r^y*jhcz)tk6iw@6vquy^(9r(&'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Language code spanish
LANGUAGE_CODE = 'es-es'

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_mongoengine',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'dj_rest_auth',
    'pwa'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware'
]

AUTHENTICATION_BACKENDS = [
    # django's inbuild authentication backend
    'django.contrib.auth.backends.ModelBackend',

    # django's allauth authentication backend
    'allauth.account.auth_backends.AuthenticationBackend',
]
# Rest auth config
REST_AUTH_REGISTER_SERIALIZERS = {
    'REGISTER_SERIALIZER': 'auth.authSerializer.CustomRegisterSerializer',
}
REST_AUTH_SERIALIZERS = {
    'USER_DETAILS_SERIALIZER': 'auth.authSerializer.CustomUserDetailsSerializer',
}

ROOT_URLCONF = 'doit.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'frontend')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Django rest framework config

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
        'auth.permissions.IsOwnerOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'doit.pagination.CustomPageNumberPagination',
    'PAGE_SIZE': 10
}

# AllAuth config
SOCIALACCOUNT_ADAPTER = "auth.socialAccountAdapter.CustomSocialAccountAdapter"

SOCIALACCOUNT_STORE_TOKENS = True

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        "APP": {
            "client_id": os.environ.get("GOOGLE_CLIENT_ID"),
            "secret": os.environ.get("GOOGLE_SECRET_ID"),
            "key": ""
        },
        'SCOPE': [
            'profile',
            'email',
            'https://www.googleapis.com/auth/calendar'
        ],
        'AUTH_PARAMS': {
            'prompt': 'consent',
            'access_type': 'offline',
        }
    }
}

WSGI_APPLICATION = 'doit.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get("POSTGRES_DB"),
        'USER': os.environ.get("POSTGRES_USER"),
        'PASSWORD': os.environ.get("POSTGRES_PASSWORD"),
        'HOST': os.environ.get("POSTGRES_HOST"),
        'PORT': '5432',
    }
}

if os.environ.get('DOCKER'):
    mongoengine.connect(
        db=os.environ.get("MONGO_INITDB_DATABASE"),
        host='mongo',
        port=27017,
        username=os.environ.get("MONGO_INITDB_ROOT_USERNAME"),
        password=os.environ.get("MONGO_INITDB_ROOT_PASSWORD"),
    )
elif TEST:
    db = mongoengine.connect("TEST",
                             username=os.environ.get("MONGO_INITDB_ROOT_USERNAME"),
                             password=os.environ.get("MONGO_INITDB_ROOT_PASSWORD"), )
    db.drop_database("TEST")
else:
    mongoengine.connect("DOIT")

# Email validation
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
ACCOUNT_EMAIL_VERIFICATION = "none"

# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'frontend', 'build', 'static'),
)

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = 'media/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# dev env CORS SETTINGS
BASEURL = 'http://localhost:8000'
FE_BASEURL = 'http://localhost:3000'

ALLOWED_HOSTS = ['*']

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    "timezone",
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with'
]
CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_WHITELIST = (
    BASEURL, FE_BASEURL
)
CSRF_TRUSTED_ORIGINS = [
    BASEURL, FE_BASEURL
]

# PWA
PWA_APP_NAME = 'doit'
PWA_APP_DESCRIPTION = "doit PWA"
PWA_APP_THEME_COLOR = '#000000'
PWA_APP_BACKGROUND_COLOR = '#ffffff'
PWA_APP_DISPLAY = 'standalone'
PWA_APP_SCOPE = '/'
PWA_APP_ORIENTATION = 'any'
PWA_APP_START_URL = '/'
PWA_APP_STATUS_BAR_COLOR = 'default'
PWA_APP_ICONS = [
    {
        'src': 'static/media/Logo.58218d2cab0730893cbc546528ac327f.svg',
        'sizes': '160x160'
    }
]
PWA_APP_ICONS_APPLE = [
    {
        'src': 'static/media/Logo.58218d2cab0730893cbc546528ac327f.svg',
        'sizes': '160x160'
    }
]
PWA_APP_SPLASH_SCREEN = [
    {
        'src': 'static/media/Logo.58218d2cab0730893cbc546528ac327f.svg',
        'media': '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)'
    }
]
PWA_APP_DIR = 'ltr'
PWA_APP_LANG = 'es-ES'
