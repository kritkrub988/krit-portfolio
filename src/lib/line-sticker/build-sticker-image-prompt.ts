import { getStickerPack } from "../../data/line-sticker/sticker-packs.ts"
import { getStickerVisualStyle } from "../../data/line-sticker/themes.ts"
import type { StickerPackMode } from "../../types/line-sticker.ts"

export const stickerImagePromptFilename = "line-sticker-image-prompt.txt"

export const stickerPromptIntros: Record<StickerPackMode, string> = {
  single: "ใช้รูปภาพที่ฉันแนบเป็นภาพอ้างอิงหลัก เปลี่ยนตัวแบบในภาพให้เป็นตัวละครสติกเกอร์การ์ตูนน่ารัก โดยรักษาเอกลักษณ์สำคัญจากต้นฉบับ เช่น รูปหน้า ทรงผม สีผิว เสื้อผ้า และจุดเด่น ให้ตัวละครทั้ง 16 ภาพดูเป็นคนเดียวกัน",
  animal: "ใช้รูปภาพสัตว์ที่ฉันแนบเป็นภาพอ้างอิงหลัก เปลี่ยนสัตว์ในภาพให้เป็นตัวละครสติกเกอร์การ์ตูนน่ารัก โดยรักษาเอกลักษณ์สำคัญจากต้นฉบับ เช่น สีขน ลวดลาย รูปหน้า หู หาง และจุดเด่น ให้ตัวละครทั้ง 16 ภาพดูเป็นสัตว์ตัวเดียวกัน",
  pair: "ใช้รูปภาพที่ฉันแนบเป็นภาพอ้างอิงหลัก สร้างตัวละครสติกเกอร์คู่จำนวน 2 ตัว โดยรักษาเอกลักษณ์ของแต่ละตัวละคร เช่น รูปหน้า ทรงผม สีผิว เสื้อผ้า และจุดเด่น ให้ทั้งสองคนดูเป็นคนเดิมและแยกจากกันได้ชัดเจนในทั้ง 16 ภาพ\n\nรักษาความสัมพันธ์และปฏิสัมพันธ์ของตัวละครทั้งสองตามท่าทางที่กำหนด",
}

export const stickerPromptRules = `จัดเป็นตาราง 4 คอลัมน์ × 4 แถว ให้มีครบ 16 ภาพ ใช้ภาพช่วงเอวขึ้นไป ขนาดตัวละครใกล้เคียงกัน และวางตัวละครไว้กึ่งกลางพื้นที่ของตัวเอง

รักษาทรงผม เสื้อผ้า สีผิว และรูปแบบตัวละครให้สม่ำเสมอทั้งชุด เปลี่ยนเฉพาะสีหน้า ท่าทาง และอุปกรณ์ขนาดเล็กที่เกี่ยวข้องกับอารมณ์

เพิ่มขอบสติกเกอร์สีขาวรอบตัวละครอย่างสม่ำเสมอ ใช้พื้นหลังสีเดียวเรียบที่แตกต่างจากสีหลักของตัวละคร เพื่อให้นำไปลบพื้นหลังภายหลังได้ง่าย

ตัวละคร มือ อุปกรณ์ และขอบสติกเกอร์ต้องอยู่ภายในพื้นที่ของภาพตัวเอง ห้ามล้ำหรือซ้อนกับภาพข้างเคียง ห้ามตัดศีรษะ มือ หรือส่วนสำคัญ

ข้อความในรายการมีไว้ระบุความหมายและท่าทางเท่านั้น

ห้ามใส่ข้อความ ห้ามใส่ตัวอักษร ห้ามใส่ตัวเลข ห้ามใส่เส้นกรอบแบ่งช่อง ห้ามสร้างภาพซ้ำ และห้ามเปลี่ยนเครื่องแต่งกายระหว่างภาพ

ผลลัพธ์เป็นสติกเกอร์ชีต 1 ภาพ แบบ 4×4 ความละเอียดสูง มีครบ 16 ภาพ พร้อมนำไปตัดเป็นไฟล์แยก`

export function buildStickerImagePrompt(
  stickerPackId: string,
  visualStyleId: string,
) {
  const stickerPack = getStickerPack(stickerPackId)
  const visualStyle = getStickerVisualStyle(visualStyleId)
  const animalNote = stickerPack.id === "cute-orange-cat"
    ? "\n\nถ้าเป็นชุดแมวน่ารัก ให้คงลักษณะแมวเป็นหลัก และสามารถใช้โทนแมวส้มตามคำอธิบายของชุดได้"
    : ""
  const itemList = stickerPack.items
    .map((item) => `${item.id.toString().padStart(2, "0")}. ${item.text} — ${item.action}`)
    .join("\n")

  return `${stickerPromptIntros[stickerPack.characterMode]}${animalNote}

Visual Style: ${visualStyle.nameEnglish} (${visualStyle.nameThai})
รูปแบบภาพ: ${visualStyle.promptText}

สร้างตัวละคร 16 ภาพ เรียงจากซ้ายไปขวาและจากแถวบนลงแถวล่างดังนี้:

${itemList}

${stickerPromptRules}`
}
