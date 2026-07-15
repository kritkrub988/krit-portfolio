# Data Dictionary — KRIT HUB AI Tutor Bookings

เอกสารนี้อธิบายคอลัมน์ A–O ของ Sheet `Bookings` ตามลำดับจริง ข้อมูลทั้งหมดเป็นข้อมูลการจอง จึงต้องจำกัดสิทธิ์เข้าถึง Google Sheets และไม่คัดลอกข้อมูลส่วนบุคคลไปยัง Log หรือระบบอื่นโดยไม่จำเป็น

| คอลัมน์ / Field | ความหมาย | ชนิด | Required | ตัวอย่าง (สมมติ) | Validation | Source of Truth | ข้อควรระวัง |
|---|---|---|---|---|---|---|---|
| A `booking_reference` | เลขอ้างอิงรายการจอง | String | Required | `KHA-20260720-A1B2C3` | `KHA-YYYYMMDD-XXXXXX`, ต้องไม่ซ้ำ | Apps Script ภายใต้ Lock | ห้ามแก้เองหลังสร้าง; ใช้อ้างอิงโดยไม่ต้องเปิดเผยเบอร์โทร |
| B `created_at` | เวลาที่ระบบรับการจอง | String datetime | Required | `2026-07-20 08:15:30` | `YYYY-MM-DD HH:mm:ss`, Asia/Bangkok | Apps Script clock | ไม่ใช่เวลาเรียน; เก็บเป็นข้อความเพื่อไม่ให้ Locale เปลี่ยนรูป |
| C `booking_date` | วันที่เรียน | String date | Required | `2026-07-20` | วันที่จริง `YYYY-MM-DD`, ไม่ย้อนหลัง | ผู้จอง + Apps Script Validation | ห้ามใช้รูปแบบ `DD/MM/YYYY`; มีผลต่อ Slot ซ้ำ |
| D `time_slot` | รอบเวลาเรียน | String enum | Required | `09:00-10:30` | ต้องอยู่ใน weekday/weekend slots ของวันนั้น | Settings + Apps Script | วันธรรมดาไม่มี `15:00-16:30` |
| E `customer_name` | ชื่อผู้ติดต่อจอง | String | Required | `ผู้จองทดสอบ` | Trim, ห้ามว่าง, Next.js จำกัด 150 ตัวอักษร | ผู้จอง | เป็น PII; ห้าม Log หรือใช้ตัวอย่างชื่อบุคคลจริง |
| F `phone` | เบอร์โทรผู้ติดต่อ | String | Required | `0800000000` | Trim, ห้ามว่าง, Next.js จำกัด 50 ตัวอักษร | ผู้จอง | เก็บเป็นข้อความเพื่อรักษาเลข 0; เป็น PII |
| G `number_of_students` | จำนวนผู้เรียนในรอบ | Integer | Required | `2` | จำนวนเต็ม 1–4 | ผู้จอง + Server Validation | ห้ามรับค่าทศนิยมหรือค่าที่ Client แปลงผิดชนิด |
| H `price_per_person` | ราคาต่อคน ณ เวลาจอง | Number | Required | `250` | คำนวณจากราคารวม/จำนวนคน | Apps Script Settings | ห้ามเชื่อค่าจาก Client; เก็บค่าเดิมเพื่อ Audit แม้เปลี่ยนราคาใหม่ |
| I `total_price` | ราคารวมของรายการ | Number | Required | `500` | Mapping 1–4 คนจาก Settings | Apps Script Settings | ไม่ใช่หลักฐานการชำระเงิน; ระบบไม่เก็บข้อมูลบัตร |
| J `course_name` | ชื่อหลักสูตรที่จอง | String | Required | `Level 2 + 2.5 Extra` | ต้องไม่ว่าง; ใช้ Default เมื่อ Settings ผิด | Apps Script Settings/Config | Client เปลี่ยนเองไม่ได้; เก็บ Snapshot ของรายการ |
| K `learning_format` | รูปแบบการเรียน | String enum | Required | `onsite` | `onsite` หรือ `online` เท่านั้น | ผู้จอง + Server Validation | ตัวพิมพ์เล็กตามค่ามาตรฐาน |
| L `location` | สถานที่หรือรายละเอียดการเรียน | String | Required ใน Payload ปัจจุบัน (อนุญาตข้อความว่าง) | `ในเมืองพิษณุโลก` | String, Trim, Next.js จำกัด 500 ตัวอักษร | ผู้จอง | อาจมีข้อมูลส่วนบุคคล; อย่าใส่รายละเอียดเกินจำเป็น |
| M `note` | หมายเหตุเพิ่มเติม | String | Optional | `ต้องการเน้นหัวข้อ AI` | Trim, Next.js จำกัด 2,000 ตัวอักษร | ผู้จอง | ข้อความอิสระเสี่ยงมี PII; ห้ามใช้เก็บข้อมูลชำระเงิน |
| N `status` | สถานะดำเนินการ | String enum | Required | `pending` | `pending`, `confirmed`, `cancelled`; เริ่ม `pending` | Apps Script ตอนสร้าง + ผู้ดูแลภายหลัง | pending/confirmed ล็อก Slot; cancelled ไม่ล็อก |
| O `line_user_id` | รหัส LINE สำหรับเชื่อมในอนาคต | String | Optional | ว่าง | Trim, Next.js จำกัด 200 ตัวอักษร | Client ที่ได้รับอนุญาตในอนาคต | รอบนี้ยังไม่เชื่อม LINE OA; เป็น Identifier ที่ต้องปกป้อง |

## Mapping ราคาเริ่มต้น

| จำนวนผู้เรียน | ราคาต่อคน | ราคารวม |
|---:|---:|---:|
| 1 | 300 | 300 |
| 2 | 250 | 500 |
| 3 | 220 | 660 |
| 4 | 220 | 880 |

Apps Script คำนวณราคาใหม่ทุกคำขอและไม่อ่าน `price_per_person`, `total_price`, `course_name` หรือ `status` จาก Client ค่าฝั่ง Next.js ใช้ Preview/Validation Test ไม่ใช่ Source of Truth สำหรับการบันทึก

## กติกาความเป็นส่วนตัวและการแก้ข้อมูล

- จำกัดสิทธิ์ Sheet เฉพาะผู้ดูแลที่จำเป็น
- ใช้ `booking_reference` ในการสื่อสารภายในแทนการคัดลอกชื่อ/เบอร์เมื่อทำได้
- ห้ามเก็บเลขบัตร, CVV, Slip หรือ Credential ในคอลัมน์ใด
- การแก้ status ใช้ค่าที่กำหนดเท่านั้น
- หากต้องแก้วันหรือ Slot ให้ยกเลิกรายการเดิมและสร้างใหม่เพื่อรักษาประวัติที่ชัดเจน
- กำหนดระยะเวลาเก็บข้อมูลและขั้นตอนลบข้อมูลตามนโยบายความเป็นส่วนตัวของผู้ดูแลก่อนใช้งานจริง
