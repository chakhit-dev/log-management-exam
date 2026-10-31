# คู่มือการติดตั้งระบบ (Installation Guide) - Log Management System

เอกสารนี้อธิบายขั้นตอนการติดตั้งและตั้งค่าระบบจัดการ Log (Log Management System) ซึ่งพัฒนาด้วย **Next.js (App Router)**, **Prisma ORM (v7)**, **ClickHouse** (สำหรับจัดเก็บและวิเคราะห์ Log) และ **Vector** (สำหรับรวบรวมและส่งต่อ Log)

---

## 📋 สิ่งที่ต้องเตรียมก่อนการติดตั้ง (Prerequisites)

ก่อนเริ่มต้นติดตั้ง กรุณาตรวจสอบว่าเครื่องของคุณมีโปรแกรมเหล่านี้ติดตั้งอยู่แล้ว:

1. **Node.js** (แนะนำเวอร์ชัน `v20.x` ขึ้นไป) และ **npm**
2. **Docker** และ **Docker Compose** (สำหรับรันฐานข้อมูล ClickHouse, PostgreSQL และ Vector)
3. **Git** (สำหรับโคลนโปรเจกต์)
4. **Bash Shell** (สำหรับรันสคริปต์จำลองการส่ง Log ในโฟลเดอร์ `sendlog/` - หากใช้ Windows แนะนำให้รันผ่าน Git Bash หรือ WSL)

---

## 🚀 ขั้นตอนการติดตั้ง (Step-by-Step Installation)

### 1. เตรียมซอร์สโค้ดและติดตั้ง Dependencies

เปิด Terminal และเข้าไปยังโฟลเดอร์โปรเจกต์ จากนั้นติดตั้งแพ็กเกจทั้งหมด:

```bash
# เข้าสู่โฟลเดอร์โปรเจกต์
cd log-management-exam

# ติดตั้ง Node.js dependencies
npm install
```

ดาวน์โหลด GeoIP

```bash
curl -L "https://cdn.jsdelivr.net/npm/dbip-city-lite/dbip-city-lite.mmdb.gz" \
  -o dbip-city-lite.mmdb.gz
```

unpack

```bash
gunzip dbip-city-lite.mmdb.gz
```

---

### 2. ตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables)

สร้างไฟล์ `.env` ที่โฟลเดอร์หลัก (Root Directory) ของโปรเจกต์ และกำหนดค่าการเชื่อมต่อต่างๆ ดังนี้ (ปรับแก้รหัสผ่านและพอร์ตให้ตรงกับ `docker-compose.yml` ของคุณ):

```env
AUTH_SECRET=e2e044ee3d2f273a84c3a1e89814f3f61b548b1f43d6f7ed7150a9feddf5703a

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

---

### 3. รันระบบ Infrastructure ด้วย Docker Compose

โปรเจกต์นี้ใช้ Docker Compose ในการจำลองฐานข้อมูลและตัวรับ Log (เช่น PostgreSQL, ClickHouse, Vector) ให้รันคำสั่งต่อไปนี้เพื่อเปิดใช้งาน Service ทั้งหมดในโหมดเบื้องหลัง:

```bash
docker compose up -d
```

> **การตรวจสอบสถานะ:** รันคำสั่ง `docker compose ps` เพื่อเช็คว่า Container ทั้งหมดทำงานปกติ (สถานะ `Up` หรือ `Healthy`)

---

### 4. ตั้งค่าฐานข้อมูล (Database Setup & Migration)

#### 4.1 ตั้งค่าฐานข้อมูลหลักด้วย Prisma (PostgreSQL)
โปรเจกต์นี้ใช้งาน **Prisma v7** (สังเกตได้จากไฟล์ `prisma7.config.ts`) ให้รันคำสั่งเพื่อสร้างตาราง (Users, Tenants, Memberships) และสร้าง Prisma Client:

```bash
# สร้าง Prisma Client
npx prisma generate

# รัน Migration เพื่อสร้างตารางในฐานข้อมูล
npx prisma migrate deploy
# หรือหากอยู่ในโหมดพัฒนา (Development) สามารถใช้:
# npx prisma migrate dev
```

*(ทางเลือกเพิ่มเติม)* หากต้องการนำเข้าข้อมูลตั้งต้นจากไฟล์ SQL ที่มีให้ในโปรเจกต์ สามารถรันผ่านฐานข้อมูลโดยตรงโดยใช้ไฟล์ `sql/prisma.sql`

#### 4.2 ตั้งค่าตารางเก็บ Log ใน ClickHouse
หากใน `docker-compose.yml` ไม่ได้ทำการผูกไฟล์ Init SQL ไว้อัตโนมัติ ให้คุณนำโครงสร้างตารางจากไฟล์ `sql/clickhouse_db.sql` ไปรันใน ClickHouse:

```bash
# ตัวอย่างการรัน SQL เข้าสู่ ClickHouse Container (เปลี่ยนชื่อ container_name ให้ตรงกับของคุณ)
docker exec -i <clickhouse_container_name> clickhouse-client --multiquery < sql/clickhouse_db.sql
```

---

### 5. เริ่มต้นรันแอปพลิเคชัน (Start the Application)

เมื่อฐานข้อมูลพร้อมแล้ว สามารถเปิดรันเว็บแอปพลิเคชัน Next.js ได้เลย:

#### สำหรับโหมดพัฒนา (Development Mode)
```bash
npm run dev
```

#### สำหรับโหมดใช้งานจริง (Production Mode)
```bash
npm run build
npm run start
```

เมื่อรันสำเร็จ ให้เปิดเว็บเบราว์เซอร์และเข้าไปที่: **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 การทดสอบส่งข้อมูล Log เข้าสู่ระบบ (Seeding & Testing Logs)

เพื่อให้หน้า Dashboard (`/dashboard`) และหน้าตาราง Log (`/logs`) มีข้อมูลสำหรับแสดงผลกราฟ (เช่น EPS, Error Rate, Top IP, Top User, Event Timeline) คุณสามารถส่งข้อมูลจำลองเข้าสู่ระบบได้ 3 วิธี:

### วิธีที่ 1: รันสคริปต์จำลองการยิง Log (แนะนำ)
ในโฟลเดอร์ `sendlog/` มีสคริปต์สำหรับจำลองการส่ง Log เข้าสู่ระบบ:

```bash
cd sendlog

# ให้สิทธิ์การรันไฟล์สคริปต์
chmod +x seed-main4.sh seed-revers-date.sh

# รันสคริปต์เพื่อส่ง Log เข้าสู่ระบบ
./seed-main4.sh
```
*(สามารถอ่านรายละเอียดเพิ่มเติมได้ในไฟล์ `sendlog/readme.md`)*

### วิธีที่ 2: อัปโหลดไฟล์ Log ผ่านหน้าเว็บ (UI Upload)
1. ล็อกอินเข้าสู่ระบบที่หน้าเว็บ
2. ไปยังเมนูอัปโหลดไฟล์ (Upload Drawer)
3. เลือกอัปโหลดไฟล์ตัวอย่างที่มีให้ในโปรเจกต์ คือ `simpledata.json`

### วิธีที่ 3: ส่งผ่าน API หรือ Vector โดยตรง
* **ผ่าน Next.js API:** ส่ง HTTP `POST` request ไปที่ `http://localhost:3000/api/logs` หรือ `http://localhost:3000/api/logs/[tenant]`
* **ผ่าน Vector:** ส่ง Log เข้าสู่พอร์ตที่ตั้งค่าไว้ในไฟล์ `vector.toml` เพื่อทำการแปลงข้อมูล (Transform) และส่งต่อไปยัง ClickHouse โดยอัตโนมัติ

---

## 📁 โครงสร้างไฟล์สำคัญในโปรเจกต์ (Project Structure Overview)

* `app/` - โครงสร้างหน้าเว็บและ API Routes ของ Next.js
  * `app/actions/` - Server Actions สำหรับดึงข้อมูลสถิติจาก ClickHouse (เช่น `eps.ts`, `errorrate.ts`, `topip.ts`, `getLogs.ts`)
  * `app/api/` - API Endpoints สำหรับจัดการผู้ใช้งาน, Tenants, การอัปโหลดไฟล์ และรับ Webhook จาก Grafana
  * `app/dashboard/` & `app/logs/` - หน้าแสดงผล Dashboard และตารางค้นหา Log
* `prisma/` - ไฟล์ `schema.prisma` และประวัติการทำ Migration สำหรับฐานข้อมูลผู้ใช้งานและสิทธิ์ (Multi-tenant)
* `sql/` - ไฟล์ SQL ตั้งต้นสำหรับสร้างตารางใน ClickHouse (`clickhouse_db.sql`) และฐานข้อมูล Prisma (`prisma.sql`)
* `sendlog/` - สคริปต์ Bash สำหรับยิงข้อมูล Log จำลองเพื่อทดสอบระบบ
* `vector.toml` - ไฟล์ตั้งค่า Pipeline ของ Vector สำหรับรับและประมวลผล Log
* `docs/` - เอกสารสถาปัตยกรรมระบบ (`architecture.md`) และการตั้งค่า Appliance (`setup_appliance.md`)

---

## 🛠️ การแก้ไขปัญหาเบื้องต้น (Troubleshooting)

1. **หน้า Dashboard ไม่แสดงข้อมูล หรือขึ้น Error จาก ClickHouse:**
   * ตรวจสอบว่า ClickHouse Container ทำงานอยู่หรือไม่
   * ตรวจสอบการเชื่อมต่อด้วย Action `app/actions/debugClickHouse.ts` หรือเช็คค่า `CLICKHOUSE_HOST` ในไฟล์ `.env`
   * ตรวจสอบว่าได้รันสคริปต์ `sql/clickhouse_db.sql` เพื่อสร้างตารางแล้วหรือยัง
2. **ติดปัญหาเรื่อง Prisma Client ตอนรันโค้ด:**
   * เนื่องจากโปรเจกต์มีการใช้งานโครงสร้างของ Prisma 7 (`prisma7.config.ts`) หากมีการแก้ไข Schema ให้รัน `npx prisma generate` ใหม่ทุกครั้ง
3. **ไม่สามารถล็อกอินได้ (NextAuth Error):**
   * ตรวจสอบว่าได้ตั้งค่า `AUTH_SECRET` ในไฟล์ `.env` เรียบร้อยแล้ว และมีข้อมูลผู้ใช้ (User) และ Tenant อยู่ในฐานข้อมูล PostgreSQL แล้ว