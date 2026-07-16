# External Setup — ขั้นตอนที่เหลือสำหรับเจ้าของบัญชี

Repository, Google Sheet, Apps Script source, tests และคู่มือพร้อมแล้ว เหลือเฉพาะขั้นตอนที่ต้องใช้สิทธิ์เจ้าของ Google/Vercel

## 1) Google Apps Script (ประมาณ 8 นาที)

1. เปิด https://docs.google.com/spreadsheets/d/1Y3yQR58olRgBlf7ghuWxU6ayAmdwYzUGTxji6_ucfkw/edit
2. Extensions → Apps Script
3. สร้าง 3 ไฟล์แล้วคัดลอก `Code.gs`, `Config.gs`, `Validation.gs` จาก `integrations/google-apps-script/`
4. Run `initializeSheets` และกดอนุญาต
5. Project Settings → Script Properties → เพิ่ม `BOOKING_API_SECRET` เป็นค่าสุ่มยาว ≥32 ตัวอักษร
6. Deploy → New deployment → Web app → Execute as Me → ให้ Vercel เข้าถึงได้ → Deploy
7. คัดลอก URL ที่ลงท้าย `/exec`

## 2) Vercel (ประมาณ 5 นาที)

Project `krit-portfolio` → Settings → Environment Variables เพิ่ม Production/Preview:

```text
GOOGLE_APPS_SCRIPT_WEB_APP_URL=<URL /exec>
GOOGLE_APPS_SCRIPT_API_SECRET=<ค่าเดียวกับ Script Property>
ADMIN_PASSWORD=<รหัสผ่านยาว>
ADMIN_SESSION_SECRET=<ค่าสุ่มยาวอย่างน้อย 32 ตัว>
NEXT_PUBLIC_APP_URL=https://krit-portfolio-liard.vercel.app
```

Redeploy ล่าสุด แล้วเปิด `/tutor/booking` และ `/admin/bookings`

## 3) ตรวจจบงาน (ประมาณ 3 นาที)

จองด้วยข้อมูลสมมติ → ได้ reference → ตรวจแถวใน Sheets → Admin Confirm → Cancel → ตรวจว่า slot กลับมาว่าง จากนั้นลบ/ทำความสะอาดข้อมูลทดสอบตามนโยบาย

ห้ามส่งค่า secret/password กลับมาในแชต หากต้องการให้ช่วยตรวจ ให้แจ้งเพียงว่า “ตั้งค่าแล้ว” พร้อม URL production ที่ไม่มี credential

## สถานะอัตโนมัติรอบล่าสุด (2026-07-16)

- Secret สามค่าถูกสร้างใน `.env.local` แล้วและไม่ถูก Git ติดตาม
- Apps Script ตั้ง Script Property, deploy Web app version 4 และ health check ผ่าน
- Local QA และ end-to-end booking/duplicate/Admin/cancel/slot reopen ผ่าน
- Vercel project เดิมตั้ง Environment Variables ครบสำหรับ Production/Preview
- Preview และ Production deploy READY; domain เดิมมี Tutor/Admin และ API แล้ว
- Production end-to-end ผ่าน ข้อมูลทดสอบทั้งหมดเป็น `cancelled` ไม่มีคิวทดสอบค้าง
