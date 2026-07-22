import { formatStickerFilename } from "../../config/sticker-export.ts"
import type {
  ExportValidationItem,
  ExportValidationSummary,
} from "../../types/line-sticker.ts"

export function validateStickerFiles(
  items: ExportValidationItem[],
  mainReady: boolean,
  tabReady: boolean,
): ExportValidationSummary {
  const errors: string[] = []
  const warnings: string[] = []
  const warningFiles = new Set<string>()

  if (items.length !== 16) errors.push(`ต้องมีภาพครบ 16 ภาพ (พบ ${items.length})`)
  const expectedNames = Array.from({ length: 16 }, (_, index) => formatStickerFilename(index + 1))
  expectedNames.forEach((filename) => {
    if (!items.some((item) => item.filename === filename)) errors.push(`ไม่พบไฟล์ ${filename}`)
  })

  items.forEach((item) => {
    if (item.isEmpty) errors.push(`${item.filename} ไม่มีข้อมูลภาพ`)
    if (!item.isPng) errors.push(`${item.filename} ไม่ใช่ PNG`)
    if (!item.hasTransparency) {
      warnings.push(`${item.filename} ยังไม่พบพื้นที่โปร่งใส`)
      warningFiles.add(item.filename)
    }
    if (item.textOverflow) {
      warnings.push(`${item.filename} มีข้อความล้น Canvas`)
      warningFiles.add(item.filename)
    } else if (item.textNearEdge) {
      warnings.push(`${item.filename} มีข้อความใกล้ขอบ Safe Area`)
      warningFiles.add(item.filename)
    }
  })

  if (!mainReady) errors.push("ยังสร้าง main.png ไม่สำเร็จ")
  if (!tabReady) errors.push("ยังสร้าง tab.png ไม่สำเร็จ")

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    warningFiles: [...warningFiles],
  }
}
