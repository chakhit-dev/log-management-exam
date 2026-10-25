#!/bin/bash

echo "Starting to seed logs into Vector..."

# 1. HTTP API Log (App Login Failed)
curl -s -X POST http://localhost:8080/ \
  -H "Content-Type: application/json" \
  -d '{
    "tenant": "demoA",
    "source": "api",
    "event_type": "app_login_failed",
    "user": "alice",
    "src_ip": "203.0.113.7",
    "reason": "wrong_password",
    "@timestamp": "2025-08-20T07:20:00Z"
  }' > /dev/null

# 2. CrowdStrike Log (Malware Detected)
curl -X POST http://localhost:8080/ \
  -H "Content-Type: application/json" \
  -d '{
    "tenant": "demoA",
    "source": "crowdstrike",
    "event_type": "malware_detected",
    "host": "WIN10-01",
    "process": "powershell.exe",
    "severity": 8,
    "sha256": "abc123xyz789...",
    "action": "quarantine",
    "@timestamp": "2025-08-20T08:00:00Z"
  }'

# 3. Microsoft 365
curl -X POST http://localhost:8080/ \
  -H "Content-Type: application/json" \
  -d '{
    "tenant": "demoB",
    "source": "m365",
    "event_type": "UserLoggedIn",
    "user": "bob@demo.local",
    "ip": "198.51.100.23",
    "status": "Success",
    "workload": "Exchange",
    "@timestamp": "2025-08-20T10:05:00Z"
  }'

# 3. Microsoft AD / Windows Security (Logon Failed 4625)
curl -s -X POST http://localhost:8080/ \
  -H "Content-Type: application/json" \
  -d '{
    "tenant": "demoB",
    "source": "ad",
    "event_id": 4625,
    "event_type": "LogonFailed",
    "user": "demo\\eve",
    "host": "DC01",
    "src_ip": "203.0.113.77",
    "logon_type": 3,
    "@timestamp": "2025-08-20T11:11:11Z"
  }' > /dev/null

echo "Seed logs successfully sent to Vector!"