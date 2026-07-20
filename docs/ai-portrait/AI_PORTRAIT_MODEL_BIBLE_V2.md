# AI Portrait Model Bible v2
## โฟโต้ทิพย์ — Official Model System

> ไฟล์นี้เป็นแหล่งอ้างอิงหลักของ Model ประจำเพจ 4 คน  
> ทุก Workflow, Prompt, Recipe, QA และ Export ต้องอ้างอิง Model ID และ Identity Version จากไฟล์นี้

---

# 1. เป้าหมาย

สร้าง Model สมมติ 4 คนที่:

- จำหน้าได้ชัดเจน
- มีช่วงวัยและบุคลิกต่างกันจริง
- ใช้กับงาน Portrait, Fashion, Editorial และ Commercial ได้
- รักษาใบหน้า อายุ รูปร่างโดยรวม และบุคลิกเดิมข้ามหลายภาพ
- ดูเหมือนบุคคลจริงที่ถูกถ่ายด้วยทีมงานมืออาชีพ
- ไม่เปลี่ยนหน้าตามเสื้อผ้า กล้อง แสง หรือ Film Look
- ไม่อ้างอิงหรือเลียนแบบบุคคลจริง

---

# 2. Identity Lock Rules

## 2.1 สิ่งที่ล็อก

- Model ID
- Stage Name
- อายุภาพลักษณ์
- สัญชาติ/ภูมิหลังตัวละคร
- รูปหน้า
- โครงแก้มและกราม
- รูปทรงดวงตา
- ระยะห่างดวงตา
- รูปทรงจมูก
- รูปทรงริมฝีปาก
- Skin Tone และ Undertone
- Hairline
- สีและ Texture ของผมหลัก
- ส่วนสูงโดยประมาณ
- Body Silhouette โดยรวม
- จุดจำเฉพาะตัว
- บุคลิกหลัก
- Expression Signature

## 2.2 สิ่งที่เปลี่ยนได้

- เสื้อผ้า
- ทรงผมย่อยที่ยังไม่เปลี่ยน Hairline
- Makeup
- สถานที่
- ฤดูกาล
- กล้อง
- เลนส์
- แสง
- Film Stock
- Color Grade
- Pose
- Action
- Campaign

## 2.3 สิ่งที่ห้ามเปลี่ยนโดยไม่สร้าง Version ใหม่

- อายุภาพลักษณ์
- สัญชาติ/ภูมิหลัง
- รูปหน้า
- สีผิวหลัก
- Eye Shape
- Nose Shape
- Lip Shape
- Jawline
- ส่วนสูง
- รูปร่างหลัก
- จุดจำเฉพาะตัว
- บุคลิกหลัก

---

# 3. Official Model Summary

| ID | Stage Name | อายุ | ภูมิหลังตัวละคร | Character | งานหลัก |
|---|---|---:|---|---|---|
| MODEL_A_YUNA | YUNA | 19 | ลูกครึ่งญี่ปุ่น–เกาหลีใต้ | Cute / Fresh / Playful | Youth, Lifestyle, Japanese Snapshot |
| MODEL_B_MEI | MEI | 23 | จีน | Fashion / Elegant / Clean Beauty | Beauty, Editorial, Lookbook |
| MODEL_C_RIN | RIN | 28 | ลูกครึ่งญี่ปุ่น–จีน | Bold / Luxury / Dark Feminine | High Fashion, Luxury, Cinematic |
| MODEL_D_HANA | HANA | 33 | เกาหลีใต้ | Professional / Fit / Modern | Branding, Corporate, Wellness |

> ชื่อทั้งหมดเป็น Stage Name ของเพจ ไม่จำเป็นต้องเป็นชื่อทางกฎหมายของตัวละคร

---

# 4. MODEL A — YUNA

## 4.1 Identity

- **Model ID:** `MODEL_A_YUNA`
- **Identity Version:** `YUNA_ID_V1.0`
- **อายุภาพลักษณ์:** 19 ปี
- **ภูมิหลัง:** ลูกครึ่งญี่ปุ่น–เกาหลีใต้
- **บทบาท:** Model สายวัยรุ่น สดใส เป็นธรรมชาติ
- **ภาพจำ:** เด็กสาววัยมหาวิทยาลัยที่ดูมีชีวิตจริง ไม่ใช่นางแบบแฟชั่นที่ถูกแต่งจนโตเกินวัย

## 4.2 Facial Identity

- รูปหน้าไข่ค่อนไปทางกลม
- หน้าผากปานกลาง
- แก้มมีความนุ่มตามวัย
- กรามโค้ง ไม่เป็นเหลี่ยมชัด
- ดวงตาทรง Almond-Round
- ชั้นตาธรรมชาติ ไม่หนาเกินไป
- ระยะห่างดวงตาปานกลาง
- คิ้วตรงโค้งเล็กน้อย
- จมูกสันกลาง ปลายมน
- ริมฝีปากทรงธรรมชาติ ปากล่างเต็มกว่าปากบนเล็กน้อย
- รอยยิ้มเปิดกว้างและเป็นมิตร
- ผิวโทน Neutral-Warm
- มี Texture ผิวจริงและกระจาง ๆ บางส่วนได้
- จุดจำ: ไฝเล็กมากบริเวณแก้มซ้ายด้านล่าง

## 4.3 Hair Identity

- สีผม Dark Brown
- ผมตรง มีลอนอ่อนบริเวณปลาย
- ความยาวเลยไหล่
- Hairline ธรรมชาติ
- หน้าม้าบางหรือแสกกลางได้
- ห้ามเปลี่ยนเป็นผมสีอ่อนจัดโดยไม่มี Version ใหม่

## 4.4 Body & Movement

- ส่วนสูงโดยประมาณ 162 ซม.
- รูปร่างสมส่วนตามวัย
- ท่าทางคล่องตัว
- การเคลื่อนไหวเป็นธรรมชาติ
- Signature Movement: เดินเร็วเล็กน้อย หันกลับมายิ้ม ผมเคลื่อนไหวตามลม
- หลีกเลี่ยง Pose ที่ดูเป็นผู้ใหญ่หรือยั่วยุ

## 4.5 Expression Library

- Natural Smile
- Laughing Candid
- Curious Look
- Quiet Side Glance
- Soft Neutral
- Looking Away
- Wind-in-hair Moment
- Slight Surprise

## 4.6 Wardrobe Range

- Casual Japanese
- University Casual
- Cardigan
- Shirt
- Denim
- Simple Skirt
- Light Dress
- Sneakers
- Tote Bag
- Y2K แบบเบา
- Summer Casual

## 4.7 Approved Production Styles

- Japanese Youth Snapshot
- Japanese Summer Memory
- Soft Daylight Lifestyle
- Compact Film Diary
- Café Story
- Travel Story
- Park Portrait
- Countryside Film
- Soft Personal Portrait

## 4.8 Restricted Direction

- ไม่ใช้ Sexy Direction
- ไม่ใช้เสื้อผ้าเปิดเผย
- ไม่ใช้ Pose เชิงยั่วยุ
- ไม่ทำให้ดูอายุมากขึ้นเพื่อใช้กับงานแนว Sensual
- ไม่ใช้ Makeup หนัก
- ไม่ใช้ High-fashion Beauty Retouch จนเสียความอ่อนวัย
- ไม่ทำให้ผิวขาวพลาสติกหรือตาโตแบบ Anime

## 4.9 Primary Camera Packages

### Digital Lifestyle

- Fujifilm X100VI
- 23mm f/2 หรือมุมมองเทียบเท่า 35mm
- f/2.8–f/4
- ระยะกล้องใกล้ถึงปานกลาง
- ฉากยังอ่านออก

### Film Snapshot

- Contax T2
- Sonnar 38mm f/2.8
- Fujicolor Superia X-TRA 400
- Direct flash ใช้ได้
- ยอมรับ Focus Miss เล็กน้อยเฉพาะ Photo Diary

## 4.10 Signature Color

- Fujicolor Superia X-TRA 400
- Kodak Gold 200
- Fujifilm Pro 400H
- Classic Negative
- Japanese Summer Grade
- Cream Highlight
- Green/Cyan Background
- Fine Grain

---

# 5. MODEL B — MEI

## 5.1 Identity

- **Model ID:** `MODEL_B_MEI`
- **Identity Version:** `MEI_ID_V1.0`
- **อายุภาพลักษณ์:** 23 ปี
- **ภูมิหลัง:** จีน
- **บทบาท:** Fashion และ Beauty Model หลักของเพจ
- **ภาพจำ:** สวยเด่นแบบนางแบบจริงจัง ถ่ายได้ทั้ง Clean Beauty, Editorial และ Luxury Casual

## 5.2 Facial Identity

- รูปหน้าไข่เรียวยาว
- หน้าผากปานกลาง
- Cheekbone ชัดแต่ไม่แข็ง
- Jawline เรียบและคม
- ดวงตา Almond Shape
- Eyelid ชัดแบบธรรมชาติ
- คิ้วได้รูป ความหนาปานกลาง
- จมูกทรงตรง ปลายเรียว
- ริมฝีปากชัด ปากบนมี Cupid’s Bow
- ผิว Neutral
- จุดจำ: ไฝเล็กเหนือริมฝีปากด้านขวา
- Expression Signature: สายตามั่นใจและคางยกเล็กน้อย

## 5.3 Hair Identity

- ผมยาวสีดำธรรมชาติ
- Hair Texture เรียบเงา
- แสกกลางเป็นทรงหลัก
- Soft Wave, Sleek Hair และ Low Ponytail ใช้ได้
- Wet Hair ใช้เฉพาะ Editorial

## 5.4 Body & Movement

- ส่วนสูงโดยประมาณ 170 ซม.
- รูปร่างสมส่วนแบบนางแบบ
- Posture ตรง
- เส้นสายแขนและไหล่ชัดเมื่อโพส
- Signature Movement: หมุนไหล่ช้า เดินเป็นเส้นตรง หยุดมองกล้อง
- ภาพต้องดูแข็งแรงและสมจริง ไม่ยืดสัดส่วนเกินธรรมชาติ

## 5.5 Expression Library

- Clean Neutral
- Confident Eye Contact
- Soft Smile
- Editorial Serious
- Chin-up Beauty
- Profile Gaze
- Controlled Laugh
- Soft Sensual Look แบบแพลตฟอร์มทั่วไป

## 5.6 Wardrobe Range

- Minimal Fashion
- Tailored Suit
- Blazer
- Slip Dress แบบสุภาพ
- Monochrome
- Luxury Casual
- Designer-inspired
- Lookbook
- Studio Beauty
- Magazine Fashion

## 5.7 Approved Production Styles

- Clean Beauty Editorial
- Japanese Magazine Beauty
- Minimal Studio Fashion
- Editorial Lookbook
- Luxury Casual
- High-end Beauty
- Fashion Personal Branding
- Soft Film Fashion

## 5.8 Platform-safe Sensual Direction

- ใช้สายตา แสง เงา และเส้นไหล่
- ใช้ชุดแฟชั่นที่สุภาพ
- ไม่เปิดเผยจุดสงวน
- ไม่ใช้ Pose เชิงเพศ
- ไม่ใช้ Lingerie
- ไม่ทำภาพ 18+
- ต้องคงลักษณะผู้ใหญ่ชัดเจน ไม่ทำให้ดูเด็กลง

## 5.9 Primary Camera Packages

### Digital Beauty

- Hasselblad X2D 100C
- XCD 90V f/2.5
- f/4
- Eye-level
- Camera distance 2.2–2.5 m
- Smooth tonal transition
- Controlled background separation

### Medium Format Film Editorial

- Contax 645
- Zeiss Planar 80mm f/2
- Kodak Portra 160
- Slight overexposure 1/3–2/3 stop
- Fine grain
- Neutral skin

## 5.10 Signature Color

- Kodak Portra 160
- Kodak Portra 400
- Fujifilm ASTIA
- PRO Neg. Std
- Clean Editorial Grade
- Neutral skin
- Cream highlight
- Restrained red
- Fine grain

---

# 6. MODEL C — RIN

## 6.1 Identity

- **Model ID:** `MODEL_C_RIN`
- **Identity Version:** `RIN_ID_V1.0`
- **อายุภาพลักษณ์:** 28 ปี
- **ภูมิหลัง:** ลูกครึ่งญี่ปุ่น–จีน
- **บทบาท:** Model สาย Luxury, High Fashion และ Cinematic
- **ภาพจำ:** สวยคม สุขุม มีพลัง ดูแพง และรองรับ Dark Feminine แบบไม่ติดเรท

## 6.2 Facial Identity

- รูปหน้า Oval-Angular
- Cheekbone ชัด
- Jawline เป็นมุมมากกว่า MEI
- ดวงตา Almond Narrow
- สายตานิ่งและคม
- คิ้วโค้งเล็กน้อย มีโครงชัด
- จมูกสันตรง ปลายคม
- ริมฝีปากเต็มปานกลาง
- ผิว Neutral-Olive
- จุดจำ: รอยไฝเล็กบริเวณขมับขวา
- Expression Signature: Neutral Intense

## 6.3 Hair Identity

- ผม Espresso Black
- ยาวระดับกลางถึงยาว
- Straight, Soft Wave, Sleek Back และ Wet Hair ใช้ได้
- Hairline ต้องคงเดิม
- Bob ใช้ได้เฉพาะสร้าง `RIN_ID_V2.x`

## 6.4 Body & Movement

- ส่วนสูงโดยประมาณ 168 ซม.
- รูปร่างสมส่วนและดูแข็งแรง
- Posture มั่นคง
- Signature Movement: ก้าวช้า หันไหล่ มองผ่านกล้อง
- Power Pose ใช้ได้
- ไม่บิดสัดส่วนเกินจริง

## 6.5 Expression Library

- Intense Neutral
- Controlled Smirk
- Side Profile
- Low Gaze
- Direct Eye Contact
- Mysterious Look
- Luxury Calm
- Cinematic Tension

## 6.6 Wardrobe Range

- Tailored Suit
- Structured Dress
- Dark Monochrome
- Leather Accent แบบสุภาพ
- Luxury Evening
- Jewelry Campaign
- Sculptural Fashion
- Avant-Garde
- Cinematic Wardrobe

## 6.7 Approved Production Styles

- Luxury Noir Editorial
- High Fashion
- Cinematic Night
- Jewelry Campaign
- Dark Editorial
- Modern Noir
- Power Woman
- Japanese Quiet Portrait
- ETERNA Cinema
- Luxury Personal Branding

## 6.8 Platform-safe Bold Direction

- ใช้เส้นสายร่างกายแบบแฟชั่น
- ใช้ไหล่ หลัง และ Silhouette ได้ในระดับสุภาพ
- ไม่ใช้ภาพกึ่งเปลือย
- ไม่ใช้ Lingerie
- ไม่ใช้ Pose เชิงเพศ
- ไม่ทำภาพ 18+
- ต้องคงความเป็น Editorial และ Luxury

## 6.9 Primary Camera Packages

### Digital Luxury

- Leica SL3
- APO-Summicron-SL 90mm f/2 ASPH.
- f/2.8–f/5.6
- Controlled side light
- Strong micro-contrast
- Natural skin texture

### Medium Format Cinematic

- Mamiya RZ67 Pro II
- Sekor Z 110mm f/2.8
- Kodak Vision3 500T หรือ Portra 800
- Controlled halation
- Deep shadow
- Mixed practical light

## 6.10 Signature Color

- Kodak Vision3 500T
- Kodak Portra 800
- CineStill 800T
- Fujifilm ETERNA
- ETERNA Bleach Bypass
- Warm skin / cool shadow
- Deep burgundy
- Charcoal
- Controlled gold accent

---

# 7. MODEL D — HANA

## 7.1 Identity

- **Model ID:** `MODEL_D_HANA`
- **Identity Version:** `HANA_ID_V1.0`
- **อายุภาพลักษณ์:** 33 ปี
- **ภูมิหลัง:** เกาหลีใต้
- **บทบาท:** Model สาย Working Woman, Personal Branding, Wellness และ Corporate
- **ภาพจำ:** ผู้หญิงวัยทำงานที่ดู Fit สุขภาพดี มั่นใจ และน่าเชื่อถือ

## 7.2 Facial Identity

- รูปหน้าไข่ มีกรามอ่อน
- Cheekbone ปานกลาง
- ดวงตา Almond Soft
- สายตานิ่งแต่เป็นมิตร
- คิ้วธรรมชาติ
- จมูกทรงตรง ปลายมนเล็กน้อย
- ริมฝีปากทรงสมดุล
- ผิว Neutral-Warm
- มีเส้นผิวและรายละเอียดตามวัยอย่างเป็นธรรมชาติ
- จุดจำ: รอยยิ้มด้านซ้ายสูงกว่าด้านขวาเล็กน้อย
- Expression Signature: Calm Confident Smile

## 7.3 Hair Identity

- ผมยาวประบ่าถึงกลางหลัง
- Warm Dark Brown
- Straight Blowout หรือ Soft Wave
- Low Ponytail และ Sleek Bun ใช้ได้
- ทรงผมต้องดูดูแลดีแต่ไม่แฟชั่นจัดเกินงาน

## 7.4 Body & Movement

- ส่วนสูงโดยประมาณ 166 ซม.
- รูปร่าง Fit แบบคนดูแลสุขภาพ
- Posture ดี
- ท่าทางมั่นใจ
- Signature Movement: เดินถือแฟ้ม ยืนพิงโต๊ะ หันคุยกับกล้อง
- ไม่เน้นความผอมหรือกล้ามเนื้อเกินจริง

## 7.5 Expression Library

- Calm Confidence
- Professional Smile
- Friendly Eye Contact
- Executive Neutral
- Thoughtful Look
- Walking Candid
- Wellness Relaxed
- Speaker Portrait

## 7.6 Wardrobe Range

- Business Casual
- Tailored Suit
- Smart Casual
- Knitwear
- Clean Dress
- Modern Office
- Minimal Luxury
- Wellness Outfit
- Activewear แบบสุภาพ
- Travel for Work

## 7.7 Approved Production Styles

- Executive Personal Branding
- Corporate Editorial
- Wellness Daylight
- Modern Working Woman
- LinkedIn-style Portrait
- Consultant Portrait
- Entrepreneur Story
- Office Lifestyle
- Travel for Work
- Fitness Lifestyle แบบสุภาพ

## 7.8 Restricted Direction

- ไม่ทำ Sexualized Fitness
- ไม่ใช้ Activewear ที่เปิดเผยมาก
- ไม่ทำให้ดูเด็กลงหรือแก่เกินจริง
- ไม่ลบริ้วรอยตามธรรมชาติจนหน้าพลาสติก
- ไม่ยืดรูปร่างหรือทำให้ผอมเกินจริง
- ต้องรักษาความเป็นมืออาชีพ

## 7.9 Primary Camera Packages

### Digital Branding

- Fujifilm GFX100S II
- GF 80mm f/1.7 R WR
- f/3.2–f/5.6
- Eye-level
- Natural compression
- Clean detail

### Film Corporate Lifestyle

- Hasselblad 500C/M
- Carl Zeiss Planar 80mm f/2.8
- Kodak Portra 160
- Soft window light
- Neutral skin
- Fine grain

## 7.10 Signature Color

- Kodak Portra 160
- Kodak Portra 400
- Fujifilm Pro 400H
- PRO Neg. Std
- Classic Chrome
- Warm Neutral Skin Grade
- Navy
- Beige
- Soft gray
- Natural green

---

# 8. Approved Reference Set

ก่อนใช้งาน Model เป็น Official Identity ต้องมีภาพที่ผ่าน QA อย่างน้อย:

1. Front Neutral
2. Front Soft Smile
3. Front Full Smile
4. Left 45°
5. Right 45°
6. Left Profile
7. Right Profile
8. Looking Down
9. Looking Up
10. Half Body
11. Three-quarter
12. Full Body
13. Walking
14. Hand Reference
15. Neutral Makeup
16. Signature Hair
17. Low-key Light
18. Soft Daylight
19. Studio Beauty
20. Outdoor Lifestyle

ไฟล์ที่ผ่านต้องเก็บใน:

```text
MODELS/
└── MODEL_ID/
    ├── identity/
    ├── approved_reference/
    ├── expressions/
    ├── body_and_hands/
    ├── hair/
    ├── wardrobe/
    ├── rejected/
    └── version_history/
```

---

# 9. Identity QA Gate

ภาพจะผ่าน Identity Gate เมื่อ:

- ใบหน้าตรงกับ Approved Reference
- อายุไม่เปลี่ยนเกิน ±2 ปีจากอายุที่ล็อก
- Shape ของตา จมูก ปาก และกรามคงเดิม
- Skin Tone ไม่เปลี่ยนเพราะ Film Grade
- Hairline คงเดิม
- ส่วนสูงและรูปร่างไม่เปลี่ยนระหว่างเซต
- จุดจำเฉพาะตัวยังอยู่
- Expression ยังสอดคล้องกับบุคลิก
- ไม่มีลักษณะเหมือนบุคคลจริงหรือคนดัง

---

# 10. Version Control

รูปแบบ:

`MODELNAME_ID_VMAJOR.MINOR`

ตัวอย่าง:

- `YUNA_ID_V1.0` — Identity หลัก
- `YUNA_ID_V1.1` — เพิ่ม Approved Expression
- `YUNA_ID_V1.2` — เพิ่มทรงผมที่ผ่าน
- `YUNA_ID_V2.0` — เปลี่ยน Identity หลัก ต้องอนุมัติใหม่

การเปลี่ยนเสื้อผ้า แสง หรือฉาก ไม่เพิ่ม Identity Version  
การเปลี่ยนใบหน้า อายุ ภูมิหลัง Hairline หรือรูปร่างหลัก ต้องขึ้น Major Version

---

# 11. Prompt Identity Block Template

```md
MODEL_ID:
IDENTITY_VERSION:
AGE_LOCK:
BACKGROUND_LOCK:

FACE:
EYES:
NOSE:
LIPS:
JAW:
SKIN:
HAIR:
UNIQUE_MARKER:
BODY_SILHOUETTE:
SIGNATURE_EXPRESSION:

DO_NOT_CHANGE:
- face geometry
- age
- ethnicity/background
- skin undertone
- hairline
- unique marker
- overall body proportion
```

---

# 12. Status

- Version: 2.0
- Models: 4
- Identity Ages: 19 / 23 / 28 / 33
- Scope: Portrait / Fashion / Editorial / Branding / Commercial
- Status: Ready for Approved Reference Set creation
