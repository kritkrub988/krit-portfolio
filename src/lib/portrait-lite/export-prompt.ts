import { getPortraitSelectionDetails } from "./generate-portrait-prompt.ts"
import type { PortraitSelection } from "../../types/portrait-lite.ts"

function pad(value: number) {
  return value.toString().padStart(2, "0")
}

export function createPortraitExportFilename(selection: PortraitSelection, now = new Date()) {
  const details = getPortraitSelectionDetails(selection)
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  return `AI_PORTRAIT_${details.model.name}_${details.ratio.prompt.replace(":", "x")}_${timestamp}.txt`
}

export function createPortraitExportText(selection: PortraitSelection, prompt: string) {
  const details = getPortraitSelectionDetails(selection)
  return `AI Portrait Prompt — Lite

Model: ${details.model.name}
Outfit: ${details.outfit.label}
Location: ${details.location.label}
Mood: ${details.mood.label}
Ratio: ${details.ratio.prompt}
Images: ${details.imageCount.value}
Camera: ${details.camera.label}
Film Filter: ${details.film.label}

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
