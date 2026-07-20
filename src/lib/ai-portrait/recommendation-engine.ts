import { lookRecipes } from "../../data/ai-portrait/recipes.ts"
import { workflowStepById } from "../../data/ai-portrait/workflow.ts"
import { deriveSelectedModelId, isRecipeCompatibleWithModel } from "./dependency-rules.ts"
import type { LookRecipe, PortraitProject, WorkflowOption } from "../../types/ai-portrait.ts"

export type RecipeRecommendation = {
  recipe: LookRecipe
  score: number
  reason: string
}

function selectedValue(project: PortraitProject, stepId: string): string | undefined {
  const answer = project.answers[stepId]
  const optionId = answer?.optionIds[0]
  const option = workflowStepById.get(stepId)?.options?.find((item) => item.id === optionId)
  return answer?.customValue?.trim() || option?.promptValue
}

export function recommendRecipes(
  project: PortraitProject,
  limit = 2,
): RecipeRecommendation[] {
  const modelId = deriveSelectedModelId(project)
  const goal = selectedValue(project, "step-0-1")
  const bigIdea = selectedValue(project, "step-1-1")
  const narrative = selectedValue(project, "step-1-2")
  const visualLanguage = selectedValue(project, "step-1-3")

  return lookRecipes
    .filter((recipe) => !modelId || isRecipeCompatibleWithModel(recipe.id, modelId))
    .map((recipe) => {
      let score = 0
      const reasons: string[] = []

      if (modelId && recipe.recommendedModels.includes(modelId)) {
        score += 4
        reasons.push("ตรงกับ Model Bible")
      }
      if (goal && recipe.goals.includes(goal)) {
        score += 4
        reasons.push(`เหมาะกับ ${goal}`)
      }
      if (visualLanguage && recipe.tags.includes(visualLanguage)) {
        score += 3
        reasons.push(`รองรับ ${visualLanguage}`)
      }
      if (bigIdea && recipe.tags.includes(bigIdea)) {
        score += 2
        reasons.push(`สอดคล้องกับ ${bigIdea}`)
      }
      if (narrative && recipe.narrative.toLowerCase().includes(narrative.toLowerCase())) {
        score += 1
        reasons.push("เข้ากับ Narrative")
      }

      return {
        recipe,
        score,
        reason: reasons.slice(0, 2).join(" · ") || "ใช้เป็นทางเลือกเพิ่มเติมได้",
      }
    })
    .sort((a, b) => b.score - a.score || a.recipe.id.localeCompare(b.recipe.id))
    .slice(0, Math.min(2, Math.max(0, limit)))
}

export function recommendedOptionIds(
  project: PortraitProject,
  stepId: string,
): Map<string, string> {
  const recommendations = new Map<string, string>()
  if (stepId !== "step-3-1") return recommendations

  const step = workflowStepById.get(stepId)
  for (const recommendation of recommendRecipes(project)) {
    const option = step?.options?.find(
      (item: WorkflowOption) => item.metadata?.recipeId === recommendation.recipe.id,
    )
    if (option) recommendations.set(option.id, recommendation.reason)
  }
  return recommendations
}
