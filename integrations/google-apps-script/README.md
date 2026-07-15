# KRIT HUB AI Tutor — Google Apps Script

ซอร์สในโฟลเดอร์นี้ใช้สร้าง Web App สำหรับรับคำขอจองและบันทึกลง Google Sheets โดยต้องคัดลอกเข้า Apps Script ที่ผูกกับไฟล์ `KRIT HUB AI Tutor - Bookings` ด้วยตนเอง

ไฟล์หลัก:

- `Config.gs` เก็บค่าตั้งต้น อ่าน Settings และสร้างโครงสร้างชีต
- `Validation.gs` ตรวจวันที่ รอบเวลา จำนวนผู้เรียน และข้อมูลคำขอ
- `Code.gs` ให้บริการ `doGet`, `doPost` และคำสั่งช่วยผู้ดูแล
- `appsscript.json.example` เป็นตัวอย่าง Manifest (เปลี่ยนชื่อเป็น `appsscript.json` เมื่อใช้ `clasp`)
- `TEST_CASES.md` เป็นรายการทดสอบด้วยตนเองใน Apps Script

เริ่มต้นโดยคัดลอกไฟล์ `.gs` ทั้งสามไฟล์เข้า Apps Script ตั้ง Script Property ชื่อ `BOOKING_API_SECRET` แล้วรัน `initializeSheets()` หนึ่งครั้ง รายละเอียดทั้งหมดอยู่ที่ `docs/KRIT_HUB_AI_TUTOR_GOOGLE_SHEETS_SETUP.md`

ข้อสำคัญ: Apps Script Web App ไม่เปิด Custom Request Header ให้ `doPost(e)` อ่านได้อย่างเชื่อถือได้ การเชื่อมต่อชุดนี้จึงส่ง Secret ใน JSON body ผ่าน HTTPS และลบทิ้งก่อน Validation/บันทึกข้อมูล ห้ามเรียก Web App จาก Browser โดยตรงและห้ามใส่ Secret ในตัวแปรที่ขึ้นต้นด้วย `NEXT_PUBLIC_`
