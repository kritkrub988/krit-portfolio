import type { StickerFontKey } from "@/types/line-sticker"

export type StickerFontDefinition = {
  key: StickerFontKey
  name: string
  cssVariable: string
  weights: readonly number[]
}

export const stickerFonts: Record<StickerFontKey, StickerFontDefinition> = {
  kodchasan: { key: "kodchasan", name: "Kodchasan", cssVariable: "--font-sticker-kodchasan", weights: [700] },
  mali: { key: "mali", name: "Mali", cssVariable: "--font-sticker-mali", weights: [500, 600] },
  mitr: { key: "mitr", name: "Mitr", cssVariable: "--font-sticker-mitr", weights: [600, 700] },
  itim: { key: "itim", name: "Itim", cssVariable: "--font-sticker-itim", weights: [400] },
  sriracha: { key: "sriracha", name: "Sriracha", cssVariable: "--font-sticker-sriracha", weights: [400] },
  "chakra-petch": { key: "chakra-petch", name: "Chakra Petch", cssVariable: "--font-sticker-chakra-petch", weights: [400, 600] },
  pattaya: { key: "pattaya", name: "Pattaya", cssVariable: "--font-sticker-pattaya", weights: [400] },
}

export const stickerFontFallbackOrder: readonly StickerFontKey[] = [
  "kodchasan",
  "mali",
  "mitr",
  "itim",
]

export const stickerSystemFontFallback = '"Noto Sans Thai", sans-serif'

export function getStickerFont(fontKey: StickerFontKey) {
  return stickerFonts[fontKey]
}

export function getStickerFontStackKeys(fontKey: StickerFontKey) {
  return [fontKey, ...stickerFontFallbackOrder.filter((key) => key !== fontKey)]
}

export function getStickerFontCssFamily(fontKey: StickerFontKey) {
  const variables = getStickerFontStackKeys(fontKey).map(
    (key) => `var(${stickerFonts[key].cssVariable})`,
  )
  return [...variables, stickerSystemFontFallback].join(", ")
}
