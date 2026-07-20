import type { PortraitProject } from "../../types/ai-portrait.ts"
import { answerValue } from "./brief-builder.ts"

export type ShotDefinition = { id: string; label: string }

const editorialEightShots = [
  "Hero Full-body", "Three-quarter", "Medium", "Beauty Close-up", "Profile", "Movement", "Wardrobe Detail", "Negative-space Cover",
]

const portraitFiveShots = ["Hero", "Medium", "Close-up", "Profile", "Detail"]

const campaignTwelveShots = [
  "Campaign Hero", "Vertical Hero", "Horizontal Hero", "Full-body", "Three-quarter", "Medium", "Beauty Close-up", "Profile", "Movement", "Product or Wardrobe Detail", "Horizontal Copy-space", "Vertical Copy-space",
]

function numberedShots(labels: string[]): ShotDefinition[] {
  return labels.map((label, index) => ({ id: `S${(index + 1).toString().padStart(2, "0")}`, label }))
}

export function resolveShotDefinitions(project: PortraitProject): ShotDefinition[] {
  const coverage = answerValue(project, "step-8-1")
  const custom = project.answers["step-8-1"]?.customValue?.trim()
  if (coverage.includes("Editorial 8-shot")) return numberedShots(editorialEightShots)
  if (coverage.includes("Campaign 12-shot")) return numberedShots(campaignTwelveShots)
  if (coverage.includes("Portrait 5-shot")) return numberedShots(portraitFiveShots)
  return custom
    ? numberedShots(custom.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))
    : []
}
