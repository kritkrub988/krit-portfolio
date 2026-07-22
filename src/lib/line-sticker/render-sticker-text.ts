"use client"

import { stickerExportConfig } from "@/config/sticker-export"
import { getStickerTextStyle } from "@/data/line-sticker/text-styles"
import { canvasToPngBlob } from "@/lib/line-sticker/image-browser-utils"
import {
  assessTextBounds,
  calculateContainPlacement,
  calculateRotatedTextBounds,
} from "@/lib/line-sticker/text-layout"
import type { StickerTextSettings, TextBounds } from "@/types/line-sticker"

function splitGraphemes(text: string) {
  if (typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter("th", { granularity: "grapheme" })
    return [...segmenter.segment(text)].map((part) => part.segment)
  }
  return Array.from(text)
}

function configureTextContext(
  context: CanvasRenderingContext2D,
  settings: StickerTextSettings,
) {
  const style = getStickerTextStyle(settings.styleId)
  context.font = `${style.fontWeight} ${settings.fontSize}px ${style.fontFamily}`
  context.textAlign = "left"
  context.textBaseline = "middle"
  context.lineJoin = "round"
  context.lineCap = "round"
  context.lineWidth = settings.strokeWidth
  context.strokeStyle = settings.strokeColor
  context.fillStyle = settings.fillColor
  context.shadowColor = settings.shadowEnabled ? settings.shadowColor : "transparent"
  context.shadowBlur = settings.shadowEnabled ? Math.max(3, settings.fontSize * 0.12) : 0
  context.shadowOffsetX = settings.shadowEnabled ? Math.max(2, settings.fontSize * 0.055) : 0
  context.shadowOffsetY = settings.shadowEnabled ? Math.max(2, settings.fontSize * 0.075) : 0
  return style
}

function measureSpacedText(
  context: CanvasRenderingContext2D,
  text: string,
  letterSpacing: number,
) {
  const graphemes = splitGraphemes(text)
  const widths = graphemes.map((grapheme) => context.measureText(grapheme).width)
  const width = widths.reduce((sum, value) => sum + value, 0) + Math.max(0, graphemes.length - 1) * letterSpacing
  const sampleMetrics = context.measureText(text || "ก")
  const height =
    (sampleMetrics.actualBoundingBoxAscent || 0) +
      (sampleMetrics.actualBoundingBoxDescent || 0) ||
    Number.parseFloat(context.font) * 1.2
  return { graphemes, widths, width, height }
}

function drawSpacedText(
  context: CanvasRenderingContext2D,
  settings: StickerTextSettings,
) {
  const style = configureTextContext(context, settings)
  const measured = measureSpacedText(context, settings.message, settings.letterSpacing)
  let cursor = -measured.width / 2
  if (style.gradient) {
    const gradient = context.createLinearGradient(-measured.width / 2, 0, measured.width / 2, 0)
    gradient.addColorStop(0, style.gradient[0])
    gradient.addColorStop(1, style.gradient[1])
    context.fillStyle = gradient
  }
  measured.graphemes.forEach((grapheme, index) => {
    if (settings.strokeWidth > 0) context.strokeText(grapheme, cursor, 0)
    context.fillText(grapheme, cursor, 0)
    cursor += measured.widths[index] + settings.letterSpacing
  })
  return measured
}

export async function drawStickerComposition(
  canvas: HTMLCanvasElement,
  imageBlob: Blob,
  settings: StickerTextSettings,
  options: { showSafeArea?: boolean } = {},
) {
  const width = stickerExportConfig.stickerCanvasWidth
  const height = stickerExportConfig.stickerCanvasHeight
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d", { alpha: true })
  if (!context) throw new Error("Canvas is not available in this browser")
  context.clearRect(0, 0, width, height)
  const bitmap = await createImageBitmap(imageBlob)
  const placement = calculateContainPlacement(bitmap.width, bitmap.height, width, height)
  context.drawImage(bitmap, placement.x, placement.y, placement.width, placement.height)
  bitmap.close()

  context.save()
  configureTextContext(context, settings)
  const measured = measureSpacedText(context, settings.message, settings.letterSpacing)
  const centerX = settings.x * width
  const centerY = settings.y * height
  const paddedWidth = measured.width + settings.strokeWidth * 2
  const paddedHeight = measured.height + settings.strokeWidth * 2
  const bounds = calculateRotatedTextBounds(
    centerX,
    centerY,
    paddedWidth,
    paddedHeight,
    settings.rotation,
  )
  context.translate(centerX, centerY)
  context.rotate((settings.rotation * Math.PI) / 180)
  if (settings.message.trim()) drawSpacedText(context, settings)
  context.restore()

  const status = assessTextBounds(bounds, width, height, stickerExportConfig.safeMargin)
  if (options.showSafeArea) drawEditorOverlays(context, bounds, status.overflow, status.nearEdge)
  return { bounds, ...status }
}

function drawEditorOverlays(
  context: CanvasRenderingContext2D,
  bounds: TextBounds,
  overflow: boolean,
  nearEdge: boolean,
) {
  const margin = stickerExportConfig.safeMargin
  context.save()
  context.setLineDash([7, 5])
  context.lineWidth = 1.5
  context.strokeStyle = "rgba(5,150,105,0.8)"
  context.strokeRect(
    margin,
    margin,
    stickerExportConfig.stickerCanvasWidth - margin * 2,
    stickerExportConfig.stickerCanvasHeight - margin * 2,
  )
  context.setLineDash([5, 4])
  context.strokeStyle = overflow
    ? "rgba(225,29,72,0.95)"
    : nearEdge
      ? "rgba(217,119,6,0.95)"
      : "rgba(37,99,235,0.85)"
  context.strokeRect(bounds.left, bounds.top, bounds.width, bounds.height)
  context.restore()
}

export async function renderStickerToPng(
  imageBlob: Blob,
  settings: StickerTextSettings,
) {
  const canvas = document.createElement("canvas")
  const validation = await drawStickerComposition(canvas, imageBlob, settings)
  return { blob: await canvasToPngBlob(canvas), validation }
}

export async function renderPngToSize(
  sourceBlob: Blob,
  width: number,
  height: number,
) {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d", { alpha: true })
  if (!context) throw new Error("Canvas is not available in this browser")
  context.clearRect(0, 0, width, height)
  const bitmap = await createImageBitmap(sourceBlob)
  const placement = calculateContainPlacement(bitmap.width, bitmap.height, width, height)
  context.drawImage(bitmap, placement.x, placement.y, placement.width, placement.height)
  bitmap.close()
  return canvasToPngBlob(canvas)
}
