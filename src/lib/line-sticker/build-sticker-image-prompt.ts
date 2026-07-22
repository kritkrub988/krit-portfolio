import { stickerEmotions } from "../../data/line-sticker/emotions.ts"
import { stickerThemes } from "../../data/line-sticker/themes.ts"

export const stickerImagePromptFilename = "line-sticker-image-prompt.txt"

export function getStickerTheme(themeId: string) {
  const theme = stickerThemes.find((item) => item.id === themeId)
  if (!theme) throw new Error(`Unknown sticker theme: ${themeId}`)
  return theme
}

export function buildStickerImagePrompt(themeId: string) {
  const theme = getStickerTheme(themeId)
  const emotions = stickerEmotions
    .map((emotion) => `${emotion.id} ${emotion.label} — ${emotion.action}`)
    .join("\n")

  return `ใช้รูปภาพที่ฉันแนบเป็นภาพอ้างอิงหลัก เปลี่ยนบุคคลในภาพเป็นตัวละครสติกเกอร์การ์ตูนน่ารัก โดยรักษาเอกลักษณ์หลัก เช่น รูปหน้า ทรงผม สีผิว เสื้อผ้า และจุดเด่น ให้ทั้ง 16 ภาพดูเป็นคนเดียวกัน

Theme: ${theme.nameEnglish} (${theme.nameThai})
รูปแบบภาพ: ${theme.promptText}

สร้างอารมณ์เรียงจากซ้ายไปขวา บนลงล่าง:
${emotions}

จัดเป็นตาราง 4×4 ครบ 16 ช่อง ใช้ภาพช่วงเอวขึ้นไป ขนาดตัวละครใกล้เคียงกัน แต่ละภาพต้องอยู่ภายในพื้นที่ของตัวเองและไม่ล้ำข้ามช่อง ไม่มีข้อความ ไม่มีตัวอักษร ไม่มีตัวเลข ไม่มีกรอบช่อง และใช้พื้นหลังสีเรียบที่ตัดออกได้ง่าย`
}
