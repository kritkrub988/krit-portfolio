import {
  cameraPackages,
  lookRecipes,
  portraitModels,
  portraitWorkflow,
  workflowStepById,
  workflowSteps,
} from "../../data/ai-portrait/index.ts"
import { findInvalidatedAnswerStepIds } from "./dependency-rules.ts"
import type {
  PortraitProject,
  ProjectAnswer,
  WorkflowStep,
} from "../../types/ai-portrait.ts"

export type ValidationIssue = {
  code: string
  message: string
  id?: string
}

const validDependencyRuleIds = new Set([
  "requires-model",
  "recipe-model-compatibility",
  "camera-model-medium-compatibility",
  "wardrobe-model-safety",
  "hair-model-compatibility",
  "makeup-model-safety",
  "requires-lighting-package",
  "requires-capture-medium",
  "film-medium-compatibility",
  "requires-color-selection",
  "requires-all-production-steps",
  "requires-final-brief-review",
  "requires-brief-approval",
  "requires-prompt-blocks",
  "requires-prompt-qa",
])

function duplicateValues(values: string[]): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value)
    seen.add(value)
  }
  return [...duplicates]
}

export function validateMasterData(): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const phaseIds = portraitWorkflow.phases.map((phase) => phase.id)
  const stepIds = workflowSteps.map((step) => step.id)
  const optionIds = workflowSteps.flatMap((step) => step.options?.map((option) => option.id) ?? [])
  const modelIds = portraitModels.map((model) => model.id)
  const recipeIds = lookRecipes.map((recipe) => recipe.id)
  const cameraIds = cameraPackages.map((cameraPackage) => cameraPackage.id)

  for (const [code, values] of [
    ["DUPLICATE_PHASE_ID", phaseIds],
    ["DUPLICATE_STEP_ID", stepIds],
    ["DUPLICATE_OPTION_ID", optionIds],
    ["DUPLICATE_MODEL_ID", modelIds],
    ["DUPLICATE_RECIPE_ID", recipeIds],
    ["DUPLICATE_CAMERA_ID", cameraIds],
  ] as const) {
    for (const id of duplicateValues(values)) {
      issues.push({ code, id, message: `${code}: ${id}` })
    }
  }

  const phaseIdSet = new Set(phaseIds)
  const modelIdSet = new Set(modelIds)
  const cameraIdSet = new Set(cameraIds)

  for (const step of workflowSteps) {
    if (!phaseIdSet.has(step.phaseId)) {
      issues.push({ code: "UNKNOWN_PHASE", id: step.id, message: `${step.id} อ้างถึง Phase ที่ไม่มีอยู่` })
    }
    if (step.required && !step.promptBlock) {
      issues.push({ code: "MISSING_PROMPT_BLOCK", id: step.id, message: `${step.id} ไม่มี Prompt Block` })
    }
    for (const ruleId of step.dependencyRuleIds ?? []) {
      if (!validDependencyRuleIds.has(ruleId)) {
        issues.push({ code: "UNKNOWN_DEPENDENCY", id: step.id, message: `${step.id} อ้างถึง Dependency ${ruleId} ที่ไม่มีอยู่` })
      }
    }
  }

  for (const model of portraitModels) {
    if (!model.identityVersion) {
      issues.push({ code: "MISSING_IDENTITY_VERSION", id: model.id, message: `${model.id} ไม่มี Identity Version` })
    }
    for (const cameraId of model.cameraPackageIds) {
      if (!cameraIdSet.has(cameraId)) {
        issues.push({ code: "UNKNOWN_CAMERA", id: model.id, message: `${model.id} อ้างถึง Camera Package ที่ไม่มีอยู่: ${cameraId}` })
      }
    }
  }

  for (const recipe of lookRecipes) {
    if (recipe.recommendedModels.length === 0) {
      issues.push({ code: "MISSING_RECIPE_MODEL", id: recipe.id, message: `${recipe.id} ไม่มี Model Recommendation` })
    }
    for (const modelId of recipe.recommendedModels) {
      if (!modelIdSet.has(modelId)) {
        issues.push({ code: "UNKNOWN_RECIPE_MODEL", id: recipe.id, message: `${recipe.id} อ้างถึง Model ที่ไม่มีอยู่: ${modelId}` })
      }
    }
  }

  const serializedData = JSON.stringify({ portraitModels, lookRecipes, workflow: portraitWorkflow })
  for (const oldName of ["AIRA", "MIRA", "VERA", "ELENA"]) {
    if (serializedData.includes(oldName)) {
      issues.push({ code: "BANNED_MODEL_NAME", id: oldName, message: `พบชื่อ Model เก่า ${oldName}` })
    }
  }

  return issues
}

export function validateStepAnswer(
  step: WorkflowStep,
  answer: ProjectAnswer | undefined,
): string[] {
  const errors: string[] = []
  if (!answer) return step.required ? ["กรุณาเลือกคำตอบก่อนดำเนินการต่อ"] : []

  const customValue = answer.customValue?.trim() ?? ""
  const selectedOptions = step.options?.filter((option) => answer.optionIds.includes(option.id)) ?? []
  const hasUnknownOption = answer.optionIds.some(
    (optionId) => !step.options?.some((option) => option.id === optionId),
  )

  if (hasUnknownOption) errors.push("คำตอบอ้างถึงตัวเลือกที่ไม่มีอยู่")
  if (step.required && selectedOptions.length === 0 && !customValue) {
    errors.push("กรุณาเลือกคำตอบก่อนดำเนินการต่อ")
  }
  if (answer.optionIds.length > 1 && step.inputType !== "multiselect") {
    errors.push("ขั้นตอนนี้เลือกได้เพียงหนึ่งตัวเลือก")
  }

  const selectedCustomOption = selectedOptions.some((option) =>
    /custom|กำหนดเอง|ผู้ใช้กำหนดเอง/i.test(option.label),
  )
  if (selectedCustomOption && step.allowsCustom && !customValue) {
    errors.push("กรุณากรอกรายละเอียด Custom")
  }

  const approvalStepIds = new Set([
    "step-2-2",
    "step-6-2",
    "step-7-1",
    "step-7-4",
    "step-8-3",
    "step-9-1",
    "step-9-2",
    "step-10-1",
    "step-10-2",
    "step-10-3",
  ])
  if (approvalStepIds.has(step.id) && selectedOptions[0]?.code !== "A") {
    errors.push("ขั้นตอนนี้ต้องเลือกตัวเลือกอนุมัติก่อนดำเนินการต่อ")
  }

  for (const rule of step.validation ?? []) {
    if (rule.type === "minSelections" && answer.optionIds.length < rule.value) errors.push(rule.message)
    if (rule.type === "maxSelections" && answer.optionIds.length > rule.value) errors.push(rule.message)
    if (rule.type === "minLength" && customValue.length < rule.value) errors.push(rule.message)
    if (rule.type === "maxLength" && customValue.length > rule.value) errors.push(rule.message)
  }

  return [...new Set(errors)]
}

export function validateProject(project: PortraitProject): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  for (const step of workflowSteps) {
    for (const message of validateStepAnswer(step, project.answers[step.id])) {
      issues.push({ code: "INVALID_ANSWER", id: step.id, message })
    }
  }
  for (const stepId of findInvalidatedAnswerStepIds(project)) {
    issues.push({ code: "DEPENDENCY_CONFLICT", id: stepId, message: "คำตอบนี้ไม่สอดคล้องกับคำตอบต้นทางอีกต่อไป" })
  }
  return issues
}

export function canNavigateToStep(project: PortraitProject, targetStepId: string): boolean {
  const targetIndex = workflowSteps.findIndex((step) => step.id === targetStepId)
  if (targetIndex < 0) return false
  return workflowSteps.slice(0, targetIndex).every((step) =>
    step.required ? validateStepAnswer(step, project.answers[step.id]).length === 0 : true,
  )
}

export function nextIncompleteStepId(project: PortraitProject): string | undefined {
  return workflowSteps.find(
    (step) => validateStepAnswer(step, project.answers[step.id]).length > 0,
  )?.id
}

export function isKnownStepId(stepId: string): boolean {
  return workflowStepById.has(stepId)
}
