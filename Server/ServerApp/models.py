from django.db import models
from django.utils import timezone

# Create your models here.
class Device(models.Model):
    ip = models.CharField(max_length=20)
    mac = models.CharField(max_length=20, null=True)
    alias = models.CharField(max_length=20, null=True)
    date_found = models.DateTimeField(default=timezone.localtime(timezone.now()))
    last_seen = models.DateTimeField(default=timezone.localtime(timezone.now()))
    mac_vendor = models.CharField(max_length=100, null=True)
    open_ports = models.CharField(max_length=500,null=True)
    is_new = models.BooleanField(default=True)

    def __str__(self):
        return self.ip

# Create your models here.
class Packet(models.Model):
    ethernet_destination = models.CharField(default=None, max_length=20, null=True, blank=True)
    ethernet_source = models.CharField(default=None, max_length=20, null=True, blank=True)
    
    ip_destination = models.CharField(default=None, max_length=20, null=True, blank=True)
    ip_source = models.CharField(default=None, max_length=20, null=True, blank=True)

    tcp_destination_port = models.CharField(default=None, max_length=20, null=True, blank=True)
    tcp_source_port = models.CharField(default=None, max_length=20, null=True, blank=True)
    tcp_flag = models.CharField(default=None, max_length=20, null=True, blank=True)

    udp_destination_port = models.CharField(default=None, max_length=20, null=True, blank=True)
    udp_source_port = models.CharField(default=None, max_length=20, null=True, blank=True)

    arp_source_mac = models.CharField(default=None, max_length=20, null=True, blank=True)
    arp_destination_mac = models.CharField(default=None, max_length=20, null=True, blank=True)
    arp_source_ip = models.CharField(default=None, max_length=20, null=True, blank=True)
    arp_destination_ip = models.CharField(default=None, max_length=20, null=True, blank=True)

    raw_packet_data = models.CharField(default=None, max_length=65535, null=True, blank=True)

    dns_packet_opcode = models.CharField(default=None, max_length=20, null=True, blank=True)
    dns_packet_qd = models.CharField(default=None, max_length=20, null=True, blank=True)

    icmp_packet_type = models.CharField(default=None, max_length=20, null=True, blank=True)

    packet_type = models.CharField(default=None, max_length=20, null=True, blank=True)

    date_found = models.DateTimeField(default=timezone.localtime(timezone.now()))

