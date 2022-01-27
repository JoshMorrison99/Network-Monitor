from django.shortcuts import render
from django.http import HttpResponse
import module

# Create your views here.
def say_hello(request):
    myDevice = module.DeviceScan()
    return HttpResponse('Hello World')
