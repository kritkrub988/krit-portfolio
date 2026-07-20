import { portraitModelById, workflowStepById } from "../../data/ai-portrait/index.ts"
import type { PortraitProject, PortraitProjectSnapshot } from "../../types/ai-portrait.ts"
import { effectiveOptionIds, normalizeProjectAnswer } from "./answer-utils.ts"
import { deriveSelectedModelId } from "./dependency-rules.ts"

export type SafetyIssue = {
  code: string
  message: string
  severity: "critical" | "warning"
  stepId?: string
}

function answerText(project: PortraitProjectSnapshot): string {
  return Object.entries(project.answers ?? {}).flatMap(([stepId, raw]) => {
    const answer = normalizeProjectAnswer(stepId, raw, new Date(0).toISOString())
    const step = workflowStepById.get(stepId)
    const values = effectiveOptionIds(answer).map((id) => step?.options?.find((option) => option.id === id)?.label ?? "")
    return [...values, answer.customValue ?? ""]
  }).join(" ").toLowerCase()
}

export function validateModelSafety(project: PortraitProjectSnapshot): SafetyIssue[] {
  const projectLike = project as PortraitProject
  const modelId = deriveSelectedModelId(projectLike)
  const model = portraitModelById.get(modelId ?? "")
  if (!model) return []
  const text = answerText(project)
  const issues: SafetyIssue[] = []

  if (model.ageStatus === "MINOR") {
    if (/sexy|sensual|lingerie|swimwear|nightlife|bedroom|provocative|body.focus|chest|hips|thigh|dark feminine|luxury noir|เซ็กซี่|ยั่วยวน|ชุดชั้นใน/.test(text)) {
      issues.push({ code: "MINOR_SEXUALIZATION", message: "บล็อกคำสั่งที่ทำให้ AKARI ผู้เยาว์มีลักษณะเชิงเพศหรือเน้นสรีระ", severity: "critical" })
    }
    if (/age.?up|make (her )?older|adult makeup|adult commercial|เพิ่มอายุ|ทำให้ดูโต/.test(text)) {
      issues.push({ code: "MINOR_AGE_UP_BYPASS", message: "บล็อกการเพิ่มอายุหรือหลบเลี่ยง Age Lock ของผู้เยาว์", severity: "critical" })
    }
  }

  if (model.id === "MODEL_F_HAEUN" && /age.?down|make (her )?younger|under.?18|high.?school|middle.?school|ลดอายุ|เด็กกว่า 18/.test(text)) {
    issues.push({ code: "HAEUN_AGE_DOWN", message: "บล็อกการลดอายุ HAEUN ไปสู่บริบทผู้เยาว์ที่ไม่เหมาะสม", severity: "critical" })
  }
  if (/extreme(ly)? thin|tiny waist|exaggerated (body|proportion)|model.body comparison|ผอมมาก|เอวเล็กผิดธรรมชาติ|สัดส่วนเกินจริง/.test(text)) {
    issues.push({ code: "BODY_EXAGGERATION", message: "บล็อกการบิดเบือนรูปร่าง ความผอมสุดขั้ว หรือการเปรียบเทียบหุ่น", severity: "critical" })
  }
  if (/skin whitening|whiten skin|porcelain white skin|artificial whitening|ผิวขาวขึ้น|ฟอกสีผิว/.test(text)) {
    issues.push({ code: "ARTIFICIAL_WHITENING", message: "บล็อก artificial skin whitening และคงสีผิวจริง", severity: "critical" })
  }
  return issues
}

export function validateImportedPortraitProject(value: unknown): { valid: boolean; issues: SafetyIssue[] } {
  if (!value || typeof value !== "object") {
    return { valid: false, issues: [{ code: "INVALID_IMPORT", message: "ไฟล์ JSON ไม่ใช่ Portrait Project", severity: "critical" }] }
  }
  const candidate = value as { answers?: unknown; currentStepId?: unknown; selectedModelId?: unknown }
  if (!candidate.answers || typeof candidate.answers !== "object" || typeof candidate.currentStepId !== "string") {
    return { valid: false, issues: [{ code: "INVALID_IMPORT_SCHEMA", message: "โครงสร้าง Portrait Project ไม่ครบ", severity: "critical" }] }
  }
  const issues = validateModelSafety(candidate as PortraitProjectSnapshot)
  return { valid: !issues.some((issue) => issue.severity === "critical"), issues }
}
