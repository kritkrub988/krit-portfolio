"use client"

import { stickerExportConfig } from "@/config/sticker-export"
import { calculateGridCropRects } from "@/lib/line-sticker/crop-sticker-grid"
import {
  colorDistance,
  removeSolidBackgroundPixels,
  sampleCornerColor,
} from "@/lib/line-sticker/remove-solid-background"
import type {
  BackgroundRemovalSettings,
  BrowserImageAsset,
  CropSettings,
  SourceGridImage,
} from "@/types/line-sticker"

function uniqueId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`
}

export function revokeImageAsset(asset: BrowserImageAsset | SourceGridImage | null) {
  if (asset?.url) URL.revokeObjectURL(asset.url)
}

export function revokeImageAssets(assets: Array<BrowserImageAsset | null>) {
  assets.forEach((asset) => revokeImageAsset(asset))
}

export async function canvasToPngBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error("Browser could not create a PNG file"))
    }, "image/png")
  })
}

export function validateSourceImageFile(file: File) {
  if (!stickerExportConfig.supportedMimeTypes.includes(
    file.type as (typeof stickerExportConfig.supportedMimeTypes)[number],
  )) {
    throw new Error("รองรับเฉพาะไฟล์ PNG, JPG, JPEG และ WebP เท่านั้น")
  }
  if (file.size > stickerExportConfig.maxSourceFileBytes) {
    throw new Error("ไฟล์มีขนาดใหญ่เกิน 20 MB กรุณาเลือกไฟล์ที่เล็กลง")
  }
  if (file.size === 0) throw new Error("ไฟล์ภาพไม่มีข้อมูล")
}

export async function createSourceGridImage(file: File): Promise<SourceGridImage> {
  validateSourceImageFile(file)
  const bitmap = await createImageBitmap(file)
  const asset: SourceGridImage = {
    id: uniqueId("source-grid"),
    filename: file.name,
    blob: file,
    url: URL.createObjectURL(file),
    width: bitmap.width,
    height: bitmap.height,
    fileType: file.type,
    fileSize: file.size,
  }
  bitmap.close()
  return asset
}

export async function cropGridImage(
  source: SourceGridImage,
  settings: CropSettings,
): Promise<BrowserImageAsset[]> {
  const bitmap = await createImageBitmap(source.blob)
  const rects = calculateGridCropRects(bitmap.width, bitmap.height, settings)
  const assets: BrowserImageAsset[] = []

  try {
    for (const rect of rects) {
      const canvas = document.createElement("canvas")
      canvas.width = rect.width
      canvas.height = rect.height
      const context = canvas.getContext("2d", { alpha: true })
      if (!context) throw new Error("Canvas is not available in this browser")
      context.drawImage(
        bitmap,
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        0,
        0,
        rect.width,
        rect.height,
      )
      const blob = await canvasToPngBlob(canvas)
      assets.push({
        id: `sticker-${String(rect.index).padStart(2, "0")}`,
        filename: rect.filename,
        blob,
        url: URL.createObjectURL(blob),
        width: rect.width,
        height: rect.height,
      })
      if (rect.index % 4 === 0) await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    }
  } catch (error) {
    revokeImageAssets(assets)
    throw error
  } finally {
    bitmap.close()
  }

  return assets
}

export async function getBlobImageData(blob: Blob) {
  const bitmap = await createImageBitmap(blob)
  const canvas = document.createElement("canvas")
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const context = canvas.getContext("2d", { willReadFrequently: true })
  if (!context) {
    bitmap.close()
    throw new Error("Canvas is not available in this browser")
  }
  context.drawImage(bitmap, 0, 0)
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  bitmap.close()
  return imageData
}

export async function removeBackgroundFromBlob(
  blob: Blob,
  settings: BackgroundRemovalSettings,
) {
  const imageData = await getBlobImageData(blob)
  const output = removeSolidBackgroundPixels(
    imageData.data,
    imageData.width,
    imageData.height,
    settings,
  )
  const canvas = document.createElement("canvas")
  canvas.width = imageData.width
  canvas.height = imageData.height
  const context = canvas.getContext("2d", { alpha: true })
  if (!context) throw new Error("Canvas is not available in this browser")
  context.putImageData(new ImageData(output, imageData.width, imageData.height), 0, 0)
  return canvasToPngBlob(canvas)
}

export async function createTransparentAsset(
  source: BrowserImageAsset,
  settings: BackgroundRemovalSettings,
) {
  const blob = await removeBackgroundFromBlob(source.blob, settings)
  return {
    ...source,
    blob,
    url: URL.createObjectURL(blob),
  }
}

export async function getAutomaticBackgroundColor(blob: Blob) {
  const imageData = await getBlobImageData(blob)
  return sampleCornerColor(imageData.data, imageData.width, imageData.height)
}

export async function blobHasTransparentPixel(blob: Blob) {
  const imageData = await getBlobImageData(blob)
  for (let index = 3; index < imageData.data.length; index += 4) {
    if (imageData.data[index] < 255) return true
  }
  return false
}

function longestUniformRunNear(
  scores: number[],
  target: number,
  radius: number,
  threshold: number,
) {
  const start = Math.max(0, Math.floor(target - radius))
  const end = Math.min(scores.length - 1, Math.ceil(target + radius))
  let bestStart = -1
  let bestLength = 0
  let runStart = -1
  for (let index = start; index <= end + 1; index += 1) {
    const uniform = index <= end && scores[index] >= threshold
    if (uniform && runStart < 0) runStart = index
    if (!uniform && runStart >= 0) {
      const length = index - runStart
      if (length > bestLength) {
        bestStart = runStart
        bestLength = length
      }
      runStart = -1
    }
  }
  return bestStart >= 0 ? { start: bestStart, length: bestLength } : null
}

export async function suggestCropSettings(source: SourceGridImage): Promise<CropSettings> {
  const bitmap = await createImageBitmap(source.blob)
  const maxAnalysisSize = 900
  const scale = Math.min(1, maxAnalysisSize / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(4, Math.round(bitmap.width * scale))
  const height = Math.max(4, Math.round(bitmap.height * scale))
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d", { willReadFrequently: true })
  if (!context) {
    bitmap.close()
    throw new Error("Canvas is not available in this browser")
  }
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  const pixels = context.getImageData(0, 0, width, height).data
  const background = sampleCornerColor(pixels, width, height)
  const xScores = Array.from({ length: width }, (_, x) => {
    let matches = 0
    for (let y = 0; y < height; y += 2) {
      const offset = (y * width + x) * 4
      if (colorDistance({ r: pixels[offset], g: pixels[offset + 1], b: pixels[offset + 2] }, background) < 30) matches += 1
    }
    return matches / Math.ceil(height / 2)
  })
  const yScores = Array.from({ length: height }, (_, y) => {
    let matches = 0
    for (let x = 0; x < width; x += 2) {
      const offset = (y * width + x) * 4
      if (colorDistance({ r: pixels[offset], g: pixels[offset + 1], b: pixels[offset + 2] }, background) < 30) matches += 1
    }
    return matches / Math.ceil(width / 2)
  })

  function edgeMargin(scores: number[], reverse = false) {
    let count = 0
    for (let offset = 0; offset < scores.length * 0.18; offset += 1) {
      const index = reverse ? scores.length - 1 - offset : offset
      if (scores[index] < 0.985) break
      count += 1
    }
    return count
  }
  function medianGap(scores: number[]) {
    const runs = [1, 2, 3]
      .map((part) => longestUniformRunNear(scores, (scores.length * part) / 4, scores.length * 0.055, 0.985))
      .filter((run): run is { start: number; length: number } => Boolean(run))
      .map((run) => run.length)
      .sort((a, b) => a - b)
    return runs.length ? runs[Math.floor(runs.length / 2)] : 0
  }
  const inverseScale = 1 / scale
  return {
    marginLeft: Math.round(edgeMargin(xScores) * inverseScale),
    marginRight: Math.round(edgeMargin(xScores, true) * inverseScale),
    marginTop: Math.round(edgeMargin(yScores) * inverseScale),
    marginBottom: Math.round(edgeMargin(yScores, true) * inverseScale),
    gapX: Math.round(medianGap(xScores) * inverseScale),
    gapY: Math.round(medianGap(yScores) * inverseScale),
  }
}
