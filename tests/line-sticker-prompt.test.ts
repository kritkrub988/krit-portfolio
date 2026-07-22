import assert from "node:assert/strict"
import test from "node:test"

import {
  defaultStickerMessages,
  stickerMessageSoftLimit,
} from "../src/data/line-sticker/default-messages.ts"
import {
  splitStickerPrompt,
  stickerPromptFilename,
} from "../src/data/line-sticker/prompt-templates.ts"
import {
  defaultStickerTextStyleId,
  stickerTextStyles,
} from "../src/data/line-sticker/text-styles.ts"
import {
  defaultStickerThemeId,
  stickerThemes,
} from "../src/data/line-sticker/themes.ts"
import {
  buildStickerPrompt,
  getStickerPromptSelection,
} from "../src/lib/line-sticker/build-sticker-prompt.ts"
import type { StickerPromptInput } from "../src/types/line-sticker.ts"

function defaultInput(): StickerPromptInput {
  return {
    themeId: defaultStickerThemeId,
    textStyleId: defaultStickerTextStyleId,
    messages: [...defaultStickerMessages],
  }
}

test("configures the required 12 themes and default Pastel Cute theme", () => {
  assert.equal(stickerThemes.length, 12)
  assert.equal(new Set(stickerThemes.map((theme) => theme.id)).size, 12)
  const selected = stickerThemes.find((theme) => theme.id === defaultStickerThemeId)
  assert.equal(selected?.nameEnglish, "Pastel Cute")
  assert.equal(selected?.nameThai, "พาสเทลน่ารัก")
  stickerThemes.forEach((theme) => {
    assert.equal(theme.colors.length, 3)
    assert.ok(theme.prompt.length > 20)
  })
})

test("configures all 24 text styles and defaults to Bold Rounded", () => {
  assert.equal(stickerTextStyles.length, 24)
  assert.equal(new Set(stickerTextStyles.map((style) => style.id)).size, 24)
  const selected = stickerTextStyles.find((style) => style.id === defaultStickerTextStyleId)
  assert.equal(selected?.nameEnglish, "Bold Rounded")
  assert.equal(selected?.nameThai, "ตัวกลมหนา")
})

test("preserves the required 16 editable Thai default messages", () => {
  assert.equal(defaultStickerMessages.length, 16)
  assert.deepEqual(defaultStickerMessages, [
    "สวัสดีค่า",
    "ขอบคุณค่า",
    "ขอโทษน้า",
    "ได้เลยค่า",
    "โอเคเลย",
    "ไม่เป็นไรน้า",
    "รอแป๊บนึง",
    "ถึงแล้วน้า",
    "ไปก่อนน้า",
    "เย้!",
    "สู้ ๆ นะ",
    "หิวแล้ววว",
    "ง่วงจัง",
    "คิดถึงจัง",
    "รักนะ",
    "ฝันดีค่า",
  ])
  assert.equal(stickerMessageSoftLimit, 20)
})

test("builds the temporary 4 by 4 prompt with theme, text style, and 16 messages", () => {
  const prompt = buildStickerPrompt(defaultInput())
  assert.match(prompt, /รูปภาพต้นฉบับที่ฉันแนบในแชตเป็นตัวอ้างอิงหลัก/)
  assert.match(prompt, /สม่ำเสมอทั้ง 16 ภาพ/)
  assert.match(prompt, /4 คอลัมน์ × 4 แถว/)
  assert.match(prompt, /ใช้พื้นหลังโปร่งใส/)
  assert.match(prompt, /Theme: Pastel Cute \(พาสเทลน่ารัก\)/)
  assert.match(prompt, /Text style: Bold Rounded \(ตัวกลมหนา\)/)
  assert.match(prompt, /01\. สวัสดีค่า/)
  assert.match(prompt, /16\. ฝันดีค่า/)
  assert.match(prompt, /ตัวอักษรภาษาไทยต้องอ่านง่าย สะกดถูก และไม่บังใบหน้า/)
})

test("custom theme, text style, and edited messages flow into the generated prompt", () => {
  const messages: string[] = [...defaultStickerMessages]
  messages[0] = "หวัดดีจ้า"
  messages[15] = "นอนหลับฝันดี"
  const prompt = buildStickerPrompt({
    themeId: "soft-3d",
    textStyleId: "candy-text",
    messages,
  })
  assert.match(prompt, /Theme: Soft 3D \(การ์ตูน 3D นุ่มนิ่ม\)/)
  assert.match(prompt, /Text style: Candy Text \(ลูกกวาด\)/)
  assert.match(prompt, /01\. หวัดดีจ้า/)
  assert.match(prompt, /16\. นอนหลับฝันดี/)
})

test("empty message fields remain visible as intentional blanks", () => {
  const messages: string[] = [...defaultStickerMessages]
  messages[4] = "   "
  const prompt = buildStickerPrompt({ ...defaultInput(), messages })
  assert.match(prompt, /05\. \(เว้นว่าง\)/)
})

test("rejects an input that does not contain exactly 16 messages", () => {
  assert.throws(
    () => getStickerPromptSelection({ ...defaultInput(), messages: ["ข้อความเดียว"] }),
    /requires exactly 16 messages/,
  )
})

test("split prompt preserves files 01 through 16 plus main and tab assets", () => {
  assert.match(splitStickerPrompt, /ตัดภาพตามเส้นแบ่งเดิมออกเป็น 16 ช่อง/)
  assert.match(splitStickerPrompt, /01\.png/)
  assert.match(splitStickerPrompt, /16\.png/)
  assert.match(splitStickerPrompt, /main\.png/)
  assert.match(splitStickerPrompt, /tab\.png/)
  assert.match(splitStickerPrompt, /รวมไฟล์ทั้งหมดเป็น ZIP พร้อมดาวน์โหลด/)
  assert.equal(stickerPromptFilename, "line-sticker-prompt.txt")
})
