from django.db import models
from django.utils import timezone

# Create your models here.
class Device(models.Model):
    ip = models.CharField(max_length=20)
    mac = models.CharField(max_length=20, null=True)
    alias = models.CharField(max_length=20, null=True)
    date_found = models.DateTimeField(default=timezone.now)
    #last_seen = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.ip
