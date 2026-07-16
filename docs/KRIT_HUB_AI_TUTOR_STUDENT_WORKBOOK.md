# Student Workbook — KRIT HUB AI Tutor

ชื่อ: __________ วันที่: __________ Repository/Preview: __________

## Checklist

- [ ] เปิด Portfolio และ Tutor ได้
- [ ] อธิบาย architecture ได้
- [ ] สร้าง/เข้าถึง Sheets และ Apps Script
- [ ] ตั้ง server-only environment variables
- [ ] Availability ทำงาน
- [ ] Booking สำเร็จและกัน slot ซ้ำ
- [ ] Admin เปลี่ยนสถานะได้
- [ ] lint/typecheck/tests/build ผ่าน
- [ ] Deploy preview และตรวจ responsive

## ช่องบันทึก

| หัวข้อ | บันทึก |
| --- | --- |
| URL Preview (ไม่ใช่ secret) | |
| Apps Script deployment version | |
| Test booking reference | |
| ปัญหาที่พบ | |
| วิธีแก้ | |
| สิ่งที่จะปรับปรุง | |

## คำถามทบทวน

1. เพราะเหตุใด browser จึงไม่ควรเรียก Apps Script พร้อม secret โดยตรง?
2. `pending` ต่างจาก `confirmed` ต่อ availability อย่างไร?
3. Lock ป้องกัน race condition แบบใด?
4. SameSite cookie และ origin check ช่วยอะไร?
5. เหตุใดต้องยึดวันที่ Asia/Bangkok?

## Lab tasks

### Lab A — Pricing

เติมผลลัพธ์: 1 คน ____ / 2 คน ____ / 3 คน ____ / 4 คน ____ และเขียน test สำหรับ 0 กับ 5 คน

### Lab B — Availability

เลือกวันธรรมดา/วันหยุดอย่างละวัน บันทึก slot ที่คาดหวัง แล้วสร้าง booking หนึ่งรอบและตรวจว่ารอบนั้นเปลี่ยนเป็น unavailable

### Lab C — Validation/Security

ทดลองข้อมูลต่อไปนี้โดยไม่ใช้ PII จริง: วันที่อดีต, phone ผิด, onsite ไม่มี location, honeypot มีค่า, ส่งเร็วเกินไป และส่ง submission id ซ้ำ บันทึก code ที่ได้รับ

### Lab D — Admin

Login, filter รายการ, Confirm, Cancel และ Logout ตรวจว่าผู้ไม่ login อ่าน/แก้รายการไม่ได้

## Test cases

| Case | Expected | Actual | Pass |
| --- | --- | --- | --- |
| Booking ปกติ | 201 + reference | | [ ] |
| Slot ซ้ำ | 409/SLOT_UNAVAILABLE | | [ ] |
| Secret ผิด | UNAUTHORIZED | | [ ] |
| วันที่อดีต | VALIDATION_ERROR | | [ ] |
| Admin ไม่มี session | 401 | | [ ] |
| Cancel แล้วจองรอบเดิม | สำเร็จ | | [ ] |

## Submission checklist

- [ ] ไม่มี secret/token/password ในงานส่ง
- [ ] ไม่มีข้อมูลส่วนตัวจริง
- [ ] มี evidence ของ test/build
- [ ] มี architecture และคำอธิบาย trade-off
- [ ] มี rollback/backup plan
- [ ] ลบหรือ cancel ข้อมูลทดสอบแล้ว
