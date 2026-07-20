import { createPortraitId } from "../../lib/ai-portrait/ids.ts"
import type { BuiltPrompt, PortraitProject, PromptVersion } from "../../types/ai-portrait.ts"

export function createPromptVersion(
  project: PortraitProject,
  builtPrompt: BuiltPrompt,
  versionNumber: number,
): PromptVersion {
  return {
    id: createPortraitId("prompt_version"),
    projectId: project.id,
    versionNumber,
    promptText: builtPrompt.fullPrompt,
    briefText: builtPrompt.brief,
    snapshot: {
      name: project.name,
      status: project.status,
      currentStepId: project.currentStepId,
      answers: structuredClone(project.answers),
      selectedModelId: project.selectedModelId,
      selectedRecipeId: project.selectedRecipeId,
      briefApprovedAt: project.briefApprovedAt,
    },
    createdAt: new Date().toISOString(),
  }
}

export function nextPromptVersionNumber(versions: PromptVersion[]): number {
  return Math.max(0, ...versions.map((version) => version.versionNumber)) + 1
}
