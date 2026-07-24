import {
  defaultStickerPackId,
  getStickerPack,
} from "../../data/line-sticker/sticker-packs.ts"
import {
  defaultStickerTextStyleId,
  getStickerTextStyle,
} from "../../data/line-sticker/text-styles.ts"
import type {
  BackgroundRemovalSettings,
  StickerTextSettings,
} from "../../types/line-sticker.ts"

export function createDefaultBackgroundRemovalSettings(): BackgroundRemovalSettings {
  return {
    color: { r: 255, g: 255, b: 255 },
    tolerance: 45,
    edgeConnected: true,
    feather: 1,
  }
}

export function createDefaultTextSetting(
  index: number,
  stickerPackId = defaultStickerPackId,
): StickerTextSettings {
  const style = getStickerTextStyle(defaultStickerTextStyleId)
  const pack = getStickerPack(stickerPackId)
  return {
    message: pack.items[index]?.text ?? "",
    styleId: style.id,
    fillColor: style.fill,
    strokeColor: style.stroke,
    strokeWidth: style.strokeWidth,
    fontSize: 46,
    letterSpacing: style.letterSpacing,
    shadowEnabled: style.shadowBlur > 0 || style.shadowOffsetX !== 0 || style.shadowOffsetY !== 0,
    shadowColor: style.shadowColor,
    x: 0.5,
    y: 0.82,
    rotation: style.rotation,
  }
}

export function createDefaultStickerTextSettings(stickerPackId = defaultStickerPackId) {
  return Array.from(
    { length: 16 },
    (_, index) => createDefaultTextSetting(index, stickerPackId),
  )
}

export function stickerTextSettingsMatchPack(
  settings: StickerTextSettings[],
  stickerPackId: string,
) {
  const pack = getStickerPack(stickerPackId)
  return pack.items.every((item, index) => settings[index]?.message === item.text)
}

export function applyStickerPackMessages(
  settings: StickerTextSettings[],
  stickerPackId: string,
) {
  const pack = getStickerPack(stickerPackId)
  return settings.map((setting, index) => ({
    ...setting,
    message: pack.items[index]?.text ?? "",
  }))
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
    shadowEnabled: style.shadowBlur > 0 || style.shadowOffsetX !== 0 || style.shadowOffsetY !== 0,
    shadowColor: style.shadowColor,
    rotation: style.rotation,
  }
}
