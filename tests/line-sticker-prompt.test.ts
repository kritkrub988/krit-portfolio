import assert from "node:assert/strict"
import test from "node:test"

import {
  createCompleteStickerFilenames,
  formatStickerFilename,
  stickerExportConfig,
} from "../src/config/sticker-export.ts"
import { defaultStickerMessages } from "../src/data/line-sticker/default-messages.ts"
import { stickerEmotions } from "../src/data/line-sticker/emotions.ts"
import {
  getStickerFontCssFamily,
  stickerFontFallbackOrder,
  stickerFonts,
} from "../src/data/line-sticker/sticker-fonts.ts"
import {
  defaultStickerTextStyleId,
  stickerTextStyles,
} from "../src/data/line-sticker/text-styles.ts"
import {
  defaultStickerThemeId,
  stickerThemes,
} from "../src/data/line-sticker/themes.ts"
import {
  buildStickerImagePrompt,
  stickerImageMasterPrompt,
  stickerImagePromptFilename,
} from "../src/lib/line-sticker/build-sticker-image-prompt.ts"
import {
  calculateGridCropRects,
  defaultCropSettings,
} from "../src/lib/line-sticker/crop-sticker-grid.ts"
import { createStickerZip } from "../src/lib/line-sticker/create-sticker-zip.ts"
import {
  colorDistance,
  createBackgroundRemovalMask,
  hasTransparentPixel,
  removeSolidBackgroundPixels,
} from "../src/lib/line-sticker/remove-solid-background.ts"
import {
  applyTextStyle,
  createDefaultBackgroundRemovalSettings,
  createDefaultStickerTextSettings,
} from "../src/lib/line-sticker/sticker-state.ts"
import {
  assessTextBounds,
  calculateContainPlacement,
  calculateRotatedTextBounds,
  estimateTextWidth,
  splitThaiGraphemes,
} from "../src/lib/line-sticker/text-layout.ts"
import { validateStickerFiles } from "../src/lib/line-sticker/validate-sticker-files.ts"
import type { BackgroundRemovalSettings, ExportValidationItem } from "../src/types/line-sticker.ts"

test("keeps the required 12 themes and defaults to Pastel Cute", () => {
  assert.equal(stickerThemes.length, 12)
  assert.equal(new Set(stickerThemes.map((theme) => theme.id)).size, 12)
  assert.equal(stickerThemes.find((theme) => theme.id === defaultStickerThemeId)?.nameEnglish, "Pastel Cute")
  stickerThemes.forEach((theme) => assert.ok(theme.promptText.length > 20))
})

test("builds one concise image-only prompt with all 16 ordered emotions", () => {
  const prompt = buildStickerImagePrompt(defaultStickerThemeId)
  assert.match(prompt, /ใช้รูปภาพที่ฉันแนบเป็นภาพอ้างอิงหลัก/)
  assert.match(prompt, /Theme: Pastel Cute/)
  assert.match(prompt, /01\. ทักทาย — ยิ้มอย่างเป็นมิตรและยกมือโบก/)
  assert.match(prompt, /16\. ฝันดี — หลับตาและกอดหมอนขนาดเล็ก/)
  assert.match(prompt, /ตาราง 4 คอลัมน์ × 4 แถว ให้มีครบ 16 ภาพ/)
  assert.match(prompt, /ห้ามใส่ข้อความ ห้ามใส่ตัวอักษร ห้ามใส่ตัวเลข/)
  assert.doesNotMatch(prompt, /Text style|สวัสดีค่า/)
  assert.equal(stickerEmotions.length, 16)
  assert.equal(stickerImagePromptFilename, "line-sticker-image-prompt.txt")
})

test("substitutes only the two supported Master Prompt variables for every theme", () => {
  assert.equal((stickerImageMasterPrompt.match(/\{\{THEME_NAME\}\}/g) ?? []).length, 1)
  assert.equal((stickerImageMasterPrompt.match(/\{\{THEME_PROMPT\}\}/g) ?? []).length, 1)
  stickerThemes.forEach((theme) => {
    const prompt = buildStickerImagePrompt(theme.id)
    assert.ok(prompt.includes(`Theme: ${theme.nameEnglish}`))
    assert.ok(prompt.includes(theme.promptText))
    assert.doesNotMatch(prompt, /\{\{[^}]+\}\}/)
    assert.doesNotMatch(prompt, /TEXT_STYLE|ZIP|API Key/)
  })
})

test("preserves the required 16 Thai defaults and 24 Canvas text styles", () => {
  assert.deepEqual(defaultStickerMessages, [
    "สวัสดีค่า", "ขอบคุณค่า", "ขอโทษน้า", "ได้เลยค่า", "โอเคเลย", "ไม่เป็นไรน้า",
    "รอแป๊บนึง", "ถึงแล้วน้า", "ไปก่อนนะ", "เย้!", "สู้ ๆ นะ", "หิวแล้ววว",
    "ง่วงจัง", "คิดถึงจัง", "รักนะ", "ฝันดีค่า",
  ])
  assert.equal(stickerTextStyles.length, 24)
  assert.equal(defaultStickerTextStyleId, "bold-rounded")
  const settings = createDefaultStickerTextSettings()
  assert.equal(settings.length, 16)
  assert.equal(settings[0].message, "สวัสดีค่า")
  assert.equal(applyTextStyle(settings[0], "candy-text").styleId, "candy-text")
  assert.deepEqual(createDefaultBackgroundRemovalSettings(), {
    color: { r: 255, g: 255, b: 255 }, tolerance: 45, edgeConnected: true, feather: 1,
  })
})

test("maps all 24 text styles to the seven required Thai fonts and exact weights", () => {
  const expected = [
    ["Kodchasan", 700], ["Mali", 500], ["Kodchasan", 700], ["Mitr", 700],
    ["Mitr", 700], ["Kodchasan", 700], ["Mali", 600], ["Mitr", 600],
    ["Kodchasan", 700], ["Itim", 400], ["Sriracha", 400], ["Mali", 600],
    ["Kodchasan", 700], ["Sriracha", 400], ["Chakra Petch", 400], ["Mitr", 700],
    ["Chakra Petch", 600], ["Itim", 400], ["Pattaya", 400], ["Mitr", 700],
    ["Mali", 500], ["Itim", 400], ["Mali", 600], ["Pattaya", 400],
  ]
  assert.deepEqual(
    stickerTextStyles.map((style) => [stickerFonts[style.fontKey].name, style.fontWeight]),
    expected,
  )
  assert.equal(new Set(stickerTextStyles.map((style) => style.fontKey)).size, 7)
  stickerTextStyles.forEach((style) => {
    assert.ok(stickerFonts[style.fontKey].weights.includes(style.fontWeight))
    assert.ok(style.previewClass.length > 0)
    assert.ok(style.shadowBlur >= 0)
  })
})

test("uses the required Thai fallback order and preserves every validation phrase", () => {
  assert.deepEqual(stickerFontFallbackOrder, ["kodchasan", "mali", "mitr", "itim"])
  const family = getStickerFontCssFamily("sriracha")
  assert.match(family, /--font-sticker-sriracha/)
  assert.match(family, /--font-sticker-kodchasan/)
  assert.match(family, /"Noto Sans Thai", sans-serif/)
  const samples = [
    "สวัสดี", "ขอบคุณค่ะ", "ไม่เป็นไรนะ", "รอแป๊บนึง", "สู้ ๆ นะ", "ง่วงจัง", "ฝันดีค่า",
  ]
  samples.forEach((sample) => assert.equal(splitThaiGraphemes(sample).join(""), sample))
})

test("calculates ordered 4 by 4 crops for a square source", () => {
  const rects = calculateGridCropRects(1600, 1600, defaultCropSettings)
  assert.equal(rects.length, 16)
  assert.deepEqual(rects[0], { index: 1, row: 0, column: 0, filename: "01.png", x: 0, y: 0, width: 400, height: 400 })
  assert.deepEqual(rects[15], { index: 16, row: 3, column: 3, filename: "16.png", x: 1200, y: 1200, width: 400, height: 400 })
})

test("crops a horizontal source without resizing and respects outer margins plus gutters", () => {
  const rects = calculateGridCropRects(1800, 1000, {
    marginLeft: 100,
    marginRight: 100,
    marginTop: 40,
    marginBottom: 40,
    gapX: 20,
    gapY: 10,
  })
  assert.equal(rects[0].x, 100)
  assert.equal(rects[0].y, 40)
  assert.equal(rects[0].width, 385)
  assert.equal(rects[0].height, 223)
  assert.equal(rects[1].x - (rects[0].x + rects[0].width), 20)
  assert.equal(rects[4].y - (rects[0].y + rects[0].height), 10)
  assert.equal(rects[15].x + rects[15].width, 1700)
  assert.equal(rects[15].y + rects[15].height, 960)
})

test("rejects crop settings that consume the source image", () => {
  assert.throws(() => calculateGridCropRects(100, 100, { marginLeft: 60, marginRight: 60, marginTop: 0, marginBottom: 0, gapX: 0, gapY: 0 }), /no usable image area/)
})

test("computes RGB color distance", () => {
  assert.equal(colorDistance({ r: 10, g: 20, b: 30 }, { r: 10, g: 20, b: 30 }), 0)
  assert.equal(colorDistance({ r: 0, g: 0, b: 0 }, { r: 3, g: 4, b: 0 }), 5)
})

function whitePixelBuffer(width: number, height: number) {
  const pixels = new Uint8ClampedArray(width * height * 4)
  for (let index = 0; index < width * height; index += 1) pixels.set([255, 255, 255, 255], index * 4)
  return pixels
}

const edgeSettings: BackgroundRemovalSettings = {
  color: { r: 255, g: 255, b: 255 }, tolerance: 5, edgeConnected: true, feather: 0,
}

test("flood fill removes only matching pixels connected to image edges", () => {
  const pixels = whitePixelBuffer(5, 5)
  const blackRing = [[1,1],[2,1],[3,1],[1,2],[3,2],[1,3],[2,3],[3,3]]
  blackRing.forEach(([x, y]) => pixels.set([0, 0, 0, 255], (y * 5 + x) * 4))
  const mask = createBackgroundRemovalMask(pixels, 5, 5, edgeSettings)
  assert.equal(mask[0], 1)
  assert.equal(mask[2 * 5 + 2], 0, "enclosed white detail must be preserved")
  const output = removeSolidBackgroundPixels(pixels, 5, 5, edgeSettings)
  assert.equal(output[3], 0)
  assert.equal(output[(2 * 5 + 2) * 4 + 3], 255)
  assert.equal(hasTransparentPixel(output), true)
})

test("non-edge mode removes enclosed matching colors too", () => {
  const pixels = whitePixelBuffer(3, 3)
  pixels.set([0, 0, 0, 255], (1 * 3 + 0) * 4)
  const mask = createBackgroundRemovalMask(pixels, 3, 3, { ...edgeSettings, edgeConnected: false })
  assert.equal(mask[4], 1)
})

test("text bounds distinguish safe short Thai text from long overflowing Thai text", () => {
  const shortWidth = estimateTextWidth("เย้!", 46, 0)
  const longWidth = estimateTextWidth("ข้อความภาษาไทยยาวมากจนล้นขอบ", 46, 1)
  assert.ok(longWidth > shortWidth)
  const safe = calculateRotatedTextBounds(185, 260, shortWidth, 55, 0)
  const overflow = calculateRotatedTextBounds(185, 260, longWidth, 55, 0)
  assert.deepEqual(assessTextBounds(safe, 370, 320, 18), { overflow: false, nearEdge: false })
  assert.equal(assessTextBounds(overflow, 370, 320, 18).overflow, true)
})

test("keeps Thai vowels and tone marks intact while segmenting text for Canvas", () => {
  const text = "สวัสดีค่า เก่งที่สุด!"
  const graphemes = splitThaiGraphemes(text)
  assert.equal(graphemes.join(""), text)
  assert.ok(graphemes.length < Array.from(text).length)
  assert.ok(graphemes.some((grapheme) => grapheme.length > 1))
})

test("contain placement creates centered main and tab output without stretching or cropping", () => {
  const main = calculateContainPlacement(370, 320, stickerExportConfig.mainCanvasWidth, stickerExportConfig.mainCanvasHeight)
  const tab = calculateContainPlacement(370, 320, stickerExportConfig.tabCanvasWidth, stickerExportConfig.tabCanvasHeight)
  assert.equal(main.width, 240)
  assert.ok(main.height < 240 && main.y > 0)
  assert.equal(tab.height, 74)
  assert.ok(tab.width < 96 && tab.x > 0)
})

test("creates filenames 01 through 16 plus main and tab", () => {
  assert.equal(formatStickerFilename(1), "01.png")
  assert.equal(formatStickerFilename(16), "16.png")
  assert.throws(() => formatStickerFilename(17), /between 1 and 16/)
  const filenames = createCompleteStickerFilenames()
  assert.equal(filenames.length, 18)
  assert.deepEqual(filenames.slice(-2), ["main.png", "tab.png"])
})

test("creates a readable ZIP containing all 18 expected PNG filenames", async () => {
  const JSZip = (await import("jszip")).default
  const filenames = createCompleteStickerFilenames()
  const zipBlob = await createStickerZip(
    filenames.map((filename) => ({
      filename,
      blob: new Blob([filename], { type: "image/png" }),
    })),
  )
  const parsed = await JSZip.loadAsync(await zipBlob.arrayBuffer())

  assert.equal(zipBlob.type, "application/zip")
  assert.deepEqual(Object.keys(parsed.files).sort(), [...filenames].sort())
})

function validExportItems(): ExportValidationItem[] {
  return Array.from({ length: 16 }, (_, index) => ({
    stickerId: `sticker-${index + 1}`,
    filename: formatStickerFilename(index + 1),
    isPng: true,
    isEmpty: false,
    hasTransparency: true,
    textOverflow: false,
    textNearEdge: false,
  }))
}

test("validates all files before export and keeps warnings non-blocking", () => {
  const clean = validateStickerFiles(validExportItems(), true, true)
  assert.equal(clean.valid, true)
  assert.deepEqual(clean.errors, [])
  const warnedItems = validExportItems()
  warnedItems[8] = { ...warnedItems[8], textOverflow: true, hasTransparency: false }
  const warned = validateStickerFiles(warnedItems, true, true)
  assert.equal(warned.valid, true)
  assert.deepEqual(warned.warningFiles, ["09.png"])
  const blocked = validateStickerFiles(warnedItems.slice(0, 15), false, false)
  assert.equal(blocked.valid, false)
  assert.ok(blocked.errors.some((error) => error.includes("ครบ 16")))
  assert.ok(blocked.errors.some((error) => error.includes("main.png")))
  assert.ok(blocked.errors.some((error) => error.includes("tab.png")))
  const reordered = validExportItems()
  ;[reordered[0], reordered[1]] = [reordered[1], reordered[0]]
  const outOfOrder = validateStickerFiles(reordered, true, true)
  assert.equal(outOfOrder.valid, false)
  assert.ok(outOfOrder.errors.some((error) => error.includes("ลำดับไฟล์ไม่ถูกต้อง")))
})
