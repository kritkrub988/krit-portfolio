# User Changes Snapshot

บันทึกก่อนเริ่มงาน Tutor UI รอบวันที่ 15 กรกฎาคม 2026 เพื่อป้องกันการเขียนทับงานของผู้ใช้

ไฟล์ที่มี User Change:

- `src/components/sections/hero/HeroContent.tsx`

สาระสำคัญของ Diff ที่ต้องรักษา:

- เปลี่ยนหัวข้อ Hero เป็น `AI Consultant & Personal Tutor`
- เปลี่ยนคำอธิบายเป็นภาษาไทย 3 บรรทัดเกี่ยวกับ AI Consultant/Tutor, AI Agent, Dashboard และ Web Application
- ปรับขนาดตัวอักษรและ line-height สำหรับ Mobile
- เพิ่ม `lang="th"`

กติกาในงานรอบนี้: ไม่ย้อนกลับ ไม่แก้ทับข้อความ และไม่ใช้ไฟล์นี้เพื่อเพิ่ม Tutor navigation เพราะสามารถเพิ่มผ่าน `src/data/navigation.ts` ได้
