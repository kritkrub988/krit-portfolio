# Google Apps Script — ดำเนินการครบแล้ว

สถานะวันที่ 2026-07-16:

- Script Property `BOOKING_API_SECRET` ตั้งค่าแล้ว
- Web app ใช้ Execute as เจ้าของและ Access `ทุกคน`; POST ทุกคำขอตรวจ API secret
- Deployment version 4 ใช้ URL `/exec` เดิม
- Health check ตอบ HTTP 200, `success=true`, service `KRIT HUB AI Tutor Booking API`, status `ok`
- แก้และตรวจการเก็บภาษาไทยกับเลข `0` นำหน้าเบอร์โทรแล้ว

ไม่มี manual authentication step ค้าง เอกสารนี้ไม่เก็บ secret หรือ URL ID แบบเต็ม
