## How to use

เป็นคำสั่งใน Linux, macOS และ Unix ใช้สำหรับเปลี่ยนสิทธิ์การเข้าถึงไฟล์ (File Permissions)
```bash
chmod +x seed-main.sh
```

```bash
chmod +x seed-revers-date.sh
```

ใช้งาน
```bash
./seed-revers-date.sh {ระบุจำนวน Resquest} {จำนวนวันที่ย้อนหลัง}
```

```bash
./seed-main.sh {ระบุจำนวน Resquest}
```

## API Reference

#### [API] POST INGEST

```http
POST /api/ingest
```
Request Body ส่งข้อมูลเป็นรูปแบบ application/json
```body
{
  "tenant": "demoA",
  "source": "api",
  "event_type": "app_login_failed",
  "user": "alice",
  "ip": "125.27.146.182",
  "@timestamp": "2026-10-30T12:00:00Z"
}
```

#### [API] GET TENANT DATA

```http
GET /api/logs/{$tenant_name}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `tenant_name`      | `string` | **Required**. tenant_name of item to fetch |

#### [API] GET LOG DATA

```http
POST /api/logs
```
Request Body ส่งข้อมูลเป็นรูปแบบ application/json
```body
{
    "tenant_name": "demoB",
    "limit": 10
}
```

#### [API] CREATE USER

```http
POST /api/users
```
Request Body ส่งข้อมูลเป็นรูปแบบ application/json
```body
{
    "email": "t3@gg.com",
    "username": "t3",
    "password": "zz112233"
}
```

#### [API] CREATE TENANT

```http
POST /api/teants
```
Request Body ส่งข้อมูลเป็นรูปแบบ application/json
```body
{
    "id": 7,
    "name": "demoG"
}
```

#### [API] GET MEMBERSHIPS

```http
POST /api/memberships
```
Request Body ส่งข้อมูลเป็นรูปแบบ application/json
```body
{
    "user_id": 1
}
```



