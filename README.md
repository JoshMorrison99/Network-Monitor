# Home Network Monitoring Software

## Josh Morrison - 101083525

### Technlogies Used:

- Javascript
  - React.js
  - Next.js
  - d3.js
  - MaterialUI
  - Axios
  - UUID
- Python
  - Scapy
  - Django
  - Django REST Framework
  - Requests
- Git

- Nmap --> for verification purposes
- Ettercap --> for verification purposes
- Wireshark --> for verification purposes

## How to Enable IP Forwarding on Windows 10

- Step 1: goto HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters
- Step 2: Create a new REG_DWORD nameed IPEnableRouter
- Step 3: Set IPEnableRouter to 1
- Step 4: Reboot

Explaination of IPEnableRouter: https://docs.microsoft.com/en-us/troubleshoot/windows-client/networking/tcpip-and-nbt-configuration-parameters

## How to run

1. git clone https://github.com/JoshMorrison99/Network-Monitor.git
2. Open Terminal 1
3. cd /Client
4. npm install
5. npm run dev
6. Open Terminal 2
7. cd /Server
8. pip install -r requirements.txt
9. python manage.py runserver
10. Done
