import { answerValue } from "../../lib/ai-portrait/brief-builder.ts"
import { deriveSelectedModelId } from "../../lib/ai-portrait/dependency-rules.ts"
import { requestToPromise, withStore } from "./indexed-db.ts"
import { PORTRAIT_STORES } from "./types.ts"
import type { CustomRecipe, PortraitProject } from "../../types/ai-portrait.ts"

function customRecipeId(projectId: string): string {
  return `CUSTOM_RECIPE_${projectId}`
}

export function customRecipeFromProject(project: PortraitProject): CustomRecipe {
  const timestamp = new Date().toISOString()
  const name = project.answers["step-3-1"]?.customValue?.trim() || "Custom Portrait Recipe"
  return {
    id: customRecipeId(project.id),
    projectId: project.id,
    name,
    recommendedModels: deriveSelectedModelId(project) ? [deriveSelectedModelId(project) as string] : [],
    goals: [answerValue(project, "step-0-1")],
    narrative: answerValue(project, "step-1-2"),
    location: answerValue(project, "step-4-1"),
    season: answerValue(project, "step-4-2"),
    time: answerValue(project, "step-4-3"),
    captureMedium: answerValue(project, "step-3-2"),
    camera: answerValue(project, "step-3-3"),
    lens: "Defined by the selected custom camera package",
    aperture: "Defined by the selected custom camera package",
    lightingPlan: answerValue(project, "step-6-1"),
    wardrobe: answerValue(project, "step-5-1"),
    hair: answerValue(project, "step-5-3"),
    makeup: answerValue(project, "step-5-4"),
    filmOrSimulation: answerValue(project, "step-7-2"),
    postGrade: answerValue(project, "step-7-3"),
    grain: "Defined by approved color parameters",
    halation: "Defined by approved color parameters",
    shotCoverage: [answerValue(project, "step-8-1")],
    negativeConstraints: ["Preserve model restrictions, natural realism, and series continuity"],
    qaFocus: ["Identity", "Camera and lighting consistency", "Color separation", "Shot continuity"],
    tags: [answerValue(project, "step-1-3")],
    createdAt: project.createdAt,
    updatedAt: timestamp,
  }
}

export async function saveCustomRecipeForProject(project: PortraitProject): Promise<CustomRecipe> {
  const recipe = customRecipeFromProject(project)
  await withStore(PORTRAIT_STORES.customRecipes, "readwrite", async (transaction) => {
    const store = transaction.objectStore(PORTRAIT_STORES.customRecipes)
    const existing = await requestToPromise(
      store.get(recipe.id) as IDBRequest<CustomRecipe | undefined>,
    )
    await requestToPromise(store.put({
      ...recipe,
      createdAt: existing?.createdAt ?? recipe.createdAt,
    } satisfies CustomRecipe))
  })
  return recipe
}

export async function listCustomRecipes(): Promise<CustomRecipe[]> {
  return withStore(PORTRAIT_STORES.customRecipes, "readonly", async (transaction) => {
    const recipes = await requestToPromise(
      transaction.objectStore(PORTRAIT_STORES.customRecipes).getAll() as IDBRequest<CustomRecipe[]>,
    )
    return recipes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  })
}

