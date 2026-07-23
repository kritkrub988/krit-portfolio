import type { TextBounds } from "../../types/line-sticker.ts"

export function splitThaiGraphemes(text: string) {
  if (typeof Intl.Segmenter === "function") {
    return [...new Intl.Segmenter("th", { granularity: "grapheme" }).segment(text)].map((part) => part.segment)
  }
  return Array.from(text)
}

export function countTextGraphemes(text: string) {
  return splitThaiGraphemes(text).length
}

export function estimateTextWidth(text: string, fontSize: number, letterSpacing: number) {
  const count = countTextGraphemes(text)
  return count * fontSize * 0.62 + Math.max(0, count - 1) * letterSpacing
}

export function calculateContainPlacement(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
) {
  if ([sourceWidth, sourceHeight, targetWidth, targetHeight].some((value) => value <= 0)) {
    throw new Error("Image dimensions must be positive")
  }
  const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight)
  const width = sourceWidth * scale
  const height = sourceHeight * scale
  return {
    x: (targetWidth - width) / 2,
    y: (targetHeight - height) / 2,
    width,
    height,
    scale,
  }
}

export function calculateRotatedTextBounds(
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  rotationDegrees: number,
): TextBounds {
  const radians = (rotationDegrees * Math.PI) / 180
  const rotatedWidth = Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians))
  const rotatedHeight = Math.abs(width * Math.sin(radians)) + Math.abs(height * Math.cos(radians))
  return {
    left: centerX - rotatedWidth / 2,
    top: centerY - rotatedHeight / 2,
    right: centerX + rotatedWidth / 2,
    bottom: centerY + rotatedHeight / 2,
    width: rotatedWidth,
    height: rotatedHeight,
  }
}

export function assessTextBounds(
  bounds: TextBounds,
  canvasWidth: number,
  canvasHeight: number,
  safeMargin: number,
) {
  const overflow =
    bounds.left < 0 || bounds.top < 0 || bounds.right > canvasWidth || bounds.bottom > canvasHeight
  const nearEdge =
    bounds.left < safeMargin ||
    bounds.top < safeMargin ||
    bounds.right > canvasWidth - safeMargin ||
    bounds.bottom > canvasHeight - safeMargin
  return { overflow, nearEdge }
}
