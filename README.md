# KRIT Portfolio + KRIT HUB AI Tutor

เว็บไซต์ Portfolio ของ KRIT ที่ขยายด้วยระบบประชาสัมพันธ์หลักสูตร AI Tutor, ตารางราคา, ตรวจรอบว่าง, จองเรียน และหน้าผู้ดูแล โดยยังรักษาหน้า Portfolio และลิงก์ติดต่อเดิมไว้

## Routes

| Route | หน้าที่ |
| --- | --- |
| `/` | Portfolio และทางเข้าสู่ AI Tutor |
| `/tutor` | Landing page หลักสูตร |
| `/tutor/course` | รายละเอียดหลักสูตร |
| `/tutor/pricing` | ราคา 1–4 คน |
| `/tutor/booking` | ฟอร์มตรวจรอบว่างและจอง |
| `/tutor/booking/success` | ผลการจองที่ไม่แสดงข้อมูลส่วนตัว |
| `/admin/bookings` | เข้าสู่ระบบและจัดการสถานะการจอง |

API หลักคือ `GET /api/tutor/availability`, `POST /api/tutor/bookings`, `POST|DELETE /api/admin/session`, `GET /api/admin/bookings` และ `PATCH /api/admin/bookings/:reference`

## Setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

ระบบต้องใช้ Google Apps Script Web App เป็นตัวกลางระหว่าง Next.js กับ Google Sheets ดูขั้นตอนใน `docs/KRIT_HUB_AI_TUTOR_GOOGLE_SHEETS_SETUP.md`

เมื่อสร้างรายการจองสำเร็จ Apps Script จะส่งอีเมลแจ้งเตือนไปยัง `BOOKING_NOTIFICATION_EMAIL` หลังบันทึกข้อมูล โดยปัญหาการส่งอีเมลจะไม่ทำให้รายการจองสูญหาย

## Environment variables

| ชื่อ | ใช้ที่ใด | จำเป็น |
| --- | --- | --- |
| `GOOGLE_APPS_SCRIPT_WEB_APP_URL` | Server เท่านั้น; URL ลงท้าย `/exec` | Production booking |
| `GOOGLE_APPS_SCRIPT_API_SECRET` | Server เท่านั้น; ต้องตรง Script Property | Production booking |
| `ADMIN_PASSWORD` | รหัสผ่านผู้ดูแล | Admin |
| `ADMIN_SESSION_SECRET` | ลงนาม session; สุ่มยาวอย่างน้อย 32 ตัวอักษร | Admin |
| `NEXT_PUBLIC_APP_URL` | URL เว็บไซต์ canonical | แนะนำ |
| `LINE_CHANNEL_SECRET` / `LINE_CHANNEL_ACCESS_TOKEN` | รองรับ LINE ในอนาคต | ไม่จำเป็น |

ห้ามใส่ Secret ในตัวแปรที่ขึ้นต้น `NEXT_PUBLIC_` หรือ commit `.env.local`

## Testing

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

ชุดทดสอบครอบคลุมราคา, วัน/เวลา Bangkok, validation, anti-spam, duplicate submission, rate limit, response จาก Apps Script, availability และ admin session

## Deployment

โปรเจกต์เชื่อม Vercel ไว้แล้ว ตั้ง Environment Variables สำหรับ Production และ Preview จากนั้น deploy แล้วทดสอบ booking จริงหนึ่งรายการ ดู checklist ใน `docs/KRIT_HUB_AI_TUTOR_DEPLOYMENT_REPORT.md` และ `docs/KRIT_HUB_AI_TUTOR_OPERATIONS_RUNBOOK.md`

## เอกสาร

- คู่มือเจ้าของระบบ: `docs/KRIT_HUB_AI_TUTOR_SYSTEM_GUIDE.md`
- คู่มือผู้สอน/ผู้เรียน: `docs/KRIT_HUB_AI_TUTOR_INSTRUCTOR_GUIDE.md`, `docs/KRIT_HUB_AI_TUTOR_STUDENT_WORKBOOK.md`
- คู่มือรวม 25 บท: `docs/KRIT_HUB_AI_TUTOR_COMPLETE_MANUAL.md`
- Apps Script source: `integrations/google-apps-script/`
