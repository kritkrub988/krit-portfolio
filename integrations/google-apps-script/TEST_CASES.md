# Test Cases — KRIT HUB AI Tutor Google Apps Script

เอกสารนี้ใช้ทดสอบในสำเนา Google Sheets สำหรับทดสอบเท่านั้น ห้ามใช้ข้อมูลส่วนบุคคลจริง และควรลบรายการทดสอบหลังจบงาน

## ข้อมูลตั้งต้น

1. สร้าง Google Sheets ชื่อ `KRIT HUB AI Tutor - Bookings`
2. คัดลอก `Code.gs`, `Config.gs`, `Validation.gs` เข้า Apps Script
3. ตั้ง Script Property `BOOKING_API_SECRET` เป็นค่าทดสอบที่เดายาก
4. รัน `initializeSheets()` และอนุญาตสิทธิ์
5. Deploy เป็น Web App เวอร์ชันทดสอบ แล้วใช้ URL `/exec`
6. เลือกวันทดสอบในอนาคตตามเวลา `Asia/Bangkok`

Payload มาตรฐาน (เปลี่ยนวันที่และ Secret ก่อนใช้):

```json
{
  "api_secret": "YOUR_TEST_SECRET",
  "customer_name": "ผู้จองทดสอบ",
  "phone": "0800000000",
  "booking_date": "2026-07-20",
  "time_slot": "09:00-10:30",
  "number_of_students": 2,
  "learning_format": "onsite",
  "location": "ในเมืองพิษณุโลก",
  "note": "ข้อมูลทดสอบ",
  "line_user_id": ""
}
```

## กรณีทดสอบ

### 1. initializeSheets

- เตรียม: ใช้ไฟล์ที่ยังไม่มี `Bookings` และ `Settings`
- ทำ: เลือกฟังก์ชัน `initializeSheets` แล้ว Run
- คาดหวัง: สร้าง 2 ชีต, Header `Bookings` ครบ A–O, Settings ครบ, Freeze แถวแรก และไม่สร้างรายการจอง
- ทดสอบซ้ำ: รันอีกครั้ง ต้องไม่ลบ/เขียนทับรายการเดิมและไม่เพิ่ม Settings ซ้ำ

### 2. doGet

- ทำ: เปิด Web App URL ด้วย GET
- คาดหวัง: JSON มี `success: true`, service ตรงชื่อระบบ และ `status: "ok"`

### 3. Booking สำเร็จ

- เตรียม: ใช้วันอนาคตและรอบที่เปิด โดยยังไม่มีรายการชนกัน
- ทำ: POST Payload มาตรฐาน
- คาดหวัง: `success: true`, Reference รูปแบบ `KHA-YYYYMMDD-XXXXXX`, สถานะ `pending`, ราคา 2 คนเป็น 250/คน รวม 500 และมีแถวใหม่หนึ่งแถว

### 4. Booking ซ้ำ

- เตรียม: มีรายการ `pending` หรือ `confirmed` ที่วันและรอบเดียวกัน
- ทำ: POST วันและรอบเดิมอีกครั้ง
- คาดหวัง: `success: false`, `code: "SLOT_UNAVAILABLE"` และไม่เพิ่มแถว

### 5. วันที่ย้อนหลัง

- ทำ: POST `booking_date` ก่อนวันปัจจุบันตาม Asia/Bangkok
- คาดหวัง: `VALIDATION_ERROR`, errors ระบุวันที่ย้อนหลัง และไม่เพิ่มแถว

### 6. Slot ไม่ตรงวัน

- ทำ: เลือกวันจันทร์–ศุกร์และส่ง `15:00-16:30`
- คาดหวัง: `VALIDATION_ERROR` เพราะรอบนี้เปิดเฉพาะเสาร์–อาทิตย์

### 7. จำนวนผู้เรียนผิด

- ทำ: ทดสอบค่า 0, 5, 1.5 และข้อความ `"2"`
- คาดหวัง: ค่าที่ไม่ใช่จำนวนเต็ม 1–4 ถูกปฏิเสธ (JSON จาก Next.js ต้องส่งเป็น Number)

### 8. Secret ผิด

- ทำ: POST ด้วย `api_secret` ที่ไม่ตรง Script Property
- คาดหวัง: `UNAUTHORIZED`, ไม่มีข้อมูลคำขอ/Secret ใน Log และไม่เพิ่มแถว

### 9. cancelled slot จองใหม่ได้

- เตรียม: เปลี่ยนรายการเดิมเป็น `cancelled`
- ทำ: POST วันและรอบเดียวกัน
- คาดหวัง: จองสำเร็จและได้ Reference ใหม่

### 10. Lock Timeout

- เตรียม: ในสำเนาสคริปต์ทดสอบ ให้ฟังก์ชันทดสอบถือ Script Lock เกิน 10 วินาที
- ทำ: POST ระหว่างที่ Lock ถูกถืออยู่
- คาดหวัง: `LOCK_TIMEOUT`, ไม่มีแถวใหม่ และระบบ release lock ของคำขออย่างปลอดภัย
- หลังทดสอบ: ลบฟังก์ชันทดสอบ Lock ออกก่อนสร้าง Deployment ใหม่

### 11. Booking Reference ไม่ซ้ำ

- ทำ: สร้างรายการหลายรายการต่างรอบ แล้วตรวจคอลัมน์ A
- คาดหวัง: ทุกค่าไม่ซ้ำและตรง `KHA-YYYYMMDD-[A-Z0-9]{6}`
- ทดสอบเชิงบังคับในสำเนา: Mock UUID ให้ชนครั้งแรก ระบบต้องสุ่มใหม่ก่อนบันทึก

### 12. Sheet หาย

- เตรียม: เปลี่ยนชื่อ `Bookings` ชั่วคราวหลัง initialize
- ทำ: POST ที่ผ่าน Validation
- คาดหวัง: `CONFIGURATION_ERROR`, ไม่เผย Spreadsheet ID/Stack Trace และไม่มีข้อมูลตกค้าง
- คืนค่า: เปลี่ยนชื่อกลับหรือรัน `initializeSheets`

### 13. Settings หาย

- เตรียม: เปลี่ยนชื่อ `Settings` ชั่วคราว
- ทำ: POST ที่ถูกต้อง
- คาดหวัง: ระบบใช้ค่ามาตรฐานสำรองจาก `Config.gs`, บันทึกได้ และ Log เฉพาะ `SETTINGS_FALLBACK`
- คืนค่า: เปลี่ยนชื่อกลับหรือรัน `initializeSheets`

### 14. Settings ผิดรูปแบบ

- เตรียม: ใส่ราคาติดลบ, Slot รูปแบบผิด หรือ Timezone อื่น
- ทำ: POST ที่ถูกต้อง
- คาดหวัง: เฉพาะคีย์ที่ผิดใช้ค่ามาตรฐานสำรอง; ไม่รับราคา/รอบจาก Client
- คืนค่า: แก้ Settings เป็นค่าที่ผ่านการตรวจแล้วทดสอบใหม่

## ตรวจ Log และข้อมูลหลังทดสอบ

- Log ต้องไม่มี Secret, เบอร์โทร, ชื่อ, LINE user ID หรือ Payload ทั้งก้อน
- แถวใน `Bookings` ต้องเรียง A–O ตาม Data Dictionary
- ราคา, course และ status ต้องมาจาก Server/Settings ไม่ใช่ค่าที่ Client แอบส่ง
- ทดสอบพร้อมกันสองคำขอใน Slot เดียวกัน: ต้องสำเร็จเพียงคำขอเดียว
