import scapy.all as scapy
from ipaddress import IPv4Network
from .models import Device
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import DeviceSerializer 
from rest_framework import status
from django.utils import timezone

@api_view(['GET'])
def DeviceList(request):
    devices = Device.objects.all()
    serializer = DeviceSerializer(devices, many=True)
    return Response(serializer.data)
    

@api_view(['GET'])
def DeviceScan(request):
    network = "192.168.2.0/24"
    addresses = IPv4Network(network)
    devices = []

    for ip in addresses:
        response = scapy.sr1(scapy.IP(dst=str(ip))/scapy.ICMP(),timeout=1, verbose=0)
        if(response is None):
            print(f"{ip} is not up")
        else:
            print(f"{ip} is up") 
            devices.append(str(ip))

    for device in devices:
        obj, created = Device.objects.get_or_create(ip=device)
        if created == False:
            # Update last seen 
            obj.last_seen = timezone.now()
    return Response(status.HTTP_200_OK)

@api_view(['POST'])
def UpdateAlias(request):
    serializer = DeviceSerializer(data=request.data)
    print(request.data)
    print(request.data["ip"])
    if serializer.is_valid():
        device = Device.objects.get(ip=request.data["ip"])
        device.alias = request.data["alias"]
        device.save()
    return Response(serializer.data)

