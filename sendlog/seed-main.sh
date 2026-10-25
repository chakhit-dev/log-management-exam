bash
#!/usr/bin/env bash

set -u

DEFAULT_ENDPOINT="http://localhost:8080/"
ENDPOINT="${3:-$DEFAULT_ENDPOINT}"

TENANTS=("demoA" "demoB" "demoC" "demoD" "demoE" "demoF" "demoG")

usage() {
  echo "Usage: $0 <min_requests> <max_requests> [endpoint]"
  echo
  echo "Examples:"
  echo "  $0 100 500"
  echo "  $0 100 500 http://localhost:8080/"
  exit 1
}

# Validate arguments
if [[ $# -lt 2 || $# -gt 3 ]]; then
  usage
fi

MIN_REQUESTS="$1"
MAX_REQUESTS="$2"

if [[ ! "$MIN_REQUESTS" =~ ^[0-9]+$ ||
      ! "$MAX_REQUESTS" =~ ^[0-9]+$ ]]; then
  echo "Error: min_requests and max_requests must be integers."
  exit 1
fi

if (( MIN_REQUESTS < 1 || MAX_REQUESTS < MIN_REQUESTS )); then
  echo "Error: Require 1 <= min_requests <= max_requests."
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "Error: curl is required."
  exit 1
fi

# Generate a random integer in the inclusive range.
random_between() {
  local min="$1"
  local max="$2"
  echo $(( min + RANDOM * 32768 / 32768 % (max - min + 1) ))
}

# Use shuf for an unbiased random count when available.
if command -v shuf >/dev/null 2>&1; then
  TOTAL_REQUESTS=$(shuf -i "${MIN_REQUESTS}-${MAX_REQUESTS}" -n 1)
else
  TOTAL_REQUESTS=$(( MIN_REQUESTS + RANDOM % (MAX_REQUESTS - MIN_REQUESTS + 1) ))
fi

echo "Starting to seed logs into Vector..."
echo "Endpoint: ${ENDPOINT}"
echo "Request range: ${MIN_REQUESTS}-${MAX_REQUESTS}"
echo "Selected requests: ${TOTAL_REQUESTS}"
echo

SUCCESS=0
FAILED=0

for ((i = 1; i <= TOTAL_REQUESTS; i++)); do
  # Random tenant for each request
  TENANT_INDEX=$(( RANDOM % ${#TENANTS[@]} ))
  TENANT="${TENANTS[$TENANT_INDEX]}"

  # Randomly select one of four event types
  EVENT_TYPE=$(( RANDOM % 4 ))

  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  case "$EVENT_TYPE" in
    0)
      SOURCE="api"
      PAYLOAD=$(cat <<EOF
{
  "tenant": "${TENANT}",
  "source": "api",
  "event_type": "app_login_failed",
  "user": "alice",
  "src_ip": "203.0.113.7",
  "reason": "wrong_password",
  "@timestamp": "${TIMESTAMP}"
}
EOF
)
      ;;
    1)
      SOURCE="crowdstrike"
      PAYLOAD=$(cat <<EOF
{
  "tenant": "${TENANT}",
  "source": "crowdstrike",
  "event_type": "malware_detected",
  "host": "WIN10-01",
  "process": "powershell.exe",
  "severity": 8,
  "sha256": "abc123xyz789...",
  "action": "quarantine",
  "@timestamp": "${TIMESTAMP}"
}
EOF
)
      ;;
    2)
      SOURCE="m365"
      PAYLOAD=$(cat <<EOF
{
  "tenant": "${TENANT}",
  "source": "m365",
  "event_type": "UserLoggedIn",
  "user": "bob@demo.local",
  "ip": "198.51.100.23",
  "status": "Success",
  "workload": "Exchange",
  "@timestamp": "${TIMESTAMP}"
}
EOF
)
      ;;
    3)
      SOURCE="ad"
      PAYLOAD=$(cat <<EOF
{
  "tenant": "${TENANT}",
  "source": "ad",
  "event_id": 4625,
  "event_type": "LogonFailed",
  "user": "demo\\\\eve",
  "host": "DC01",
  "src_ip": "203.0.113.77",
  "logon_type": 3,
  "@timestamp": "${TIMESTAMP}"
}
EOF
)
      ;;
  esac

  # Send request and capture HTTP status code.
  HTTP_CODE=$(curl -sS -o /dev/null \
    -w "%{http_code}" \
    --connect-timeout 5 \
    --max-time 15 \
    -X POST "${ENDPOINT}" \
    -H "Content-Type: application/json" \
    -d "${PAYLOAD}") || HTTP_CODE="000"

  if [[ "$HTTP_CODE" =~ ^2[0-9][0-9]$ ]]; then
    ((SUCCESS += 1))
  else
    ((FAILED += 1))
    echo "[FAIL] Request ${i}/${TOTAL_REQUESTS} | tenant=${TENANT} | source=${SOURCE} | HTTP=${HTTP_CODE}"
  fi

  # Progress every 100 requests, and on the final request.
  if (( i % 100 == 0 || i == TOTAL_REQUESTS )); then
    echo "[PROGRESS] ${i}/${TOTAL_REQUESTS} | success=${SUCCESS} | failed=${FAILED}"
  fi
done

echo
echo "Seeding completed!"
echo "Endpoint: ${ENDPOINT}"
echo "Total requests: ${TOTAL_REQUESTS}"
echo "Successful: ${SUCCESS}"
echo "Failed: ${FAILED}"