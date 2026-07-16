# ตั้งค่า Google Sheets + Apps Script

## สถานะปัจจุบัน

สร้าง Google Sheet แบบเนทีฟแล้ว: **KRIT HUB AI Tutor Bookings**

https://docs.google.com/spreadsheets/d/1Y3yQR58olRgBlf7ghuWxU6ayAmdwYzUGTxji6_ucfkw/edit

ชีตมี `Bookings` (header A–O, validation สถานะ) และ `Settings` (ค่าหลักสูตร/ราคา/slot/timezone) พร้อมใช้ Apps Script ถูกผูกและ deploy เป็น Web app version 6 แล้ว โดย health check, booking และอีเมลแจ้งเตือนผ่าน end-to-end test วันที่ 2026-07-16

## Data flow

```text
Next.js browser
  → Next.js server API (validation + rate limit + secret)
  → Apps Script Web App /exec (secret + lock)
  → Google Sheets
```

ห้ามให้ browser เรียก Apps Script โดยตรงหรือเปิดเผย secret

## ผูก Apps Script

1. เปิดชีตด้านบน → Extensions → Apps Script
2. ลบ `myFunction` ตัวอย่าง
3. สร้างไฟล์และคัดลอก source ให้ตรงชื่อ:
   - `integrations/google-apps-script/Code.gs`
   - `integrations/google-apps-script/Config.gs`
   - `integrations/google-apps-script/Validation.gs`
4. ตั้ง Project timezone เป็น `Asia/Bangkok`
5. Run `initializeSheets()` หนึ่งครั้งและอนุญาตเฉพาะสิทธิ์ที่จำเป็น
6. ตรวจว่า Bookings header ตรง A–O และ Settings มี 10 key

`initializeSheets()` รันซ้ำได้โดยไม่ลบ booking และไม่เขียนทับ Setting ที่มีอยู่

## ตั้ง Secret

Apps Script → Project Settings → Script Properties → เพิ่ม:

```text
BOOKING_API_SECRET=<random อย่างน้อย 32 ตัวอักษร>
BOOKING_NOTIFICATION_EMAIL=<อีเมลผู้รับแจ้งเตือน>
```

ห้ามใส่ค่าใน source, Sheets, Git, screenshot หรือเอกสาร ค่าเดียวกันนี้ต้องไปอยู่ที่ `GOOGLE_APPS_SCRIPT_API_SECRET` บน Vercel

หลังเพิ่ม `BOOKING_NOTIFICATION_EMAIL` ให้เลือกฟังก์ชัน `authorizeBookingNotifications` ใน Apps Script แล้วกด Run หนึ่งครั้งเพื่ออนุมัติสิทธิ์ส่งอีเมลของ MailApp จากนั้น deploy เป็นเวอร์ชันใหม่

## Deploy Web App

1. Deploy → New deployment → Web app
2. Execute as: **Me**
3. Who has access: ระดับที่ Vercel เรียกโดยไม่ login ได้ตาม policy บัญชี
4. Deploy/Authorize
5. คัดลอก URL ที่ลงท้าย `/exec` เท่านั้น
6. เมื่อแก้ source ให้ Manage deployments → Edit → New version

## Actions ที่ Web App รองรับ

ทุก POST ต้องมี `api_secret`

| action | ใช้โดย | ผล |
| --- | --- | --- |
| `createBooking` หรือไม่ส่ง action | Booking API | ตรวจ/ล็อก/เพิ่มแถว |
| `availability` + `booking_date` | Availability API | คืน available/unavailable slots |
| `listBookings` | Admin API | คืนสูงสุด 500 รายการล่าสุด |
| `updateStatus` + reference/status | Admin API | เปลี่ยน pending/confirmed/cancelled |

GET ใช้ health check และไม่เปิดเผยข้อมูล

## ตั้งค่า Next.js/Vercel

```text
GOOGLE_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/.../exec
GOOGLE_APPS_SCRIPT_API_SECRET=<ตรง Script Property>
ADMIN_PASSWORD=<รหัสผ่านยาวและเดายาก>
ADMIN_SESSION_SECRET=<random อย่างน้อย 32 ตัวอักษร>
NEXT_PUBLIC_APP_URL=https://<production-domain>
```

ตั้งค่าแยก Preview/Production แล้ว redeploy; อย่าใช้ `NEXT_PUBLIC_` กับ secret

## Smoke test

1. เปิด `/tutor/booking` เลือกวันที่อนาคต
2. ตรวจว่า slot แสดงและไม่มี configuration error
3. จองข้อมูลสมมติหนึ่งรายการ
4. ตรวจ reference และแถวเดียวใน Bookings
5. ตรวจอีเมลหัวข้อ `[KRIT HUB] มีการจองใหม่ <reference>` ในกล่องผู้รับ
6. จองวัน/slot เดิมอีกครั้ง ต้องได้ `SLOT_UNAVAILABLE`
7. Login Admin → Confirm → ตรวจ status ใน Sheets
8. Cancel รายการทดสอบและลบข้อมูลส่วนตัวสมมติถ้านโยบายกำหนด

ดู test matrix เพิ่มที่ `integrations/google-apps-script/TEST_CASES.md`

## ความปลอดภัย/ข้อจำกัด

- Shared secret ป้องกัน endpoint ระดับ MVP; rotate เมื่อสงสัยว่ารั่ว
- Script Lock ป้องกัน double booking แต่ Apps Script/Sheets ไม่เหมาะกับโหลดสูง
- in-memory rate limit ของ Next.js เป็น best-effort ใน serverless หลาย instance
- จำกัดผู้แก้ไขชีต, backup และตรวจ Apps Script Executions
- ไม่ log secret, payload เต็ม, phone, LINE user id หรือ stack trace สู่ client
