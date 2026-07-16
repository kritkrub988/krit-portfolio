# Operations Runbook

## Daily check (5–10 นาที)

- เปิด production home/tutor/booking
- เลือกวันที่อนาคต ตรวจ availability
- ตรวจ Admin รายการ pending และ Apps Script Executions error
- ตรวจ Bookings ว่าไม่มีแถวผิด header/ราคา/status
- ห้ามสร้าง booking จริงทุกวัน; ใช้ synthetic monitor เฉพาะเมื่อมีแผน cleanup

## Booking issue

1. บันทึกเวลา, route, error code และ booking reference (ถ้ามี) โดยไม่คัดลอก PII
2. ตรวจ Vercel runtime logs และ Apps Script Executions
3. ตรวจ env URL/secret ว่ามีและ deployment ใช้เวอร์ชันล่าสุด
4. หากผู้ใช้ไม่แน่ใจว่าจองสำเร็จ ให้ค้นจาก reference/วัน/slot ก่อน retry
5. ห้ามเพิ่มแถวเองจนยืนยันว่า request เดิมล้มเหลว

## Slot issue

- ตรวจ Settings format และ timezone
- ตรวจ pending/confirmed ที่วัน/slot เดียวกัน
- ถ้ายกเลิกแล้วแต่ slot ยังปิด ให้ตรวจ status สะกด `cancelled`
- หาก race ให้เก็บ execution time/request ids ที่ไม่ใช่ PII และตรวจ Lock

## Apps Script issue

- `UNAUTHORIZED`: secret ไม่ตรง → rotate
- `CONFIGURATION_ERROR`: ชื่อแท็บ/header/property
- `LOCK_TIMEOUT`: traffic/process ค้าง → ตรวจ Executions แล้ว retry
- timeout/network: ตรวจ deployment URL `/exec`, permission และ quota
- หลังแก้ source ต้องสร้าง version ใหม่

## Vercel issue

1. ตรวจ deployment/build/runtime logs
2. ยืนยัน env scope Preview/Production
3. rollback ไป deployment READY ล่าสุดถ้าเกิดผลกระทบ
4. แก้ใน branch, ผ่าน quality gates, deploy preview แล้ว promote

## Secret rotation

สร้างค่าใหม่ → เปลี่ยน Apps Script Property → เปลี่ยน Vercel env → redeploy → smoke test → revoke ค่าเก่า → บันทึกวัน/ผู้รับผิดชอบโดยไม่บันทึกค่าจริง

## Incident checklist

- [ ] ระบุ severity/impact/start time
- [ ] หยุดช่องทางที่รั่วหรือ rollback
- [ ] เก็บหลักฐานที่ไม่มี PII/secret
- [ ] rotate credential ที่เกี่ยวข้อง
- [ ] ตรวจ booking ที่อาจซ้ำ/ตกหล่น
- [ ] แจ้งผู้เกี่ยวข้องตาม policy
- [ ] กู้ระบบและ end-to-end verify
- [ ] สรุป root cause/action owner/deadline

## Backup/restore

สำรอง Sheets รายสัปดาห์และก่อนเปลี่ยน schema/Apps Script; restore ในสำเนาก่อน, ตรวจ header/Settings/จำนวนแถว แล้วสลับ integration หลังได้รับอนุมัติ ห้ามเขียนทับ production โดยไม่สำรอง
