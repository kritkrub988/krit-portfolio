# Data Dictionary — KRIT HUB AI Tutor

## Bookings (A–O)

| Col | Field | Type/format | ที่มา/กติกา |
| --- | --- | --- | --- |
| A | `booking_reference` | text | Server สร้าง `KHA-YYYYMMDD-XXXXXX`, unique |
| B | `created_at` | ISO text | Apps Script, Asia/Bangkok context |
| C | `booking_date` | `YYYY-MM-DD` text | วันนี้หรืออนาคต Bangkok |
| D | `time_slot` | `HH:mm-HH:mm` text | ต้องอยู่ใน Settings ตามวัน |
| E | `customer_name` | text 2–100 | ผู้จอง |
| F | `phone` | text 8–20 | เก็บเป็น text เพื่อรักษาเลข 0 |
| G | `number_of_students` | integer 1–4 | JSON number เท่านั้น |
| H | `price_per_person` | integer THB | Server คำนวณจาก Settings |
| I | `total_price` | integer THB | Server คำนวณจาก Settings |
| J | `course_name` | text | Settings |
| K | `learning_format` | enum | `onsite` หรือ `online` |
| L | `location` | text 0–200 | onsite ต้องมี; online ว่างได้ |
| M | `note` | text 0–500 | optional |
| N | `status` | enum | `pending`, `confirmed`, `cancelled` |
| O | `line_user_id` | text 0–100 | optional สำหรับอนาคต |

`pending` และ `confirmed` ปิด slot; `cancelled` ไม่ปิด slot

## Settings

| key | default | กติกา |
| --- | --- | --- |
| `course_name` | Level 2 + 2.5 Extra | non-empty |
| `class_duration_minutes` | 90 | positive integer |
| `break_minutes` | 30 | positive integer |
| `weekday_slots` | 09:00…19:00 | comma-separated slots |
| `weekend_slots` | 09:00…19:00 | รวม 15:00–16:30 |
| `price_1_person` | 300 | ราคารวม/หาร 1 ลงตัว |
| `price_2_people` | 500 | ราคารวม/หาร 2 ลงตัว |
| `price_3_people` | 660 | ราคารวม/หาร 3 ลงตัว |
| `price_4_people` | 880 | ราคารวม/หาร 4 ลงตัว |
| `timezone` | Asia/Bangkok | รองรับค่านี้เท่านั้น |

## API-only fields

`consent`, `website` (honeypot), `form_started_at` และ `submission_id` ใช้ตรวจคำขอใน Next.js และไม่บันทึกลง Sheets; `api_secret` ส่ง server-to-server เท่านั้น

## PII และ retention

ชื่อ/โทรศัพท์/location/note/LINE id เป็นข้อมูลส่วนบุคคล ให้จำกัดสิทธิ์, ไม่ใส่ log/screenshot, กำหนดระยะเก็บและวิธีลบตามนโยบายเจ้าของระบบ การยกเลิกควรเปลี่ยนสถานะแทนลบแถวเพื่อ audit ก่อนถึงกำหนด retention
