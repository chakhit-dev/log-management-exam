# ติดตั้งใน SAAS

### อัปเดตระบบและติดตั้งแพ็กเกจพื้นฐาน
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
```

### ติดตั้ง Docker
ดาวน์โหลดและติดตั้งตัว Docker Engine
เพิ่ม GPG key และ Official Repository ของ Docker จากนั้นติดตั้ง Docker:
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io -y
```


### ติดตั้ง Docker Compose (เวอร์ชันล่าสุด)
ดาวน์โหลด Docker Compose Plugin มาเก็บไว้ในระบบ:
```bash
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
```

### ดาวน์โหลดตัวโปรเจ็ค
```bash
git clone https://github.com/chakhit-dev/log-management-exam
cd log-management-exam
```

### สร้างไฟล์ .env ไว้ที่ root project
```bash
AUTH_SECRET=
AUTH_TRUST_HOST=true

POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=log_manage_db

PGADMIN_DEFAULT_EMAIL=
PGADMIN_DEFAULT_PASSWORD=

CLICKHOUSE_URL=http://localhost:8123
CLICKHOUSE_USER=
CLICKHOUSE_PASSWORD=
CLICKHOUSE_DB=log_manage_db

GRAFANA_ADMIN_USER=
GRAFANA_ADMIN_PASSWORD=

RESEND_API_KEY=
DATABASE_URL="postgresql://username:password@localhost:5432/log_manage_db"
```

### ตั้งข้อมูลใน vector

[sinks.clickhouse_output]
type = "clickhouse"
inputs = ["process_logs", "process_network_logs"]
endpoint = "http://clickhouse:8123"
database = "log_manage_db"
table = "central_logs"
auth.strategy = "basic"
auth.user = "ตั้งรหัสที่นี้"
auth.password = "ตั้งรหัสที่นี้"
healthcheck = true

### build docker สำหรับเตรียม nodejs และ อื่นๆ
```bash
sudo docker compose up -d --build
```

### migrate database 

```bash
sudo docker compose run --rm migrate npx prisma migrate deploy
```

### import clickhouse sql file

```bash
cd log-management-exam
source .env
sudo docker compose exec -T clickhouse clickhouse-client \
  --user "$CLICKHOUSE_USER" --password "$CLICKHOUSE_PASSWORD" \
  --database "$CLICKHOUSE_DB" --multiquery < sql/clickhouse_db.sql
```
