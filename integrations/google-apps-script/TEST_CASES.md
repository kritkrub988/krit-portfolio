# Test Cases — Google Apps Script

ใช้สำเนาชีตและข้อมูลสมมติ ตั้ง `BOOKING_API_SECRET`, run `initializeSheets()`, deploy URL `/exec` แล้วเลือกวันที่อนาคตตาม Asia/Bangkok

| # | Case | Expected |
| --- | --- | --- |
| 1 | Run initialize สองครั้ง | สร้าง/เติมโครงสร้างโดยไม่ลบหรือซ้ำ |
| 2 | GET health | `success:true`, `status:ok`, ไม่เผย secret |
| 3 | `availability` วันธรรมดา | 5 slots; แยก available/unavailable ถูกต้อง |
| 4 | `availability` วันหยุด | 6 slotsรวม 15:00–16:30 |
| 5 | Create booking ปกติ 2 คน | reference, pending, 250/คน, รวม 500, เพิ่ม 1 แถว |
| 6 | Create slot เดิมพร้อมกัน | สำเร็จ 1 คำขอ; อีกคำขอ `SLOT_UNAVAILABLE` |
| 7 | วันที่อดีต/slot ผิดวัน | `VALIDATION_ERROR`, ไม่เพิ่มแถว |
| 8 | จำนวน 0, 5, 1.5, `"2"` | ปฏิเสธทั้งหมด |
| 9 | onsite ไม่มี location | `VALIDATION_ERROR` |
| 10 | online ไม่มี location | สำเร็จ |
| 11 | secret ผิด/หาย | `UNAUTHORIZED`, ไม่ log secret/payload |
| 12 | Lock เกิน 10 วินาที | `LOCK_TIMEOUT`, ไม่เพิ่มแถว |
| 13 | Booking reference collision | สุ่มใหม่ก่อนบันทึก; unique |
| 14 | Bookings sheet/header ผิด | `CONFIGURATION_ERROR`, ไม่เผย stack/id |
| 15 | Settings หาย/ค่าผิด | ใช้ default เฉพาะค่าที่ผิดและ log fallback |
| 16 | `listBookings` | เรียงใหม่สุดก่อน, สูงสุด 500, shape ถูกต้อง |
| 17 | เบอร์โทรขึ้นต้นด้วย `0` | ค่าใน Sheets และ Admin ต้องคงเลข `0` นำหน้า |
| 17 | `updateStatus` valid | เปลี่ยน pending/confirmed/cancelled |
| 18 | update ref/status ผิด | `VALIDATION_ERROR` หรือ `NOT_FOUND` |
| 19 | cancelled slot | availability เปิดและจองใหม่ได้ |
| 20 | unknown action/body JSON เสีย | error แบบปลอดภัย, ไม่แก้ข้อมูล |
| 21 | Create booking หลังอนุมัติ MailApp | บันทึก booking และส่งอีเมลหนึ่งฉบับพร้อม reference |
| 22 | MailApp ส่งไม่สำเร็จ | booking ยังสำเร็จและ log เฉพาะ code/reference โดยไม่ log PII |

หลังทดสอบ ตรวจ Bookings A–O, ราคา/course/status มาจาก server/settings, ไม่มี PII/secret ใน Executions log และเปลี่ยนข้อมูลทดสอบเป็น `cancelled` หรือลบตามนโยบาย
