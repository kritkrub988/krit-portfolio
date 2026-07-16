# QA Report — 2026-07-16

## สถานะ

**PRODUCTION READY** — ระบบ Tutor, Booking, Google Sheets, อีเมลแจ้งเตือน, Admin และ Vercel Production เชื่อมต่อและผ่าน end-to-end test แล้ว

## Quality gates

- `npm run lint` — ผ่าน
- `npm run typecheck` — ผ่าน
- `npm test` — ผ่าน 50/50
- `npm run build` — ผ่านด้วย Next.js 16.2.10
- Vercel Preview และ Production build — READY
- Secret scan — ไม่พบ secret ใน tracked files; `.env.local` ถูก Git ignore
- `git diff --check` — ผ่าน

## Local integration

- Routes `/`, `/tutor`, `/tutor/course`, `/tutor/pricing`, `/tutor/booking`, `/admin/bookings` ตอบ 200 ที่ port 3003
- Apps Script health check ตอบ 200, `success=true`, service `KRIT HUB AI Tutor Booking API`, status `ok`
- Availability แสดง 5 รอบวันธรรมดา
- จองข้อมูลสมมติ 2 คนได้ราคา 250 บาท/คน รวม 500 บาท และ reference รูปแบบ `KHA-YYYYMMDD-XXXXXX`
- จอง slot ซ้ำตอบ HTTP 409 และ `SLOT_UNAVAILABLE`; ไม่มีแถวซ้ำ
- Admin: รหัสผิด 401, รหัสถูกเข้าได้, พบรายการ, pending → confirmed → cancelled, logout แล้ว API ตอบ 401
- หลัง cancelled slot เดิมกลับมาว่าง
- แก้ Apps Script ให้คงเลข `0` นำหน้าเบอร์โทร; ตรวจภาษาไทยและ `0800000000` จาก Sheets จริงแล้ว

## Production integration

- URL: https://krit-portfolio-liard.vercel.app
- Home, Tutor, Course, Pricing, Booking และ Admin ตอบ 200
- Admin มี `noindex`; HTTPS ใช้งานได้
- Availability จริงตอบสำเร็จ
- Production booking สร้างสำเร็จ 1 รายการ, duplicate ถูกปฏิเสธ, Admin confirm/cancel/logout ผ่าน และ slot เปิดกลับ
- ตรวจข้อมูลสมมติทั้งหมด 7 แถว: `cancelled` 7, `pending` 0, `confirmed` 0
- Booking หลังอนุมัติ MailApp ส่งอีเมลหัวข้อ `[KRIT HUB] มีการจองใหม่ KHA-20260731-8D5AB0` เข้า Gmail จริง
- อีเมลมีชื่อผู้จอง เบอร์โทร วันที่ เวลา รูปแบบ จำนวนคน ยอดรวม และลิงก์หน้า Admin
- อีเมลส่งหลังบันทึก booking และข้อผิดพลาดของอีเมลไม่ทำให้ booking ล้ม
- Production Home ไม่มี browser console error และไม่มี horizontal overflow ที่ viewport ที่ตรวจ
- Hero/User Change เดิมไม่ถูกย้อนกลับ

## ความเสี่ยงที่ยอมรับสำหรับ MVP

1. in-memory rate limit/deduplication เป็น best-effort เมื่อ serverless หลาย instance
2. Apps Script/Sheets มี quota และเหมาะกับ MVP traffic
3. Shared admin password ยังไม่มี per-user audit หรือ MFA
4. เจ้าของระบบต้องกำหนด PII retention, backup และ access review ต่อเนื่อง

## หลักฐาน Deployment

- Apps Script deployment: version 6, URL `/exec` เดิม
- Vercel Preview: `dpl_FDjh51DuXpRAWMGfedizSc3ifDxX`
- Vercel Production: `dpl_F6Bpy7WReXthCp4vUc1QUKZGkC17`
- Vercel project เดิม: `prj_lpc94zHOpUNx4KMdV3QF0mjKxMgu`
