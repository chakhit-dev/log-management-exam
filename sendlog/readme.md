seed-api command
./seed-logs.sh

syslog command
./seed-syslog.sh

./seed-main4.sh 100



curl -X POST http://localhost:8080/ \
  -H "Content-Type: application/json" \
  -d '{
    "tenant": "demoA",
    "source": "api",
    "event_type": "app_login_failed",
    "user": "alice",
    "ip": "125.27.146.182,
    "@timestamp": "2026-10-30T12:00:00Z"
  }'