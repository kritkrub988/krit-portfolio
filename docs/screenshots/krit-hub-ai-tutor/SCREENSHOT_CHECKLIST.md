# Screenshot Checklist / Placeholder Mapping

วันที่ตรวจ: 2026-07-15 ห้ามใช้ภาพในสถานะ Placeholder อ้างว่าเป็นระบบจริง

| # | ไฟล์ | สถานะ | วิธีเก็บ/หมายเหตุ |
| --- | --- | --- | --- |
| 01 | `01-portfolio-home.png` | Captured (local) | Full-page animation ทำให้ภาพไม่เหมาะเป็นภาพหลัก; ใช้ตรวจอ้างอิงเท่านั้น |
| 02 | `02-tutor-home.png` | Captured (local) | ตรวจภาพแล้ว |
| 03 | `03-course-page.png` | Captured (local) | ตรวจภาพแล้ว |
| 04 | `04-pricing-page.png` | Captured (local) | ตรวจภาพแล้ว |
| 05 | `05-booking-date.png` | Placeholder | เปิด booking เลือกวันที่อนาคต; ปกปิด PII |
| 06 | `06-booking-slots.png` | Placeholder | ต้องตั้ง Apps Script ก่อนเพื่อเห็น availability จริง |
| 07 | `07-booking-price.png` | Placeholder | เลือก 1–4 คนและแสดงราคารวม |
| 08 | `08-booking-success.png` | Placeholder | ใช้ข้อมูลสมมติ/reference; ห้ามมี phone |
| 09 | `09-admin-login.png` | Placeholder | ห้ามแสดง password |
| 10 | `10-admin-bookings.png` | Placeholder | ปกปิดชื่อ/phone/location/note |
| 11 | `11-google-sheet-bookings.png` | Placeholder | เปิด native Sheet; ปกปิดทุก PII |
| 12 | `12-google-sheet-settings.png` | Placeholder | เก็บได้หลังเจ้าของเปิดชีต |
| 13 | `13-apps-script.png` | Placeholder | ห้ามเปิด Script Properties/secret |
| 14 | `14-vercel-production.png` | Placeholder | เก็บหลัง deploy เวอร์ชัน Tutor และ end-to-end ผ่าน |
| 15 | `15-line-rich-menu-plan.png` | Planned | ทำ design ภายหลัง; ต้องติดป้ายว่า plan ไม่ใช่ production |

Browser automation ตรวจ DOM/API/responsive เพิ่มแล้ว แม้การ capture บางหน้าหมดเวลา ไม่ได้สร้างภาพจำลองทดแทน

## ภาพเพิ่มวันที่ 2026-07-16

| ไฟล์ | สถานะ | หมายเหตุ |
| --- | --- | --- |
| `tutor-home.png` | Captured (local) | หน้า Tutor หลัก |
| `pricing.png` | Captured (local) | ตารางราคา |
| `booking-price.png` | Captured (local) | Preview 2 คน: 250 บาท/คน รวม 500 บาท |
| `booking-slots.png` | Captured (local) | ฟอร์มก่อนเชื่อม availability จริง ไม่มี PII |
| `admin-login.png` | Captured (local) | ไม่แสดง password |
| `admin-bookings.png` | Captured (local) | ใช้ข้อมูลทดสอบเท่านั้น ไม่มี secret |
| `production-current-home.png` | Captured (production เดิม) | หลักฐานว่า Portfolio เดิมยังเปิดได้; ไม่ใช่หลักฐานว่า Tutor ถูก deploy แล้ว |
| `production-home.png` | Captured (production ใหม่) | Domain เดิมหลัง deploy; console error 0 และไม่มี horizontal overflow |

ยังไม่มีภาพ booking success และ Google Sheets ที่ปลอดภัยต่อการเผยแพร่ จึงใช้ API/DOM/deployment evidence แทนและไม่สร้างภาพจำลอง
