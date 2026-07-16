# คู่มือเจ้าของระบบ KRIT HUB AI Tutor

## ภาพรวมและสถาปัตยกรรม

ผู้เรียนดูหลักสูตรและกรอกแบบฟอร์มบน Next.js จากนั้น Server API ตรวจข้อมูล, จำกัดคำขอ, ซ่อน Secret และเรียก Google Apps Script ผ่าน HTTPS; Apps Script ตรวจรอบซ้ำภายใต้ Script Lock ก่อนบันทึกลง Google Sheets หน้า Admin อ่านและเปลี่ยนสถานะผ่าน Server API เดียวกัน

```text
Browser → Next.js API → Google Apps Script → Google Sheets
Admin  → signed HttpOnly session → Next.js API ────────┘
```

ข้อมูลจริงอยู่ในชีต **KRIT HUB AI Tutor Bookings**:  
https://docs.google.com/spreadsheets/d/1Y3yQR58olRgBlf7ghuWxU6ayAmdwYzUGTxji6_ucfkw/edit

## งานประจำ

1. เปิด `/admin/bookings` และเข้าสู่ระบบ
2. ตรวจรายการ `pending` ใหม่เทียบกับวันที่/เวลา
3. ติดต่อผู้เรียนผ่านข้อมูลที่ได้รับอนุญาต
4. กด **Confirm** เมื่อยืนยันแล้ว หรือ **Cancel** เมื่อยกเลิก
5. ตรวจในแท็บ `Bookings` ว่าสถานะตรงกัน

หาก Admin ใช้ไม่ได้ สามารถแก้คอลัมน์ `status` ในชีตเป็น `pending`, `confirmed` หรือ `cancelled` ได้โดยตรง ห้ามลบแถวเพื่อรักษาประวัติ

## แก้ราคาและรอบเรียน

แก้เฉพาะแท็บ `Settings`:

- `price_1_person` ถึง `price_4_people` คือราคารวม และต้องหารจำนวนคนลงตัว
- `weekday_slots` / `weekend_slots` เป็นรายการ `HH:mm-HH:mm` คั่นด้วย comma
- `class_duration_minutes`, `break_minutes` และ `timezone` ใช้ตรวจนโยบาย

ค่าที่ผิดรูปแบบจะถูกแทนด้วยค่า default ใน Apps Script เพื่อไม่ให้ระบบเสีย หลังแก้ให้ตรวจ availability และจองทดสอบในอนาคตหนึ่งรอบ

## Google Sheets และ Backup

- ห้ามเปลี่ยนชื่อแท็บ `Bookings` / `Settings` หรือ header A–O
- ก่อนแก้โครงสร้าง ให้ File → Make a copy หรือ Download เป็น `.xlsx`
- สำรองรายสัปดาห์และก่อน deploy Apps Script ทุกครั้ง
- จำกัดสิทธิ์แก้ไขให้ผู้ดูแลเท่านั้น และทบทวนผู้มีสิทธิ์รายเดือน

## Rotate Secret

1. สุ่ม secret ใหม่อย่างน้อย 32 ตัวอักษร
2. เปลี่ยน Script Property `BOOKING_API_SECRET`
3. เปลี่ยน `GOOGLE_APPS_SCRIPT_API_SECRET` บน Vercel ให้ตรงกัน
4. Redeploy Vercel และทดสอบ availability/booking
5. ยกเลิกค่าเดิมทันที; ห้ามส่ง secret ในแชตหรือ screenshot

สำหรับ Admin ให้เปลี่ยน `ADMIN_PASSWORD` และ `ADMIN_SESSION_SECRET`; การเปลี่ยน session secret จะออกจากระบบทุก session เดิม

## Deploy ใหม่

1. รัน `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`
2. ตรวจ Environment Variables ของ Preview/Production
3. Deploy preview และทดสอบ Portfolio, Tutor, Booking, Admin
4. Promote/Deploy production
5. จองข้อมูลทดสอบที่ไม่ใช่ข้อมูลจริง ตรวจแถวใน Sheets แล้วเปลี่ยนเป็น `cancelled`

เมื่อแก้ Apps Script ต้องสร้าง deployment version ใหม่และคง URL `/exec` เดิมถ้าเป็นไปได้

## แก้ปัญหาเร็ว

| อาการ | ตรวจ | แก้ |
| --- | --- | --- |
| Booking แจ้งระบบยังไม่พร้อม | env URL/secret | ตั้งค่าและ redeploy |
| รอบเต็มทั้งที่ควรว่าง | แถว pending/confirmed วันเดียวกัน | แก้สถานะผิดเป็น cancelled |
| `SLOT_UNAVAILABLE` | มีคนจองชน | เลือกรอบใหม่; เป็นพฤติกรรมปกติ |
| Admin เข้าไม่ได้ | ADMIN_PASSWORD/SESSION_SECRET | ตั้งค่าใหม่และ redeploy |
| Apps Script unauthorized | secret สองฝั่งไม่ตรง | rotate ให้ตรงกัน |
| Apps Script timeout | Executions/Lock | รอคำขอจบ ตรวจ error แล้ว retry |
| ค่า Settings ไม่ทำงาน | รูปแบบราคา/slot | แก้ให้ตรง data dictionary |

ดูขั้นตอนเหตุขัดข้องเต็มใน `KRIT_HUB_AI_TUTOR_OPERATIONS_RUNBOOK.md`

## Current handoff — 2026-07-16

ระบบ Production พร้อมใช้งานแล้วบน https://krit-portfolio-liard.vercel.app Apps Script version 6, Google Sheets, อีเมลแจ้งเตือน, Admin และ Vercel Environment Variables เชื่อมครบ การทดสอบ Local และ Production ผ่านทั้ง booking, email delivery, duplicate slot, confirm, cancel, logout และ slot reopen

ข้อมูลทดสอบทั้งหมดถูกเปลี่ยนเป็น `cancelled` ไม่มีรายการ `pending` หรือ `confirmed` ค้าง ค่า secret อยู่เฉพาะ `.env.local`, Apps Script Script Property และ Vercel Environment Variables โดยไม่อยู่ใน Git หรือเอกสาร
