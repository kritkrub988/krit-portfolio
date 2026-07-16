# 1. ปก

**KRIT HUB AI Tutor — คู่มือระบบจองเรียนและ Workshop**  
Version 1.0 · 15 กรกฎาคม 2026 · Owner: KRIT

เอกสารต้นฉบับพร้อมจัดหน้าเพื่อ export เป็น Word, PDF และ PPTX โดยไม่บรรจุ credential หรือข้อมูลส่วนบุคคล

# 2. สารบัญ

1. ปก  2. สารบัญ  3. ภาพรวมระบบ  4. เป้าหมาย  5. Architecture  
6. ข้อมูลหลักสูตร  7. ราคา  8. ตารางเวลา  9. Google Sheets  10. Google Apps Script  
11. Website  12. Booking Flow  13. Availability  14. Admin  15. Security  
16. Deployment  17. LINE OA ภายหลัง  18. Operations  19. Troubleshooting  
20. Workshop สำหรับสอน  21. Student Exercises  22. QA Checklist  
23. Production Checklist  24. Glossary  25. Appendix

# 3. ภาพรวมระบบ

ระบบเพิ่มบริการ AI Tutor ลงใน Portfolio เดิม มีหน้าหลักสูตร/ราคา/จองและ Admin โดยใช้ Next.js เป็น UI/Server, Apps Script เป็น secure adapter และ Google Sheets เป็น datastore ที่เจ้าของตรวจได้ง่าย

# 4. เป้าหมาย

- เปลี่ยนผู้ชม Portfolio ให้ค้นพบและจองเรียนได้
- แสดงราคา/เวลาอย่างโปร่งใส
- ป้องกัน double booking และไม่เปิดเผย secret
- ให้ผู้ดูแล Confirm/Cancel ได้
- ใช้เป็นตัวอย่างสอน full-stack + automation ได้
- เตรียม LINE OA โดยไม่ทำให้ระบบหลักขึ้นกับ LINE

# 5. Architecture

```text
Student Browser ─┐
                 ├→ Next.js UI/API → HTTPS + shared secret → Apps Script → Sheets
Admin Browser ───┘       ↑
                 signed HttpOnly cookie
```

ขอบเขตความเชื่อถือ: browser ไม่ถือ integration secret; Next.js validate/origin/rate limit; Apps Script validate ซ้ำและ lock ก่อนเขียน

# 6. ข้อมูลหลักสูตร

ชื่อหลักสูตร `Level 2 + 2.5 Extra` สอน AI แบบลงมือทำ ระยะเรียนมาตรฐาน 90 นาที พักระหว่างรอบ 30 นาที รองรับ onsite และ online; onsite ต้องระบุสถานที่

# 7. ราคา

| ผู้เรียน | ต่อคน | รวม |
| --- | ---: | ---: |
| 1 | 300 | 300 |
| 2 | 250 | 500 |
| 3 | 220 | 660 |
| 4 | 220 | 880 |

Apps Script คำนวณจาก Settings ไม่รับราคาจาก browser

# 8. ตารางเวลา

วันจันทร์–ศุกร์: 09:00, 11:00, 13:00, 17:00, 19:00  
เสาร์–อาทิตย์: เพิ่ม 15:00–16:30 รวมเป็น 6 รอบ เวลาอ้างอิง `Asia/Bangkok`

# 9. Google Sheets

Native Sheet: https://docs.google.com/spreadsheets/d/1Y3yQR58olRgBlf7ghuWxU6ayAmdwYzUGTxji6_ucfkw/edit

`Bookings` เก็บ A–O; `Settings` เป็น source ของ course/price/slot/timezone ห้ามเปลี่ยนชื่อแท็บ/header สำรองก่อนแก้ schema ดู field ทั้งหมดใน Data Dictionary

# 10. Google Apps Script

Source อยู่ที่ `integrations/google-apps-script/` รองรับ health, create booking, email notification, availability, list bookings และ update status ใช้ Script Property `BOOKING_API_SECRET`, `BOOKING_NOTIFICATION_EMAIL`, Script Lock และ safe JSON errors ต้อง deploy เป็น Web App URL `/exec`

# 11. Website

Routes: `/`, `/tutor`, `/tutor/course`, `/tutor/pricing`, `/tutor/booking`, `/tutor/booking/success`, `/admin/bookings` หน้า Admin/success ถูกกัน index ตามความเหมาะสมและ security headers เปิดใช้ส่วนหลัก

# 12. Booking Flow

1. ผู้เรียนเลือกวัน → โหลด availability
2. เลือก slot/จำนวน/รูปแบบ → แสดงราคา
3. กรอกชื่อ/โทรศัพท์/location/note และ consent
4. Client ส่ง submission id/timing/honeypot
5. Next.js validate/rate-limit แล้วเรียก Apps Script
6. Apps Script lock, recheck slot, คำนวณราคา, เพิ่มแถว
7. Success แสดง reference/สรุปที่ไม่เปิดเผย PII

# 13. Availability

`GET /api/tutor/availability?date=YYYY-MM-DD` ตรวจวันจริงและไม่ย้อนหลัง Apps Script รวม Settings กับ booking ที่สถานะ pending/confirmed; cancelled ไม่ปิด slot Response ไม่ cache และ error แบบ fail-safe

# 14. Admin

`/admin/bookings` ใช้ shared password แล้วสร้าง session token ลงนาม HMAC ใน HttpOnly/SameSite=Strict cookie อายุ 8 ชั่วโมง ผู้มี session จึง list/filter และเปลี่ยนสถานะได้ Logout ล้าง cookie

# 15. Security

- Zod validation ทั้ง API และ parse response
- server-only secrets/HTTPS `/exec`
- origin check, SameSite cookie, constant-time password compare
- honeypot, minimum form time, submission dedupe, best-effort rate limit
- Apps Script validation/Lock
- noindex admin, no-store sensitive APIs
- ไม่ log/แสดง PII และไม่ส่ง secret สู่ client

ข้อจำกัด: admin shared account ไม่มี MFA/audit รายบุคคล และ memory guard ไม่ใช่ distributed store

# 16. Deployment

ผ่าน lint/typecheck/50 tests/build แล้ว Apps Script, Google Sheets, อีเมลแจ้งเตือน, Admin และ Vercel Production เชื่อมครบ ดูผล end-to-end ล่าสุดใน Deployment Report และ QA Report

# 17. LINE OA ภายหลัง

Rich menu เชื่อม Course/Pricing/Booking/Contact ได้ ต่อไปค่อยเพิ่ม webhook ที่ verify signature และใช้ service layer เดียวกัน Core web ต้องทำงานเมื่อ LINE ปิด

# 18. Operations

ตรวจ pending/availability/logs รายวัน, backup Sheets รายสัปดาห์, rotate secrets เมื่อสงสัยรั่ว, deploy ผ่าน preview และมี rollback owner ทุกครั้ง รายละเอียดใน Operations Runbook

# 19. Troubleshooting

| Code/อาการ | ความหมาย | การแก้ |
| --- | --- | --- |
| `INTEGRATION_NOT_CONFIGURED` | env Google ไม่ครบ | ตั้ง URL/secret และ redeploy |
| `UNAUTHORIZED` | secret/session ผิด | ตรวจ/rotate |
| `SLOT_UNAVAILABLE` | slot ถูกปิด | เลือกใหม่หรือตรวจ status |
| `VALIDATION_ERROR` | input/settings ผิด | แก้ตาม Data Dictionary |
| `LOCK_TIMEOUT` | คำขอชน/ค้าง | ตรวจ Executions แล้ว retry |
| 401 Admin | ไม่มี/หมด session | Login ใหม่หรือตั้ง Admin env |

# 20. Workshop สำหรับสอน

ลำดับ: architecture → frontend/backend/API → Sheets/Apps Script → availability/booking → admin/security → tests → deploy → reflection ใช้ checkpoint หลังทุกช่วงและข้อมูลสมมติ ดู Instructor Guide

# 21. Student Exercises

เขียน pricing boundary tests, ทดลอง validation, อธิบาย lock/race, แก้ slot ใน Settings, ตรวจ unauthorized admin และออกแบบ LINE rollout ส่ง evidence ที่ปกปิด PII ตาม Student Workbook

# 22. QA Checklist

- [x] lint/typecheck/tests/build
- [x] Apps Script syntax
- [x] local routes/API fail-safe
- [x] responsive/console/overlay checks
- [x] Google Sheet native structure
- [ ] Apps Script live deployment
- [ ] live booking/availability/admin with Sheets
- [ ] production Tutor deployment screenshot

# 23. Production Checklist

- [x] เจ้าของอนุญาต Apps Script และได้ `/exec`
- [x] ตั้ง Google/Admin secrets ใน Vercel
- [ ] backup Sheets และจำกัดสิทธิ์
- [x] deploy preview ผ่าน build/smoke gate
- [x] deploy/promote production
- [x] booking + duplicate + confirm + cancel ผ่าน
- [x] logs/client/screenshot ไม่มี secret/PII
- [ ] monitoring/retention/incident owner พร้อม

# 24. Glossary

**API** สัญญารับส่งข้อมูล · **Apps Script** runtime ของ Google · **Environment variable** config นอก source · **HMAC** ลายเซ็นตรวจ token · **Honeypot** ช่องล่อ bot · **Idempotency** ส่งซ้ำไม่เกิดผลซ้ำ · **PII** ข้อมูลระบุตัวบุคคล · **Race condition** คำขอพร้อมกันทำให้ผลชน · **Secret rotation** เปลี่ยนและยกเลิก credential · **Webhook** endpoint รับ event

# 25. Appendix

## เอกสารประกอบ

- `KRIT_HUB_AI_TUTOR_SYSTEM_GUIDE.md`
- `KRIT_HUB_AI_TUTOR_INSTRUCTOR_GUIDE.md`
- `KRIT_HUB_AI_TUTOR_STUDENT_WORKBOOK.md`
- `KRIT_HUB_AI_TUTOR_GOOGLE_SHEETS_SETUP.md`
- `KRIT_HUB_AI_TUTOR_BOOKING_DATA_DICTIONARY.md`
- `KRIT_HUB_AI_TUTOR_LINE_OA_SETUP.md`
- `KRIT_HUB_AI_TUTOR_OPERATIONS_RUNBOOK.md`
- `KRIT_HUB_AI_TUTOR_QA_REPORT.md`
- `KRIT_HUB_AI_TUTOR_DEPLOYMENT_REPORT.md`
- `screenshots/krit-hub-ai-tutor/SCREENSHOT_CHECKLIST.md`

## Environment template

`.env.example` มีเฉพาะชื่อ key/ค่าว่าง ไม่มี secret จริง LINE variables เป็น optional future integration

## Export note

เมื่อจัดทำ Word/PDF/PPTX ให้ใช้ heading เหล่านี้เป็น section, ฝังเฉพาะภาพ Captured ที่ตรวจแล้ว, แสดง link เป็นข้อความ และทำ redaction PII/credential ก่อน export

## สถานะส่งมอบล่าสุด — 2026-07-16

ส่วนโค้ด, UI, API, Admin, Apps Script source, Google Sheet, tests และคู่มือพร้อมแล้ว Apps Script version 6 และ Vercel Production ถูก deploy จริงบน domain เดิม End-to-end booking/email delivery/duplicate/confirm/cancel/slot reopen ผ่าน Production ข้อมูลทดสอบทั้งหมดเป็น `cancelled`
