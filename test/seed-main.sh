# #!/bin/bash

# # 1. URL ของ HTTP Server (แก้จาก /ingest เป็น / เพื่อให้ตรงกับ default ของ Vector)
# HTTP_URL="http://localhost:8080/"

# # 2. พอร์ตของ Network Syslog (UDP) ตามที่ตั้งไว้ใน [sources.network_syslog]
# SYSLOG_HOST="127.0.0.1"
# SYSLOG_PORT="514"

# ITERATIONS=${1:-5}

# # ==========================================
# # ชุดข้อมูลสำหรับสุ่ม (Arrays)
# # ==========================================
# TENANTS=("demoA" "demoB" "demoC" "demoD" "demoE" "demoF" "demoG" "demnoG")
# USERS=("alice" "bob" "charlie" "david" "eve" "admin" "root" "svc_backup" "john.doe")
# HOSTS=("WIN10-01" "WIN10-02" "WIN11-DEV" "SRV-WEB01" "SRV-DB01" "DC01" "DC02" "MAC-FIN01")
# STATUS_CODES=(200 201 301 302 400 401 403 404 422 429 500 502 503)

# random_elem() {
#   local arr=("$@")
#   echo "${arr[$RANDOM % ${#arr[@]}]}"
# }

# random_ip() {
#   echo "$((RANDOM % 223 + 1)).$((RANDOM % 256)).$((RANDOM % 256)).$((RANDOM % 254 + 1))"
# }

# random_mac() {
#   printf "%02x:%02x:%02x:%02x:%02x:%02x" $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256))
# }

# random_sha256() {
#   echo "$RANDOM-$(date +%s%N)" | shasum -a 256 | head -c 64
# }

# echo "=========================================================="
# echo " Starting Randomized Log Ingestion ($ITERATIONS rounds)"
# echo " HTTP Target  : $HTTP_URL"
# echo " Syslog Target: udp://$SYSLOG_HOST:$SYSLOG_PORT"
# echo "=========================================================="

# for ((i=1; i<=ITERATIONS; i++)); do
#   echo -e "\n------------------- [ Round $i / $ITERATIONS ] -------------------"
  
#   ISO_TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
#   SYSLOG_TS=$(date +"%b %d %H:%M:%S")

#   # ---------------------------------------------------------
#   # 4.1 Firewall/Syslog -> ยิงเข้า UDP 514
#   # ---------------------------------------------------------
#   FW_ACTIONS=("allow" "deny" "drop" "reset")
#   FW_PROTOS=("tcp" "udp" "icmp")
#   FW_MSGS=("DNS blocked" "Traffic allowed" "Port scan detected" "Malicious IP blocked")
#   FW_POLICIES=("Block-DNS" "Allow-Web" "Default-Deny" "IPS-Strict")
  
#   TENANT=$(random_elem "${TENANTS[@]}")
#   ACTION=$(random_elem "${FW_ACTIONS[@]}")
#   PROTO=$(random_elem "${FW_PROTOS[@]}")
#   SPT=$((RANDOM % 60000 + 1024))
#   DPT_LIST=(53 80 443 22 3389 8080 5353)
#   DPT=$(random_elem "${DPT_LIST[@]}")
#   MSG=$(random_elem "${FW_MSGS[@]}")
#   POLICY=$(random_elem "${FW_POLICIES[@]}")
#   STATUS_CODE=$(random_elem "${STATUS_CODES[@]}")

#   echo "[4.1] Firewall/Syslog -> UDP:$SYSLOG_PORT (tenant=$TENANT, action=$ACTION, status_code=$STATUS_CODE)"
#   echo -n "<134>$SYSLOG_TS fw0$((RANDOM % 3 + 1)) tenant=$TENANT vendor=demo product=ngfw action=$ACTION src=$(random_ip) dst=$(random_ip) spt=$SPT dpt=$DPT proto=$PROTO status_code=$STATUS_CODE msg=$MSG policy=$POLICY" | nc -u -w 1 $SYSLOG_HOST $SYSLOG_PORT

#   # ---------------------------------------------------------
#   # 4.2 Network (Router Syslog) -> ยิงเข้า UDP 514
#   # ---------------------------------------------------------
#   NET_EVENTS=("link-down" "link-up" "bgp-flap" "ospf-neighbor-down" "high-cpu")
#   NET_REASONS=("carrier-loss" "admin-down" "timeout" "cable-unplugged")
  
#   TENANT=$(random_elem "${TENANTS[@]}")
#   EVENT=$(random_elem "${NET_EVENTS[@]}")
#   REASON=$(random_elem "${NET_REASONS[@]}")
#   IFACE="ge-0/0/$((RANDOM % 24))"
#   STATUS_CODE=$(random_elem "${STATUS_CODES[@]}")

#   echo "[4.2] Network Syslog  -> UDP:$SYSLOG_PORT (tenant=$TENANT, if=$IFACE, event=$EVENT, status_code=$STATUS_CODE)"
#   echo -n "<190>$SYSLOG_TS r$((RANDOM % 5 + 1)) tenant=$TENANT vendor=cisco product=ios if=$IFACE action=$EVENT event=$EVENT src=$(random_ip) mac=$(random_mac) status_code=$STATUS_CODE reason=$REASON" | nc -u -w 1 $SYSLOG_HOST $SYSLOG_PORT

#   # ---------------------------------------------------------
#   # 4.3 HTTP API -> ยิงเข้า HTTP 8080 (/)
#   # ---------------------------------------------------------
#   API_EVENTS=("app_login_failed" "app_login_success" "token_expired" "rate_limit_exceeded" "unauthorized_access")
#   API_REASONS=("wrong_password" "user_not_found" "account_locked" "mfa_failed" "valid_credentials")
  
#   TENANT=$(random_elem "${TENANTS[@]}")
#   EVENT=$(random_elem "${API_EVENTS[@]}")
#   USER=$(random_elem "${USERS[@]}")
#   REASON=$(random_elem "${API_REASONS[@]}")
#   STATUS_CODE=$(random_elem "${STATUS_CODES[@]}")

#   echo -n "[4.3] HTTP API (tenant=$TENANT, event=$EVENT, status=$STATUS_CODE) -> "
#   curl -s -o /dev/null -w "HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
#     -H "Content-Type: application/json" \
#     -d "{
# \"tenant\":\"$TENANT\",
# \"source\":\"api\",
# \"vendor\":\"custom\",
# \"product\":\"login_service\",
# \"event_type\":\"$EVENT\",
# \"user\":\"$USER\",
# \"ip\":\"$(random_ip)\",
# \"status_code\":$STATUS_CODE,
# \"reason\":\"$REASON\",
# \"@timestamp\":\"$ISO_TS\"
# }"

#   # ---------------------------------------------------------
#   # 4.4 CrowdStrike (sample JSON) -> ยิงเข้า HTTP 8080 (/)
#   # ---------------------------------------------------------
#   CS_EVENTS=("malware_detected" "ransomware_blocked" "suspicious_powershell" "credential_dumping")
#   CS_PROCS=("powershell.exe" "cmd.exe" "mimikatz.exe" "svchost.exe" "rundll32.exe")
#   CS_ACTIONS=("quarantine" "blocked" "killed" "alert_only" "isolated")
  
#   TENANT=$(random_elem "${TENANTS[@]}")
#   EVENT=$(random_elem "${CS_EVENTS[@]}")
#   HOST=$(random_elem "${HOSTS[@]}")
#   PROC=$(random_elem "${CS_PROCS[@]}")
#   SEV=$((RANDOM % 10 + 1))
#   ACTION=$(random_elem "${CS_ACTIONS[@]}")
#   STATUS_CODE=$(random_elem "${STATUS_CODES[@]}")

#   echo -n "[4.4] CrowdStrike (tenant=$TENANT, host=$HOST, sev=$SEV, status=$STATUS_CODE) -> "
#   curl -s -o /dev/null -w "HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
#     -H "Content-Type: application/json" \
#     -d "{
# \"tenant\":\"$TENANT\",
# \"source\":\"crowdstrike\",
# \"vendor\":\"crowdstrike\",
# \"product\":\"falcon\",
# \"event_type\":\"$EVENT\",
# \"host\":\"$HOST\",
# \"process\":\"$PROC\",
# \"severity\":$SEV,
# \"sha256\":\"$(random_sha256)\",
# \"action\":\"$ACTION\",
# \"status_code\":$STATUS_CODE,
# \"@timestamp\":\"$ISO_TS\"
# }"

#   # ---------------------------------------------------------
#   # 4.5 AWS CloudTrail -> ยิงเข้า HTTP 8080 (/)
#   # ---------------------------------------------------------
#   AWS_SERVICES=("iam" "ec2" "s3" "rds" "lambda" "sts")
#   AWS_REGIONS=("ap-southeast-1" "ap-southeast-7" "us-east-1" "eu-west-1")
#   AWS_EVENTS=("CreateUser" "DeleteUser" "ConsoleLogin" "AuthorizeSecurityGroupIngress" "RunInstances")
  
#   TENANT=$(random_elem "${TENANTS[@]}")
#   SERVICE=$(random_elem "${AWS_SERVICES[@]}")
#   REGION=$(random_elem "${AWS_REGIONS[@]}")
#   EVENT=$(random_elem "${AWS_EVENTS[@]}")
#   USER=$(random_elem "${USERS[@]}")
#   TARGET_USER="temp-user-$((RANDOM % 999))"
#   ACC_ID="$((RANDOM % 899999 + 100000))$((RANDOM % 899999 + 100000))"
#   STATUS_CODE=$(random_elem "${STATUS_CODES[@]}")

#   echo -n "[4.5] AWS CloudTrail (tenant=$TENANT, service=$SERVICE, event=$EVENT, status=$STATUS_CODE) -> "
#   curl -s -o /dev/null -w "HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
#     -H "Content-Type: application/json" \
#     -d "{
# \"tenant\":\"$TENANT\",
# \"source\":\"aws\",
# \"vendor\":\"aws\",
# \"product\":\"cloudtrail\",
# \"cloud\":{\"service\":\"$SERVICE\",\"account_id\":\"$ACC_ID\",\"region\":\"$REGION\"},
# \"event_type\":\"$EVENT\",
# \"user\":\"$USER\",
# \"status_code\":$STATUS_CODE,
# \"@timestamp\":\"$ISO_TS\",
# \"raw\":{\"eventName\":\"$EVENT\",\"requestParameters\":{\"userName\":\"$TARGET_USER\"}}
# }"

#   # ---------------------------------------------------------
#   # 4.6 Microsoft 365 Audit -> ยิงเข้า HTTP 8080 (/)
#   # ---------------------------------------------------------
#   M365_EVENTS=("UserLoggedIn" "UserLoginFailed" "FileDownloaded" "FileDeleted" "MailboxLogin")
#   M365_STATUSES=("Success" "Failed" "PartiallySucceeded" "ClientError")
#   M365_WORKLOADS=("Exchange" "SharePoint" "OneDrive" "AzureActiveDirectory" "MicrosoftTeams")
  
#   TENANT=$(random_elem "${TENANTS[@]}")
#   EVENT=$(random_elem "${M365_EVENTS[@]}")
#   USER="$(random_elem "${USERS[@]}")@demo.local"
#   STATUS=$(random_elem "${M365_STATUSES[@]}")
#   WORKLOAD=$(random_elem "${M365_WORKLOADS[@]}")
#   STATUS_CODE=$(random_elem "${STATUS_CODES[@]}")

#   echo -n "[4.6] M365 Audit (tenant=$TENANT, workload=$WORKLOAD, status=$STATUS_CODE) -> "
#   curl -s -o /dev/null -w "HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
#     -H "Content-Type: application/json" \
#     -d "{
# \"tenant\":\"$TENANT\",
# \"source\":\"m365\",
# \"vendor\":\"microsoft\",
# \"product\":\"m365\",
# \"event_type\":\"$EVENT\",
# \"user\":\"$USER\",
# \"ip\":\"$(random_ip)\",
# \"status\":\"$STATUS\",
# \"status_code\":$STATUS_CODE,
# \"workload\":\"$WORKLOAD\",
# \"@timestamp\":\"$ISO_TS\"
# }"

#   # ---------------------------------------------------------
#   # 4.7 Microsoft AD/Windows Security -> ยิงเข้า HTTP 8080 (/)
#   # ---------------------------------------------------------
#   AD_EVENT_IDS=(4624 4625 4720 4726 4740 4688)
#   AD_LOGON_TYPES=(2 3 4 5 7 10)
  
#   TENANT=$(random_elem "${TENANTS[@]}")
#   EVENT_ID=$(random_elem "${AD_EVENT_IDS[@]}")
  
#   if [ "$EVENT_ID" -eq 4624 ]; then
#     EVENT_TYPE="LogonSuccess"
#     STATUS_CODE=200
#   elif [ "$EVENT_ID" -eq 4625 ]; then
#     EVENT_TYPE="LogonFailed"
#     STATUS_CODE=401
#   elif [ "$EVENT_ID" -eq 4740 ]; then
#     EVENT_TYPE="AccountLockedOut"
#     STATUS_CODE=403
#   else
#     EVENT_TYPE="SecurityEvent"
#     STATUS_CODE=$(random_elem "${STATUS_CODES[@]}")
#   fi

#   USER=$(random_elem "${USERS[@]}")
#   HOST=$(random_elem "${HOSTS[@]}")
#   LOGON_TYPE=$(random_elem "${AD_LOGON_TYPES[@]}")

#   echo -n "[4.7] AD Security (tenant=$TENANT, event_id=$EVENT_ID, status=$STATUS_CODE) -> "
#   curl -s -o /dev/null -w "HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
#     -H "Content-Type: application/json" \
#     -d "{
# \"tenant\":\"$TENANT\",
# \"source\":\"ad\",
# \"vendor\":\"microsoft\",
# \"product\":\"active_directory\",
# \"event_id\":$EVENT_ID,
# \"event_type\":\"$EVENT_TYPE\",
# \"user\":\"demo\\\\$USER\",
# \"host\":\"$HOST\",
# \"ip\":\"$(random_ip)\",
# \"logon_type\":$LOGON_TYPE,
# \"status_code\":$STATUS_CODE,
# \"@timestamp\":\"$ISO_TS\"
# }"

#   sleep 0.5
# done

# echo -e "\n=========================================================="
# echo " Completed sending $((ITERATIONS * 7)) random log events!"
# echo "=========================================================="









# #!/bin/bash

# # 1. URL ของ HTTP Server
# HTTP_URL="http://localhost:8080/"

# # 2. พอร์ตของ Network Syslog (UDP)
# SYSLOG_HOST="127.0.0.1"
# SYSLOG_PORT="514"

# ITERATIONS=${1:-5}

# # ==========================================
# # ชุดข้อมูลสำหรับสุ่ม (Arrays) - ย้ายมาประกาศนอกลูปทั้งหมดเพื่อความเร็ว
# # ==========================================
# TENANTS=("demoA" "demoB" "demoC" "demoD" "demoE" "demoF" "demoG" "demnoG")
# USERS=("alice" "bob" "charlie" "david" "eve" "admin" "root" "svc_backup" "john.doe")
# HOSTS=("WIN10-01" "WIN10-02" "WIN11-DEV" "SRV-WEB01" "SRV-DB01" "DC01" "DC02" "MAC-FIN01")
# STATUS_CODES=(200 201 301 302 400 401 403 404 422 429 500 502 503)

# FW_ACTIONS=("allow" "deny" "drop" "reset")
# FW_PROTOS=("tcp" "udp" "icmp")
# FW_MSGS=("DNS blocked" "Traffic allowed" "Port scan detected" "Malicious IP blocked")
# FW_POLICIES=("Block-DNS" "Allow-Web" "Default-Deny" "IPS-Strict")
# DPT_LIST=(53 80 443 22 3389 8080 5353)

# NET_EVENTS=("link-down" "link-up" "bgp-flap" "ospf-neighbor-down" "high-cpu")
# NET_REASONS=("carrier-loss" "admin-down" "timeout" "cable-unplugged")

# API_EVENTS=("app_login_failed" "app_login_success" "token_expired" "rate_limit_exceeded" "unauthorized_access")
# API_REASONS=("wrong_password" "user_not_found" "account_locked" "mfa_failed" "valid_credentials")

# CS_EVENTS=("malware_detected" "ransomware_blocked" "suspicious_powershell" "credential_dumping")
# CS_PROCS=("powershell.exe" "cmd.exe" "mimikatz.exe" "svchost.exe" "rundll32.exe")
# CS_ACTIONS=("quarantine" "blocked" "killed" "alert_only" "isolated")

# AWS_SERVICES=("iam" "ec2" "s3" "rds" "lambda" "sts")
# AWS_REGIONS=("ap-southeast-1" "ap-southeast-7" "us-east-1" "eu-west-1")
# AWS_EVENTS=("CreateUser" "DeleteUser" "ConsoleLogin" "AuthorizeSecurityGroupIngress" "RunInstances")

# M365_EVENTS=("UserLoggedIn" "UserLoginFailed" "FileDownloaded" "FileDeleted" "MailboxLogin")
# M365_STATUSES=("Success" "Failed" "PartiallySucceeded" "ClientError")
# M365_WORKLOADS=("Exchange" "SharePoint" "OneDrive" "AzureActiveDirectory" "MicrosoftTeams")

# AD_EVENT_IDS=(4624 4625 4720 4726 4740 4688)
# AD_LOGON_TYPES=(2 3 4 5 7 10)

# random_ip() {
#   echo "$((RANDOM % 223 + 1)).$((RANDOM % 256)).$((RANDOM % 256)).$((RANDOM % 254 + 1))"
# }

# random_mac() {
#   printf "%02x:%02x:%02x:%02x:%02x:%02x" $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256))
# }

# # สร้าง SHA256 ด้วย printf ในตัวของ Bash (เร็วกว่าเรียก shasum หลายสิบเท่า)
# random_sha256() {
#   printf "%08x%08x%08x%08x%08x%08x%08x%08x" $RANDOM $RANDOM $RANDOM $RANDOM $RANDOM $RANDOM $RANDOM $RANDOM
# }

# echo "=========================================================="
# echo " Starting TURBO Randomized Log Ingestion ($ITERATIONS rounds)"
# echo " HTTP Target  : $HTTP_URL"
# echo " Syslog Target: udp://$SYSLOG_HOST:$SYSLOG_PORT"
# echo "=========================================================="

# # ดึงเวลาเริ่มต้นครั้งเดียวเพื่อลดการเรียกคำสั่ง date ซ้ำๆ
# ISO_TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
# SYSLOG_TS=$(date +"%b %d %H:%M:%S")

# for ((i=1; i<=ITERATIONS; i++)); do
#   echo -e "\n------------------- [ Round $i / $ITERATIONS ] -------------------"

#   # ---------------------------------------------------------
#   # 4.1 Firewall/Syslog -> ยิงเข้า UDP 514 (ใช้ -w 0 ไม่ต้องรอ 1 วินาที)
#   # ---------------------------------------------------------
#   TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
#   ACTION=${FW_ACTIONS[$RANDOM % ${#FW_ACTIONS[@]}]}
#   PROTO=${FW_PROTOS[$RANDOM % ${#FW_PROTOS[@]}]}
#   SPT=$((RANDOM % 60000 + 1024))
#   DPT=${DPT_LIST[$RANDOM % ${#DPT_LIST[@]}]}
#   MSG=${FW_MSGS[$RANDOM % ${#FW_MSGS[@]}]}
#   POLICY=${FW_POLICIES[$RANDOM % ${#FW_POLICIES[@]}]}
#   STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

#   echo "[4.1] Firewall/Syslog -> UDP:$SYSLOG_PORT (tenant=$TENANT, action=$ACTION, status_code=$STATUS_CODE)"
#   echo -n "<134>$SYSLOG_TS fw0$((RANDOM % 3 + 1)) tenant=$TENANT vendor=demo product=ngfw action=$ACTION src=$(random_ip) dst=$(random_ip) spt=$SPT dpt=$DPT proto=$PROTO status_code=$STATUS_CODE msg=$MSG policy=$POLICY" | nc -u -w 0 $SYSLOG_HOST $SYSLOG_PORT &

#   # ---------------------------------------------------------
#   # 4.2 Network (Router Syslog) -> ยิงเข้า UDP 514 (ใช้ -w 0)
#   # ---------------------------------------------------------
#   TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
#   EVENT=${NET_EVENTS[$RANDOM % ${#NET_EVENTS[@]}]}
#   REASON=${NET_REASONS[$RANDOM % ${#NET_REASONS[@]}]}
#   IFACE="ge-0/0/$((RANDOM % 24))"
#   STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

#   echo "[4.2] Network Syslog  -> UDP:$SYSLOG_PORT (tenant=$TENANT, if=$IFACE, event=$EVENT, status_code=$STATUS_CODE)"
#   echo -n "<190>$SYSLOG_TS r$((RANDOM % 5 + 1)) tenant=$TENANT vendor=cisco product=ios if=$IFACE action=$EVENT event=$EVENT src=$(random_ip) mac=$(random_mac) status_code=$STATUS_CODE reason=$REASON" | nc -u -w 0 $SYSLOG_HOST $SYSLOG_PORT &

#   # ---------------------------------------------------------
#   # 4.3 HTTP API -> ยิงเข้า HTTP 8080 (/)
#   # ---------------------------------------------------------
#   TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
#   EVENT=${API_EVENTS[$RANDOM % ${#API_EVENTS[@]}]}
#   USER=${USERS[$RANDOM % ${#USERS[@]}]}
#   REASON=${API_REASONS[$RANDOM % ${#API_REASONS[@]}]}
#   STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

#   curl -s -o /dev/null -w "[4.3] HTTP API (tenant=$TENANT, event=$EVENT, status=$STATUS_CODE) -> HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
#     -H "Content-Type: application/json" \
#     -d "{\"tenant\":\"$TENANT\",\"source\":\"api\",\"vendor\":\"custom\",\"product\":\"login_service\",\"event_type\":\"$EVENT\",\"user\":\"$USER\",\"ip\":\"$(random_ip)\",\"status_code\":$STATUS_CODE,\"reason\":\"$REASON\",\"@timestamp\":\"$ISO_TS\"}" &

#   # ---------------------------------------------------------
#   # 4.4 CrowdStrike (sample JSON) -> ยิงเข้า HTTP 8080 (/)
#   # ---------------------------------------------------------
#   TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
#   EVENT=${CS_EVENTS[$RANDOM % ${#CS_EVENTS[@]}]}
#   HOST=${HOSTS[$RANDOM % ${#HOSTS[@]}]}
#   PROC=${CS_PROCS[$RANDOM % ${#CS_PROCS[@]}]}
#   SEV=$((RANDOM % 10 + 1))
#   ACTION=${CS_ACTIONS[$RANDOM % ${#CS_ACTIONS[@]}]}
#   STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

#   curl -s -o /dev/null -w "[4.4] CrowdStrike (tenant=$TENANT, host=$HOST, sev=$SEV, status=$STATUS_CODE) -> HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
#     -H "Content-Type: application/json" \
#     -d "{\"tenant\":\"$TENANT\",\"source\":\"crowdstrike\",\"vendor\":\"crowdstrike\",\"product\":\"falcon\",\"event_type\":\"$EVENT\",\"host\":\"$HOST\",\"process\":\"$PROC\",\"severity\":$SEV,\"sha256\":\"$(random_sha256)\",\"action\":\"$ACTION\",\"status_code\":$STATUS_CODE,\"@timestamp\":\"$ISO_TS\"}" &

#   # ---------------------------------------------------------
#   # 4.5 AWS CloudTrail -> ยิงเข้า HTTP 8080 (/)
#   # ---------------------------------------------------------
#   TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
#   SERVICE=${AWS_SERVICES[$RANDOM % ${#AWS_SERVICES[@]}]}
#   REGION=${AWS_REGIONS[$RANDOM % ${#AWS_REGIONS[@]}]}
#   EVENT=${AWS_EVENTS[$RANDOM % ${#AWS_EVENTS[@]}]}
#   USER=${USERS[$RANDOM % ${#USERS[@]}]}
#   TARGET_USER="temp-user-$((RANDOM % 999))"
#   ACC_ID="$((RANDOM % 899999 + 100000))$((RANDOM % 899999 + 100000))"
#   STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

#   curl -s -o /dev/null -w "[4.5] AWS CloudTrail (tenant=$TENANT, service=$SERVICE, event=$EVENT, status=$STATUS_CODE) -> HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
#     -H "Content-Type: application/json" \
#     -d "{\"tenant\":\"$TENANT\",\"source\":\"aws\",\"vendor\":\"aws\",\"product\":\"cloudtrail\",\"cloud\":{\"service\":\"$SERVICE\",\"account_id\":\"$ACC_ID\",\"region\":\"$REGION\"},\"event_type\":\"$EVENT\",\"user\":\"$USER\",\"status_code\":$STATUS_CODE,\"@timestamp\":\"$ISO_TS\",\"raw\":{\"eventName\":\"$EVENT\",\"requestParameters\":{\"userName\":\"$TARGET_USER\"}}}" &

#   # ---------------------------------------------------------
#   # 4.6 Microsoft 365 Audit -> ยิงเข้า HTTP 8080 (/)
#   # ---------------------------------------------------------
#   TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
#   EVENT=${M365_EVENTS[$RANDOM % ${#M365_EVENTS[@]}]}
#   USER="${USERS[$RANDOM % ${#USERS[@]}]}@demo.local"
#   STATUS=${M365_STATUSES[$RANDOM % ${#M365_STATUSES[@]}]}
#   WORKLOAD=${M365_WORKLOADS[$RANDOM % ${#M365_WORKLOADS[@]}]}
#   STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

#   curl -s -o /dev/null -w "[4.6] M365 Audit (tenant=$TENANT, workload=$WORKLOAD, status=$STATUS_CODE) -> HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
#     -H "Content-Type: application/json" \
#     -d "{\"tenant\":\"$TENANT\",\"source\":\"m365\",\"vendor\":\"microsoft\",\"product\":\"m365\",\"event_type\":\"$EVENT\",\"user\":\"$USER\",\"ip\":\"$(random_ip)\",\"status\":\"$STATUS\",\"status_code\":$STATUS_CODE,\"workload\":\"$WORKLOAD\",\"@timestamp\":\"$ISO_TS\"}" &

#   # ---------------------------------------------------------
#   # 4.7 Microsoft AD/Windows Security -> ยิงเข้า HTTP 8080 (/)
#   # ---------------------------------------------------------
#   TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
#   EVENT_ID=${AD_EVENT_IDS[$RANDOM % ${#AD_EVENT_IDS[@]}]}
  
#   if [ "$EVENT_ID" -eq 4624 ]; then
#     EVENT_TYPE="LogonSuccess"
#     STATUS_CODE=200
#   elif [ "$EVENT_ID" -eq 4625 ]; then
#     EVENT_TYPE="LogonFailed"
#     STATUS_CODE=401
#   elif [ "$EVENT_ID" -eq 4740 ]; then
#     EVENT_TYPE="AccountLockedOut"
#     STATUS_CODE=403
#   else
#     EVENT_TYPE="SecurityEvent"
#     STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}
#   fi

#   USER=${USERS[$RANDOM % ${#USERS[@]}]}
#   HOST=${HOSTS[$RANDOM % ${#HOSTS[@]}]}
#   LOGON_TYPE=${AD_LOGON_TYPES[$RANDOM % ${#AD_LOGON_TYPES[@]}]}

#   curl -s -o /dev/null -w "[4.7] AD Security (tenant=$TENANT, event_id=$EVENT_ID, status=$STATUS_CODE) -> HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
#     -H "Content-Type: application/json" \
#     -d "{\"tenant\":\"$TENANT\",\"source\":\"ad\",\"vendor\":\"microsoft\",\"product\":\"active_directory\",\"event_id\":$EVENT_ID,\"event_type\":\"$EVENT_TYPE\",\"user\":\"demo\\\\$USER\",\"host\":\"$HOST\",\"ip\":\"$(random_ip)\",\"logon_type\":$LOGON_TYPE,\"status_code\":$STATUS_CODE,\"@timestamp\":\"$ISO_TS\"}" &

#   # รอให้ทั้ง 7 ข้อในรอบนี้ยิงเสร็จพร้อมกัน (ใช้เวลาแค่ ~0.05 วินาที) แล้วขึ้นรอบใหม่ทันที
#   wait
# done

# echo -e "\n=========================================================="
# echo " Completed sending $((ITERATIONS * 7)) random log events!"
# echo "=========================================================="






# #!/bin/bash

# # 1. URL ของ HTTP Server
# HTTP_URL="http://localhost:8080/"

# # 2. พอร์ตของ Network Syslog (UDP)
# SYSLOG_HOST="127.0.0.1"
# SYSLOG_PORT="514"

# ITERATIONS=${1:-5}

# # ==========================================
# # ชุดข้อมูลสำหรับสุ่ม (Arrays)
# # ==========================================
# TENANTS=("demoA" "demoB" "demoC" "demoD" "demoE" "demoF" "demoG" "demnoG")
# USERS=("alice" "bob" "charlie" "david" "eve" "admin" "root" "svc_backup" "john.doe")
# HOSTS=("WIN10-01" "WIN10-02" "WIN11-DEV" "SRV-WEB01" "SRV-DB01" "DC01" "DC02" "MAC-FIN01")
# STATUS_CODES=(200 201 301 302 400 401 403 404 422 429 500 502 503)

# FW_ACTIONS=("allow" "deny" "drop" "reset")
# FW_PROTOS=("tcp" "udp" "icmp")
# FW_MSGS=("DNS blocked" "Traffic allowed" "Port scan detected" "Malicious IP blocked")
# FW_POLICIES=("Block-DNS" "Allow-Web" "Default-Deny" "IPS-Strict")
# DPT_LIST=(53 80 443 22 3389 8080 5353)

# NET_EVENTS=("link-down" "link-up" "bgp-flap" "ospf-neighbor-down" "high-cpu")
# NET_REASONS=("carrier-loss" "admin-down" "timeout" "cable-unplugged")

# API_EVENTS=("app_login_failed" "app_login_success" "token_expired" "rate_limit_exceeded" "unauthorized_access")
# API_REASONS=("wrong_password" "user_not_found" "account_locked" "mfa_failed" "valid_credentials")

# CS_EVENTS=("malware_detected" "ransomware_blocked" "suspicious_powershell" "credential_dumping")
# CS_PROCS=("powershell.exe" "cmd.exe" "mimikatz.exe" "svchost.exe" "rundll32.exe")
# CS_ACTIONS=("quarantine" "blocked" "killed" "alert_only" "isolated")

# AWS_SERVICES=("iam" "ec2" "s3" "rds" "lambda" "sts")
# AWS_REGIONS=("ap-southeast-1" "ap-southeast-7" "us-east-1" "eu-west-1")
# AWS_EVENTS=("CreateUser" "DeleteUser" "ConsoleLogin" "AuthorizeSecurityGroupIngress" "RunInstances")

# M365_EVENTS=("UserLoggedIn" "UserLoginFailed" "FileDownloaded" "FileDeleted" "MailboxLogin")
# M365_STATUSES=("Success" "Failed" "PartiallySucceeded" "ClientError")
# M365_WORKLOADS=("Exchange" "SharePoint" "OneDrive" "AzureActiveDirectory" "MicrosoftTeams")

# AD_EVENT_IDS=(4624 4625 4720 4726 4740 4688)
# AD_LOGON_TYPES=(2 3 4 5 7 10)

# # ---------------------------------------------------------
# # ฟังก์ชันสุ่ม IP (โอกาสใช้ IP ซ้ำจาก Pool เดิม 60% / สุ่มใหม่ 40%)
# # ---------------------------------------------------------
# FREQUENT_IPS=("203.0.113.7" "198.51.100.23" "10.0.1.10" "192.168.1.100" "172.16.0.50" "203.0.113.77" "10.10.10.5")

# random_ip() {
#   local roll=$((RANDOM % 100 + 1))
#   if [ $roll -le 60 ]; then
#     # โอกาส 60% เลือก IP ซ้ำจาก Pool ที่กำหนด
#     echo "${FREQUENT_IPS[$RANDOM % ${#FREQUENT_IPS[@]}]}"
#   else
#     # โอกาส 40% สุ่ม IP ใหม่
#     echo "$((RANDOM % 223 + 1)).$((RANDOM % 256)).$((RANDOM % 256)).$((RANDOM % 254 + 1))"
#   fi
# }

# random_mac() {
#   printf "%02x:%02x:%02x:%02x:%02x:%02x" $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256))
# }

# random_sha256() {
#   printf "%08x%08x%08x%08x%08x%08x%08x%08x" $RANDOM $RANDOM $RANDOM $RANDOM $RANDOM $RANDOM $RANDOM $RANDOM
# }

# echo "=========================================================="
# echo " Starting TURBO Log Ingestion with 60% IP Reuse ($ITERATIONS rounds)"
# echo " HTTP Target  : $HTTP_URL"
# echo " Syslog Target: udp://$SYSLOG_HOST:$SYSLOG_PORT"
# echo "=========================================================="

# ISO_TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
# SYSLOG_TS=$(date +"%b %d %H:%M:%S")

# for ((i=1; i<=ITERATIONS; i++)); do
#   echo -e "\n------------------- [ Round $i / $ITERATIONS ] -------------------"

#   # 4.1 Firewall/Syslog
#   TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
#   ACTION=${FW_ACTIONS[$RANDOM % ${#FW_ACTIONS[@]}]}
#   PROTO=${FW_PROTOS[$RANDOM % ${#FW_PROTOS[@]}]}
#   SPT=$((RANDOM % 60000 + 1024))
#   DPT=${DPT_LIST[$RANDOM % ${#DPT_LIST[@]}]}
#   MSG=${FW_MSGS[$RANDOM % ${#FW_MSGS[@]}]}
#   POLICY=${FW_POLICIES[$RANDOM % ${#FW_POLICIES[@]}]}
#   STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

#   echo "[4.1] Firewall/Syslog -> UDP:$SYSLOG_PORT (tenant=$TENANT, action=$ACTION, status_code=$STATUS_CODE)"
#   echo -n "<134>$SYSLOG_TS fw0$((RANDOM % 3 + 1)) tenant=$TENANT vendor=demo product=ngfw action=$ACTION src=$(random_ip) dst=$(random_ip) spt=$SPT dpt=$DPT proto=$PROTO status_code=$STATUS_CODE msg=$MSG policy=$POLICY" | nc -u -w 0 $SYSLOG_HOST $SYSLOG_PORT &

#   # 4.2 Network Syslog
#   TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
#   EVENT=${NET_EVENTS[$RANDOM % ${#NET_EVENTS[@]}]}
#   REASON=${NET_REASONS[$RANDOM % ${#NET_REASONS[@]}]}
#   IFACE="ge-0/0/$((RANDOM % 24))"
#   STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

#   echo "[4.2] Network Syslog  -> UDP:$SYSLOG_PORT (tenant=$TENANT, if=$IFACE, event=$EVENT, status_code=$STATUS_CODE)"
#   echo -n "<190>$SYSLOG_TS r$((RANDOM % 5 + 1)) tenant=$TENANT vendor=cisco product=ios if=$IFACE action=$EVENT event=$EVENT src=$(random_ip) mac=$(random_mac) status_code=$STATUS_CODE reason=$REASON" | nc -u -w 0 $SYSLOG_HOST $SYSLOG_PORT &

#   # 4.3 HTTP API
#   TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
#   EVENT=${API_EVENTS[$RANDOM % ${#API_EVENTS[@]}]}
#   USER=${USERS[$RANDOM % ${#USERS[@]}]}
#   REASON=${API_REASONS[$RANDOM % ${#API_REASONS[@]}]}
#   STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

#   curl -s -o /dev/null -w "[4.3] HTTP API (tenant=$TENANT, event=$EVENT, status=$STATUS_CODE) -> HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
#     -H "Content-Type: application/json" \
#     -d "{\"tenant\":\"$TENANT\",\"source\":\"api\",\"vendor\":\"custom\",\"product\":\"login_service\",\"event_type\":\"$EVENT\",\"user\":\"$USER\",\"ip\":\"$(random_ip)\",\"status_code\":$STATUS_CODE,\"reason\":\"$REASON\",\"@timestamp\":\"$ISO_TS\"}" &

#   # 4.4 CrowdStrike (ไม่มี IP ตามโจทย์ต้นฉบับ)
#   TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
#   EVENT=${CS_EVENTS[$RANDOM % ${#CS_EVENTS[@]}]}
#   HOST=${HOSTS[$RANDOM % ${#HOSTS[@]}]}
#   PROC=${CS_PROCS[$RANDOM % ${#CS_PROCS[@]}]}
#   SEV=$((RANDOM % 10 + 1))
#   ACTION=${CS_ACTIONS[$RANDOM % ${#CS_ACTIONS[@]}]}
#   STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

#   curl -s -o /dev/null -w "[4.4] CrowdStrike (tenant=$TENANT, host=$HOST, sev=$SEV, status=$STATUS_CODE) -> HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
#     -H "Content-Type: application/json" \
#     -d "{\"tenant\":\"$TENANT\",\"source\":\"crowdstrike\",\"vendor\":\"crowdstrike\",\"product\":\"falcon\",\"event_type\":\"$EVENT\",\"host\":\"$HOST\",\"process\":\"$PROC\",\"severity\":$SEV,\"sha256\":\"$(random_sha256)\",\"action\":\"$ACTION\",\"status_code\":$STATUS_CODE,\"@timestamp\":\"$ISO_TS\"}" &

#   # 4.5 AWS CloudTrail (ไม่มี IP ตามโจทย์ต้นฉบับ)
#   TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
#   SERVICE=${AWS_SERVICES[$RANDOM % ${#AWS_SERVICES[@]}]}
#   REGION=${AWS_REGIONS[$RANDOM % ${#AWS_REGIONS[@]}]}
#   EVENT=${AWS_EVENTS[$RANDOM % ${#AWS_EVENTS[@]}]}
#   USER=${USERS[$RANDOM % ${#USERS[@]}]}
#   TARGET_USER="temp-user-$((RANDOM % 999))"
#   ACC_ID="$((RANDOM % 899999 + 100000))$((RANDOM % 899999 + 100000))"
#   STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

#   curl -s -o /dev/null -w "[4.5] AWS CloudTrail (tenant=$TENANT, service=$SERVICE, event=$EVENT, status=$STATUS_CODE) -> HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
#     -H "Content-Type: application/json" \
#     -d "{\"tenant\":\"$TENANT\",\"source\":\"aws\",\"vendor\":\"aws\",\"product\":\"cloudtrail\",\"cloud\":{\"service\":\"$SERVICE\",\"account_id\":\"$ACC_ID\",\"region\":\"$REGION\"},\"event_type\":\"$EVENT\",\"user\":\"$USER\",\"status_code\":$STATUS_CODE,\"@timestamp\":\"$ISO_TS\",\"raw\":{\"eventName\":\"$EVENT\",\"requestParameters\":{\"userName\":\"$TARGET_USER\"}}}" &

#   # 4.6 M365 Audit
#   TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
#   EVENT=${M365_EVENTS[$RANDOM % ${#M365_EVENTS[@]}]}
#   USER="${USERS[$RANDOM % ${#USERS[@]}]}@demo.local"
#   STATUS=${M365_STATUSES[$RANDOM % ${#M365_STATUSES[@]}]}
#   WORKLOAD=${M365_WORKLOADS[$RANDOM % ${#M365_WORKLOADS[@]}]}
#   STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

#   curl -s -o /dev/null -w "[4.6] M365 Audit (tenant=$TENANT, workload=$WORKLOAD, status=$STATUS_CODE) -> HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
#     -H "Content-Type: application/json" \
#     -d "{\"tenant\":\"$TENANT\",\"source\":\"m365\",\"vendor\":\"microsoft\",\"product\":\"m365\",\"event_type\":\"$EVENT\",\"user\":\"$USER\",\"ip\":\"$(random_ip)\",\"status\":\"$STATUS\",\"status_code\":$STATUS_CODE,\"workload\":\"$WORKLOAD\",\"@timestamp\":\"$ISO_TS\"}" &

#   # 4.7 Microsoft AD/Windows Security
#   TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
#   EVENT_ID=${AD_EVENT_IDS[$RANDOM % ${#AD_EVENT_IDS[@]}]}
  
#   if [ "$EVENT_ID" -eq 4624 ]; then
#     EVENT_TYPE="LogonSuccess"
#     STATUS_CODE=200
#   elif [ "$EVENT_ID" -eq 4625 ]; then
#     EVENT_TYPE="LogonFailed"
#     STATUS_CODE=401
#   elif [ "$EVENT_ID" -eq 4740 ]; then
#     EVENT_TYPE="AccountLockedOut"
#     STATUS_CODE=403
#   else
#     EVENT_TYPE="SecurityEvent"
#     STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}
#   fi

#   USER=${USERS[$RANDOM % ${#USERS[@]}]}
#   HOST=${HOSTS[$RANDOM % ${#HOSTS[@]}]}
#   LOGON_TYPE=${AD_LOGON_TYPES[$RANDOM % ${#AD_LOGON_TYPES[@]}]}

#   curl -s -o /dev/null -w "[4.7] AD Security (tenant=$TENANT, event_id=$EVENT_ID, status=$STATUS_CODE) -> HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
#     -H "Content-Type: application/json" \
#     -d "{\"tenant\":\"$TENANT\",\"source\":\"ad\",\"vendor\":\"microsoft\",\"product\":\"active_directory\",\"event_id\":$EVENT_ID,\"event_type\":\"$EVENT_TYPE\",\"user\":\"demo\\\\$USER\",\"host\":\"$HOST\",\"ip\":\"$(random_ip)\",\"logon_type\":$LOGON_TYPE,\"status_code\":$STATUS_CODE,\"@timestamp\":\"$ISO_TS\"}" &

#   # รอให้ทุกข้อในรอบนี้ส่งออกไปพร้อมกันทันที
#   wait
# done

# echo -e "\n=========================================================="
# echo " Completed sending $((ITERATIONS * 7)) random log events!"
# echo "=========================================================="







#!/bin/bash

# 1. URL ของ HTTP Server
HTTP_URL="http://localhost:8080/ingest"

# 2. พอร์ตของ Network Syslog (UDP)
SYSLOG_HOST="127.0.0.1"
SYSLOG_PORT="514"

ITERATIONS=${1:-5}

# ==========================================
# ชุดข้อมูลสำหรับสุ่ม (Arrays)
# ==========================================
TENANTS=("demoA" "demoB" "demoC" "demoD" "demoE" "demoF" "demoG" "demnoG")
USERS=("alice" "bob" "charlie" "david" "eve" "admin" "root" "svc_backup" "john.doe")
HOSTS=("WIN10-01" "WIN10-02" "WIN11-DEV" "SRV-WEB01" "SRV-DB01" "DC01" "DC02" "MAC-FIN01")
STATUS_CODES=(200 201 301 302 400 401 403 404 422 429 500 502 503)

FW_ACTIONS=("allow" "deny" "drop" "reset")
FW_PROTOS=("tcp" "udp" "icmp")
FW_MSGS=("DNS blocked" "Traffic allowed" "Port scan detected" "Malicious IP blocked")
FW_POLICIES=("Block-DNS" "Allow-Web" "Default-Deny" "IPS-Strict")
DPT_LIST=(53 80 443 22 3389 8080 5353)

NET_EVENTS=("link-down" "link-up" "bgp-flap" "ospf-neighbor-down" "high-cpu")
NET_REASONS=("carrier-loss" "admin-down" "timeout" "cable-unplugged")

API_EVENTS=("app_login_failed" "app_login_success" "token_expired" "rate_limit_exceeded" "unauthorized_access")
API_REASONS=("wrong_password" "user_not_found" "account_locked" "mfa_failed" "valid_credentials")

CS_EVENTS=("malware_detected" "ransomware_blocked" "suspicious_powershell" "credential_dumping")
CS_PROCS=("powershell.exe" "cmd.exe" "mimikatz.exe" "svchost.exe" "rundll32.exe")
CS_ACTIONS=("quarantine" "blocked" "killed" "alert_only" "isolated")

AWS_SERVICES=("iam" "ec2" "s3" "rds" "lambda" "sts")
AWS_REGIONS=("ap-southeast-1" "ap-southeast-7" "us-east-1" "eu-west-1")
AWS_EVENTS=("CreateUser" "DeleteUser" "ConsoleLogin" "AuthorizeSecurityGroupIngress" "RunInstances")

M365_EVENTS=("UserLoggedIn" "UserLoginFailed" "FileDownloaded" "FileDeleted" "MailboxLogin")
M365_STATUSES=("Success" "Failed" "PartiallySucceeded" "ClientError")
M365_WORKLOADS=("Exchange" "SharePoint" "OneDrive" "AzureActiveDirectory" "MicrosoftTeams")

AD_EVENT_IDS=(4624 4625 4720 4726 4740 4688)
AD_LOGON_TYPES=(2 3 4 5 7 10)

# ---------------------------------------------------------
# ฟังก์ชันสุ่ม IP (โอกาสใช้ IP ซ้ำจาก Pool เดิม 60% / สุ่มใหม่ 40%)
# ---------------------------------------------------------
FREQUENT_IPS=("203.0.113.7" "198.51.100.23" "10.0.1.10" "192.168.1.100" "172.16.0.50" "203.0.113.77" "10.10.10.5")

random_ip() {
  local roll=$((RANDOM % 100 + 1))
  if [ $roll -le 60 ]; then
    echo "${FREQUENT_IPS[$RANDOM % ${#FREQUENT_IPS[@]}]}"
  else
    echo "$((RANDOM % 223 + 1)).$((RANDOM % 256)).$((RANDOM % 256)).$((RANDOM % 254 + 1))"
  fi
}

random_mac() {
  printf "%02x:%02x:%02x:%02x:%02x:%02x" $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256)) $((RANDOM%256))
}

random_sha256() {
  printf "%08x%08x%08x%08x%08x%08x%08x%08x" $RANDOM $RANDOM $RANDOM $RANDOM $RANDOM $RANDOM $RANDOM $RANDOM
}

echo "=========================================================="
echo " Starting TURBO Log Ingestion with 60% IP Reuse ($ITERATIONS rounds)"
echo " HTTP Target  : $HTTP_URL"
echo " Syslog Target: udp://$SYSLOG_HOST:$SYSLOG_PORT"
echo "=========================================================="

ISO_TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SYSLOG_TS=$(date +"%b %d %H:%M:%S")

for ((i=1; i<=ITERATIONS; i++)); do
  echo -e "\n------------------- [ Round $i / $ITERATIONS ] -------------------"

  # 4.1 Firewall/Syslog
  TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
  ACTION=${FW_ACTIONS[$RANDOM % ${#FW_ACTIONS[@]}]}
  PROTO=${FW_PROTOS[$RANDOM % ${#FW_PROTOS[@]}]}
  SPT=$((RANDOM % 60000 + 1024))
  DPT=${DPT_LIST[$RANDOM % ${#DPT_LIST[@]}]}
  MSG=${FW_MSGS[$RANDOM % ${#FW_MSGS[@]}]}
  POLICY=${FW_POLICIES[$RANDOM % ${#FW_POLICIES[@]}]}
  STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

  echo "[4.1] Firewall/Syslog -> UDP:$SYSLOG_PORT (tenant=$TENANT, action=$ACTION, status_code=$STATUS_CODE)"
  echo -n "<134>$SYSLOG_TS fw0$((RANDOM % 3 + 1)) tenant=$TENANT vendor=demo product=ngfw action=$ACTION src=$(random_ip) dst=$(random_ip) spt=$SPT dpt=$DPT proto=$PROTO status_code=$STATUS_CODE msg=$MSG policy=$POLICY" | nc -u -w 0 $SYSLOG_HOST $SYSLOG_PORT &

  # 4.2 Network Syslog
  TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
  EVENT=${NET_EVENTS[$RANDOM % ${#NET_EVENTS[@]}]}
  REASON=${NET_REASONS[$RANDOM % ${#NET_REASONS[@]}]}
  IFACE="ge-0/0/$((RANDOM % 24))"
  STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

  echo "[4.2] Network Syslog  -> UDP:$SYSLOG_PORT (tenant=$TENANT, if=$IFACE, event=$EVENT, status_code=$STATUS_CODE)"
  echo -n "<190>$SYSLOG_TS r$((RANDOM % 5 + 1)) tenant=$TENANT vendor=cisco product=ios if=$IFACE action=$EVENT event=$EVENT src=$(random_ip) mac=$(random_mac) status_code=$STATUS_CODE reason=$REASON" | nc -u -w 0 $SYSLOG_HOST $SYSLOG_PORT &

  # 4.3 HTTP API
  TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
  EVENT=${API_EVENTS[$RANDOM % ${#API_EVENTS[@]}]}
  USER=${USERS[$RANDOM % ${#USERS[@]}]}
  REASON=${API_REASONS[$RANDOM % ${#API_REASONS[@]}]}
  STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

  curl -s -o /dev/null -w "[4.3] HTTP API (tenant=$TENANT, event=$EVENT, status=$STATUS_CODE) -> HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
    -H "Content-Type: application/json" \
    -d "{\"tenant\":\"$TENANT\",\"source\":\"api\",\"vendor\":\"custom\",\"product\":\"login_service\",\"event_type\":\"$EVENT\",\"user\":\"$USER\",\"ip\":\"$(random_ip)\",\"status_code\":$STATUS_CODE,\"reason\":\"$REASON\",\"@timestamp\":\"$ISO_TS\"}" &

  # 4.4 CrowdStrike
  TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
  EVENT=${CS_EVENTS[$RANDOM % ${#CS_EVENTS[@]}]}
  HOST=${HOSTS[$RANDOM % ${#HOSTS[@]}]}
  PROC=${CS_PROCS[$RANDOM % ${#CS_PROCS[@]}]}
  SEV=$((RANDOM % 10 + 1))
  ACTION=${CS_ACTIONS[$RANDOM % ${#CS_ACTIONS[@]}]}
  STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

  curl -s -o /dev/null -w "[4.4] CrowdStrike (tenant=$TENANT, host=$HOST, sev=$SEV, status=$STATUS_CODE) -> HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
    -H "Content-Type: application/json" \
    -d "{\"tenant\":\"$TENANT\",\"source\":\"crowdstrike\",\"vendor\":\"crowdstrike\",\"product\":\"falcon\",\"event_type\":\"$EVENT\",\"host\":\"$HOST\",\"process\":\"$PROC\",\"severity\":$SEV,\"sha256\":\"$(random_sha256)\",\"action\":\"$ACTION\",\"status_code\":$STATUS_CODE,\"@timestamp\":\"$ISO_TS\"}" &

  # 4.5 AWS CloudTrail
  TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
  SERVICE=${AWS_SERVICES[$RANDOM % ${#AWS_SERVICES[@]}]}
  REGION=${AWS_REGIONS[$RANDOM % ${#AWS_REGIONS[@]}]}
  EVENT=${AWS_EVENTS[$RANDOM % ${#AWS_EVENTS[@]}]}
  USER=${USERS[$RANDOM % ${#USERS[@]}]}
  TARGET_USER="temp-user-$((RANDOM % 999))"
  ACC_ID="$((RANDOM % 899999 + 100000))$((RANDOM % 899999 + 100000))"
  STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

  curl -s -o /dev/null -w "[4.5] AWS CloudTrail (tenant=$TENANT, service=$SERVICE, event=$EVENT, status=$STATUS_CODE) -> HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
    -H "Content-Type: application/json" \
    -d "{\"tenant\":\"$TENANT\",\"source\":\"aws\",\"vendor\":\"aws\",\"product\":\"cloudtrail\",\"cloud\":{\"service\":\"$SERVICE\",\"account_id\":\"$ACC_ID\",\"region\":\"$REGION\"},\"event_type\":\"$EVENT\",\"user\":\"$USER\",\"status_code\":$STATUS_CODE,\"@timestamp\":\"$ISO_TS\",\"raw\":{\"eventName\":\"$EVENT\",\"requestParameters\":{\"userName\":\"$TARGET_USER\"}}}" &

  # 4.6 M365 Audit
  TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
  EVENT=${M365_EVENTS[$RANDOM % ${#M365_EVENTS[@]}]}
  USER="${USERS[$RANDOM % ${#USERS[@]}]}@demo.local"
  STATUS=${M365_STATUSES[$RANDOM % ${#M365_STATUSES[@]}]}
  WORKLOAD=${M365_WORKLOADS[$RANDOM % ${#M365_WORKLOADS[@]}]}
  STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}

  curl -s -o /dev/null -w "[4.6] M365 Audit (tenant=$TENANT, workload=$WORKLOAD, status=$STATUS_CODE) -> HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
    -H "Content-Type: application/json" \
    -d "{\"tenant\":\"$TENANT\",\"source\":\"m365\",\"vendor\":\"microsoft\",\"product\":\"m365\",\"event_type\":\"$EVENT\",\"user\":\"$USER\",\"ip\":\"$(random_ip)\",\"status\":\"$STATUS\",\"status_code\":$STATUS_CODE,\"workload\":\"$WORKLOAD\",\"@timestamp\":\"$ISO_TS\"}" &

  # 4.7 Microsoft AD/Windows Security (แยกตัวแปร status_code ของ AD อิสระ)
  TENANT=${TENANTS[$RANDOM % ${#TENANTS[@]}]}
  EVENT_ID=${AD_EVENT_IDS[$RANDOM % ${#AD_EVENT_IDS[@]}]}
  AD_STATUS_CODE=${STATUS_CODES[$RANDOM % ${#STATUS_CODES[@]}]}
  
  if [ "$EVENT_ID" -eq 4624 ]; then
    EVENT_TYPE="LogonSuccess"
  elif [ "$EVENT_ID" -eq 4625 ]; then
    EVENT_TYPE="LogonFailed"
  elif [ "$EVENT_ID" -eq 4740 ]; then
    EVENT_TYPE="AccountLockedOut"
  else
    EVENT_TYPE="SecurityEvent"
  fi

  USER=${USERS[$RANDOM % ${#USERS[@]}]}
  HOST=${HOSTS[$RANDOM % ${#HOSTS[@]}]}
  LOGON_TYPE=${AD_LOGON_TYPES[$RANDOM % ${#AD_LOGON_TYPES[@]}]}

  curl -s -o /dev/null -w "[4.7] AD Security (tenant=$TENANT, event_id=$EVENT_ID, status=$AD_STATUS_CODE) -> HTTP: %{http_code}\n" -X POST "$HTTP_URL" \
    -H "Content-Type: application/json" \
    -d "{\"tenant\":\"$TENANT\",\"source\":\"ad\",\"vendor\":\"microsoft\",\"product\":\"active_directory\",\"event_id\":$EVENT_ID,\"event_type\":\"$EVENT_TYPE\",\"user\":\"demo\\\\$USER\",\"host\":\"$HOST\",\"ip\":\"$(random_ip)\",\"logon_type\":$LOGON_TYPE,\"status_code\":$AD_STATUS_CODE,\"@timestamp\":\"$ISO_TS\"}" &

  # รอให้ทุกข้อในรอบนี้ส่งออกไปพร้อมกันทันที
  wait
done

echo -e "\n=========================================================="
echo " Completed sending $((ITERATIONS * 7)) random log events!"
echo "=========================================================="