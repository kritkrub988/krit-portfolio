# แผนเชื่อม LINE Official Account (ภายหลัง)

ระบบเว็บจองทำงานได้โดยไม่พึ่ง LINE ปัจจุบันยังไม่มี LINE credential และยังไม่เปิด endpoint ใด ๆ

## เตรียมบัญชี

1. สร้าง LINE Official Account และ Messaging API channel
2. กำหนดผู้ดูแล/นโยบายข้อมูล
3. เก็บ `LINE_CHANNEL_SECRET` และ `LINE_CHANNEL_ACCESS_TOKEN` ใน Vercel server-only
4. ห้ามใส่ใน Git, Sheets, browser, screenshot หรือเอกสาร

## Rich menu ที่แนะนำ

- ดูหลักสูตร → `/tutor/course`
- ราคา → `/tutor/pricing`
- จองเรียน → `/tutor/booking`
- ติดต่อ → ใช้ Contact LINE link เดิมของ Portfolio

## Webhook ระยะถัดไป

เพิ่ม `POST /api/line/webhook` เฉพาะเมื่อพร้อม โดยต้อง verify `x-line-signature` จาก raw body ก่อน parse, ตอบเร็ว, ทำ idempotency ด้วย event id, ไม่ log message/PII และส่งงานช้าไป queue หากจำเป็น

LINE ไม่ควรเขียน Sheets โดยตรง ให้เรียก service layer เดียวกับ Booking/Admin เพื่อคง validation, locking และราคาเป็นแหล่งเดียว

## ทดสอบก่อนเปิด

- Signature ถูก/ผิด, replay event, timeout/retry
- Rich menu ทุก URL เป็น HTTPS production
- ไม่มี credential ใน client bundle
- ลบ user id ตาม retention/consent
- ปิด channel แล้วเว็บยังจองได้ 100%

## Rollout

เริ่ม dev channel → internal users → limited rollout → production; rotate token หลัง workshop/เหตุรั่ว และปิด webhook ได้โดยไม่กระทบ core booking
