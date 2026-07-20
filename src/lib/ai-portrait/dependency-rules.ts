import { cameraPackageById, portraitModelById } from "../../data/ai-portrait/models.ts"
import { lookRecipeById } from "../../data/ai-portrait/recipes.ts"
import { workflowStepById, workflowSteps } from "../../data/ai-portrait/workflow.ts"
import type { PortraitProject, WorkflowOption } from "../../types/ai-portrait.ts"

export type OptionAvailability = {
  disabled: boolean
  reason?: string
}

const modelRecipeBlocks: Record<string, string[]> = {
  MODEL_A_YUNA: ["PR-06", "PR-12", "PR-14", "PR-15", "PR-16"],
  MODEL_B_MEI: ["PR-02", "PR-03", "PR-04", "PR-08", "PR-15", "PR-16"],
  MODEL_C_RIN: ["PR-02", "PR-03", "PR-04", "PR-08", "PR-09", "PR-11", "PR-13", "PR-15", "PR-16"],
  MODEL_D_HANA: ["PR-03", "PR-05", "PR-06", "PR-09", "PR-11", "PR-12", "PR-13", "PR-14"],
}

function getMetadataString(option: WorkflowOption, key: string): string | undefined {
  const value = option.metadata?.[key]
  return typeof value === "string" ? value : undefined
}

function getSelectedOption(project: PortraitProject, stepId: string): WorkflowOption | undefined {
  const answer = project.answers[stepId]
  const optionId = answer?.optionIds[0]
  return workflowStepById.get(stepId)?.options?.find((option) => option.id === optionId)
}

export function deriveSelectedModelId(project: PortraitProject): string | undefined {
  const selected = getSelectedOption(project, "step-2-1")
  return project.selectedModelId ?? (selected ? getMetadataString(selected, "modelId") : undefined)
}

export function deriveSelectedRecipeId(project: PortraitProject): string | undefined {
  const selected = getSelectedOption(project, "step-3-1")
  return project.selectedRecipeId ?? (selected ? getMetadataString(selected, "recipeId") : undefined)
}

export function getOptionAvailability(
  project: PortraitProject,
  stepId: string,
  option: WorkflowOption,
): OptionAvailability {
  const modelId = deriveSelectedModelId(project)

  if (stepId === "step-3-1" && modelId) {
    const recipeId = getMetadataString(option, "recipeId")
    if (recipeId && modelRecipeBlocks[modelId]?.includes(recipeId)) {
      const model = portraitModelById.get(modelId)
      return {
        disabled: true,
        reason: `${option.label} ขัดกับ Approved Styles หรือ Restricted Direction ของ ${model?.stageName ?? modelId}`,
      }
    }
  }

  if (stepId === "step-3-3") {
    const cameraPackageId = getMetadataString(option, "cameraPackageId")
    const cameraPackage = cameraPackageId ? cameraPackageById.get(cameraPackageId) : undefined
    const captureMedium = getSelectedOption(project, "step-3-2")?.promptValue

    if (cameraPackage && modelId && !cameraPackage.recommendedModels.includes(modelId)) {
      return { disabled: true, reason: "Camera Package นี้ไม่ได้อยู่ใน Model Bible ของ Model ที่เลือก" }
    }
    if (cameraPackage && captureMedium && !cameraPackage.captureMedia.includes(captureMedium)) {
      return { disabled: true, reason: "Camera Package ไม่สอดคล้องกับ Capture Medium ที่เลือก" }
    }
  }

  if (stepId === "step-5-3" && modelId) {
    const blockedHair: Record<string, string[]> = {
      MODEL_A_YUNA: ["E"],
      MODEL_D_HANA: ["E", "F"],
    }
    if (blockedHair[modelId]?.includes(option.code)) {
      return { disabled: true, reason: "ทรงผมนี้ไม่ได้รับอนุมัติใน Model Bible ของ Model ที่เลือก" }
    }
  }

  if (stepId === "step-5-4" && modelId === "MODEL_A_YUNA" && ["C", "D", "E"].includes(option.code)) {
    return { disabled: true, reason: "YUNA ต้องใช้ Makeup เบาและคงภาพลักษณ์วัย 19 ปี" }
  }

  if (stepId === "step-7-2") {
    const captureMedium = getSelectedOption(project, "step-3-2")?.promptValue ?? ""
    const simulationLabels = ["Fujifilm ASTIA", "Fujifilm Classic Negative", "Fujifilm ETERNA", "ACROS / B&W"]
    const filmLabels = [
      "Kodak Portra 160",
      "Kodak Portra 400",
      "Kodak Gold 200",
      "Fujifilm Pro 400H",
      "Fujicolor Superia 400",
      "Kodak Vision3 250D",
      "Kodak Vision3 500T",
    ]
    if (captureMedium.startsWith("Digital") && filmLabels.includes(option.label)) {
      return { disabled: false, reason: "ใช้เป็น film emulation ใน post-production ไม่ใช่ฟิล์มจริง" }
    }
    if (captureMedium.includes("Film") && simulationLabels.includes(option.label)) {
      return { disabled: true, reason: "In-camera simulation นี้ไม่ตรงกับ Capture Medium แบบ Film" }
    }
  }

  return { disabled: false }
}

export function findInvalidatedAnswerStepIds(
  project: PortraitProject,
): string[] {
  return workflowSteps.flatMap((step) => {
    const answer = project.answers[step.id]
    if (!answer) return []
    const invalid = answer.optionIds.some((optionId) => {
      const option = step.options?.find((item) => item.id === optionId)
      return option ? getOptionAvailability(project, step.id, option).disabled : true
    })
    return invalid ? [step.id] : []
  })
}

export function isRecipeCompatibleWithModel(recipeId: string, modelId: string): boolean {
  if (!lookRecipeById.has(recipeId) || !portraitModelById.has(modelId)) return false
  return !modelRecipeBlocks[modelId]?.includes(recipeId)
}
