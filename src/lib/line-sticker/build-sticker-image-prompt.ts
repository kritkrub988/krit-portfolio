import { stickerEmotions } from "../../data/line-sticker/emotions.ts"
import { stickerThemes } from "../../data/line-sticker/themes.ts"

export const stickerImagePromptFilename = "line-sticker-image-prompt.txt"

const masterPromptIntro = `ใช้รูปภาพที่ฉันแนบเป็นภาพอ้างอิงหลัก เปลี่ยนตัวแบบในภาพให้เป็นตัวละครสติกเกอร์การ์ตูนน่ารัก โดยรักษาเอกลักษณ์สำคัญจากต้นฉบับ เช่น รูปหน้า ทรงผม สีผิว เสื้อผ้า และจุดเด่น ให้ตัวละครทั้ง 16 ภาพดูเป็นคนเดียวกัน

Theme: {{THEME_NAME}}
รูปแบบภาพ: {{THEME_PROMPT}}

สร้างตัวละคร 16 อารมณ์ เรียงจากซ้ายไปขวาและจากแถวบนลงแถวล่างดังนี้:`

const masterPromptRules = `จัดเป็นตาราง 4 คอลัมน์ × 4 แถว ให้มีครบ 16 ภาพ ใช้ภาพช่วงเอวขึ้นไป ขนาดตัวละครใกล้เคียงกัน และวางตัวละครไว้กึ่งกลางพื้นที่ของตัวเอง

รักษาทรงผม เสื้อผ้า สีผิว และรูปแบบตัวละครให้สม่ำเสมอทั้งชุด เปลี่ยนเฉพาะสีหน้า ท่าทาง และอุปกรณ์ขนาดเล็กที่เกี่ยวข้องกับอารมณ์

เพิ่มขอบสติกเกอร์สีขาวรอบตัวละครอย่างสม่ำเสมอ ใช้พื้นหลังสีเดียวเรียบที่แตกต่างจากสีหลักของตัวละคร เพื่อให้นำไปลบพื้นหลังภายหลังได้ง่าย

ตัวละคร มือ อุปกรณ์ และขอบสติกเกอร์ต้องอยู่ภายในพื้นที่ของภาพตัวเอง ห้ามล้ำหรือซ้อนกับภาพข้างเคียง ห้ามตัดศีรษะ มือ หรือส่วนสำคัญ

ห้ามใส่ข้อความ ห้ามใส่ตัวอักษร ห้ามใส่ตัวเลข ห้ามใส่เส้นกรอบแบ่งช่อง ห้ามสร้างภาพซ้ำ และห้ามเปลี่ยนเครื่องแต่งกายระหว่างภาพ

ผลลัพธ์เป็นสติกเกอร์ชีต 1 ภาพ แบบ 4×4 ความละเอียดสูง มีครบ 16 ภาพ พร้อมนำไปตัดเป็นไฟล์แยก`

const masterPromptEmotions = stickerEmotions
  .map((emotion) => `${emotion.id}. ${emotion.label} — ${emotion.action}`)
  .join("\n")

export const stickerImageMasterPrompt = `${masterPromptIntro}\n\n${masterPromptEmotions}\n\n${masterPromptRules}`

export function getStickerTheme(themeId: string) {
  const theme = stickerThemes.find((item) => item.id === themeId)
  if (!theme) throw new Error(`Unknown sticker theme: ${themeId}`)
  return theme
}

export function buildStickerImagePrompt(themeId: string) {
  const theme = getStickerTheme(themeId)
  return stickerImageMasterPrompt
    .replace("{{THEME_NAME}}", theme.nameEnglish)
    .replace("{{THEME_PROMPT}}", theme.promptText)
}
