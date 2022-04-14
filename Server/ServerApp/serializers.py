from rest_framework import serializers
from .models import Device
from .models import Packet

class DeviceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Device
        fields = '__all__'

class PacketSerializer(serializers.ModelSerializer):

    class Meta:
        model = Packet
        fields = '__all__'

        