# AI Portrait Professional QA v1
## Quality Gate สำหรับ Portrait, Fashion และ Commercial

> QA นี้ใช้หลัง Correction, Retouch และ Color Mastering  
> งานจะ Export Final ได้เมื่อผ่าน Critical Gate และได้คะแนนตามเกณฑ์

---

# 1. QA Status

## A. PASS
- คะแนน 90–100
- ไม่มี Critical Error
- Identity อย่างน้อย 18/20
- พร้อม Caption และ Export

## B. PASS WITH MINOR FIX
- คะแนน 85–89
- ไม่มี Critical Error
- แก้จุดเล็กได้โดยไม่ Regenerate ทั้งภาพ

## C. MAJOR REVISION
- คะแนน 70–84
- มีหลายจุดผิด
- ต้อง Inpaint, Retouch หรือสร้าง Shot ใหม่

## D. REJECT / REGENERATE
- ต่ำกว่า 70
- มี Critical Error
- ภาพเสีย Direction หรือ Identity

---

# 2. Critical Gate

พบข้อใดข้อหนึ่ง ให้หยุด Final ทันที:

- หน้าไม่ใช่ Model เดิม
- อายุเปลี่ยนชัดเจน
- Model ดูเป็นผู้เยาว์ในงานที่มี Sensual Direction
- นิ้วเกิน ขาด หรือติดกันชัด
- แขน ขา ข้อต่อ หรือสัดส่วนผิดรุนแรง
- ดวงตาคนละทิศโดยไม่มีเหตุผล
- เงาขัดกับทิศทางแสง
- Catchlight ขัดกับ Lighting Plan
- Reflection หรือกระจกผิดตรรกะ
- เครื่องประดับหรือ Product ผิดรูป
- โลโก้หรือข้อความผิด
- ลายผ้าเปลี่ยนระหว่างภาพ
- เสื้อผ้า เครื่องประดับ หรือทรงผมขาด Continuity
- ผิวเป็นพลาสติกชัด
- ฉากสถาปัตยกรรมผิดจนสังเกตได้
- ภาพเสี่ยงละเมิดสิทธิ บุคคลจริง หรือทำให้เข้าใจผิด
- ขัดข้อจำกัดเฉพาะ Model Bible
- มีเนื้อหาไม่เหมาะกับแพลตฟอร์มทั่วไป

---

# 3. คะแนนรวม 100

| หมวด | คะแนนเต็ม |
|---|---:|
| A. Identity & Age | 20 |
| B. Anatomy & Hands | 15 |
| C. Face, Skin, Hair & Teeth | 10 |
| D. Lighting & Shadow | 10 |
| E. Camera, Lens & Perspective | 10 |
| F. Wardrobe, Fabric & Accessories | 10 |
| G. Environment, Product & Text | 10 |
| H. Color, Film & Retouch | 10 |
| I. Series Continuity | 5 |
| **รวม** | **100** |

---

# A. Identity & Age — 20 คะแนน

## ตรวจ

- Model ID ตรง
- Identity Version ตรง
- รูปหน้า
- Eye Shape
- Nose Shape
- Lip Shape
- Jawline
- Skin Undertone
- Hairline
- จุดจำเฉพาะตัว
- อายุภาพลักษณ์
- Body Silhouette
- บุคลิกและ Expression

## ให้คะแนน

- 18–20: เหมือน Official Identity ชัดเจน
- 15–17: มี Drift เล็กน้อย
- 10–14: Drift ชัด ต้องแก้
- 0–9: คนละ Identity

---

# B. Anatomy & Hands — 15 คะแนน

## ตรวจ

- ศีรษะ คอ ไหล่
- แขน ข้อศอก ข้อมือ
- มือ นิ้ว เล็บ
- ลำตัว สะโพก ขา เข่า ข้อเท้า
- การลงน้ำหนัก
- Pose Balance
- Movement Logic
- Contact ระหว่างมือกับวัตถุ

## ให้คะแนน

- 14–15: ถูกต้องและเป็นธรรมชาติ
- 11–13: Minor issue
- 7–10: Major fix
- 0–6: Regenerate

---

# C. Face, Skin, Hair & Teeth — 10 คะแนน

## ตรวจ

- Eye Direction
- Eyelid
- Eyelash
- Catchlight symmetry ตามแสง
- ฟัน
- ริมฝีปาก
- Skin Texture
- Pore Detail
- Under-eye
- Hairline
- Hair Strand
- Flyaway Hair
- Makeup symmetry

## ห้าม

- Plastic Skin
- Eye enlargement
- Teeth glow
- Hair clump แบบพลาสติก
- Retouch จนเสียอายุจริง

---

# D. Lighting & Shadow — 10 คะแนน

## ตรวจ

- Key direction
- Fill level
- Rim direction
- Background light
- Shadow direction
- Contact shadow
- Catchlight shape
- Color temperature
- Mixed-light motivation
- Highlight roll-off
- Specular highlight

## ให้คะแนน

- 9–10: ตรง Lighting Plan
- 7–8: Minor inconsistency
- 4–6: Direction ขัดกัน
- 0–3: ต้องสร้างใหม่

---

# E. Camera, Lens & Perspective — 10 คะแนน

## ตรวจ

- Focal length character
- Camera height
- Camera distance
- Perspective distortion
- Compression
- Depth of field
- Focus plane
- Bokeh logic
- Motion blur
- Crop logic
- Horizon
- Vertical lines

## ห้าม

- 85mm look แต่ distortion แบบ 24mm
- Bokeh ไม่สัมพันธ์กับ Aperture
- ใบหน้าและฉากคมเท่ากันแบบผิดธรรมชาติ
- แขนยาวผิดเพราะ Perspective

---

# F. Wardrobe, Fabric & Accessories — 10 คะแนน

## ตรวจ

- Seam
- Pattern
- Button
- Zipper
- Pocket
- Layer
- Fabric weight
- Fabric fold
- Jewelry
- Glasses
- Shoes
- Wardrobe continuity

## ห้าม

- ลายผ้าหาย
- กระดุมเพิ่ม/ลด
- ต่างหูคนละคู่
- เสื้อทะลุร่างกาย
- ผ้าแข็งหรือเหลวผิดวัสดุ

---

# G. Environment, Product & Text — 10 คะแนน

## ตรวจ

- Architecture
- Furniture
- Door/window geometry
- Reflection
- Train / vehicle
- Product geometry
- Logo
- Text
- Signage
- Scale
- Weather
- Time of day
- Background depth

## Japanese Scene เพิ่มเติม

- ป้ายภาษาญี่ปุ่นถูกหรือหลีกเลี่ยง
- สถานที่ไม่รวมหลายเมืองผิดภูมิศาสตร์
- รถไฟและสถานีมีตรรกะ
- ไม่แปะซากุระหรือ Neon โดยไม่มีเหตุผล

---

# H. Color, Film & Retouch — 10 คะแนน

## ตรวจ 3 ชั้น

1. Capture Medium
2. Film Stock / Simulation
3. Post Grade

## ตรวจรายละเอียด

- White Balance
- Tint
- Skin Hue
- Saturation
- Contrast
- Highlight Roll-off
- Shadow Density
- Grain Size
- Grain Strength
- Halation
- Bloom
- Scanner / Print Character
- Retouch consistency

## ห้าม

- ผิวเปลี่ยนสัญชาติจาก Grade
- Grain เท่ากันทุกพื้นที่แบบ Overlay
- Halation รอบทุกวัตถุ
- Shadow จมหาย
- Highlight ขาวขาดโดยไม่ตั้งใจ

---

# I. Series Continuity — 5 คะแนน

## ตรวจ

- Identity
- อายุ
- Hair
- Makeup
- Wardrobe ต่อ Look
- เครื่องประดับ
- Product
- Direction of light
- Weather
- Time
- Color Pipeline
- Grain
- Aspect and sequence

## ให้คะแนน

- 5: ต่อเนื่องเหมือน Campaign เดียวกัน
- 4: Minor drift
- 2–3: มีหลายจุดเปลี่ยน
- 0–1: ไม่ใช่เซตเดียวกัน

---

# 4. Model-specific QA

## YUNA

- ต้องดูอายุ 19
- ห้าม Sexy Direction
- Makeup ต้องเบา
- รูปร่างและ Pose เป็นธรรมชาติ
- ไม่ทำให้ดูโตเกินวัย

## MEI

- ต้องดูอายุ 23
- Face Geometry แบบ Fashion Model ต้องคงเดิม
- Soft Sensual ทำได้เฉพาะแบบแพลตฟอร์มทั่วไป
- Skin Retouch ต้องมี Texture

## RIN

- ต้องดูอายุ 28
- Jawline และ Cheekbone ต้องคง
- Dark Feminine ต้องไม่กลายเป็นคอนเทนต์ 18+
- Black fabric และ Jewelry ต้องมี Separation

## HANA

- ต้องดูอายุ 33
- เก็บรายละเอียดผิวตามวัย
- Fit ต้องดูสุขภาพดี ไม่ผอมเกินจริง
- Activewear ต้องสุภาพ
- Corporate Pose ต้องไม่แข็งจนดู Stock Photo

---

# 5. Shot QA Report Template

```yaml
project_id:
shot_id:
model_id:
identity_version:
recipe_id:
image_version:

critical_error:
  found: false
  details: []

scores:
  identity_age: 0
  anatomy_hands: 0
  face_skin_hair: 0
  lighting_shadow: 0
  camera_perspective: 0
  wardrobe_accessories: 0
  environment_product_text: 0
  color_film_retouch: 0
  series_continuity: 0

total_score: 0
status:
correction_codes: []
notes:
approved_by:
approved_at:
```

---

# 6. Correction Codes

| Code | ความหมาย |
|---|---|
| ID-01 | Face Identity Drift |
| ID-02 | Age Drift |
| AN-01 | Hand/Finger Error |
| AN-02 | Limb/Joint Error |
| FC-01 | Eye Direction |
| FC-02 | Plastic Skin |
| HR-01 | Hairline/Hair Error |
| LT-01 | Light Direction |
| LT-02 | Catchlight Error |
| CM-01 | Lens/Perspective |
| CM-02 | DOF/Bokeh |
| WD-01 | Fabric/Seam |
| AC-01 | Accessory Continuity |
| BG-01 | Background Geometry |
| RF-01 | Reflection Error |
| TX-01 | Text/Logo |
| CL-01 | Skin Color |
| CL-02 | Film/Grade |
| CT-01 | Series Continuity |
| SF-01 | Safety/Platform |

---

# 7. Final Series Gate

ก่อน Export ต้องตรวจ:

- ทุก Shot ผ่านขั้นต่ำ 85
- Hero Shot ผ่านขั้นต่ำ 90
- ไม่มี Critical Error
- Identity ทุกภาพอย่างน้อย 18/20
- Series Continuity อย่างน้อย 4/5
- Color Master ล็อกแล้ว
- ไม่มี Draft ปน
- Revision Log ครบ
- Caption ตรงกับภาพ
- AI Disclosure พร้อมตามนโยบายเพจ

---

# 8. QA Output

ระบบต้องตอบในรูปแบบ:

```md
QA STATUS: PASS / MINOR FIX / MAJOR REVISION / REJECT
TOTAL SCORE: XX/100
CRITICAL ERROR: NONE / FOUND

จุดที่ผ่าน:
- ...

จุดที่ต้องแก้:
- ...

Correction Route:
- Inpaint
- Retouch
- Regenerate Shot
- Rebuild Series

Next Action:
A. Approve
B. Fix Minor
C. Major Revision
D. Reject
```
