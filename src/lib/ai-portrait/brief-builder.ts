import { workflowStepById } from "../../data/ai-portrait/workflow.ts"
import type { PortraitProject } from "../../types/ai-portrait.ts"
import { effectiveOptionIds } from "./answer-utils.ts"
import { resolveImageRatio } from "./image-ratio.ts"

export type ResolvedAnswer = {
  stepId: string
  label: string
  value: string
}

export function resolveAnswer(
  project: PortraitProject,
  stepId: string,
): ResolvedAnswer | null {
  const step = workflowStepById.get(stepId)
  const answer = project.answers[stepId]
  if (!step || !answer) return null

  const values = effectiveOptionIds(answer)
    .map((optionId) => step.options?.find((option) => option.id === optionId)?.promptValue)
    .filter((value): value is string => Boolean(value))
  const customValue = answer.customValue?.trim()
  const merged = [...values, ...(customValue ? [customValue] : [])]

  if (merged.length === 0) return null
  return { stepId, label: step.title, value: merged.join(", ") }
}

export function answerValue(project: PortraitProject, stepId: string): string {
  return resolveAnswer(project, stepId)?.value ?? "ยังไม่ระบุ"
}

const briefFields: Array<[string, string]> = [
  ["Project Name", "project-name"],
  ["Goal", "step-0-1"],
  ["Audience", "step-0-2"],
  ["Platform", "step-0-3"],
  ["Deliverables", "step-0-4"],
  ["Big Idea", "step-1-1"],
  ["Narrative", "step-1-2"],
  ["Visual Language", "step-1-3"],
  ["Model", "step-2-1"],
  ["Identity Lock", "step-2-2"],
  ["Recipe", "step-3-1"],
  ["Capture Medium", "step-3-2"],
  ["Camera", "step-3-3"],
  ["Location", "step-4-1"],
  ["Season", "step-4-2"],
  ["Time", "step-4-3"],
  ["Weather", "step-4-4"],
  ["Wardrobe", "step-5-1"],
  ["Material and Silhouette", "step-5-2"],
  ["Hair", "step-5-3"],
  ["Makeup", "step-5-4"],
  ["Lighting", "step-6-1"],
  ["Lighting Approval", "step-6-2"],
  ["Color Layers", "step-7-1"],
  ["Film / Simulation", "step-7-2"],
  ["Post Grade", "step-7-3"],
  ["Color Approval", "step-7-4"],
  ["Image Ratio", "image-ratio"],
  ["Shot Coverage", "step-8-1"],
  ["Shot Cards", "step-8-2"],
  ["Continuity", "step-8-3"],
]

export function buildPortraitBrief(project: PortraitProject): string {
  const ratio = resolveImageRatio(project)
  const lines = briefFields.flatMap(([label, stepId]) => {
    if (stepId === "image-ratio") {
      return [
        `- **Primary Ratio:** ${ratio.primary}`,
        `- **Secondary Ratios:** ${ratio.secondary.join(", ") || "None"}`,
        `- **Orientation:** ${ratio.orientation}`,
        `- **Platform Fit:** ${ratio.platformFit.join(", ")}`,
        `- **Pixel Reference:** ${ratio.pixelReference}`,
        `- **Composition Guidance:** ${ratio.compositionGuidance.join("; ")}`,
        `- **Safe Zone:** ${ratio.safeZone}`,
        `- **Crop Strategy:** ${ratio.cropStrategy}`,
        `- **Copy Space:** ${ratio.copySpace}`,
      ]
    }
    const value = stepId === "project-name" ? project.name : answerValue(project, stepId)
    return [`- **${label}:** ${value}`]
  })

  return ["# FINAL PRODUCTION BRIEF", "", ...lines].join("\n")
}
