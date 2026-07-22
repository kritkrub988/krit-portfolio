/* eslint-disable @next/next/no-img-element */

import { AlertTriangle, CheckCircle2, Pencil } from "lucide-react"
import type { StickerValidationResult } from "@/types/line-sticker"

export type RenderedStickerPreview = {
  filename: string
  blob: Blob
  url: string
  validation: StickerValidationResult
}

type ExportPreviewGridProps = {
  previews: RenderedStickerPreview[]
  selectedIndex: number
  onSelect: (index: number) => void
  onEdit: (index: number) => void
}

export function ExportPreviewGrid({
  previews,
  selectedIndex,
  onSelect,
  onEdit,
}: ExportPreviewGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
      {previews.map((preview, index) => {
        const warning = preview.validation.textOverflow || preview.validation.textNearEdge || !preview.validation.hasTransparency
        return (
          <article key={preview.filename} className={`overflow-hidden rounded-2xl border bg-white p-2 shadow-sm transition ${selectedIndex === index ? "border-violet-500 ring-2 ring-violet-200" : warning ? "border-amber-300" : "border-slate-200"}`}>
            <button type="button" onClick={() => onSelect(index)} aria-pressed={selectedIndex === index} className="sticker-checkerboard block w-full overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500">
              <img src={preview.url} alt={`Preview ไฟล์ ${preview.filename}`} className="aspect-[370/320] w-full object-contain" />
            </button>
            <div className="mt-2 flex items-center justify-between gap-2">
              <strong className="text-xs text-slate-800">{preview.filename}</strong>
              <button type="button" onClick={() => onEdit(index)} className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-[10px] font-bold text-slate-700 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"><Pencil size={12} aria-hidden="true" />แก้ไข</button>
            </div>
            <div className="mt-2 space-y-1 text-[9px] leading-4">
              <p className={`flex items-center gap-1 ${preview.validation.hasTransparency ? "text-emerald-700" : "text-amber-700"}`}>{preview.validation.hasTransparency ? <CheckCircle2 size={12} aria-hidden="true" /> : <AlertTriangle size={12} aria-hidden="true" />}{preview.validation.hasTransparency ? "พบพื้นหลังโปร่งใส" : "ยังไม่พบพื้นที่โปร่งใส"}</p>
              <p className={`flex items-center gap-1 ${preview.validation.textOverflow ? "text-rose-700" : preview.validation.textNearEdge ? "text-amber-700" : "text-emerald-700"}`}>{preview.validation.textOverflow || preview.validation.textNearEdge ? <AlertTriangle size={12} aria-hidden="true" /> : <CheckCircle2 size={12} aria-hidden="true" />}{preview.validation.textOverflow ? "ข้อความล้น Canvas" : preview.validation.textNearEdge ? "ข้อความใกล้ขอบ" : "ข้อความอยู่ใน Safe Area"}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
