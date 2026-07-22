import { defaultStickerMessages } from "../../data/line-sticker/default-messages.ts"
import {
  defaultStickerTextStyleId,
  getStickerTextStyle,
} from "../../data/line-sticker/text-styles.ts"
import type { StickerTextSettings } from "../../types/line-sticker.ts"

export function createDefaultTextSetting(index: number): StickerTextSettings {
  const style = getStickerTextStyle(defaultStickerTextStyleId)
  return {
    message: defaultStickerMessages[index] ?? "",
    styleId: style.id,
    fillColor: style.fill,
    strokeColor: style.stroke,
    strokeWidth: style.strokeWidth,
    fontSize: 46,
    letterSpacing: style.letterSpacing,
    shadowEnabled: style.shadow,
    shadowColor: style.shadowColor,
    x: 0.5,
    y: 0.82,
    rotation: style.rotation,
  }
}

export function createDefaultStickerTextSettings() {
  return Array.from({ length: 16 }, (_, index) => createDefaultTextSetting(index))
}

export function applyTextStyle(
  current: StickerTextSettings,
  styleId: string,
): StickerTextSettings {
  const style = getStickerTextStyle(styleId)
  return {
    ...current,
    styleId,
    fillColor: style.fill,
    strokeColor: style.stroke,
    strokeWidth: style.strokeWidth,
    letterSpacing: style.letterSpacing,
    shadowEnabled: style.shadow,
    shadowColor: style.shadowColor,
    rotation: style.rotation,
  }
}
