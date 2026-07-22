import { formatStickerFilename } from "../../config/sticker-export.ts"
import type { CropRect, CropSettings } from "../../types/line-sticker.ts"

export const defaultCropSettings: CropSettings = {
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  marginBottom: 0,
  gapX: 0,
  gapY: 0,
}

function validateDimension(value: number, name: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive number`)
  }
}

function validateSetting(value: number, name: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be zero or greater`)
  }
}

export function calculateGridCropRects(
  imageWidth: number,
  imageHeight: number,
  settings: CropSettings,
): CropRect[] {
  validateDimension(imageWidth, "imageWidth")
  validateDimension(imageHeight, "imageHeight")
  Object.entries(settings).forEach(([name, value]) => validateSetting(value, name))

  const contentWidth = imageWidth - settings.marginLeft - settings.marginRight - settings.gapX * 3
  const contentHeight = imageHeight - settings.marginTop - settings.marginBottom - settings.gapY * 3
  if (contentWidth < 4 || contentHeight < 4) {
    throw new Error("Crop margins and gaps leave no usable image area")
  }

  const cellWidth = contentWidth / 4
  const cellHeight = contentHeight / 4
  const rects: CropRect[] = []

  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      const index = row * 4 + column + 1
      const rawLeft = settings.marginLeft + column * (cellWidth + settings.gapX)
      const rawTop = settings.marginTop + row * (cellHeight + settings.gapY)
      const rawRight = settings.marginLeft + (column + 1) * cellWidth + column * settings.gapX
      const rawBottom = settings.marginTop + (row + 1) * cellHeight + row * settings.gapY
      const x = Math.round(rawLeft)
      const y = Math.round(rawTop)
      const right = Math.round(rawRight)
      const bottom = Math.round(rawBottom)

      rects.push({
        index,
        row,
        column,
        filename: formatStickerFilename(index),
        x,
        y,
        width: Math.max(1, right - x),
        height: Math.max(1, bottom - y),
      })
    }
  }

  return rects
}
