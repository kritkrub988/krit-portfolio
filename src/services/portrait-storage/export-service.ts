import {
  createPortraitId,
  createPromptFilename,
  getBangkokDateForFilename,
} from "@/lib/ai-portrait/ids"
import { requestToPromise, withStore } from "@/services/portrait-storage/indexed-db"
import { PORTRAIT_STORES } from "@/services/portrait-storage/types"
import type {
  BuiltPrompt,
  ExportHistoryRecord,
  PortraitProject,
} from "@/types/ai-portrait"
import { resolveImageRatio } from "@/lib/ai-portrait/image-ratio"

export type PromptExportFormat = "txt" | "md" | "json"

export type PreparedPromptExport = {
  filename: string
  mimeType: string
  content: string
}

export function preparePromptExport(input: {
  format: PromptExportFormat
  project: PortraitProject
  builtPrompt: BuiltPrompt
  versionNumber: number
  modelName?: string
  timestamp?: string
}): PreparedPromptExport {
  const timestamp = input.timestamp ?? input.project.updatedAt
  const imageRatio = resolveImageRatio(input.project)
  const filename = createPromptFilename({
    date: getBangkokDateForFilename(timestamp),
    projectName: input.project.name,
    modelName: input.modelName,
    imageRatio: imageRatio.primary,
    versionNumber: input.versionNumber,
    extension: input.format,
  })

  if (input.format === "txt") {
    return { filename, mimeType: "text/plain;charset=utf-8", content: input.builtPrompt.fullPrompt }
  }

  if (input.format === "md") {
    const content = [
      "# AI Portrait Prompt Export",
      "",
      `- Project: ${input.project.name}`,
      `- Project ID: ${input.project.id}`,
      `- Version: ${input.versionNumber}`,
      `- Timestamp: ${timestamp}`,
      "",
      input.builtPrompt.brief,
      "",
      input.builtPrompt.fullPrompt,
    ].join("\n")
    return { filename, mimeType: "text/markdown;charset=utf-8", content }
  }

  const content = JSON.stringify({
    ...input.builtPrompt.json,
    exportMetadata: {
      projectId: input.project.id,
      version: input.versionNumber,
      timestamp,
    },
  }, null, 2)
  return { filename, mimeType: "application/json;charset=utf-8", content }
}

export function downloadPreparedExport(prepared: PreparedPromptExport): void {
  if (typeof document === "undefined" || typeof URL === "undefined") {
    throw new Error("Browser download is not available")
  }
  const blob = new Blob([prepared.content], { type: prepared.mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = prepared.filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export async function copyPromptToClipboard(prompt: string): Promise<void> {
  if (!navigator.clipboard?.writeText) throw new Error("Clipboard permission is unavailable")
  await navigator.clipboard.writeText(prompt)
}

export async function recordExport(
  projectId: string,
  format: PromptExportFormat,
  filename: string,
  versionId?: string,
): Promise<ExportHistoryRecord> {
  const record: ExportHistoryRecord = {
    id: createPortraitId("export"),
    projectId,
    versionId,
    format,
    filename,
    createdAt: new Date().toISOString(),
  }
  await withStore(PORTRAIT_STORES.exportHistory, "readwrite", async (transaction) => {
    await requestToPromise(transaction.objectStore(PORTRAIT_STORES.exportHistory).add(record))
  })
  return record
}
