# Deployment Report — 2026-07-16

## ผลลัพธ์

**Production deployment สำเร็จ** บน Vercel project เดิม `krit-portfolio` และ domain เดิม https://krit-portfolio-liard.vercel.app

## Google Apps Script

- Sheet: `KRIT HUB AI Tutor Bookings`
- Tabs: `Bookings`, `Settings`
- Script Property `BOOKING_API_SECRET` ตั้งค่าแล้ว โดยค่าไม่อยู่ในเอกสารหรือ Git
- Web app: Execute as เจ้าของ, Access `ทุกคน`, code ตรวจ API secret ทุก POST
- Deployment version 6 ใช้ URL `/exec` เดิม
- Script Property `BOOKING_NOTIFICATION_EMAIL` ตั้งเป็น `krit.rte@gmail.com` และอนุมัติสิทธิ์ MailApp แล้ว
- เมื่อสร้าง booking สำเร็จ ระบบส่งอีเมลหลังบันทึกข้อมูล; หากอีเมลขัดข้อง booking ยังสำเร็จและบันทึกเหตุการณ์แบบไม่เผย PII
- Health check: HTTP 200, `success=true`, service และ status ถูกต้อง
- แก้การเขียนเบอร์โทรให้บังคับข้อความและคงเลข `0` นำหน้าแล้ว

## Vercel

- Project: `krit-portfolio`
- Project ID: `prj_lpc94zHOpUNx4KMdV3QF0mjKxMgu`
- Team ID: `team_mlVqSHrFLfZ9OHHXi9HxNzGk`
- Environment Variables ตั้งครบสำหรับ Production และ Preview:
  - `GOOGLE_APPS_SCRIPT_WEB_APP_URL`
  - `GOOGLE_APPS_SCRIPT_API_SECRET`
  - `ADMIN_PASSWORD`
  - `ADMIN_SESSION_SECRET`
  - `NEXT_PUBLIC_APP_URL`
- Preview deployment: `dpl_FDjh51DuXpRAWMGfedizSc3ifDxX` — READY
- Production deployment: `dpl_F6Bpy7WReXthCp4vUc1QUKZGkC17` — READY
- Alias: https://krit-portfolio-liard.vercel.app

## Production verification

- [x] Home/Tutor/Course/Pricing/Booking/Admin ตอบ 200
- [x] Portfolio และ Hero เดิมยังทำงาน
- [x] Availability จริงตอบ slots
- [x] Booking synthetic ได้ reference และเพิ่มหนึ่งแถว
- [x] Duplicate slot ตอบ `SLOT_UNAVAILABLE` และไม่มีแถวซ้ำ
- [x] Admin รหัสผิด/ถูก, list, confirm, cancel และ logout ผ่าน
- [x] Google Sheets status เปลี่ยนเป็น `cancelled`
- [x] อีเมลแจ้งเตือนการจองใหม่ส่งเข้า `krit.rte@gmail.com` จริง พร้อม reference `KHA-20260731-8D5AB0`
- [x] รายการทดสอบการแจ้งเตือน 2 รายการถูกยกเลิกและ slot เปิดกลับ
- [x] Cancelled slot เปิดกลับ
- [x] ไม่มีข้อมูลทดสอบ pending หรือ confirmed ค้าง
- [x] Admin เป็น `noindex`; HTTPS ใช้งานได้
- [x] ไม่มี secret ใน tracked files หรือภาพหน้าจอ

## Rollback

หาก Production มีปัญหา ให้เลือก deployment ก่อนหน้าใน Vercel แล้ว Promote/Rollback จากหน้า Deployments จากนั้นตรวจ Home และ API ก่อนเปิดรับจองอีกครั้ง ส่วน Apps Script ให้เลือก version ก่อนหน้าใน Manage deployments โดยคง deployment ID/URL เดิม
