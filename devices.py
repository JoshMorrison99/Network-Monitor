from sys import platform
import scapy.all as scapy
import os
from ipaddress import IPv4Network
import socket

OS = platform

def get_os():
    erase_text_file("user_information/OS.txt")
    currentOS = ''
    if platform == 'win32':
        currentOS = "Windows"
    elif platform == 'darwin':
        currentOS = "macOS"
    elif platform == 'linux':
        currentOS = "Linux"

    if(currentOS != ''):
        with open('user_information/OS.txt', 'w') as f:
                print(currentOS, file=f)
        f.close()


# ARP scan is the fastest way to scan ETHERNET
def arp_network_scan():
    answered, unanswered = scapy.srp(scapy.Ether(dst="ff:ff:ff:ff:ff:ff")/scapy.ARP(pdst="192.168.2.0/24"),timeout=2)
    answered.summary(lambda s,r: r.sprintf("%Ether.src% %ARP.psrc%") )

    erase_text_file("user_information/Ethernet_Devices.txt")

    for element in answered:
        with open("user_information/ARP_Devices.txt", "a") as f:
            print(element[1].psrc, file=f)
    f.close()

# ICMP scan is needed because ARP will only scan ethernet, but this software wants all devices.
def icmp_network_scan(ip_range):
    network = ip_range
    addresses = IPv4Network(network)
    devices = []

    for ip in addresses:
        response = scapy.sr1(scapy.IP(dst=str(ip))/scapy.ICMP(),timeout=2, verbose=0)
        if(response is None):
           print(f"{ip} is not up")
        else:
            print(f"{ip} is up") 
            devices.append(str(ip))

    erase_text_file("user_information/ICMP_Devices.txt")

    for device in devices:
        with open("user_information/ICMP_Devices.txt", "a") as f:
            print(device, file=f)
    f.close()
    

def get_router_IP_address():
    erase_text_file("user_information/RouterIP.txt")
    with open("user_information/RouterIP.txt", "a") as f:
        print(scapy.conf.route.route("0.0.0.0")[2], file=f)
    f.close()

# def hostname_lookup_from_IP():
#     f = open("user_information/Devices.txt", 'r')
#     lines = f.readlines()
#     for line in lines:
#         print(line.strip("\n"))
#         try:
#             print(socket.gethostbyaddr(line).strip("\n"))
#         except:
#             print("no hostname for ", line.strip("\n"))


def erase_text_file(file_to_erase):
    file = open(file_to_erase,"w")
    file.close()

icmp_network_scan("192.168.2.0/24")