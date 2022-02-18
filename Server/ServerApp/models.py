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
    ethernet_destination = models.CharField(max_length=20)
    ethernet_source = models.CharField(max_length=20)
    
    ip_destination = models.CharField(max_length=20)
    ip_source = models.CharField(max_length=20)

    tcp_destination_port = models.CharField(max_length=20)
    tcp_source_port = models.CharField(max_length=20)
    tcp_flag = models.CharField(max_length=20)
