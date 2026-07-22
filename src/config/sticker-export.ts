export const stickerExportConfig = {
  stickerCanvasWidth: 370,
  stickerCanvasHeight: 320,
  mainCanvasWidth: 240,
  mainCanvasHeight: 240,
  tabCanvasWidth: 96,
  tabCanvasHeight: 74,
  safeMargin: 18,
  filenamePattern: "{index}.png",
  maxSourceFileBytes: 20 * 1024 * 1024,
  supportedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
  stickerZipFilename: "line-stickers-16.zip",
  completeZipFilename: "line-stickers-complete.zip",
} as const

export function formatStickerFilename(index: number) {
  if (!Number.isInteger(index) || index < 1 || index > 16) {
    throw new Error(`Sticker index must be between 1 and 16; received ${index}`)
  }
  return stickerExportConfig.filenamePattern.replace("{index}", String(index).padStart(2, "0"))
}

export function createCompleteStickerFilenames() {
  return [
    ...Array.from({ length: 16 }, (_, index) => formatStickerFilename(index + 1)),
    "main.png",
    "tab.png",
  ]
}
