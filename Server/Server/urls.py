from django.contrib import admin
from django.urls import path, include
from ServerApp import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/devicelist/', views.DeviceList),
    path('api/devicescan/', views.DeviceScan),
    path('api/updatealias/', views.UpdateAlias),
    path('api/updategateway/', views.UpdateGateway),
    path('api/deletedatabase/', views.DeleteDatabase),
    path('api/arppoisioning/', views.ArpPoisioning)
]