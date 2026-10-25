#!/bin/bash

# echo "Starting to seed Network/Firewall Syslog into Vector (Port 514)..."
# echo "Sending Firewall Block Event..."
# echo "<132>1 2026-10-24T08:31:00.000Z firewall01.local security_log - - - [meta sequenceId=\"2\"] Action=Block Protocol=UDP SrcIP=203.0.113.50 DstIP=10.0.0.1 DstPort=53" | nc -u -w1 localhost 514

# sleep 1

# echo "Sending Firewall Allow Event..."
# echo "<134>1 2026-10-24T08:32:00.000Z firewall01.local security_log - - - [meta sequenceId=\"3\"] Action=Allow Protocol=HTTPS SrcIP=192.168.1.55 DstIP=142.250.190.46 DstPort=443" | nc -u -w1 localhost 514

# echo "Sending Firewall Allow TCP Event..."
# echo "<134>1 2026-10-24T08:33:00.000Z firewall01.local security_log - - - [meta sequenceId=\"4\"] Action=Allow Protocol=TCP SrcIP=192.168.1.100 DstIP=8.8.8.8 DstPort=443" | nc -u -w1 localhost 514

echo "<134>Aug 20 12:44:56 fw01 vendor=demo product=ngfw action=deny src=10.0.1.10 dst=8.8.8.8 spt=5353 dpt=53 proto=udp msg=DNS blocked policy=Block-DNS" | nc -u -w1 localhost 514
echo "Syslog seed data successfully sent to Vector!"

