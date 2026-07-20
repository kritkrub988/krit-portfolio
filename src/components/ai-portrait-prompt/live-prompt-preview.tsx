"use client"

import { useState } from "react"
import type { BuiltPrompt, PromptBlockKey, PromptVersion } from "@/types/ai-portrait"

type PreviewTab = "blocks" | "brief" | "final" | "versions"

type LivePromptPreviewProps = {
  builtPrompt: BuiltPrompt
  canUseFinal: boolean
  saveStatus: "idle" | "saving" | "saved" | "error"
  versions: PromptVersion[]
  highlightedBlock?: PromptBlockKey
  onCopyPrompt: () => void
  onCopyBlock: (content: string) => void
  onSaveVersion: () => void
  onExport: (format: "txt" | "md" | "json") => void
  onReset: () => void
  onCopyVersion: (version: PromptVersion) => void
  onExportVersion: (version: PromptVersion) => void
  onRestoreVersion: (version: PromptVersion) => void
  onDeleteVersion: (version: PromptVersion) => void
}

export function LivePromptPreview({ builtPrompt, canUseFinal, saveStatus, versions, highlightedBlock, onCopyPrompt, onCopyBlock, onSaveVersion, onExport, onReset, onCopyVersion, onExportVersion, onRestoreVersion, onDeleteVersion }: LivePromptPreviewProps) {
  const [tab, setTab] = useState<PreviewTab>("blocks")
  const tabs: Array<[PreviewTab, string]> = [["blocks", "Live Blocks"], ["brief", "Brief"], ["final", "Final Prompt"], ["versions", `Versions (${versions.length})`]]
  return (
    <aside className="flex h-full min-h-[36rem] flex-col border-l border-slate-200 bg-slate-950 text-slate-100 lg:max-h-[calc(100vh-4rem)]">
      <div className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/95 p-4 backdrop-blur">
        <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-blue-300">Live Prompt Preview</p><p aria-live="polite" className={`mt-1 text-xs ${saveStatus === "error" ? "text-rose-300" : "text-slate-400"}`}>{saveStatus === "saving" ? "กำลังบันทึก…" : saveStatus === "saved" ? "บันทึกแล้ว" : saveStatus === "error" ? "บันทึกไม่สำเร็จ — ลองแก้คำตอบอีกครั้งเพื่อ Retry" : "พร้อมใช้งาน"}</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${canUseFinal ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-200"}`}>{canUseFinal ? "BRIEF APPROVED" : "DRAFT"}</span></div>
        <div className="mt-4 flex gap-1 overflow-x-auto" role="tablist" aria-label="Prompt preview modes">
          {tabs.map(([value, label]) => <button key={value} type="button" role="tab" aria-selected={tab === value} onClick={() => setTab(value)} className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-bold ${tab === value ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10"}`}>{label}</button>)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "blocks" ? <div className="space-y-3" aria-live="polite">{builtPrompt.blocks.map((block) => <details key={block.key} open className={`rounded-2xl border bg-white/5 transition ${highlightedBlock === block.key ? "border-blue-400 ring-2 ring-blue-400/25" : "border-white/10"}`}><summary className="cursor-pointer px-4 py-3 text-sm font-bold text-blue-200">{block.title}{highlightedBlock === block.key ? <span className="ml-2 text-[10px] uppercase tracking-wider text-blue-300">updated</span> : null}</summary><div className="border-t border-white/10 p-4"><pre className="whitespace-pre-wrap font-mono text-xs leading-6 text-slate-300">{block.content}</pre><button type="button" onClick={() => onCopyBlock(block.content)} className="mt-3 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold hover:bg-white/10">Copy Block</button></div></details>)}</div> : null}
        {tab === "brief" ? <pre className="whitespace-pre-wrap font-mono text-xs leading-6 text-slate-300">{builtPrompt.brief}</pre> : null}
        {tab === "final" ? canUseFinal ? <pre className="whitespace-pre-wrap font-mono text-xs leading-6 text-slate-300">{builtPrompt.fullPrompt}</pre> : <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-6 text-amber-100">Final Prompt จะเปิดหลังจากตอบ Required Steps และอนุมัติ Brief ที่ Phase 9 แล้ว Live Blocks และ Brief ยังอัปเดตแบบเรียลไทม์ได้ตามปกติ</div> : null}
        {tab === "versions" ? versions.length === 0 ? <p className="rounded-2xl border border-dashed border-white/15 p-6 text-sm text-slate-400">ยังไม่มี Prompt Version — ระบบจะสร้าง V001 อัตโนมัติเมื่ออนุมัติ Brief</p> : <div className="space-y-3">{versions.map((version) => <article key={version.id} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex items-center justify-between"><h3 className="font-bold">Version {version.versionNumber.toString().padStart(3, "0")}</h3><time className="text-xs text-slate-400">{new Date(version.createdAt).toLocaleString("th-TH")}</time></div><p className="mt-2 text-xs text-slate-400">{version.snapshot.selectedModelId ?? "No model"} · {version.snapshot.selectedRecipeId ?? "No recipe"}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => onCopyVersion(version)} className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-bold">Copy</button><button type="button" onClick={() => onExportVersion(version)} className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-bold">Export MD</button><button type="button" onClick={() => onRestoreVersion(version)} className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-bold">Restore as Draft</button><button type="button" onClick={() => onDeleteVersion(version)} className="rounded-lg border border-rose-400/30 px-2.5 py-1.5 text-xs font-bold text-rose-300">Delete</button></div></article>)}</div> : null}
      </div>

      <div className="border-t border-white/10 bg-slate-950 p-4">
        <div className="grid grid-cols-2 gap-2">
          <button type="button" disabled={!canUseFinal} onClick={onCopyPrompt} className="rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white disabled:opacity-40">Copy Prompt</button>
          <button type="button" disabled={!canUseFinal} onClick={onSaveVersion} className="rounded-xl bg-violet-600 px-3 py-2.5 text-xs font-bold text-white disabled:opacity-40">Save Version</button>
          <button type="button" disabled={!canUseFinal} onClick={() => onExport("txt")} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-bold disabled:opacity-40">TXT</button>
          <button type="button" disabled={!canUseFinal} onClick={() => onExport("md")} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-bold disabled:opacity-40">Markdown</button>
          <button type="button" disabled={!canUseFinal} onClick={() => onExport("json")} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-bold disabled:opacity-40">JSON</button>
          <button type="button" onClick={onReset} className="rounded-xl border border-rose-400/30 px-3 py-2 text-xs font-bold text-rose-300">Reset</button>
        </div>
        {canUseFinal ? <p className="mt-3 text-center text-xs leading-5 text-emerald-300">Prompt พร้อมแล้ว คัดลอกไปวางใน ChatGPT Project เพื่อทำงานขั้นต่อไป</p> : null}
      </div>
    </aside>
  )
}
