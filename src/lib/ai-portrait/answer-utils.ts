import type { PortraitProject, ProjectAnswer, WorkflowStep } from "../../types/ai-portrait.ts"
import { workflowSteps } from "../../data/ai-portrait/workflow.ts"

export const approvalStepIds = new Set([
  "step-2-2", "step-6-2", "step-7-1", "step-7-4", "step-8-3",
  "step-9-1", "step-9-2", "step-10-1", "step-10-2", "step-10-3",
])

export function effectiveOptionIds(answer?: ProjectAnswer): string[] {
  if (!answer) return []
  if (answer.selectionMode === "auto") return answer.resolvedOptionIds ?? answer.optionIds ?? []
  return answer.selectedOptionIds ?? answer.optionIds ?? []
}

export function normalizeProjectAnswer(
  stepId: string,
  answer: Partial<ProjectAnswer> | undefined,
  timestamp = new Date().toISOString(),
): ProjectAnswer {
  const legacy = answer?.optionIds ?? []
  const inferredMode = answer?.selectionMode ?? (legacy.length > 0 ? "manual" : "auto")
  const selected = answer?.selectedOptionIds ?? (inferredMode === "auto" ? [] : legacy)
  const resolved = answer?.resolvedOptionIds ?? legacy
  return {
    stepId,
    selectionMode: inferredMode,
    selectedOptionIds: [...selected],
    resolvedOptionIds: [...resolved],
    customValue: answer?.customValue,
    autoReason: answer?.autoReason,
    autoConfidence: answer?.autoConfidence,
    imageRatio: answer?.imageRatio ? {
      ...answer.imageRatio,
      secondary: [...new Set(answer.imageRatio.secondary ?? [])],
      shotOverrides: answer.imageRatio.shotOverrides ? { ...answer.imageRatio.shotOverrides } : undefined,
    } : undefined,
    updatedAt: answer?.updatedAt ?? timestamp,
  }
}

export function normalizePortraitProject(project: PortraitProject): PortraitProject {
  const normalizedAnswers = Object.fromEntries(
    Object.entries(project.answers ?? {}).map(([stepId, answer]) => [
      stepId,
      normalizeProjectAnswer(stepId, answer, project.updatedAt),
    ]),
  )
  for (const step of workflowSteps) {
    normalizedAnswers[step.id] ??= createInitialAnswer(step, project.updatedAt)
  }
  return {
    ...project,
    answers: normalizedAnswers,
  }
}

export function createInitialAnswer(step: WorkflowStep, timestamp: string): ProjectAnswer {
  return {
    stepId: step.id,
    selectionMode: approvalStepIds.has(step.id) ? "manual" : "auto",
    selectedOptionIds: [],
    resolvedOptionIds: [],
    updatedAt: timestamp,
  }
}
