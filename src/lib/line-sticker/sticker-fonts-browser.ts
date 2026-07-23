"use client"

import {
  getStickerFont,
  getStickerFontStackKeys,
  stickerSystemFontFallback,
} from "@/data/line-sticker/sticker-fonts"
import { getStickerTextStyle } from "@/data/line-sticker/text-styles"
import type { StickerFontKey, StickerTextSettings } from "@/types/line-sticker"

export type ResolvedStickerFont = {
  fontFamily: string
  primaryReady: boolean
  usedFallback: boolean
}

const resolvedFontPromises = new Map<string, Promise<ResolvedStickerFont>>()

function getFontRoot() {
  return document.querySelector<HTMLElement>("[data-sticker-font-root]") ?? document.documentElement
}

function resolveFontVariable(fontKey: StickerFontKey) {
  const font = getStickerFont(fontKey)
  const value = getComputedStyle(getFontRoot()).getPropertyValue(font.cssVariable).trim()
  // next/font may include its configured fallbacks in the variable value.
  // Canvas needs only the generated primary family here so our own fallback
  // order stays deterministic: primary -> Kodchasan -> Mali -> Mitr -> Itim.
  return firstFamily(value || `"${font.name}"`)
}

function firstFamily(fontFamily: string) {
  return fontFamily.split(",")[0]?.trim() || fontFamily
}

function warnMissingFont(fontKey: StickerFontKey) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[LINE Sticker Studio] ฟอนต์ ${getStickerFont(fontKey).name} โหลดไม่สำเร็จ กำลังใช้ fallback`)
  }
}

async function loadStickerFont(
  fontKey: StickerFontKey,
  fontWeight: number,
  sampleText: string,
): Promise<ResolvedStickerFont> {
  const stackKeys = getStickerFontStackKeys(fontKey)
  const resolvedFamilies = stackKeys.map(resolveFontVariable)
  const fullStack = [...resolvedFamilies, stickerSystemFontFallback].join(", ")

  if (!document.fonts) {
    warnMissingFont(fontKey)
    return { fontFamily: fullStack, primaryReady: false, usedFallback: true }
  }

  const sample = sampleText.trim() || "สวัสดี ขอบคุณค่ะ สู้ ๆ นะ"
  const primaryFamily = firstFamily(resolvedFamilies[0])
  const primaryFont = `${fontWeight} 32px ${primaryFamily}`
  await document.fonts.load(primaryFont, sample)
  await document.fonts.ready
  const primaryReady = document.fonts.check(primaryFont, sample)

  if (primaryReady) {
    return { fontFamily: fullStack, primaryReady: true, usedFallback: false }
  }

  warnMissingFont(fontKey)
  for (let index = 1; index < resolvedFamilies.length; index += 1) {
    const fallbackFamily = firstFamily(resolvedFamilies[index])
    const fallbackFont = `${fontWeight} 32px ${fallbackFamily}`
    await document.fonts.load(fallbackFont, sample)
    if (document.fonts.check(fallbackFont, sample)) {
      const reordered = [resolvedFamilies[index], ...resolvedFamilies.filter((_, familyIndex) => familyIndex !== index)]
      return {
        fontFamily: [...reordered, stickerSystemFontFallback].join(", "),
        primaryReady: false,
        usedFallback: true,
      }
    }
  }

  return { fontFamily: stickerSystemFontFallback, primaryReady: false, usedFallback: true }
}

export function waitForStickerFont(
  fontKey: StickerFontKey,
  fontWeight: number,
  sampleText: string,
) {
  const cacheKey = `${fontKey}:${fontWeight}`
  const cached = resolvedFontPromises.get(cacheKey)
  if (cached) return cached
  const promise = loadStickerFont(fontKey, fontWeight, sampleText).catch((cause) => {
    resolvedFontPromises.delete(cacheKey)
    throw cause
  })
  resolvedFontPromises.set(cacheKey, promise)
  return promise
}

export async function waitForStickerFontsForSettings(settings: StickerTextSettings[]) {
  const unique = new Map<string, { fontKey: StickerFontKey; fontWeight: number; sampleText: string }>()
  settings.forEach((item) => {
    const style = getStickerTextStyle(item.styleId)
    unique.set(`${style.fontKey}:${style.fontWeight}`, {
      fontKey: style.fontKey,
      fontWeight: style.fontWeight,
      sampleText: item.message,
    })
  })
  return Promise.all(
    [...unique.values()].map((font) => waitForStickerFont(font.fontKey, font.fontWeight, font.sampleText)),
  )
}
