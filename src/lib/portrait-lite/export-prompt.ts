import { getPortraitSelectionDetails } from "./generate-portrait-prompt.ts"
import type { PortraitSelection } from "../../types/portrait-lite.ts"

function pad(value: number) {
  return value.toString().padStart(2, "0")
}

const formatFilenameTokens: Record<string, string> = {
  headshot: "HEADSHOT",
  "half-body": "HALF_BODY",
  "three-quarter": "3_QUARTER",
  "full-body": "FULL_BODY",
}

function filenameToken(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase()
}

export function createPortraitExportFilename(selection: PortraitSelection, now = new Date()) {
  const details = getPortraitSelectionDetails(selection)
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  const formatToken = formatFilenameTokens[details.format.id] ?? filenameToken(details.format.id)
  const locationToken = filenameToken(details.location.id)
  return `AI_TRAVEL_PORTRAIT_${formatToken}_${locationToken}_${timestamp}.txt`
}

export function createPortraitExportText(selection: PortraitSelection, prompt: string) {
  const details = getPortraitSelectionDetails(selection)
  return `AI Portrait Prompt — เที่ยวทิพย์

Portrait Format: ${details.format.label}
Outfit: ${details.outfit.label}
Location: ${details.location.label}
Mood: ${details.mood.label}
Ratio: ${details.ratio.prompt}
Images: ${details.imageCount.value}
Camera: ${details.camera.label}
Film Filter: ${details.film.label}

วิธีใช้:
แนบรูปใบหน้าของคุณพร้อม Prompt ด้านล่างในระบบสร้างภาพ

PROMPT
----------------------------------------

${prompt}`
}

export function downloadPortraitPrompt(selection: PortraitSelection, prompt: string) {
  const blob = new Blob([createPortraitExportText(selection, prompt)], {
    type: "text/plain;charset=utf-8",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = createPortraitExportFilename(selection)
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
