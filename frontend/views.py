from django.shortcuts import render

# Create your views here.


def app(request):
    return render(request, "build/index.html")