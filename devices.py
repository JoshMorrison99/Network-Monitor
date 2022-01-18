from sys import platform
import scapy.all as scapy
import os

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

# https://scapy.readthedocs.io/en/latest/usage.html?highlight=ARP#arp-ping
def network_scan():
    # scapy.Ether(dst="ff:ff:ff:ff:ff:ff") --> this is a broadcast frame --> https://networkencyclopedia.com/broadcast-frame/#:~:text=In%20Ethernet%20networks%2C%20Broadcast%20Frame,on%20the%20network%20of%20computers.
    # 192.168.1.0 --> 192.168.1.0 - 192.168.1.254
    answered, unanswered = scapy.srp(scapy.Ether(dst="ff:ff:ff:ff:ff:ff")/scapy.ARP(pdst="192.168.1.0/24"),timeout=2)
    print("Source MAC address: " + answered[0][1].hwsrc)

    erase_text_file("user_information/Devices.txt")

    for element in answered:
        with open("user_information/Devices.txt", "a") as f:
            # psrc is the source IP address
            # element[1] are all the received packets from answered list
            # element[0] are all the sent packets from answered list
            print(element[1].psrc, file=f)
    f.close()


def erase_text_file(file_to_erase):
    file = open(file_to_erase,"w")
    file.close()

print(network_scan())