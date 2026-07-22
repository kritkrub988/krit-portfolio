"use client"

import { Copy, Download, Info, RotateCcw, WandSparkles } from "lucide-react"
import { stickerImagePromptFilename } from "@/lib/line-sticker/build-sticker-image-prompt"
import { copyTextToClipboard, downloadTextFile } from "@/lib/line-sticker/browser-utils"
import { StepNavigation } from "./step-navigation"
import { ThemeSelector } from "./theme-selector"

type PromptStepProps = {
  themeId: string
  generatedPrompt: string
  isDirty: boolean
  onThemeChange: (themeId: string) => void
  onGenerate: () => void
  onReset: () => void
  onNext: () => void
  showToast: (message: string) => void
}

export function PromptStep({
  themeId,
  generatedPrompt,
  isDirty,
  onThemeChange,
  onGenerate,
  onReset,
  onNext,
  showToast,
}: PromptStepProps) {
  async function copyPrompt() {
    try {
      await copyTextToClipboard(generatedPrompt)
      showToast("คัดลอก Prompt แล้ว")
    } catch {
      showToast("คัดลอกไม่สำเร็จ กรุณาเลือกข้อความแล้วคัดลอกเอง")
    }
  }

  return (
    <section aria-labelledby="prompt-step-heading" className="space-y-6">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <ThemeSelector value={themeId} onChange={onThemeChange} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-[2rem] border border-violet-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Step 1</p>
              <h2 id="prompt-step-heading" className="mt-2 text-2xl font-extrabold text-slate-950">
                Prompt สำหรับสร้างภาพล้วน 16 อารมณ์
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                ไม่มีข้อความในภาพ เพื่อให้ตัด ลบพื้นหลัง และใส่ภาษาไทยใน Browser ได้แม่นกว่า
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${isDirty ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
              {isDirty ? "Theme เปลี่ยนแล้ว" : "พร้อมใช้งาน"}
            </span>
          </div>
          {isDirty ? (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
              กด “สร้าง Prompt” เพื่ออัปเดต Theme ล่าสุดก่อน Copy
            </p>
          ) : null}
          <pre className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200 selection:bg-violet-500/40 sm:p-5">
            {generatedPrompt}
          </pre>
        </div>

        <aside className="rounded-[2rem] border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-sky-50 p-5 shadow-sm lg:sticky lg:top-24">
          <h3 className="text-lg font-extrabold text-slate-950">นำ Prompt ไปใช้อย่างไร</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            คัดลอก Prompt แล้วนำไปวางพร้อมรูปอ้างอิงใน ChatGPT หรือ Gemini ด้วยตัวเอง เว็บไซต์ไม่ได้สร้างภาพด้วย AI โดยตรง
          </p>
          <div className="mt-5 grid gap-2">
            <button type="button" onClick={onGenerate} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
              <WandSparkles size={17} aria-hidden="true" />
              สร้าง Prompt
            </button>
            <button type="button" onClick={copyPrompt} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white transition hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600">
              <Copy size={17} aria-hidden="true" />
              Copy Prompt
            </button>
            <button type="button" onClick={() => { downloadTextFile(stickerImagePromptFilename, generatedPrompt); showToast("ดาวน์โหลด Prompt แล้ว") }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500">
              <Download size={17} aria-hidden="true" />
              ดาวน์โหลดเป็น .txt
            </button>
            <button type="button" onClick={onReset} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500">
              <RotateCcw size={15} aria-hidden="true" />
              คืนค่าเริ่มต้น
            </button>
          </div>
          <div className="mt-5 flex gap-3 rounded-2xl border border-sky-200 bg-white/80 p-4 text-xs leading-6 text-sky-900">
            <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            เป้าหมายคือให้ตัวละครอ้างอิงจากคนในรูปและดูเป็นคนเดียวกันทั้งชุด ไม่ใช่การรับประกันใบหน้าเหมือน 100%
          </div>
        </aside>
      </div>

      <StepNavigation onNext={onNext} nextLabel="ไปเลือกและตัดภาพ" helperText="เมื่อได้ภาพ 4×4 จาก AI แล้ว ให้กลับมาเลือกภาพในขั้นถัดไป" />
    </section>
  )
}
