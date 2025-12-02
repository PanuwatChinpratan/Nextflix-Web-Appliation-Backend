# Nextflix API Gateway (NestJS + Prisma + MongoDB)

เกตเวย์ที่ดึงข้อมูลหนังจาก TMDB ให้ฝั่ง Next.js และให้ favorites store รองรับ MongoDB (Prisma) พร้อม fallback in-memory

## วิธีเริ่มต้น

1) ติดตั้ง dependency
```bash
npm install
```
2) ตั้งค่า env (dev)
```bash
# ใช้ .env.development เป็นไฟล์หลักสำหรับ dev (NODE_ENV=development)
# คีย์สำคัญ: PORT, FRONTEND_URL, CORS_ORIGINS, TMDB_API_KEY, DATABASE_URL
cp .env.example .env.development
```
3) สร้าง Prisma client
```bash
npx prisma generate
```
4) รัน local (พอร์ตเริ่มต้น 4000)
```bash
NODE_ENV=development npm run start:dev
```

### Production env
- ใส่ค่าจริงใน `.env.production` (เช่น FRONTEND_URL, CORS_ORIGINS, TMDB_API_KEY, DATABASE_URL ของ prod)
- รันด้วย `NODE_ENV=production` (Nest จะเลือก `.env.production` ก่อน แล้ว fallback `.env`)

## API ที่มีให้ใช้

- `GET /movies/trending?page=1` – หนัง/ซีรีส์มาแรงวันนี้ (proxy TMDB)
- `GET /movies/popular?page=1` – รายการยอดนิยม
- `GET /movies/search?query=devil&page=1` – ค้นหาด้วยข้อความ (query ต้องไม่ว่าง)
- `GET /movies/:id` – รายละเอียดเรื่อง
- `GET /favorites?userId=guest` – รายการที่บันทึก (ใช้ Mongo ถ้ามี DATABASE_URL ไม่งั้นใช้ in-memory)
- `POST /favorites` – เพิ่ม/อัปเดต `{ userId, movieId, title, posterUrl? }`
- `DELETE /favorites/:movieId?userId=guest` – ลบออกจากรายการ (idempotent)
- `GET /health` – health check

Swagger docs: `http://localhost:4000/docs`

## หมายเหตุ

- Frontend เรียกผ่านเกตเวย์นี้เท่านั้น ไม่ยิง TMDB โดยตรง
- CORS เปิดให้ `FRONTEND_URL` (ดีฟอลต์ `http://localhost:3000`) เพิ่ม origin เพิ่มเติมผ่าน `CORS_ORIGINS`
- Prisma เซ็ตกับ MongoDB; ถ้าไม่มี `DATABASE_URL` จะใช้ in-memory favorites แทนเพื่อให้ UI ทำงานได้ต่อ
- เปิด rate limit ด้วย Throttler 120 requests/60s ต่อ IP (ปรับได้ใน `app.module.ts`)
- ลบ favorites ซ้ำ/ไม่พบจะไม่ error (ลบแบบ idempotent)
- คิวรีค้นหาบังคับไม่ว่าง และมี validation ด้วย `class-validator`
