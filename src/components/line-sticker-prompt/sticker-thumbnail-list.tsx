/* eslint-disable @next/next/no-img-element */

import { Check } from "lucide-react"
import type { BrowserImageAsset } from "@/types/line-sticker"

type StickerThumbnailListProps = {
  assets: BrowserImageAsset[]
  selectedIndex: number
  onSelect: (index: number) => void
  warningIndexes?: Set<number>
}

export function StickerThumbnailList({
  assets,
  selectedIndex,
  onSelect,
  warningIndexes = new Set(),
}: StickerThumbnailListProps) {
  return (
    <div className="flex min-w-0 max-w-full gap-2 overflow-x-auto pb-2 lg:grid lg:max-h-[640px] lg:grid-cols-2 lg:overflow-y-auto lg:pr-1" aria-label="รายการสติกเกอร์ 01 ถึง 16">
      {assets.map((asset, index) => {
        const active = index === selectedIndex
        const warning = warningIndexes.has(index)
        return (
          <button key={asset.id} type="button" aria-pressed={active} onClick={() => onSelect(index)} className={`relative w-20 shrink-0 rounded-2xl border p-1.5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 lg:w-auto ${active ? "border-violet-500 bg-violet-50 ring-2 ring-violet-200" : warning ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white hover:border-violet-200"}`}>
            <img src={asset.url} alt={`Thumbnail ${asset.filename}`} className="sticker-checkerboard aspect-square w-full rounded-xl object-contain" />
            <span className="mt-1 block text-[10px] font-extrabold text-slate-700">{asset.filename}</span>
            {!warning ? <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-600 text-white"><Check size={11} strokeWidth={3} aria-hidden="true" /></span> : <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-amber-500 text-[10px] font-black text-white">!</span>}
          </button>
        )
      })}
    </div>
  )
}
