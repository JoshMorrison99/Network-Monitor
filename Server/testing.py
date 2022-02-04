from urllib import response
from scapy.all import IP,TCP,sr1,ICMP
import concurrent.futures


def tcp_scan(ip):
    GATEWAY = "192.168.2."
    response = sr1(IP(dst=(GATEWAY+str(ip)))/ICMP(),timeout=1, verbose=0)
    if(response != None):
        print(f'{ip} is up')

    

with concurrent.futures.ThreadPoolExecutor() as executor:
    executor.map(tcp_scan, list(range(256)))