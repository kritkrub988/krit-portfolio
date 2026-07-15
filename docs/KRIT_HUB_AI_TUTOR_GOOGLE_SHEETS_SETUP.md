# คู่มือติดตั้ง KRIT HUB AI Tutor — Google Sheets Booking

คู่มือนี้เป็นขั้นตอนเตรียมระบบรับข้อมูลการจองจาก Next.js ไปยัง Google Apps Script และ Google Sheets สำหรับ MVP ปริมาณการจองไม่สูง งานใน Repository เตรียมซอร์สและเครื่องมือทดสอบไว้แล้ว แต่ **ยังไม่ได้สร้าง Google Sheets, ตั้งค่า Apps Script, Deploy หรือเชื่อม Credential จริง** ผู้ใช้ต้องทำขั้นตอนในบัญชี Google ของตนเองตามคู่มือนี้

## 1. ภาพรวม Data Flow

```text
เว็บไซต์ Next.js
  → Server-side API (เก็บ URL และ Secret ไว้ฝั่ง Server)
  → Google Apps Script Web App
  → Google Sheets: Bookings
  → ผู้ดูแลตรวจรายการและปรับสถานะ
```

หน้าเว็บไม่ควรเรียก Apps Script โดยตรง เพราะจะทำให้ Secret รั่วไปยัง Browser และเกิดปัญหา CORS ได้ Integration ที่เตรียมไว้จึงเรียกผ่าน Server เท่านั้น

## 2. สร้าง Google Sheets

1. เข้าบัญชี Google ที่ผู้ดูแลระบบจะใช้
2. สร้าง Spreadsheet ใหม่ชื่อ `KRIT HUB AI Tutor - Bookings`
3. ยังไม่ต้องสร้างชีตหรือ Header เอง ฟังก์ชัน `initializeSheets()` จะสร้าง/เติมให้
4. หากมีข้อมูลจริงอยู่แล้ว ให้สำรองไฟล์ก่อนรัน Script รุ่นใหม่

ระบบใช้ 2 ชีต:

- `Bookings` — เก็บรายการจอง A–O
- `Settings` — เก็บคู่ `key` / `value` สำหรับชื่อหลักสูตร รอบเวลา ราคา และ Timezone

## 3. เปิด Apps Script

ใน Google Sheets เลือก **Extensions → Apps Script** โครงการ Apps Script ที่เปิดจากเมนูนี้จะผูกกับ Spreadsheet อัตโนมัติ ซึ่งเป็นรูปแบบที่ซอร์สชุดนี้ต้องการ

## 4. คัดลอก Source

สร้างไฟล์ใน Apps Script แล้วคัดลอกเนื้อหาตามชื่อ:

1. `integrations/google-apps-script/Code.gs`
2. `integrations/google-apps-script/Config.gs`
3. `integrations/google-apps-script/Validation.gs`

ลบโค้ดตัวอย่าง `myFunction` ที่ Google สร้างให้เพื่อไม่ให้สับสน จากนั้นกด Save ตัวอย่าง Manifest อยู่ใน `appsscript.json.example`; การติดตั้งผ่านหน้าเว็บไม่จำเป็นต้องเปิดแก้ Manifest หากตั้ง Timezone ของ Project เป็น Bangkok แล้ว

## 5. รัน initializeSheets

1. ใน Toolbar ของ Apps Script เลือกฟังก์ชัน `initializeSheets`
2. กด **Run**
3. ครั้งแรกระบบจะขอสิทธิ์ ให้ตรวจชื่อ Project และบัญชีก่อนอนุญาต
4. กลับไป Google Sheets แล้วตรวจว่ามี `Bookings` และ `Settings`
5. ตรวจ Header ของ Bookings ให้ครบ A–O และ Settings ครบ 10 ค่า

ฟังก์ชันนี้รันซ้ำได้: ไม่ลบรายการจอง ไม่เขียนทับ Settings ที่มี และเติมเฉพาะคีย์ที่ขาด หาก Header ของ Bookings ผิดและมีข้อมูลอยู่ ระบบจะหยุดเพื่อป้องกันข้อมูลเสียหาย

## 6. อนุญาตสิทธิ์ Script อย่างปลอดภัย

Apps Script ต้องมีสิทธิ์อ่าน/เขียน Spreadsheet ที่ผูกอยู่ อนุญาตด้วยบัญชีผู้ดูแลที่เหมาะสมเท่านั้น หลีกเลี่ยงบัญชีส่วนตัวที่ไม่เกี่ยวข้อง และตรวจรายการสิทธิ์ก่อนกด Allow

หาก Google แสดง “This app isn’t verified” สำหรับ Script ส่วนตัว ให้ตรวจว่า Script URL, Project และบัญชีเป็นของคุณจริงก่อนเปิด Advanced เพื่อดำเนินการต่อ ห้ามทำขั้นตอนนี้กับ Script ที่ไม่ทราบแหล่งที่มา

## 7. ตั้ง Script Property: BOOKING_API_SECRET

1. Apps Script → **Project Settings**
2. ส่วน **Script Properties** → **Add script property**
3. Property: `BOOKING_API_SECRET`
4. Value: Secret แบบสุ่มยาวอย่างน้อย 32 ตัวอักษร
5. Save

ห้ามใส่ Secret ใน `.gs`, Google Sheets, เอกสาร, Git, Screenshot หรือ Chat Secret ต้องมีค่าเดียวกับ `GOOGLE_APPS_SCRIPT_API_SECRET` ใน Environment ของ Next.js

## 8. Deploy Apps Script เป็น Web App

ขั้นตอนนี้ผู้ใช้ต้องทำเอง:

1. กด **Deploy → New deployment**
2. Select type: **Web app**
3. Description: ระบุรุ่นและวันที่ เช่น `booking-api-v1`
4. Execute as: **Me** (ผู้ Deploy)
5. Who has access: เลือกการเข้าถึงที่ทำให้ Server เรียกได้โดยไม่ต้อง Google Login ตามข้อกำหนดบัญชี Workspace
6. กด Deploy และอนุญาตสิทธิ์

เมื่อเปิดให้ผู้ไม่ลงชื่อเข้าใช้เรียก Web App ได้ ความปลอดภัยจะพึ่ง HTTPS + Shared Secret ดังนั้น Secret ต้องเดายาก เก็บเฉพาะฝั่ง Server และ Rotate เมื่อสงสัยว่ารั่ว หากนโยบายองค์กรไม่อนุญาต anonymous Web App ต้องเปลี่ยนสถาปัตยกรรมไปใช้ OAuth/Google Cloud ซึ่งอยู่นอกขอบเขตรอบนี้

Apps Script ตอบ JSON ผ่าน `ContentService` แต่ไม่สามารถกำหนด HTTP status code ได้ครบเหมือน API Server Client จึงตรวจ `success` และ `code` ใน JSON เป็นหลัก

## 9. คัดลอก Web App URL

คัดลอก URL ที่ลงท้าย `/exec` จากหน้าต่าง Deployment ห้ามใช้ URL `/dev` ใน Next.js เพราะ `/dev` ใช้ทดสอบเฉพาะผู้มีสิทธิ์แก้ Script และไม่ใช่ Deployment จริง

เมื่อแก้ `.gs` ภายหลัง ต้องสร้าง Version/แก้ Deployment ให้ชี้เวอร์ชันใหม่ มิฉะนั้น URL เดิมอาจยังรันโค้ดเก่า

## 10. ตั้ง .env.local

สร้าง `.env.local` ที่ Root ของโครงการ (ระดับเดียวกับ `package.json`):

```dotenv
GOOGLE_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/REPLACE_WITH_DEPLOYMENT_ID/exec
GOOGLE_APPS_SCRIPT_API_SECRET=REPLACE_WITH_THE_SAME_STRONG_SECRET
```

ข้อควรระวัง:

- ห้ามใช้ prefix `NEXT_PUBLIC_`
- ห้าม Commit `.env.local`; `.gitignore` ครอบคลุม `.env*` แล้ว
- `.env.example` มีเฉพาะชื่อ Variable ไม่มีค่าจริง
- Restart `npm run dev` หลังเปลี่ยน Environment

## 11. ทดสอบ doGet

เปิด Web App URL `/exec` ใน Browser หรือใช้ PowerShell:

```powershell
Invoke-RestMethod -Method Get -Uri "YOUR_WEB_APP_URL"
```

ผลที่คาดหวัง:

```json
{"success":true,"service":"KRIT HUB AI Tutor Booking API","status":"ok"}
```

## 12. ทดสอบ Booking Request

Route ทดสอบมีเฉพาะ Development และตอบ 404 ใน Production เริ่ม Next.js ด้วย `npm run dev` แล้วเรียก:

```powershell
$body = @{
  customer_name = "ผู้จองทดสอบ"
  phone = "0800000000"
  booking_date = "2026-07-20"
  time_slot = "09:00-10:30"
  number_of_students = 2
  learning_format = "onsite"
  location = "ในเมืองพิษณุโลก"
  note = "ข้อมูลทดสอบ"
  line_user_id = ""
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/tutor/bookings/test" `
  -ContentType "application/json" `
  -Body $body
```

เปลี่ยนวันที่ให้เป็นวันอนาคตและ Slot ที่เปิดจริง การทดสอบนี้สร้างรายการใน Sheet จริง จึงควรใช้ Sheet ทดสอบและลบข้อมูลทดสอบหลังจบ

## 13. ตรวจข้อมูลใน Bookings

ตรวจว่าแถวใหม่มีข้อมูล A–O ครบ, Reference รูปแบบ `KHA-YYYYMMDD-XXXXXX`, `created_at` ตาม Asia/Bangkok, ราคา 2 คน 250/คน รวม 500, course จาก Settings และ status เริ่มต้น `pending`

อย่าแก้ Reference, วัน, Slot หรือราคาของรายการย้อนหลัง เพราะจะทำให้ Audit และการป้องกัน Slot ซ้ำคลาดเคลื่อน

## 14. เปลี่ยน Status

วิธีแนะนำสำหรับ MVP:

- ใช้ Dropdown คอลัมน์ N ใน `Bookings` เลือก `pending`, `confirmed` หรือ `cancelled`
- หรือรัน Helper ใน Apps Script console: `updateBookingStatus("KHA-...", "confirmed")`

รายการ `pending` และ `confirmed` ล็อก Slot; `cancelled` เปิดให้จอง Slot เดิมใหม่ได้ ห้ามใช้คำอื่นหรือเว้นว่าง

## 15. แก้รอบเวลาและราคาอย่างปลอดภัย

แก้เฉพาะค่าใน `Settings` และทดสอบในสำเนาก่อน:

- `weekday_slots`, `weekend_slots`: คั่นด้วย comma และใช้ `HH:mm-HH:mm`
- `price_1_person` ถึง `price_4_people`: เป็น “ราคารวม” จำนวนเต็มบวก
- `course_name`: ห้ามว่าง
- `timezone`: ระบบรองรับค่าใช้งานจริง `Asia/Bangkok`

Apps Script เป็น Source of Truth ของราคา ส่วน `src/lib/tutor-booking/price.ts` ใช้ Preview/Unit Test เท่านั้น หากเปลี่ยนราคาธุรกิจ ต้องเปลี่ยนทั้ง Settings และค่าฝั่ง Next.js แล้วรันทดสอบความสอดคล้อง ระบบจะใช้ค่ามาตรฐานจาก `Config.gs` เฉพาะคีย์ที่หายหรือผิดรูปแบบ

## 16. ป้องกัน Secret

- เรียก Apps Script จาก Server เท่านั้น
- จำกัดผู้เข้าถึง Apps Script, Google Sheets และ Environment ของ Hosting
- ไม่ Log Payload ทั้งก้อน, ชื่อ, เบอร์โทร, LINE user ID หรือ Secret
- ไม่ส่ง Secret ใน Query String
- ไม่เก็บข้อมูลบัตรหรือข้อมูลชำระเงิน

ข้อจำกัด Apps Script: `doPost(e)` ไม่สามารถอ่าน Custom Request Header ได้อย่างเชื่อถือได้ Integration จึงส่ง Secret ใน JSON body ผ่าน HTTPS พร้อม Header เพื่อความเข้ากันได้ แล้ว Apps Script ลบ `api_secret` ก่อน Validation และไม่บันทึก/Log ค่านี้

## 17. Rotate Secret

เมื่อสงสัยว่ารั่ว:

1. สร้าง Secret ใหม่ที่สุ่มและยาว
2. เปลี่ยน `BOOKING_API_SECRET` ใน Script Properties
3. เปลี่ยน `GOOGLE_APPS_SCRIPT_API_SECRET` ใน Environment ของ Next.js ให้ตรงกัน
4. Restart/สร้าง Deployment ของ Next.js ตามกระบวนการของทีม (ไม่รวมในงานรอบนี้)
5. ทดสอบ Secret ใหม่ และยืนยันว่า Secret เก่าถูกปฏิเสธ
6. ตรวจ Access Log โดยไม่คัดลอกข้อมูลส่วนบุคคลออกมา

การเปลี่ยนสองฝั่งไม่พร้อมกันทำให้เกิด `UNAUTHORIZED` ชั่วคราว ควรทำในช่วงที่ไม่มีการจอง

## 18. แก้ปัญหาที่พบบ่อย

- **Web App URL ผิด** — ต้องเป็น Deployment URL `/exec`, ไม่ใช่ Editor หรือ `/dev`
- **Permission denied** — รัน `initializeSheets` ใน Editor ด้วยบัญชีผู้ Deploy และตรวจ Execute as
- **Sheet name ผิด** — ต้องเป็น `Bookings` และ `Settings` ตัวพิมพ์ตรงกัน
- **Settings ไม่มี** — รัน `initializeSheets`; ระหว่างนั้นระบบใช้ Default และ Log `SETTINGS_FALLBACK`
- **JSON ผิดรูปแบบ** — ส่ง Object JSON, `Content-Type: application/json`, จำนวนผู้เรียนเป็น Number
- **Slot ถูกจองแล้ว** — ตรวจรายการ pending/confirmed วันและเวลาเดียวกัน
- **วันที่ย้อนหลัง** — ตรวจวันที่ปัจจุบันตาม Asia/Bangkok
- **Deploy Version เก่า** — Deploy → Manage deployments → Edit → New version
- **CORS** — อย่าเรียก Apps Script จาก Browser; เรียกผ่าน Next.js Server
- **Timeout** — ตรวจ Apps Script Executions/Quota และลองใหม่; Client ตัดที่ 10 วินาที
- **Secret ไม่ตรง** — ตรวจ Script Property/Environment โดยไม่แสดงค่าใน Log

## 19. ข้อจำกัด

- Google Sheets ไม่ใช่ฐานข้อมูลสำหรับระบบขนาดใหญ่
- Apps Script มี Quota, Execution time และข้อจำกัดการตอบ HTTP
- เหมาะกับ MVP และจำนวนการจองไม่สูง
- หน้า Tutor, Booking UI และ Admin ยังไม่ได้สร้างในรอบนี้
- LINE OA และระบบชำระเงินยังไม่ได้เชื่อม
- ยังไม่มี Google Sheet/Web App/Credential จริงจนกว่าผู้ใช้ทำขั้นตอนในบัญชีของตน
- Shared Secret ป้องกันคำขอทั่วไป แต่ไม่แทน OAuth หรือระบบ Identity เต็มรูปแบบ

## 20. Checklist สำหรับ Workshop

### ผู้สอนเตรียม

- Repository และสำเนา Google Sheets ทดสอบ
- บัญชี Google ที่เปิด Apps Script ได้
- Secret ทดสอบ (ไม่ใช่ Production)
- วันที่/Slot ทดสอบที่ยังว่าง
- อธิบาย PII, Shared Secret, Lock และ Apps Script quota ก่อนเริ่ม

### ผู้เรียนต้องมี

- Google Account ของตนเอง
- สิทธิ์ใช้ Apps Script ตามนโยบายองค์กร/โรงเรียน
- Node.js และโครงการติดตั้ง Dependency แล้ว
- Editor และ Terminal; ไม่ต้องมีบัตรหรือบัญชีชำระเงิน

### ขั้นตอน Workshop

1. สร้าง Sheet และเปิด Apps Script
2. คัดลอก `.gs` และรัน `initializeSheets`
3. ตั้ง Secret และ Deploy Web App ทดสอบ
4. ตั้ง `.env.local`
5. ทดสอบ GET, POST สำเร็จ, Validation และ Slot ซ้ำ
6. เปลี่ยน Status cancelled แล้วจอง Slot เดิมใหม่

### จุดตรวจระหว่าง Workshop

- Header A–O และ Settings ถูกต้อง
- Secret ไม่ปรากฏใน Browser, Source, Git หรือ Log
- วันธรรมดาไม่รับ 15:00; เสาร์–อาทิตย์รับ
- ราคาและ status ไม่รับจาก Client
- สองคำขอ Slot เดียวกันไม่สำเร็จพร้อมกัน

### ผลงานที่ผู้เรียนส่ง

- Screenshot โครงสร้าง Sheet ที่ปิดบังข้อมูลส่วนบุคคล
- ผล Health Check และ Response ทดสอบที่ลบ Secret/PII
- Checklist Test Cases ที่ผ่าน
- คำอธิบายสิ่งที่ยังเป็น Manual และข้อจำกัดของ MVP
