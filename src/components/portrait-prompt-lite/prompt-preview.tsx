"use client"

import { Check, Copy, Download, RotateCcw } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { downloadPortraitPrompt } from "@/lib/portrait-lite/export-prompt"
import type { PortraitSelection } from "@/types/portrait-lite"

type PromptPreviewProps = {
  prompt: string
  selection: PortraitSelection
  onReset: () => void
}

function fallbackCopy(text: string) {
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand("copy")
  textarea.remove()
  if (!copied) throw new Error("Copy command was not accepted")
}

export function PromptPreview({ prompt, selection, onReset }: PromptPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
  }, [])

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt)
      } else {
        fallbackCopy(prompt)
      }
      setCopied(true)
      setCopyError(false)
      if (resetTimer.current) clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      try {
        fallbackCopy(prompt)
        setCopied(true)
        setCopyError(false)
        if (resetTimer.current) clearTimeout(resetTimer.current)
        resetTimer.current = setTimeout(() => setCopied(false), 2000)
      } catch {
        setCopyError(true)
      }
    }
  }

  return (
    <aside className="lg:sticky lg:top-6 lg:self-start" aria-labelledby="prompt-preview-heading">
      <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-950/90 shadow-2xl shadow-slate-950/40">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400">
              Live output
            </p>
            <h2 id="prompt-preview-heading" className="mt-1 font-semibold text-white">
              Prompt Preview
            </h2>
          </div>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">
            อัปเดตทันที
          </span>
        </div>

        <pre
          aria-live="polite"
          className="max-h-[58vh] min-h-96 overflow-auto whitespace-pre-wrap break-words p-5 font-mono text-[13px] leading-6 text-slate-300"
        >
          {prompt}
        </pre>

        <div className="grid gap-2 border-t border-slate-800 bg-slate-950 p-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          <button
            type="button"
            onClick={handleCopy}
            aria-label="คัดลอก Prompt"
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 focus-visible:outline-violet-300"
          >
            {copied ? <Check aria-hidden="true" size={17} /> : <Copy aria-hidden="true" size={17} />}
            {copied ? "Copied" : "Copy Prompt"}
          </button>
          <button
            type="button"
            onClick={() => downloadPortraitPrompt(selection, prompt)}
            aria-label="ส่งออก Prompt เป็นไฟล์ TXT"
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-900 focus-visible:outline-violet-300"
          >
            <Download aria-hidden="true" size={17} />
            Export TXT
          </button>
          <button
            type="button"
            onClick={onReset}
            aria-label="คืนค่าตัวเลือกเริ่มต้น"
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:bg-slate-900 focus-visible:outline-violet-300"
          >
            <RotateCcw aria-hidden="true" size={17} />
            Reset
          </button>
        </div>
        {copyError ? (
          <p role="alert" className="px-4 pb-4 text-xs text-rose-300">
            ไม่สามารถคัดลอกอัตโนมัติได้ กรุณาเลือกข้อความใน Preview แล้วคัดลอกด้วยตนเอง
          </p>
        ) : null}
      </div>
    </aside>
  )
}
