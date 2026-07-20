import { portraitModelById, workflowStepById, workflowSteps } from "../../data/ai-portrait/index.ts"
import type {
  AutoConfidence,
  AutoDecisionLog,
  PortraitProject,
  ProjectAnswer,
  WorkflowOption,
  WorkflowStep,
} from "../../types/ai-portrait.ts"
import { approvalStepIds, createInitialAnswer, effectiveOptionIds } from "./answer-utils.ts"
import { getOptionAvailability } from "./dependency-rules.ts"
import { IMAGE_RATIO_STEP_ID, imageRatioOptionIdByPreset } from "./image-ratio.ts"
import type { ImageRatioPresetId } from "../../types/ai-portrait.ts"

export type AutoResolutionResult = {
  optionIds: string[]
  reason: string
  confidence: AutoConfidence
  warnings: string[]
}

export type AutoResolutionContext = {
  triggeredBy?: string
}

function optionByCode(step: WorkflowStep, code: string): WorkflowOption | undefined {
  return step.options?.find((option) => option.code === code)
}

function projectSignals(
  project: PortraitProject,
  options: { excludeStepIds?: Set<string>; manualIntentOnly?: boolean } = {},
): string {
  return Object.entries(project.answers)
    .flatMap(([stepId, answer]) => {
      if (options.excludeStepIds?.has(stepId)) return []
      if (options.manualIntentOnly && answer.selectionMode === "auto") return []
      const step = workflowStepById.get(stepId)
      const labels = effectiveOptionIds(answer).map((id) => step?.options?.find((option) => option.id === id)?.label ?? "")
      return [...labels, answer.customValue ?? ""]
    })
    .join(" ")
    .toLowerCase()
}

function resolveModel(step: WorkflowStep, project: PortraitProject): AutoResolutionResult {
  // Model selection must be derived from user intent, not from its own previous
  // Auto result or downstream Auto answers generated for that previous model.
  const signals = projectSignals(project, {
    excludeStepIds: new Set(["step-2-1"]),
    manualIntentOnly: true,
  })
  let code = "A"
  let reason = "ยังไม่มี Creative Signal เพียงพอ จึงใช้ YUNA เป็นค่าเริ่มต้นชั่วคราว"
  let confidence: AutoConfidence = "low"

  if (/sexy|sensual|lingerie|swimwear|nightlife|provocative|adult commercial|เซ็กซี่|ยั่วยวน/.test(signals)) {
    code = /luxury|cinematic|fashion/.test(signals) ? "C" : "B"
    reason = "พบ Adult/Sensual signal จึงจำกัดการเลือกไว้ที่โมเดลผู้ใหญ่และไม่เลือกผู้เยาว์"
    confidence = "high"
  } else if (/korean|เกาหลี|campus|มหาวิทยาลัย|university/.test(signals)) {
    code = "F"; reason = "โจทย์แนว Korean campus / university เหมาะกับ HAEUN"; confidence = "high"
  } else if (/school|student|นักเรียน|มัธยม|after-school|youth/.test(signals)) {
    code = "E"; reason = "โจทย์ school life / student youth เหมาะกับ AKARI แบบ family-safe"; confidence = "high"
  } else if (/beauty|lookbook/.test(signals)) {
    code = "B"; reason = "โจทย์ Beauty / Lookbook ตรงกับ Approved Styles ของ MEI"; confidence = "high"
  } else if (/luxury|high fashion|cinematic|jewelry|quiet luxury/.test(signals)) {
    code = "C"; reason = "โจทย์ Luxury / High Fashion / Cinematic เหมาะกับ RIN"; confidence = "high"
  } else if (/branding|corporate|wellness|business|ผู้บริหาร/.test(signals)) {
    code = "D"; reason = "โจทย์ Branding / Corporate / Wellness เหมาะกับ HANA"; confidence = "high"
  } else if (/japanese|ญี่ปุ่น|photo story/.test(signals)) {
    code = /school|student|นักเรียน|มัธยม/.test(signals) ? "E" : "A"
    reason = "โจทย์ Japanese story จับคู่กับ YUNA หรือ AKARI ตามช่วงวัยและบริบท"
    confidence = "medium"
  }

  const option = optionByCode(step, code) ?? step.options?.[0]
  return { optionIds: option ? [option.id] : [], reason, confidence, warnings: [] }
}

function preferredCodes(stepId: string, signals: string): string[] {
  const defaults: Record<string, string[]> = {
    "step-0-1": ["A"], "step-0-2": ["A"], "step-0-3": ["G"], "step-0-4": ["B"],
    "step-1-1": ["A"], "step-1-2": ["F"], "step-1-3": ["A"],
    "step-3-2": ["A"], "step-4-1": ["C"], "step-4-2": ["F"], "step-4-3": ["B"],
    "step-4-4": ["B"], "step-5-1": ["A"], "step-5-2": ["A"], "step-5-3": ["A"],
    "step-5-4": ["A"], "step-6-1": ["A"], "step-7-2": ["B"], "step-7-3": ["A"],
    "step-8-1": ["A"], "step-8-2": ["A"],
  }
  if (stepId === "step-1-1" && /school|student|youth|นักเรียน/.test(signals)) return ["C", "A"]
  if (stepId === "step-1-3" && /luxury|fashion/.test(signals)) return ["D", "H", "B"]
  if (stepId === "step-4-1" && /campus|school|library/.test(signals)) return ["C", "B"]
  return defaults[stepId] ?? []
}

function resolveImageRatio(project: PortraitProject): AutoResolutionResult {
  const signalFor = (stepId: string) => {
    const answer = project.answers[stepId]
    const step = workflowStepById.get(stepId)
    return effectiveOptionIds(answer)
      .map((id) => step?.options?.find((option) => option.id === id)?.label ?? "")
      .concat(answer?.customValue ?? "")
      .join(" ")
      .toLowerCase()
  }
  const platform = signalFor("step-0-3")
  const deliverables = signalFor("step-0-4")
  const coverage = signalFor("step-8-1")
  const goal = signalFor("step-0-1")
  const narrative = `${signalFor("step-1-1")} ${signalFor("step-1-2")} ${signalFor("step-1-3")}`
  const combined = `${platform} ${deliverables} ${coverage} ${goal} ${narrative}`
  let ratio: ImageRatioPresetId = "4:5"
  let reason = "ใช้ 4:5 เป็นค่าเริ่มต้นที่ยืดหยุ่นสำหรับ Social Feed และงาน Portrait"
  let confidence: AutoConfidence = "medium"

  if (/story|reel cover|mobile wallpaper/.test(platform)) {
    ratio = "9:16"; reason = "Platform เป็น Story / Reel Cover จึงใช้กรอบแนวตั้งเต็มจอ 9:16 พร้อม mobile safe zone"; confidence = "high"
  } else if (/instagram feed|instagram carousel|facebook feed/.test(platform)) {
    ratio = "4:5"; reason = "Platform เป็น Instagram/Facebook Feed จึงใช้ 4:5 เพื่อใช้พื้นที่หน้าจอแนวตั้งอย่างมีประสิทธิภาพ"; confidence = "high"
  } else if (/website/.test(platform)) {
    ratio = "16:9"; reason = "Platform เป็น Website Portfolio/Hero จึงใช้ 16:9 สำหรับ environmental framing และ copy space"; confidence = "high"
  } else if (/print|poster/.test(platform)) {
    ratio = "2:3"; reason = "Platform เป็น Print / Poster จึงใช้ 2:3 ซึ่งรองรับ full-body และพื้นที่ตัดตก"; confidence = "high"
  } else if (/story|reel|mobile/.test(deliverables)) {
    ratio = "9:16"; reason = "Deliverables เน้น mobile vertical output จึงใช้ 9:16"; confidence = "high"
  } else if (/poster|full-body|full body/.test(`${deliverables} ${coverage}`)) {
    ratio = "2:3"; reason = "Deliverables หรือ Shot Coverage เน้น Poster / Full-body จึงใช้ 2:3"; confidence = "high"
  } else if (/editorial landscape|product \+ model|product and model/.test(combined)) {
    ratio = "5:4"; reason = "โจทย์เป็น Editorial Landscape หรือ Product + Model จึงใช้ 5:4"; confidence = "high"
  } else if (/travel|environmental|camera-standard landscape|photo story/.test(combined)) {
    ratio = "3:2"; reason = "โจทย์เน้น Travel / Environmental Storytelling จึงใช้กรอบกล้องมาตรฐาน 3:2"; confidence = "high"
  } else if (/profile|social grid|product portrait/.test(combined)) {
    ratio = "1:1"; reason = "โจทย์เน้น Profile / Social Grid จึงใช้กรอบสี่เหลี่ยม 1:1"; confidence = "high"
  } else if (/cinematic story|cinematic frame/.test(`${goal} ${narrative}`)) {
    ratio = "16:9"; reason = "Goal หรือ Narrative เป็น Cinematic Story จึงใช้ 16:9"; confidence = "high"
  }

  return {
    optionIds: [imageRatioOptionIdByPreset.get(ratio) ?? imageRatioOptionIdByPreset.get("4:5")!],
    reason,
    confidence,
    warnings: [],
  }
}

export function resolveAutomaticAnswer(
  step: WorkflowStep,
  project: PortraitProject,
  _context: AutoResolutionContext = {},
): AutoResolutionResult {
  void _context
  if (approvalStepIds.has(step.id)) {
    return { optionIds: [], reason: "Approval ต้องยืนยันโดยผู้ใช้", confidence: "high", warnings: [] }
  }
  if (step.id === "step-2-1") return resolveModel(step, project)
  if (step.id === IMAGE_RATIO_STEP_ID) return resolveImageRatio(project)

  const signals = projectSignals(project)
  const available = (step.options ?? []).filter((option) => !getOptionAvailability(project, step.id, option).disabled)
  const preferred = preferredCodes(step.id, signals)
  let option = preferred.flatMap((code) => available.filter((candidate) => candidate.code === code))[0]

  if (step.id === "step-3-1") {
    const modelId = project.selectedModelId
    option = available.find((candidate) => {
      const recipeId = candidate.metadata?.recipeId
      if (typeof recipeId !== "string" || !modelId) return false
      const model = portraitModelById.get(modelId)
      return model?.approvedStyles.some((style) => candidate.label.toLowerCase().includes(style.toLowerCase().split(" ")[0] ?? ""))
    }) ?? available[0]
  } else if (step.id === "step-3-3") {
    option = available.find((candidate) => {
      const id = candidate.metadata?.cameraPackageId
      const model = portraitModelById.get(project.selectedModelId ?? "")
      return typeof id === "string" && model?.cameraPackageIds.includes(id)
    }) ?? available[0]
  }

  option ??= available[0]
  return {
    optionIds: option ? [option.id] : [],
    reason: option
      ? `เลือก ${option.label} จากความปลอดภัย ความเข้ากันกับโมเดล เป้าหมาย และค่าตั้งต้นของ workflow`
      : "ไม่มีตัวเลือกที่ผ่านข้อจำกัดในขณะนี้",
    confidence: preferred.includes(option?.code ?? "") ? "high" : available.length > 0 ? "medium" : "low",
    warnings: option ? [] : ["AUTO_NO_SAFE_OPTION"],
  }
}

export function resolveAllAutomaticAnswers(
  project: PortraitProject,
  context: AutoResolutionContext = {},
): { project: PortraitProject; logs: AutoDecisionLog[] } {
  const timestamp = new Date().toISOString()
  const next = { ...project, answers: { ...project.answers } }
  const logs: AutoDecisionLog[] = []

  const resolutionOrder = [
    ...workflowSteps.filter((step) => step.id !== IMAGE_RATIO_STEP_ID),
    ...workflowSteps.filter((step) => step.id === IMAGE_RATIO_STEP_ID),
  ]

  for (const step of resolutionOrder) {
    const existing = next.answers[step.id] ?? createInitialAnswer(step, timestamp)
    if (existing.selectionMode !== "auto" || approvalStepIds.has(step.id)) {
      next.answers[step.id] = existing
      continue
    }
    const result = resolveAutomaticAnswer(step, next, context)
    const previous = effectiveOptionIds(existing)
    const answer: ProjectAnswer = {
      ...existing,
      resolvedOptionIds: result.optionIds,
      autoReason: result.reason,
      autoConfidence: result.confidence,
      updatedAt: timestamp,
    }
    next.answers[step.id] = answer
    if (step.id === "step-2-1") {
      const selected = step.options?.find((option) => option.id === result.optionIds[0])
      next.selectedModelId = typeof selected?.metadata?.modelId === "string" ? selected.metadata.modelId : undefined
    }
    if (step.id === "step-3-1") {
      const selected = step.options?.find((option) => option.id === result.optionIds[0])
      next.selectedRecipeId = typeof selected?.metadata?.recipeId === "string" ? selected.metadata.recipeId : undefined
    }
    if (previous.join("|") !== result.optionIds.join("|") || !existing.autoReason) {
      logs.push({
        id: `auto_${project.id}_${step.id}_${Date.now()}_${logs.length}`,
        projectId: project.id,
        stepId: step.id,
        previousOptionIds: previous,
        resolvedOptionIds: result.optionIds,
        reason: result.reason,
        confidence: result.confidence,
        warnings: result.warnings,
        triggeredBy: context.triggeredBy,
        createdAt: timestamp,
      })
    }
  }
  return { project: { ...next, updatedAt: timestamp }, logs }
}
