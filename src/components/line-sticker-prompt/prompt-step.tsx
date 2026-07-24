"use client"

import { Copy, Download, Info, RotateCcw } from "lucide-react"
import {
  stickerPackModeLabels,
} from "@/data/line-sticker/sticker-packs"
import type { StickerPack, StickerVisualStyle } from "@/types/line-sticker"
import { copyTextToClipboard, downloadTextFile } from "@/lib/line-sticker/browser-utils"
import { stickerImagePromptFilename } from "@/lib/line-sticker/build-sticker-image-prompt"
import { StepNavigation } from "./step-navigation"
import { StickerPackItemsPreview } from "./sticker-pack-items-preview"
import { StickerPackSelector } from "./sticker-pack-selector"
import { VisualStyleSelector } from "./visual-style-selector"

type PromptStepProps = {
  selectedStickerPack: StickerPack
  selectedVisualStyle: StickerVisualStyle
  generatedPrompt: string
  onStickerPackChange: (stickerPackId: string) => void
  onVisualStyleChange: (visualStyleId: string) => void
  onReset: () => void
  onNext: () => void
  showToast: (message: string) => void
}

export function PromptStep({
  selectedStickerPack,
  selectedVisualStyle,
  generatedPrompt,
  onStickerPackChange,
  onVisualStyleChange,
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
    <section aria-label="สร้าง Prompt" className="space-y-6">
      <div className="rounded-[2rem] border border-pink-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <StickerPackSelector
          value={selectedStickerPack.id}
          onChange={onStickerPackChange}
        />
      </div>

      <div className="rounded-[2rem] border border-violet-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <VisualStyleSelector
          value={selectedVisualStyle.id}
          onChange={onVisualStyleChange}
        />
      </div>

      <div className="rounded-[2rem] border border-sky-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <StickerPackItemsPreview selectedStickerPack={selectedStickerPack} />
      </div>

      <section
        aria-labelledby="prompt-ready-heading"
        className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8"
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
          Ready to use
        </p>
        <h2
          id="prompt-ready-heading"
          className="mt-1 text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl"
        >
          4. Prompt พร้อมใช้
        </h2>

        <dl className="mt-5 grid gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-bold text-slate-500">ชุดสติกเกอร์</dt>
            <dd className="mt-1 text-sm font-extrabold text-slate-950">
              {selectedStickerPack.name}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-slate-500">สไตล์ภาพ</dt>
            <dd className="mt-1 text-sm font-extrabold text-slate-950">
              {selectedVisualStyle.nameEnglish}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-slate-500">จำนวน</dt>
            <dd className="mt-1 text-sm font-extrabold text-slate-950">16 ภาพ</dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-slate-500">ประเภทตัวละคร</dt>
            <dd className="mt-1 text-sm font-extrabold text-slate-950">
              {stickerPackModeLabels[selectedStickerPack.characterMode]}
            </dd>
          </div>
        </dl>

        <div className="mt-5 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <pre className="max-h-[620px] overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200 selection:bg-emerald-500/40 sm:p-5">
            {generatedPrompt}
          </pre>

          <aside className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-sky-50 p-5 lg:sticky lg:top-24">
            <h3 className="text-lg font-extrabold text-slate-950">
              นำ Prompt ไปใช้อย่างไร
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              นำ Prompt นี้ไปวางใน ChatGPT, Gemini หรือ AI สร้างภาพที่รองรับรูปอ้างอิง พร้อมแนบรูปต้นฉบับของคุณ เมื่อได้ภาพ 4×4 แล้ว ให้นำภาพกลับมาตัดและแต่งต่อในขั้นถัดไป
            </p>
            <div className="mt-5 grid gap-2">
              <button
                type="button"
                onClick={copyPrompt}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white transition hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              >
                <Copy size={17} aria-hidden="true" />
                Copy Prompt
              </button>
              <button
                type="button"
                onClick={() => {
                  downloadTextFile(stickerImagePromptFilename, generatedPrompt)
                  showToast("ดาวน์โหลด Prompt แล้ว")
                }}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500"
              >
                <Download size={17} aria-hidden="true" />
                ดาวน์โหลดเป็น .txt
              </button>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500"
              >
                <RotateCcw size={15} aria-hidden="true" />
                คืนค่าเริ่มต้น
              </button>
            </div>
            <div className="mt-5 flex gap-3 rounded-2xl border border-sky-200 bg-white/80 p-4 text-xs leading-6 text-sky-900">
              <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              เป้าหมายคือให้ตัวละครอ้างอิงจากรูปและดูสม่ำเสมอทั้งชุด ไม่ใช่การรับประกันความเหมือน 100%
            </div>
          </aside>
        </div>
      </section>

      <StepNavigation
        onNext={onNext}
        nextLabel="ไปเลือกและตัดภาพ"
        helperText="เมื่อได้ภาพ 4×4 จาก AI แล้ว ให้กลับมาเลือกภาพในขั้นถัดไป"
      />
    </section>
  )
}
