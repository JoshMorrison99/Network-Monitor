from scapy.all import ARP,srp,Ether

def main():
    ips = []
    macs = []
    response, unanswered = srp(Ether(dst="ff:ff:ff:ff:ff:ff")/ARP(pdst="192.168.2.0/24"),timeout=2)
    for i in response:
        ips.append(i[1].psrc)      #  SOURCE IP ADDRESS
        macs.append(i[1].hwsrc)    #  SOURCE MAC ADDRESS

    # i[1] are all the received packets from response list
    # i[0] are all the sent packets from response list
    
    for i in ips:
        print(i)
    for i in macs:
        print(i)
main()