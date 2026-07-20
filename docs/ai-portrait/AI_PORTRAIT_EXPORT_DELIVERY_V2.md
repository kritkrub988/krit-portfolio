# AI Portrait Export & Delivery Workflow v2
## Master / Social / Web / Print / Archive

> ใช้หลัง Professional QA ผ่านแล้ว  
> Export ไม่ใช่แค่เปลี่ยนนามสกุลไฟล์ แต่ต้องจัดขนาด สี Metadata และ Archive ให้ครบ

---

# 1. Export Lock

ห้าม Export Final หาก:

- QA ยังไม่ PASS
- Hero Shot ต่ำกว่า 90
- มี Critical Error
- Identity ยังไม่ผ่าน
- Color Master ยังไม่ล็อก
- Caption ยังไม่อนุมัติ
- Shot List ยังไม่ครบ

---

# 2. Step E1 — เลือก Delivery Profile

## A. Social Ready
ไฟล์พร้อมโพสต์ Facebook / Instagram

## B. Web Portfolio
ไฟล์สำหรับเว็บไซต์ พร้อม WebP และ Alt Text

## C. Professional Master
เก็บไฟล์ความละเอียดเต็มและไฟล์ทำงาน

## D. Print Ready
ไฟล์สำหรับพิมพ์ตามขนาดจริง

## E. Client Delivery
ชุดส่งลูกค้า มี Preview และ Final

## F. Full Production Archive
เก็บ Source, Prompt, Revision, QA และ Final

## G. All Profiles
สร้างครบทุก Profile

## H. Custom Export

---

# 3. Professional Master

## ไฟล์หลัก

- TIFF 16-bit ถ้าระบบรองรับ
- PNG Full Resolution เมื่อไม่มี TIFF
- PSD/PSB Layered เมื่อมีงาน Retouch และระบบรองรับ
- Embedded Color Profile
- ไม่มี Social Compression
- เก็บ Original Aspect Ratio
- Master Sharpening แยกจาก Output Sharpening

## ชื่อไฟล์

`PROJECT_MODEL_SHOT_MASTER_v001.ext`

ตัวอย่าง:

`PT260720_MEI_S01_MASTER_v001.tif`

---

# 4. Social Ready

## Facebook / Instagram Portrait

- 1080 × 1350 px
- Ratio 4:5
- JPEG
- sRGB
- Quality 85–95
- Output Sharpen for Screen

## Square

- 1080 × 1080 px
- Ratio 1:1
- JPEG
- sRGB

## Story / Reel Cover

- 1080 × 1920 px
- Ratio 9:16
- JPEG
- Safe Zone สำหรับข้อความ

## Horizontal Post

- 1200 × 630 px หรือขนาดที่ Platform กำหนด
- ใช้เฉพาะเมื่อ Composition รองรับ

> ห้าม Crop ใบหน้า มือ เครื่องประดับ หรือ Product โดยไม่ตรวจใหม่

---

# 5. Web Portfolio

- WebP
- sRGB
- Long edge 1600–2400 px
- Responsive variants
- Thumbnail
- Lazy-load friendly
- Alt Text
- File size ตรวจตามคุณภาพ
- Metadata ส่วนตัวที่ไม่จำเป็นต้องลบออก
- Copyright / AI Disclosure ตามนโยบายเพจ

## Web Variants

```text
image-480.webp
image-960.webp
image-1600.webp
image-2400.webp
```

---

# 6. Print Ready

- TIFF 16-bit
- 300 ppi ที่ขนาดพิมพ์จริง
- Color Profile ตามโรงพิมพ์
- Soft Proof
- Output Sharpen ตามวัสดุ
- Bleed เมื่อเป็น Poster
- ไม่อ้างว่า 300 ppi เพียงจากการเปลี่ยนตัวเลขโดยไม่เช็ก Pixel Dimension

## ข้อมูลที่ต้องถาม

- ขนาดพิมพ์
- กระดาษ
- เครื่องพิมพ์
- Color Profile
- Bleed
- Border
- Viewing Distance

---

# 7. Client Delivery

ต้องมี:

- Preview Contact Sheet
- Selected Finals
- Social Versions
- Full-resolution Finals
- Caption Package เมื่อรวมบริการ
- Usage Note
- AI Disclosure
- Revision Summary
- Delivery Manifest

ห้ามส่ง:

- Draft ที่ไม่ผ่าน
- Rejected Images
- Prompt ภายใน หากไม่ได้รวมในแพ็ก
- Reference ส่วนตัวที่ไม่เกี่ยวข้อง
- Metadata ที่เปิดเผยข้อมูลไม่จำเป็น

---

# 8. Folder Structure

```text
AI_PORTRAIT_PRODUCTION/
└── YYYY-MM-DD_PROJECT_MODEL/
    ├── 00_admin/
    │   ├── project_brief.md
    │   ├── delivery_manifest.md
    │   └── usage_rights.md
    ├── 01_reference/
    │   ├── model_identity/
    │   ├── moodboard/
    │   ├── wardrobe/
    │   └── location/
    ├── 02_prompt/
    │   ├── master_prompt.md
    │   ├── shot_prompts/
    │   ├── negative_constraints.md
    │   └── correction_prompts/
    ├── 03_generation/
    │   ├── direction_tests/
    │   ├── contact_sheets/
    │   ├── selects/
    │   └── rejected/
    ├── 04_working/
    │   ├── identity_fix/
    │   ├── retouch/
    │   ├── composite/
    │   └── color_master/
    ├── 05_master/
    │   ├── full_resolution/
    │   └── layered/
    ├── 06_delivery/
    │   ├── social/
    │   ├── web/
    │   ├── print/
    │   └── client/
    ├── 07_content/
    │   ├── caption_short.txt
    │   ├── caption_full.txt
    │   ├── hashtags.txt
    │   ├── cta.txt
    │   ├── alt_text.txt
    │   └── ai_disclosure.txt
    ├── 08_qa/
    │   ├── shot_qa/
    │   ├── series_qa.md
    │   └── qa_summary.json
    ├── 09_metadata/
    │   ├── project_metadata.json
    │   ├── model_metadata.json
    │   └── image_manifest.json
    └── 10_archive/
        ├── revision_log.md
        └── archive_checksum.txt
```

---

# 9. Folder Naming

รูปแบบ:

`YYYY-MM-DD_PROJECT_MODEL_RECIPE`

ตัวอย่าง:

`2026-07-20_TOKYO_RAIN_RIN_PR-06`

ห้ามใช้ชื่อ Model เก่า เช่น AIRA, MIRA, VERA, ELENA

---

# 10. File Naming

รูปแบบ:

`PROJECT_MODEL_SHOT_USAGE_VERSION.ext`

ตัวอย่าง:

- `TOKYORAIN_RIN_S01_MASTER_v001.tif`
- `TOKYORAIN_RIN_S01_SOCIAL_4x5_v001.jpg`
- `TOKYORAIN_RIN_S01_WEB_1600_v001.webp`
- `TOKYORAIN_RIN_S01_PRINT_A3_v001.tif`

---

# 11. Metadata

## Project Metadata

```json
{
  "project_id": "",
  "project_name": "",
  "created_at": "",
  "model_id": "",
  "identity_version": "",
  "recipe_id": "",
  "goal": "",
  "platform": [],
  "usage": "",
  "qa_status": "",
  "qa_score": 0,
  "color_profile": "",
  "ai_generated": true,
  "approval_status": ""
}
```

## Image Manifest

```json
{
  "shot_id": "",
  "filename": "",
  "purpose": "",
  "aspect_ratio": "",
  "pixel_dimensions": "",
  "format": "",
  "color_profile": "",
  "image_version": "",
  "prompt_version": "",
  "qa_score": 0,
  "approved": false
}
```

---

# 12. Caption & Disclosure Package

## Caption Files

- `caption_short.txt`
- `caption_full.txt`
- `hashtags.txt`
- `cta.txt`
- `alt_text.txt`

## AI Disclosure

ใช้ข้อความตามนโยบายเพจ เช่น:

> ภาพนี้สร้างด้วย AI และออกแบบให้มีลักษณะเหมือนงานถ่ายภาพจริง

ห้ามอ้างว่า:

- ไปถ่ายสถานที่จริง หากไม่ได้ไป
- เป็นบุคคลจริง
- ใช้กล้องจริงตามที่จำลอง
- เป็นภาพข่าวหรือหลักฐานเหตุการณ์จริง

---

# 13. Step E2 — เลือก Format

## A. JPEG
## B. PNG
## C. WebP
## D. TIFF 16-bit
## E. PSD/PSB Layered
## F. หลาย Format ตาม Delivery Profile

ระบบต้องเตือนเมื่อ Format ที่เลือกไม่เหมาะกับ Profile

---

# 14. Step E3 — เลือก Ratio

## A. Original Master
## B. 4:5
## C. 1:1
## D. 9:16
## E. Horizontal
## F. Print Ratio
## G. Multi-ratio Package

---

# 15. Crop QA

หลัง Crop ต้องตรวจใหม่:

- ใบหน้า
- มือ
- Product
- Jewelry
- Copy Space
- Horizon
- Balance
- Headroom
- Safe Zone
- Series Consistency

ตัวเลือก:

## A. Crop ผ่าน
## B. ขยับ Crop
## C. ใช้ภาพอื่น
## D. สร้าง Composition เฉพาะ Ratio ใหม่

> ตัวเลือก D ต้องกลับเข้าสู่ Production Workflow และยังต้องใช้คำสั่ง `@สร้างรูปภาพ`

---

# 16. Delivery Manifest

```md
# Delivery Manifest

Project:
Model:
Recipe:
Identity Version:
QA Status:
QA Score:

## Delivered Files
- ...

## Profiles
- Social
- Web
- Master
- Print
- Archive

## Color
- Profile:
- Bit Depth:
- Master Resolution:

## Content
- Caption:
- Alt Text:
- AI Disclosure:

## Notes
- ...
```

---

# 17. Final Export Checklist

- QA PASS
- Model ID ถูก
- Identity Version ถูก
- Shot count ครบ
- Master ครบ
- Social dimensions ถูก
- Web variants ครบ
- Print size ถูก
- Color Profile ฝังแล้ว
- Filename ถูก
- ไม่มี Draft
- ไม่มีไฟล์ซ้ำ
- Caption ตรง
- Alt Text พร้อม
- AI Disclosure พร้อม
- Metadata พร้อม
- Revision Log พร้อม
- Archive พร้อม

---

# 18. Final Options

## A. Export Social Ready
## B. Export Web Portfolio
## C. Export Professional Master
## D. Export Print Ready
## E. Export Client Delivery
## F. Export Full Archive
## G. Export All
## H. Save as Draft

---

# 19. Export Summary

หลัง Export ระบบต้องรายงาน:

- Project Folder
- Delivery Profile
- จำนวนภาพ
- Format
- Dimensions
- Color Profile
- Caption Files
- QA Status
- Master Status
- Archive Status
- Missing Items
