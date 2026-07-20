import {
  finalPromptTitle,
  lookRecipeById,
  portraitModelById,
  portraitQaRules,
  promptBlockOrder,
  promptBlockTitles,
  workflowSteps,
  imageRatioOptionById,
} from "../../data/ai-portrait/index.ts"
import { answerValue, buildPortraitBrief, resolveAnswer } from "./brief-builder.ts"
import {
  deriveSelectedModelId,
  deriveSelectedRecipeId,
  findInvalidatedAnswerStepIds,
} from "./dependency-rules.ts"
import { validateStepAnswer } from "./validation.ts"
import { validateModelSafety } from "./safety-validation.ts"
import { resolveImageRatio } from "./image-ratio.ts"
import { resolveShotDefinitions } from "./shot-planning.ts"
import type {
  BuiltPrompt,
  ImageRatioPresetId,
  LookRecipe,
  PortraitModel,
  PortraitProject,
  PromptBlock,
  PromptBlockKey,
  PromptWarning,
} from "../../types/ai-portrait.ts"

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
  const shots = resolveShotDefinitions(project)
  const imageRatio = resolveImageRatio(project)

  if (shots.length === 0) return "Shot coverage has not been completed."
  return [
    `COVERAGE: ${coverage}`,
    ...shots.flatMap((shot) => {
      const override = imageRatio.shotOverrides[shot.id]
      const ratio = override ?? imageRatio.primary
      const preset = imageRatioOptionById.get(ratio as ImageRatioPresetId)
      return [
        `- ${shot.id} — ${shot.label}${override ? " [SHOT RATIO OVERRIDE]" : ""}`,
        `  aspect_ratio: ${ratio}`,
        `  orientation: ${preset?.orientation ?? imageRatio.orientation}`,
        `  pixel_reference: ${preset?.pixelReference ?? imageRatio.pixelReference}`,
        `  safe_zone: ${preset?.safeZone ?? imageRatio.safeZone}`,
        `  crop_strategy: ${preset?.cropStrategy ?? imageRatio.cropStrategy}`,
        `  copy_space: ${preset?.copySpace ?? imageRatio.copySpace}`,
        ...(imageRatio.secondary.length > 0 ? [`  secondary_ratios: ${imageRatio.secondary.join(", ")}`] : []),
      ]
    }),
    "Each shot card must also lock purpose, framing, camera, lens, camera height and distance, aperture, pose, action, expression, eyeline, wardrobe, lighting, background, and continuity note.",
  ].join("\n")
}

function imageFormatContent(project: PortraitProject): string {
  const ratio = resolveImageRatio(project)
  return [
    `SELECTION_MODE: ${ratio.selectionMode.toUpperCase()}`,
    `ASPECT_RATIO: ${ratio.primary}`,
    `PRIMARY_RATIO: ${ratio.primary}`,
    `SECONDARY_RATIOS: ${ratio.secondary.length ? ratio.secondary.join(", ") : "None"}`,
    `ORIENTATION: ${ratio.orientation}`,
    `PIXEL_REFERENCE: ${ratio.pixelReference}`,
    `PLATFORM_FIT: ${ratio.platformFit.join(", ")}`,
    "COMPOSITION_GUIDANCE:",
    ...ratio.compositionGuidance.map((guidance) => `- ${guidance}`),
    `SAFE_ZONE: ${ratio.safeZone}`,
    `CROP_STRATEGY: ${ratio.cropStrategy}`,
    `COPY_SPACE: ${ratio.copySpace}`,
    "HEADROOM_AND_FOOTROOM: Keep both balanced for the selected framing; never crop joints or critical wardrobe details.",
    ...(ratio.needsDedicatedComposition ? ["MULTI_RATIO_STRATEGY: Create a composition-specific master for each orientation; do not rely on destructive cropping alone."] : []),
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
    if (key === "imageFormat") content = imageFormatContent(project)
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
        message: `${step.displayCode ?? step.code} ${step.title} ยังไม่สมบูรณ์`,
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
  const imageRatio = resolveImageRatio(project)

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
    ["11. Image Format and Composition", blockContent(blocks, "imageFormat")],
    ["12. Shot List", blockContent(blocks, "shotPlanning")],
    ["13. Series Continuity", blockContent(blocks, "continuity")],
    ["14. Natural Realism Requirements", "Build realism through coherent optics, perspective, anatomy, motivated light, material behavior, authentic skin texture, physically plausible depth of field, and scene logic—not by merely adding the word photorealistic."],
    ["15. Negative Constraints", blockContent(blocks, "negativeConstraints")],
    ["16. Professional QA Requirements", blockContent(blocks, "productionQa")],
    ["17. Output Ratio and Deliverables", `${blockContent(blocks, "outputRequirements")}\nPrimary Ratio: ${imageRatio.primary}\nSecondary Ratios: ${imageRatio.secondary.join(", ") || "None"}\nFilename Token: ${imageRatio.filenameToken}`],
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
      schemaVersion: 3,
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
      imageRatio,
      promptBlocks: blocks,
      finalPrompt: fullPrompt,
      warnings,
    },
  }
}
