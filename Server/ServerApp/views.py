import scapy.all as scapy
import requests
from ipaddress import IPv4Network
from .models import Device
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import DeviceSerializer 
from rest_framework import status
from django.utils import timezone
import concurrent.futures

@api_view(['GET'])
def DeviceList(request):
    devices = Device.objects.all()
    serializer = DeviceSerializer(devices, many=True)
    return Response(serializer.data)
    
def DeviceThreadedScanner(in_ip):
    defaultGateway = GetDefaultGateway()
    ip = defaultGateway+str(in_ip)

    response = scapy.sr1(scapy.IP(dst=(ip))/scapy.ICMP(),timeout=1, verbose=0)
    if(response is None):
        print(f"{ip} is not up")
    else:
        print(f"{ip} is up") 

        # create or update device 
        obj, created = Device.objects.get_or_create(ip=str(ip))
        if created == False:
            # Update last seen 
            obj.last_seen = timezone.localtime(timezone.now())
            obj.save()

        # ARP SCAN
        response, unanswered = scapy.srp(scapy.Ether(dst="ff:ff:ff:ff:ff:ff")/scapy.ARP(pdst=(ip)),timeout=1)
        if(response != None):
            try:
                device = Device.objects.get(ip=str(ip))
                device.mac = response[0][1].hwsrc
                device.save()

                # Get and Set MAC vendor in the database
                print(device.mac)
                GetMacVendor(device.mac)
            except Device.DoesNotExist:
                device = None
        
        


@api_view(['GET'])
def DeviceScan(request):
    with concurrent.futures.ThreadPoolExecutor() as executor:
        executor.map(DeviceThreadedScanner, list(range(256)))

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


def GetDefaultGateway():
    gateway = scapy.conf.route.route("0.0.0.0")[2]
    lastIndex = gateway.rfind('.')
    return gateway[:lastIndex]+'.'

def GetMacVendor(mac_address):
    url = "https://api.macvendors.com/"
    response = requests.get(url+mac_address)
    print(response)
    if(response.status_code == 200):
        device = Device.objects.get(mac=str(mac_address))
        device.mac_vendor = response.content.decode()
        device.save()

