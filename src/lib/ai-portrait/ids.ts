export function createPortraitId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`
  }

  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

export function padVersion(versionNumber: number): string {
  return `V${Math.max(1, versionNumber).toString().padStart(3, "0")}`
}

export function slugifyFilenamePart(value: string): string {
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase()

  return normalized || "PORTRAIT_PROJECT"
}

export function createPromptFilename(input: {
  date: string
  projectName: string
  modelName?: string
  versionNumber: number
  extension: "txt" | "md" | "json"
}): string {
  const project = slugifyFilenamePart(input.projectName)
  const model = slugifyFilenamePart(input.modelName ?? "NO_MODEL")
  return `${input.date}_${project}_${model}_PROMPT_${padVersion(input.versionNumber)}.${input.extension}`
}

export function getBangkokDateForFilename(isoTimestamp: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(isoTimestamp))

  const datePart = (type: "year" | "month" | "day") =>
    parts.find((part) => part.type === type)?.value ?? ""

  return `${datePart("year")}-${datePart("month")}-${datePart("day")}`
}
