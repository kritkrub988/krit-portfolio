"use client"

import { AlignCenter, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, RotateCw } from "lucide-react"
import { useCallback } from "react"
import { stickerMessageSoftLimit } from "@/data/line-sticker/default-messages"
import { applyTextStyle, createDefaultTextSetting } from "@/lib/line-sticker/sticker-state"
import type {
  BrowserImageAsset,
  StickerTextSettings,
  StickerValidationResult,
} from "@/types/line-sticker"
import { StepNavigation } from "./step-navigation"
import { StickerTextCanvas } from "./sticker-text-canvas"
import { StickerThumbnailList } from "./sticker-thumbnail-list"
import { TextStyleSelector } from "./text-style-selector"

type TextEditorStepProps = {
  assets: BrowserImageAsset[]
  settings: StickerTextSettings[]
  selectedIndex: number
  validationResults: StickerValidationResult[]
  onSelectedIndexChange: (index: number) => void
  onSettingsChange: (settings: StickerTextSettings[]) => void
  onValidationChange: (result: StickerValidationResult) => void
  onBack: () => void
  onNext: () => void
  showToast: (message: string) => void
}

export function TextEditorStep({
  assets,
  settings,
  selectedIndex,
  validationResults,
  onSelectedIndexChange,
  onSettingsChange,
  onValidationChange,
  onBack,
  onNext,
  showToast,
}: TextEditorStepProps) {
  const current = settings[selectedIndex]
  const asset = assets[selectedIndex]
  const currentValidation = validationResults.find((result) => result.stickerId === asset?.id)
  const warningIndexes = new Set(
    validationResults
      .filter((result) => result.textOverflow || result.textNearEdge)
      .map((result) => assets.findIndex((assetItem) => assetItem.id === result.stickerId))
      .filter((index) => index >= 0),
  )

  const updateCurrent = useCallback((next: StickerTextSettings) => {
    onSettingsChange(settings.map((item, index) => index === selectedIndex ? next : item))
  }, [onSettingsChange, selectedIndex, settings])

  if (!asset || !current) return null
  const count = Array.from(current.message).length

  return (
    <section aria-labelledby="text-step-heading" className="space-y-6">
      <div className="rounded-[2rem] border border-pink-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-pink-600">Step 4</p>
          <h2 id="text-step-heading" className="mt-2 text-2xl font-extrabold text-slate-950 sm:text-3xl">ใส่ข้อความภาษาไทยทีละภาพ</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">ข้อความ Render ด้วย Canvas จริงและเก็บค่าของแต่ละภาพแยกกัน ยังไม่ Bake ลง Pixel จนกว่าจะ Preview หรือ Export</p>
        </div>
        <div className="mt-6 border-t border-slate-100 pt-6">
          <TextStyleSelector value={current.styleId} onChange={(styleId) => updateCurrent(applyTextStyle(current, styleId))} />
        </div>
      </div>

      <div className="rounded-[2rem] border border-violet-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[170px_minmax(0,1fr)_320px]">
          <aside className="order-2 min-w-0 lg:order-1"><h3 className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">เลือกภาพ</h3><StickerThumbnailList assets={assets} selectedIndex={selectedIndex} onSelect={onSelectedIndexChange} warningIndexes={warningIndexes} /></aside>

          <div className="order-1 min-w-0 lg:order-2">
            <div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-extrabold text-slate-900">Canvas {asset.filename}</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${currentValidation?.textOverflow ? "bg-rose-100 text-rose-800" : currentValidation?.textNearEdge ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{currentValidation?.textOverflow ? "ข้อความล้น" : currentValidation?.textNearEdge ? "ใกล้ขอบ" : "อยู่ใน Safe Area"}</span></div>
            <StickerTextCanvas asset={asset} settings={current} onSettingsChange={updateCurrent} onValidationChange={onValidationChange} />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" disabled={selectedIndex === 0} onClick={() => onSelectedIndexChange(selectedIndex - 1)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"><ArrowLeft size={15} aria-hidden="true" />ภาพก่อนหน้า</button>
              <button type="button" disabled={selectedIndex === 15} onClick={() => onSelectedIndexChange(selectedIndex + 1)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40">ภาพถัดไป<ArrowRight size={15} aria-hidden="true" /></button>
            </div>
          </div>

          <aside className="order-3 min-w-0 rounded-3xl border border-slate-200 bg-slate-50 p-4 lg:sticky lg:top-24">
            <h3 className="font-extrabold text-slate-900">เครื่องมือข้อความ</h3>
            <label htmlFor="sticker-message" className="mt-4 block text-xs font-bold text-slate-700">ข้อความ
              <textarea id="sticker-message" rows={2} value={current.message} onChange={(event) => updateCurrent({ ...current, message: event.target.value })} className="mt-1 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-base font-semibold text-slate-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </label>
            <p className={`mt-1 text-right text-[10px] font-bold ${count > stickerMessageSoftLimit ? "text-amber-700" : "text-slate-400"}`}>{count}/{stickerMessageSoftLimit}{count > stickerMessageSoftLimit ? " • ข้อความอาจแน่นเกินไป" : ""}</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label htmlFor="text-fill" className="text-xs font-bold text-slate-700">สีตัวอักษร<input id="text-fill" type="color" value={current.fillColor} onChange={(event) => updateCurrent({ ...current, fillColor: event.target.value })} className="mt-1 h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1" /></label>
              <label htmlFor="text-stroke" className="text-xs font-bold text-slate-700">สีขอบ<input id="text-stroke" type="color" value={current.strokeColor} onChange={(event) => updateCurrent({ ...current, strokeColor: event.target.value })} className="mt-1 h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1" /></label>
            </div>
            <RangeControl id="stroke-width" label="ความหนาขอบ" value={current.strokeWidth} min={0} max={14} suffix="px" onChange={(value) => updateCurrent({ ...current, strokeWidth: value })} />
            <RangeControl id="font-size" label="ขนาดตัวอักษร" value={current.fontSize} min={20} max={90} suffix="px" onChange={(value) => updateCurrent({ ...current, fontSize: value })} />
            <RangeControl id="letter-spacing" label="ระยะห่างตัวอักษร" value={current.letterSpacing} min={-2} max={8} suffix="px" onChange={(value) => updateCurrent({ ...current, letterSpacing: value })} />
            <RangeControl id="text-position-x" label="ตำแหน่ง X" value={Math.round(current.x * 100)} min={0} max={100} suffix="%" onChange={(value) => updateCurrent({ ...current, x: value / 100 })} />
            <RangeControl id="text-position-y" label="ตำแหน่ง Y" value={Math.round(current.y * 100)} min={0} max={100} suffix="%" onChange={(value) => updateCurrent({ ...current, y: value / 100 })} />

            <label htmlFor="text-shadow" className="mt-4 flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700"><input id="text-shadow" type="checkbox" checked={current.shadowEnabled} onChange={(event) => updateCurrent({ ...current, shadowEnabled: event.target.checked })} className="h-5 w-5 accent-violet-600" />เปิดเงาข้อความ</label>
            {current.shadowEnabled ? <label htmlFor="shadow-color" className="mt-3 block text-xs font-bold text-slate-700">สีเงา<input id="shadow-color" type="color" value={current.shadowColor} onChange={(event) => updateCurrent({ ...current, shadowColor: event.target.value })} className="mt-1 h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1" /></label> : null}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <ToolButton label="กึ่งกลางแนวนอน" icon={AlignCenter} onClick={() => updateCurrent({ ...current, x: 0.5 })} />
              <ToolButton label="วางด้านบน" icon={ArrowUp} onClick={() => updateCurrent({ ...current, x: 0.5, y: 0.2 })} />
              <ToolButton label="วางด้านล่าง" icon={ArrowDown} onClick={() => updateCurrent({ ...current, x: 0.5, y: 0.82 })} />
              <ToolButton label={`หมุน ${current.rotation}°`} icon={RotateCw} onClick={() => updateCurrent({ ...current, rotation: current.rotation >= 12 ? -12 : current.rotation + 3 })} />
            </div>
            <button type="button" onClick={() => { updateCurrent(createDefaultTextSetting(selectedIndex)); showToast(`Reset ข้อความ ${asset.filename} แล้ว`) }} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500"><RotateCcw size={15} aria-hidden="true" />Reset ข้อความของภาพนี้</button>
          </aside>
        </div>

        {currentValidation?.textOverflow || currentValidation?.textNearEdge ? <p role="status" className={`mt-5 rounded-2xl border px-4 py-3 text-xs leading-6 ${currentValidation.textOverflow ? "border-rose-200 bg-rose-50 text-rose-900" : "border-amber-200 bg-amber-50 text-amber-900"}`}>{currentValidation.textOverflow ? "ข้อความล้นออกนอก Canvas คุณยังบันทึกได้ แต่ควรลดขนาดหรือย้ายตำแหน่ง" : "ข้อความอยู่ใกล้ขอบ Safe Area ควรตรวจให้แน่ใจว่าอ่านครบและไม่บังใบหน้า"}</p> : null}
        <StepNavigation onBack={onBack} onNext={onNext} nextLabel="ตรวจและดาวน์โหลด" helperText="ค่าข้อความและ Style ของทั้ง 16 ภาพถูกเก็บแยกกันในหน่วยความจำของ Browser" />
      </div>
    </section>
  )
}

function RangeControl({ id, label, value, min, max, suffix, onChange }: { id: string; label: string; value: number; min: number; max: number; suffix: string; onChange: (value: number) => void }) {
  return <label htmlFor={id} className="mt-4 block text-xs font-bold text-slate-700">{label}: {value}{suffix}<input id={id} type="range" min={min} max={max} step={1} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-2 h-11 w-full cursor-pointer accent-violet-600" /></label>
}

function ToolButton({ label, icon: Icon, onClick }: { label: string; icon: typeof AlignCenter; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 text-[10px] font-bold text-slate-700 hover:border-violet-200 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"><Icon size={14} aria-hidden="true" />{label}</button>
}
