"use client"

import { stickerExportConfig } from "@/config/sticker-export"
import { getStickerTextStyle } from "@/data/line-sticker/text-styles"
import { canvasToPngBlob } from "@/lib/line-sticker/image-browser-utils"
import { waitForStickerFont } from "@/lib/line-sticker/sticker-fonts-browser"
import {
  assessTextBounds,
  calculateContainPlacement,
  calculateRotatedTextBounds,
  splitThaiGraphemes,
} from "@/lib/line-sticker/text-layout"
import type { StickerTextSettings, TextBounds } from "@/types/line-sticker"

function configureTextContext(
  context: CanvasRenderingContext2D,
  settings: StickerTextSettings,
  fontFamily: string,
) {
  const style = getStickerTextStyle(settings.styleId)
  const effectScale = settings.fontSize / 46
  context.font = `${style.fontWeight} ${settings.fontSize}px ${fontFamily}`
  context.textAlign = "left"
  context.textBaseline = "middle"
  context.lineJoin = "round"
  context.lineCap = "round"
  context.lineWidth = settings.strokeWidth
  context.strokeStyle = settings.strokeColor
  context.fillStyle = settings.fillColor
  context.shadowColor = settings.shadowEnabled ? settings.shadowColor : "transparent"
  context.shadowBlur = settings.shadowEnabled ? style.shadowBlur * effectScale : 0
  context.shadowOffsetX = settings.shadowEnabled ? style.shadowOffsetX * effectScale : 0
  context.shadowOffsetY = settings.shadowEnabled ? style.shadowOffsetY * effectScale : 0
  return style
}

function measureSpacedText(
  context: CanvasRenderingContext2D,
  text: string,
  letterSpacing: number,
) {
  const graphemes = splitThaiGraphemes(text)
  const widths = graphemes.map((grapheme) => context.measureText(grapheme).width)
  const width = widths.reduce((sum, value) => sum + value, 0) + Math.max(0, graphemes.length - 1) * letterSpacing
  const sampleMetrics = context.measureText(text || "ก")
  const fallbackHeight = Number.parseFloat(context.font) * 1.35
  const ascent = sampleMetrics.actualBoundingBoxAscent || fallbackHeight * 0.75
  const descent = sampleMetrics.actualBoundingBoxDescent || fallbackHeight * 0.25
  return { graphemes, widths, width, height: ascent + descent, ascent, descent }
}

function drawSpacedText(
  context: CanvasRenderingContext2D,
  settings: StickerTextSettings,
  fontFamily: string,
) {
  const style = configureTextContext(context, settings, fontFamily)
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
  const style = getStickerTextStyle(settings.styleId)
  const resolvedFont = await waitForStickerFont(
    style.fontKey,
    style.fontWeight,
    settings.message,
  )
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
  configureTextContext(context, settings, resolvedFont.fontFamily)
  const measured = measureSpacedText(context, settings.message, settings.letterSpacing)
  const centerX = settings.x * width
  const centerY = settings.y * height
  const effectScale = settings.fontSize / 46
  const shadowExtent = settings.shadowEnabled
    ? (style.shadowBlur + Math.max(Math.abs(style.shadowOffsetX), Math.abs(style.shadowOffsetY))) * effectScale
    : 0
  const paddedWidth = measured.width + (settings.strokeWidth + shadowExtent) * 2
  const paddedHeight = measured.height + (settings.strokeWidth + shadowExtent) * 2
  const bounds = calculateRotatedTextBounds(
    centerX,
    centerY,
    paddedWidth,
    paddedHeight,
    settings.rotation,
  )
  context.translate(centerX, centerY)
  context.rotate((settings.rotation * Math.PI) / 180)
  if (settings.message.trim()) drawSpacedText(context, settings, resolvedFont.fontFamily)
  context.restore()

  const status = assessTextBounds(bounds, width, height, stickerExportConfig.safeMargin)
  if (options.showSafeArea) drawEditorOverlays(context, bounds, status.overflow, status.nearEdge)
  return { bounds, ...status }
}

export async function drawTextStylePreview(
  canvas: HTMLCanvasElement,
  styleId: string,
  message: string,
  cssWidth: number,
  cssHeight: number,
) {
  const style = getStickerTextStyle(styleId)
  const resolvedFont = await waitForStickerFont(style.fontKey, style.fontWeight, message)
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.max(1, Math.round(cssWidth * pixelRatio))
  canvas.height = Math.max(1, Math.round(cssHeight * pixelRatio))
  canvas.style.width = `${cssWidth}px`
  canvas.style.height = `${cssHeight}px`
  const context = canvas.getContext("2d", { alpha: true })
  if (!context) throw new Error("Canvas is not available in this browser")
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  context.clearRect(0, 0, cssWidth, cssHeight)

  const baseFontSize = 40
  const createSettings = (fontSize: number): StickerTextSettings => ({
    message,
    styleId,
    fillColor: style.fill,
    strokeColor: style.stroke,
    strokeWidth: style.strokeWidth * (fontSize / 46),
    fontSize,
    letterSpacing: style.letterSpacing * (fontSize / 46),
    shadowEnabled: style.shadowBlur > 0 || style.shadowOffsetX !== 0 || style.shadowOffsetY !== 0,
    shadowColor: style.shadowColor,
    x: 0.5,
    y: 0.5,
    rotation: style.rotation,
  })

  let previewSettings = createSettings(baseFontSize)
  configureTextContext(context, previewSettings, resolvedFont.fontFamily)
  let measured = measureSpacedText(context, message, previewSettings.letterSpacing)
  const effectSize = previewSettings.strokeWidth * 2 +
    (style.shadowBlur + Math.abs(style.shadowOffsetX) + Math.abs(style.shadowOffsetY)) * (baseFontSize / 46)
  const fitScale = Math.min(
    1,
    (cssWidth - 16) / Math.max(1, measured.width + effectSize),
    (cssHeight - 10) / Math.max(1, measured.height + effectSize),
  )
  if (fitScale < 1) {
    previewSettings = createSettings(Math.max(25, baseFontSize * fitScale))
    configureTextContext(context, previewSettings, resolvedFont.fontFamily)
    measured = measureSpacedText(context, message, previewSettings.letterSpacing)
  }

  context.save()
  context.translate(cssWidth / 2, cssHeight / 2)
  context.rotate((previewSettings.rotation * Math.PI) / 180)
  drawSpacedText(context, previewSettings, resolvedFont.fontFamily)
  context.restore()
  return { measured, ...resolvedFont }
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
