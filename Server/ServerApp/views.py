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
            except Device.DoesNotExist:
                device = None


@api_view(['GET'])
def DeviceScan(request):
    with concurrent.futures.ThreadPoolExecutor() as executor:
        executor.map(DeviceThreadedScanner, list(range(256)))
    # defaultGateway = GetDefaultGateway()
    # network = defaultGateway + ".0/24"
    # addresses = IPv4Network(network)

    # for ip in addresses:
    #     response = scapy.sr1(scapy.IP(dst=str(ip))/scapy.ICMP(),timeout=1, verbose=0)
    #     if(response is None):
    #         print(f"{ip} is not up")
    #     else:
    #         print(f"{ip} is up") 

    #         # create or update device 
    #         obj, created = Device.objects.get_or_create(ip=str(ip))
    #         if created == False:
    #             # Update last seen 
    #             obj.last_seen = timezone.localtime(timezone.now())
    #             obj.save()

    #         # ARP SCAN
    #         response, unanswered = scapy.srp(scapy.Ether(dst="ff:ff:ff:ff:ff:ff")/scapy.ARP(pdst=str(ip)),timeout=1)
    #         if(response != None):
    #             try:
    #                 device = Device.objects.get(ip=str(ip))
    #                 device.mac = response[0][1].hwsrc
    #                 device.save()
    #             except Device.DoesNotExist:
    #                 device = None


    
    
    #ARPScan()
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




# def ARPScan():
#     ips = []
#     macs = []
#     response, unanswered = scapy.srp(scapy.Ether(dst="ff:ff:ff:ff:ff:ff")/scapy.ARP(pdst="192.168.2.0/24"),timeout=3)
#     for i in response:
#         if(i[1].psrc != None or i[1].hwsrc != None):
#             ips.append(i[1].psrc)      #  SOURCE IP ADDRESS
#             macs.append(i[1].hwsrc)    #  SOURCE MAC ADDRESS

#     # i[1] are all the received packets from response list
#     # i[0] are all the sent packets from response list
    
#     for i in range(len(ips)):
#         try:
#             device = Device.objects.get(ip=ips[i])
#             device.mac = macs[i]
#             device.save()
#         except Device.DoesNotExist:
#             device = None
        
