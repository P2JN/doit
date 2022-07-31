from django.http import Http404


def get_obj_or_404(klass, *args, **kwargs):
    try:
        return klass.objects.get(*args, **kwargs)
    except klass.DoesNotExist:
        raise Http404


def handle_uploaded_file(f):
    url = 'media/uploaded/' + f.name
    with open(url, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
    return url
