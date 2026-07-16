# คู่มือผู้สอน — Workshop KRIT HUB AI Tutor

## Learning objectives

หลังจบ ผู้เรียนควรอธิบาย flow Browser → API → Apps Script → Sheets, แยก client/server secret, สร้างฟอร์มที่ validate ได้, ป้องกันการจองชน, deploy และตรวจระบบ end-to-end ได้

## Accounts และ software

- Google Account ที่สร้าง Sheets และ Apps Script ได้
- Vercel Account และ Git repository
- Node.js/npm, editor, browser และ terminal
- Source repository นี้; ใช้ข้อมูลทดสอบเท่านั้น

## Workshop flow (ประมาณ 6 ชั่วโมง)

1. 30 นาที: ปัญหาและ architecture
2. 45 นาที: สำรวจ Frontend/Backend/API
3. 60 นาที: Google Sheets + Apps Script
4. 60 นาที: Booking/Availability
5. 45 นาที: Admin/Security
6. 45 นาที: Tests
7. 45 นาที: Deploy และ end-to-end checkpoint
8. 30 นาที: Exercise review

## Concepts สำหรับอธิบาย

- **Frontend:** UI ที่ browser แสดง; ห้ามถือ secret
- **Backend:** Server API ที่ตรวจข้อมูลและเรียกบริการภายนอก
- **API:** สัญญา request/response ระหว่างส่วนต่าง ๆ
- **Webhook:** ปลายทางรับ event; ใช้ภายหลังกับ LINE ไม่ใช่ dependency หลัก
- **Google Sheets:** datastore ที่เจ้าของระบบตรวจได้ง่าย
- **Apps Script:** validation/locking/adapter ใกล้ข้อมูล
- **Environment Variables:** config แยกจาก source; public กับ server-only ต่างกัน
- **Deployment:** เปลี่ยน source ให้เป็น runtime ที่ผู้ใช้เข้าถึงได้

## Step-by-step และ checkpoints

1. รันเว็บในเครื่อง — checkpoint: `/tutor` เปิดได้
2. อ่าน pricing/slot rules — checkpoint: อธิบายราคากลุ่มได้
3. เตรียม Sheets — checkpoint: header A–O และ Settings ครบ
4. วาง Apps Script/ตั้ง secret/deploy — checkpoint: health GET ตอบ ok
5. ตั้ง env — checkpoint: availability ไม่ตอบ configuration error
6. จองหนึ่งรายการ — checkpoint: ได้ reference และมีแถวเดียว
7. จอง slot ซ้ำ — checkpoint: ถูกปฏิเสธ
8. เข้า Admin/Confirm — checkpoint: status ในชีตเปลี่ยน
9. รัน tests/build — checkpoint: ผ่านทั้งหมด
10. Deploy preview — checkpoint: ไม่มี console error และ responsive

## Exercises

1. เพิ่ม test ราคาที่ขอบเขตผิด
2. อธิบายเหตุผลที่ Apps Script ต้องใช้ Lock
3. เปลี่ยน weekday slot ใน Settings และตรวจผล
4. สร้าง threat model สำหรับการเดา Admin password
5. ออกแบบ LINE rich menu โดยไม่ผูก core booking กับ LINE

## Common errors

- ใส่ URL `/dev` แทน `/exec`
- secret สองฝั่งไม่ตรง หรือเผลอใช้ `NEXT_PUBLIC_`
- วันที่ทดสอบเป็นอดีตตาม Asia/Bangkok
- จำนวนผู้เรียนส่งเป็น string แทน number
- แก้ header/ชื่อแท็บจน Apps Script หาไม่เจอ
- deploy source ใหม่แต่ไม่สร้าง Apps Script version ใหม่

## Final assignment

ส่ง link preview, diagram, evidence ของ test/build, booking reference ทดสอบ, ภาพแถวใน Sheets ที่ปกปิด PII, รายงานความเสี่ยง 3 ข้อ และแผน rollback ห้ามส่ง credential

## Instructor notes

สาธิตด้วยข้อมูลสมมติ, rotate secret หลัง workshop, แยกบัญชี demo จาก production, หยุดก่อนขั้นอนุญาตสิทธิ์เพื่อให้ผู้เรียนตรวจ scope และย้ำว่า in-memory rate limit เป็น best-effort สำหรับ serverless
