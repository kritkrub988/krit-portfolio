import type { PromptBlockKey } from "../../types/ai-portrait.ts"

export const promptBlockOrder: PromptBlockKey[] = [
  "projectSetup",
  "creativeDirection",
  "modelIdentity",
  "lookRecipe",
  "environment",
  "styling",
  "cameraPackage",
  "lightingDesign",
  "colorPipeline",
  "shotPlanning",
  "continuity",
  "negativeConstraints",
  "outputRequirements",
  "productionQa",
]

export const promptBlockTitles: Record<PromptBlockKey, string> = {
  projectSetup: "Project Objective",
  creativeDirection: "Creative Direction",
  modelIdentity: "Model Identity Lock",
  lookRecipe: "Look Recipe",
  environment: "Environment",
  styling: "Wardrobe, Hair and Makeup",
  cameraPackage: "Camera and Lens",
  lightingDesign: "Lighting Plan",
  colorPipeline: "Film / Simulation / Post Grade",
  shotPlanning: "Shot List",
  continuity: "Series Continuity",
  negativeConstraints: "Negative Constraints",
  outputRequirements: "Output Ratio and Deliverables",
  productionQa: "Professional QA Requirements",
}

export const finalPromptTitle = "# PROFESSIONAL AI PORTRAIT PRODUCTION PROMPT"
