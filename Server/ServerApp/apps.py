from django.apps import AppConfig
import scapy.all as scapy
import json
import os

def GetDefaultGateway():
    dirname = os.path.dirname(__file__)
    filename = os.path.join(dirname, '../../config.json')
    gateway = scapy.conf.route.route("0.0.0.0")[2]
    data = {'settings': [{'default_gateway':gateway}]}
    json_string = json.dumps(data)
    with open(filename,'w') as f:
        f.write(json_string)

class ServerappConfig(AppConfig):
    name = 'ServerApp'

    def ready(self):
        # run on startup
        print("STARTING...")
        GetDefaultGateway()
    
    