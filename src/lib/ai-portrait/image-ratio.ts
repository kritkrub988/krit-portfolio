import {
  defaultImageRatioId,
  imageRatioOptionById,
  imageRatioOptions,
} from "../../data/ai-portrait/image-ratios.ts"
import type {
  ImageRatioExport,
  ImageRatioPresetId,
  ImageRatioSelection,
  PortraitProject,
  ProjectAnswer,
  SelectionMode,
} from "../../types/ai-portrait.ts"
import { effectiveOptionIds } from "./answer-utils.ts"
import { slugifyFilenamePart } from "./ids.ts"

export const IMAGE_RATIO_STEP_ID = "step-8-ratio"
export const CUSTOM_RATIO_OPTION_ID = `${IMAGE_RATIO_STEP_ID}:h`
export const MULTI_RATIO_OPTION_ID = `${IMAGE_RATIO_STEP_ID}:i`

const presetCodes: Record<ImageRatioPresetId, string> = {
  "9:16": "a",
  "16:9": "b",
  "4:5": "c",
  "5:4": "d",
  "2:3": "e",
  "3:2": "f",
  "1:1": "g",
}

export const imageRatioOptionIdByPreset = new Map<ImageRatioPresetId, string>(
  Object.entries(presetCodes).map(([ratio, code]) => [ratio as ImageRatioPresetId, `${IMAGE_RATIO_STEP_ID}:${code}`]),
)

const imageRatioPresetByOptionId = new Map(
  [...imageRatioOptionIdByPreset].map(([ratio, optionId]) => [optionId, ratio]),
)

function greatestCommonDivisor(a: number, b: number): number {
  let left = Math.abs(a)
  let right = Math.abs(b)
  while (right !== 0) [left, right] = [right, left % right]
  return left || 1
}

export function simplifyRatio(width: number, height: number): { width: number; height: number; value: string } {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new Error("Ratio width and height must be positive integers")
  }
  const divisor = greatestCommonDivisor(width, height)
  const simplifiedWidth = width / divisor
  const simplifiedHeight = height / divisor
  return { width: simplifiedWidth, height: simplifiedHeight, value: `${simplifiedWidth}:${simplifiedHeight}` }
}

export function orientationFromDimensions(width: number, height: number): "portrait" | "landscape" | "square" | "custom" {
  if (width === height) return "square"
  if (width < height) return "portrait"
  if (width > height) return "landscape"
  return "custom"
}

export function ratioDimensions(value: string): { width: number; height: number } | null {
  const match = /^(\d+):(\d+)$/.exec(value)
  if (!match) return null
  const width = Number(match[1])
  const height = Number(match[2])
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) return null
  return { width, height }
}

export function presetForOptionId(optionId?: string): ImageRatioPresetId | undefined {
  return optionId ? imageRatioPresetByOptionId.get(optionId) : undefined
}

export function presetSuggestion(width: number, height: number): ImageRatioPresetId | undefined {
  try {
    const value = simplifyRatio(width, height).value
    return imageRatioOptionById.has(value as ImageRatioPresetId) ? value as ImageRatioPresetId : undefined
  } catch {
    return undefined
  }
}

export function normalizeImageRatioSelection(selection?: ImageRatioSelection): ImageRatioSelection | undefined {
  if (!selection) return undefined
  const secondary = [...new Set(selection.secondary ?? [])]
  if (selection.customWidthRatio && selection.customHeightRatio) {
    try {
      const simplified = simplifyRatio(selection.customWidthRatio, selection.customHeightRatio)
      return { ...selection, primary: simplified.value, secondary }
    } catch {
      return { ...selection, secondary }
    }
  }
  return { ...selection, secondary }
}

export type ResolvedImageRatio = ImageRatioExport & {
  widthRatio: number
  heightRatio: number
  isMultiRatio: boolean
  needsDedicatedComposition: boolean
}

export function resolveImageRatio(project: Pick<PortraitProject, "answers" | "name">): ResolvedImageRatio {
  const answer = project.answers[IMAGE_RATIO_STEP_ID]
  const optionId = effectiveOptionIds(answer)[0]
  const presetFromAnswer = presetForOptionId(optionId)
  const isCustom = optionId === CUSTOM_RATIO_OPTION_ID || answer?.selectionMode === "custom"
  const isMultiRatio = optionId === MULTI_RATIO_OPTION_ID
  const selection = normalizeImageRatioSelection(answer?.imageRatio)

  let primary = presetFromAnswer ?? selection?.primary ?? defaultImageRatioId
  let widthRatio = imageRatioOptionById.get(primary as ImageRatioPresetId)?.widthRatio ?? 4
  let heightRatio = imageRatioOptionById.get(primary as ImageRatioPresetId)?.heightRatio ?? 5

  if (isCustom && selection?.customWidthRatio && selection.customHeightRatio) {
    try {
      const simplified = simplifyRatio(selection.customWidthRatio, selection.customHeightRatio)
      primary = simplified.value
      widthRatio = simplified.width
      heightRatio = simplified.height
    } catch {
      primary = defaultImageRatioId
      widthRatio = 4
      heightRatio = 5
    }
  }

  if (isMultiRatio) {
    const configuredPrimary = selection?.primary as ImageRatioPresetId | undefined
    primary = configuredPrimary && imageRatioOptionById.has(configuredPrimary) ? configuredPrimary : defaultImageRatioId
    widthRatio = imageRatioOptionById.get(primary as ImageRatioPresetId)?.widthRatio ?? 4
    heightRatio = imageRatioOptionById.get(primary as ImageRatioPresetId)?.heightRatio ?? 5
  }

  const preset = imageRatioOptionById.get(primary as ImageRatioPresetId)
  const orientation = preset?.orientation ?? orientationFromDimensions(widthRatio, heightRatio)
  const secondary = isMultiRatio
    ? [...new Set(selection?.secondary ?? [])].filter((ratio) => ratio !== primary)
    : []
  const orientations = new Set([orientation, ...secondary.map((ratio) => imageRatioOptionById.get(ratio)?.orientation).filter(Boolean)])
  const filenameToken = ratioFilenameToken(String(primary))
  const selectionMode: SelectionMode = answer?.selectionMode ?? "auto"

  return {
    selectionMode,
    primary: String(primary),
    secondary,
    orientation,
    pixelReference: preset?.pixelReference ?? `${widthRatio}x${heightRatio} ratio reference`,
    platformFit: preset?.recommendedPlatforms ?? ["Custom output"],
    compositionGuidance: preset?.compositionGuidance ?? [
      `${orientation} custom-ratio composition`,
      "protect face, hands, wardrobe and products from crop loss",
      "balance headroom, footroom and copy space for the requested output",
    ],
    safeZone: preset?.safeZone ?? "Keep critical face, hands, wardrobe and product details inside a protected central safe area",
    cropStrategy: preset?.cropStrategy ?? "Protect critical subject details before removing background area",
    copySpace: preset?.copySpace ?? "Reserve copy space only where it does not compromise the subject",
    shotOverrides: selection?.shotOverrides ?? {},
    filenameToken,
    shotFilenameTemplate: `${slugifyFilenamePart(project.name)}_MODEL_SHOT_${filenameToken}_V001.jpg`,
    widthRatio,
    heightRatio,
    isMultiRatio,
    needsDedicatedComposition: orientations.size > 1,
  }
}

export function validateImageRatioAnswer(answer?: ProjectAnswer): string[] {
  if (!answer) return ["กรุณาเลือกสัดส่วนภาพ"]
  const optionId = effectiveOptionIds(answer)[0]
  const errors: string[] = []

  if (optionId === CUSTOM_RATIO_OPTION_ID || answer.selectionMode === "custom") {
    const width = answer.imageRatio?.customWidthRatio ?? 0
    const height = answer.imageRatio?.customHeightRatio ?? 0
    if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
      errors.push("Width Ratio และ Height Ratio ต้องเป็นจำนวนเต็มบวกและห้ามเป็น 0")
    } else {
      const simplified = simplifyRatio(width, height)
      if (simplified.width > 100 || simplified.height > 100) {
        errors.push("Ratio หลังย่อส่วนต้องอยู่ในช่วง 1–100")
      }
    }
  }

  if (optionId === MULTI_RATIO_OPTION_ID) {
    const primary = answer.imageRatio?.primary
    const secondary = answer.imageRatio?.secondary ?? []
    if (!primary || !imageRatioOptionById.has(primary as ImageRatioPresetId)) errors.push("Multi-ratio ต้องมี Primary Ratio หนึ่งค่า")
    if (secondary.length === 0) errors.push("Multi-ratio ต้องมี Secondary Ratio อย่างน้อยหนึ่งค่า")
    if (secondary.includes(primary as ImageRatioPresetId)) errors.push("Primary Ratio ห้ามซ้ำกับ Secondary Ratio")
    if (new Set(secondary).size !== secondary.length) errors.push("Secondary Ratio ห้ามมีค่าซ้ำ")
  }

  return errors
}

export function ratioFilenameToken(ratio: string): string {
  return ratio.replace(/:/g, "x").replace(/[^0-9x]/gi, "") || "CUSTOM"
}

export function ratioOptionForPreset(ratio: ImageRatioPresetId) {
  return imageRatioOptions.find((option) => option.id === ratio)
}
