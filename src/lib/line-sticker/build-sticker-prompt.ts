import { stickerThemes } from "../../data/line-sticker/themes.ts"
import { stickerTextStyles } from "../../data/line-sticker/text-styles.ts"
import type { StickerPromptInput } from "../../types/line-sticker.ts"

function findById<T extends { id: string }>(items: T[], id: string, label: string): T {
  const item = items.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Unknown ${label}: ${id}`)
  return item
}

export function getStickerPromptSelection(input: StickerPromptInput) {
  if (input.messages.length !== 16) {
    throw new Error(`Sticker prompt requires exactly 16 messages; received ${input.messages.length}`)
  }

  return {
    theme: findById(stickerThemes, input.themeId, "sticker theme"),
    textStyle: findById(stickerTextStyles, input.textStyleId, "text style"),
    messages: input.messages,
  }
}

export function buildStickerPrompt(input: StickerPromptInput) {
  const { theme, textStyle, messages } = getStickerPromptSelection(input)
  const numberedMessages = messages
    .map((message, index) => `${String(index + 1).padStart(2, "0")}. ${message.trim() || "(เว้นว่าง)"}`)
    .join("\n")

  return `ใช้รูปภาพต้นฉบับที่ฉันแนบในแชตเป็นตัวอ้างอิงหลัก เปลี่ยนบุคคลในภาพให้เป็นตัวละครสติกเกอร์สไตล์การ์ตูนน่ารัก โดยรักษาใบหน้า ทรงผม สีผิว เสื้อผ้า และลักษณะเด่นจากภาพต้นฉบับให้สม่ำเสมอทั้ง 16 ภาพ

สร้างสติกเกอร์จำนวน 16 ภาพ จัดวางเป็นตาราง 4 คอลัมน์ × 4 แถว แต่ละช่องแยกจากกันอย่างชัดเจน ตัวละครไม่ล้ำข้ามช่อง ใช้พื้นหลังโปร่งใส

Theme: ${theme.nameEnglish} (${theme.nameThai})
Theme description: ${theme.prompt}

Text style: ${textStyle.nameEnglish} (${textStyle.nameThai})
Text style description: ${textStyle.prompt}

ข้อความและท่าทาง:
${numberedMessages}

ทำให้ท่าทาง สีหน้า และองค์ประกอบประกอบตรงกับความหมายของแต่ละข้อความ ตัวอักษรภาษาไทยต้องอ่านง่าย สะกดถูก และไม่บังใบหน้าตัวละคร`
}
