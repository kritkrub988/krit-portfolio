import {
  finalPromptTitle,
  lookRecipeById,
  portraitModelById,
  portraitQaRules,
  promptBlockOrder,
  promptBlockTitles,
  workflowSteps,
} from "../../data/ai-portrait/index.ts"
import { answerValue, buildPortraitBrief, resolveAnswer } from "./brief-builder.ts"
import {
  deriveSelectedModelId,
  deriveSelectedRecipeId,
  findInvalidatedAnswerStepIds,
} from "./dependency-rules.ts"
import { validateStepAnswer } from "./validation.ts"
import { validateModelSafety } from "./safety-validation.ts"
import type {
  BuiltPrompt,
  LookRecipe,
  PortraitModel,
  PortraitProject,
  PromptBlock,
  PromptBlockKey,
  PromptWarning,
} from "../../types/ai-portrait.ts"

const editorialEightShots = [
  "S01 — Hero Full-body",
  "S02 — Three-quarter",
  "S03 — Medium",
  "S04 — Beauty Close-up",
  "S05 — Profile",
  "S06 — Movement",
  "S07 — Wardrobe Detail",
  "S08 — Negative-space Cover",
]

const portraitFiveShots = [
  "S01 — Hero",
  "S02 — Medium",
  "S03 — Close-up",
  "S04 — Profile",
  "S05 — Detail",
]

const campaignTwelveShots = [
  "S01 — Campaign Hero",
  "S02 — Vertical Hero",
  "S03 — Horizontal Hero",
  "S04 — Full-body",
  "S05 — Three-quarter",
  "S06 — Medium",
  "S07 — Beauty Close-up",
  "S08 — Profile",
  "S09 — Movement",
  "S10 — Product or Wardrobe Detail",
  "S11 — Horizontal Copy-space",
  "S12 — Vertical Copy-space",
]

function modelIdentityContent(model: PortraitModel | null, project: PortraitProject): string {
  if (!model) return "Model identity has not been selected."
  return [
    `MODEL_ID: ${model.id}`,
    `SELECTION_MODE: ${(project.answers["step-2-1"]?.selectionMode ?? "manual").toUpperCase()}`,
    `IDENTITY_VERSION: ${model.identityVersion}`,
    `AGE_LOCK: ${model.age}`,
    `BACKGROUND_LOCK: ${model.background}`,
    `NATIONALITY: ${model.nationality}`,
    `AGE_STATUS: ${model.ageStatus}`,
    `ROLE: ${model.role}`,
    `PROMPT_IDENTITY: ${model.promptIdentity}`,
    `FACE: ${model.facialIdentity.join("; ")}`,
    `HAIR: ${model.hairIdentity.join("; ")}`,
    `UNIQUE_MARKER: ${model.uniqueMarker}`,
    `BODY_SILHOUETTE: ${model.bodySilhouette}`,
    `SIGNATURE_EXPRESSION: ${model.signatureExpression}`,
    "DO_NOT_CHANGE: face geometry, age, background, skin undertone, hairline, unique marker, or overall body proportion.",
    "This is a fictional person. Do not imitate or resemble a real person or public figure.",
  ].join("\n")
}

function recipeContent(recipe: LookRecipe | null): string {
  if (!recipe) return "Look recipe has not been selected."
  return [
    `RECIPE_ID: ${recipe.id}`,
    `RECIPE_NAME: ${recipe.name}`,
    `PRODUCTION_INTENT: ${recipe.narrative}`,
    `CAMERA_BASELINE: ${recipe.camera}; ${recipe.lens}; ${recipe.aperture}`,
    `LIGHTING_BASELINE: ${recipe.lightingPlan}`,
    `COLOR_BASELINE: ${recipe.filmOrSimulation}; post grade ${recipe.postGrade}`,
    `QA_FOCUS: ${recipe.qaFocus.join("; ")}`,
  ].join("\n")
}

function shotListContent(project: PortraitProject): string {
  const coverage = answerValue(project, "step-8-1")
  const custom = project.answers["step-8-1"]?.customValue?.trim()
  const shots = coverage.includes("Editorial 8-shot")
    ? editorialEightShots
    : coverage.includes("Campaign 12-shot")
      ? campaignTwelveShots
      : coverage.includes("Portrait 5-shot")
        ? portraitFiveShots
        : custom
          ? custom.split(/\r?\n/).filter(Boolean)
          : []

  if (shots.length === 0) return "Shot coverage has not been completed."
  return [
    `COVERAGE: ${coverage}`,
    ...shots.map((shot) => `- ${shot}`),
    "Each shot card must lock purpose, framing, orientation, camera, lens, camera height and distance, aperture, pose, action, expression, eyeline, wardrobe, lighting, background, copy space, and continuity note.",
  ].join("\n")
}

function negativeContent(model: PortraitModel | null, recipe: LookRecipe | null): string {
  const constraints = [
    ...(model?.restrictedDirections ?? []),
    ...(recipe?.negativeConstraints ?? []),
    "No identity drift, age drift, celebrity resemblance, or real-person imitation",
    "No malformed anatomy, hands, fingers, eyes, teeth, hair, reflections, products, text, logos, or architecture",
    "No plastic skin, eye enlargement, glowing teeth, arbitrary bokeh, uniform fake grain, or uncontrolled halation",
    "No contradictory camera, lighting, weather, time, color, or continuity instructions",
  ]
  return [...new Set(constraints)].map((constraint) => `- ${constraint}`).join("\n")
}

function qaContent(): string {
  return portraitQaRules.map((rule) => `- [${rule.severity.toUpperCase()}] ${rule.promptInstruction}`).join("\n")
}

function genericBlockContent(project: PortraitProject, key: PromptBlockKey): string {
  const answers = workflowSteps
    .filter((step) => step.promptBlock === key)
    .map((step) => resolveAnswer(project, step.id))
    .filter((answer): answer is NonNullable<typeof answer> => Boolean(answer))
  return answers.length
    ? answers.map((answer) => `${answer.label}: ${answer.value}`).join("\n")
    : "Not specified yet."
}

function createBlocks(
  project: PortraitProject,
  model: PortraitModel | null,
  recipe: LookRecipe | null,
): PromptBlock[] {
  return promptBlockOrder.map((key) => {
    const sourceStepIds = workflowSteps
      .filter((step) => step.promptBlock === key)
      .map((step) => step.id)
    let content = genericBlockContent(project, key)

    if (key === "modelIdentity") content = modelIdentityContent(model, project)
    if (key === "lookRecipe") content = recipeContent(recipe)
    if (key === "shotPlanning") content = shotListContent(project)
    if (key === "negativeConstraints") content = negativeContent(model, recipe)
    if (key === "productionQa") content = qaContent()

    return { key, title: promptBlockTitles[key], content, sourceStepIds }
  })
}

function blockContent(blocks: PromptBlock[], key: PromptBlockKey): string {
  return blocks.find((block) => block.key === key)?.content ?? "Not specified yet."
}

function buildWarnings(project: PortraitProject): PromptWarning[] {
  const warnings: PromptWarning[] = []
  for (const step of workflowSteps) {
    if (validateStepAnswer(step, project.answers[step.id]).length > 0) {
      warnings.push({
        code: "INCOMPLETE_REQUIRED_STEP",
        message: `${step.code} ${step.title} ยังไม่สมบูรณ์`,
        stepId: step.id,
        severity: "warning",
      })
    }
  }
  for (const stepId of findInvalidatedAnswerStepIds(project)) {
    warnings.push({
      code: "DEPENDENCY_CONFLICT",
      message: "คำตอบไม่สอดคล้องกับคำตอบต้นทางและต้องเลือกใหม่",
      stepId,
      severity: "error",
    })
  }
  for (const issue of validateModelSafety(project)) {
    warnings.push({ code: issue.code, message: issue.message, stepId: issue.stepId, severity: issue.severity === "critical" ? "error" : "warning" })
  }
  if (!project.briefApprovedAt) {
    warnings.push({
      code: "BRIEF_NOT_APPROVED",
      message: "Final Prompt ยังไม่พร้อมใช้งานจนกว่าจะอนุมัติ Brief",
      severity: "warning",
    })
  }
  return warnings
}

export function buildPortraitPrompt(
  _workflow: typeof import("../../data/ai-portrait/workflow.ts").portraitWorkflow,
  project: PortraitProject,
): BuiltPrompt {
  const model = portraitModelById.get(deriveSelectedModelId(project) ?? "") ?? null
  const recipe = lookRecipeById.get(deriveSelectedRecipeId(project) ?? "") ?? null
  const blocks = createBlocks(project, model, recipe)
  const warnings = buildWarnings(project)
  const brief = buildPortraitBrief(project)

  const sections = [
    ["1. Project Objective", `Project: ${project.name}\nGoal: ${answerValue(project, "step-0-1")}\nProduction Objective: Create a coherent professional portrait image set for the approved goal. Do not create images until this brief is complete and approved.`],
    ["2. Target Audience and Platform", `Audience: ${answerValue(project, "step-0-2")}\nPlatform: ${answerValue(project, "step-0-3")}`],
    ["3. Model Identity Lock", blockContent(blocks, "modelIdentity")],
    ["4. Creative Direction", blockContent(blocks, "creativeDirection")],
    ["5. Look Recipe", blockContent(blocks, "lookRecipe")],
    ["6. Environment", blockContent(blocks, "environment")],
    ["7. Wardrobe, Hair and Makeup", blockContent(blocks, "styling")],
    ["8. Camera and Lens", blockContent(blocks, "cameraPackage")],
    ["9. Lighting Plan", blockContent(blocks, "lightingDesign")],
    ["10. Film / Simulation / Post Grade", blockContent(blocks, "colorPipeline")],
    ["11. Shot List", blockContent(blocks, "shotPlanning")],
    ["12. Series Continuity", blockContent(blocks, "continuity")],
    ["13. Natural Realism Requirements", "Build realism through coherent optics, perspective, anatomy, motivated light, material behavior, authentic skin texture, physically plausible depth of field, and scene logic—not by merely adding the word photorealistic."],
    ["14. Negative Constraints", blockContent(blocks, "negativeConstraints")],
    ["15. Professional QA Requirements", blockContent(blocks, "productionQa")],
    ["16. Output Ratio and Deliverables", blockContent(blocks, "outputRequirements")],
  ] as const

  const fullPrompt = [
    finalPromptTitle,
    "",
    "The subject is a fictional person. Preserve the selected official identity and never imitate a real person.",
    "Keep camera, lighting, color, styling, environment, and shot continuity mutually consistent. Every output must pass professional QA.",
    "",
    ...sections.flatMap(([title, content]) => [`## ${title}`, content, ""]),
    "Prompt พร้อมแล้ว คัดลอกไปวางใน ChatGPT Project เพื่อทำงานขั้นต่อไป",
  ].join("\n").trim()

  return {
    fullPrompt,
    blocks,
    brief,
    warnings,
    json: {
      schemaVersion: 2,
      generatedAt: project.updatedAt,
      project: {
        name: project.name,
        status: project.status,
        currentStepId: project.currentStepId,
        answers: project.answers,
        selectedModelId: model?.id,
        selectedRecipeId: recipe?.id,
        briefApprovedAt: project.briefApprovedAt,
      },
      model,
      recipe,
      promptBlocks: blocks,
      finalPrompt: fullPrompt,
      warnings,
    },
  }
}
