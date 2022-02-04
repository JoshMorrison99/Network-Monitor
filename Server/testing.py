from scapy.all import IP,TCP,sr1
import socket
from ipaddress import IPv4Network

def tcp_scan():
    network = "192.168.2.0/24"
    addresses = IPv4Network(network)
    devices = []       
    

    for ip in addresses:
        response = sr1( IP(dst=str(ip))/TCP(dport=80,flags="S"), timeout=1 )
        if(response is None):
            print(f"{ip} is not up")
        else:
            print(f"{ip} is up") 
            devices.append(str(ip))
            print(response.show())

tcp_scan()
