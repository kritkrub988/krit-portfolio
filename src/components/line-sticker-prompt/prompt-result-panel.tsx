import { Copy, Download, RotateCcw, WandSparkles } from "lucide-react"

type PromptResultPanelProps = {
  prompt: string
  isDirty: boolean
  onGenerate: () => void
  onCopy: () => void
  onDownload: () => void
  onReset: () => void
}

export function PromptResultPanel({
  prompt,
  isDirty,
  onGenerate,
  onCopy,
  onDownload,
  onReset,
}: PromptResultPanelProps) {
  return (
    <aside aria-labelledby="prompt-result-heading" className="xl:sticky xl:top-24 xl:self-start">
      <div className="overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-xl shadow-violet-100/60">
        <div className="flex items-start justify-between gap-4 border-b border-violet-100 bg-gradient-to-r from-violet-50 via-white to-pink-50 p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-100 text-sm font-extrabold text-violet-700">
              4
            </span>
            <div>
              <h2 id="prompt-result-heading" className="text-xl font-extrabold tracking-tight text-slate-950">
                Prompt พร้อมใช้งาน
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                คัดลอกแล้วนำไปวางพร้อมรูปต้นฉบับใน AI ที่คุณเลือก
              </p>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
              isDirty ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {isDirty ? "มีการแก้ไข" : "อัปเดตแล้ว"}
          </span>
        </div>

        <div className="p-4 sm:p-5">
          {isDirty ? (
            <p className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
              กด “สร้าง Prompt” เพื่ออัปเดตผลลัพธ์ด้วยตัวเลือกล่าสุด
            </p>
          ) : null}
          <pre
            aria-live="polite"
            className="max-h-[600px] min-h-96 overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-slate-950 p-4 font-mono text-[12px] leading-6 text-slate-200 selection:bg-violet-500/40 sm:p-5"
          >
            {prompt}
          </pre>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <button
              type="button"
              onClick={onGenerate}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 sm:col-span-2 xl:col-span-1 2xl:col-span-2"
            >
              <WandSparkles size={17} aria-hidden="true" />
              สร้าง Prompt
            </button>
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 text-xs font-bold text-white transition hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            >
              <Copy size={16} aria-hidden="true" />
              Copy Prompt
            </button>
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            >
              <Download size={16} aria-hidden="true" />
              ดาวน์โหลด .txt
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 sm:col-span-2 xl:col-span-1 2xl:col-span-2"
            >
              <RotateCcw size={16} aria-hidden="true" />
              Reset ทั้งหมด
            </button>
          </div>

          <p className="mt-4 rounded-xl bg-sky-50 px-3 py-2.5 text-[11px] leading-5 text-sky-800">
            เว็บไซต์นี้สร้างเฉพาะข้อความ Prompt และไม่ส่งข้อมูลหรือรูปภาพไปยัง Server
          </p>
        </div>
      </div>
    </aside>
  )
}
