import scapy.all as scapy
from ipaddress import IPv4Network
import json


def icmp_network_scan(ip_range):
    network = ip_range
    addresses = IPv4Network(network)
    devices = []

    for ip in addresses:
        response = scapy.sr1(scapy.IP(dst=str(ip))/scapy.ICMP(),timeout=1, verbose=0)
        if(response is None):
           print(f"{ip} is not up")
        else:
            print(f"{ip} is up") 
            devices.append(str(ip))

    data = {"nodes": [],"links": []}
    
    for device in devices:
        data["nodes"].append({"ip":device})
        data["links"].append({"source":"192.168.2.1", "target": device})

    with open('user_information/devices.json', "w") as f:
        json_string = json.dumps(data)
        print(json_string, file=f)
        f.close()
    

icmp_network_scan("192.168.2.0/24")
