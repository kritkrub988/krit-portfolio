/* eslint-disable @next/next/no-img-element */
"use client"

import { Crop, FileImage, Grid3X3, ImagePlus, RotateCcw, ScanLine } from "lucide-react"
import { useRef, useState } from "react"
import { defaultCropSettings } from "@/lib/line-sticker/crop-sticker-grid"
import {
  createSourceGridImage,
  cropGridImage,
  suggestCropSettings,
} from "@/lib/line-sticker/image-browser-utils"
import type { BrowserImageAsset, CropSettings, SourceGridImage } from "@/types/line-sticker"
import { GridCropCanvas } from "./grid-crop-canvas"
import { StepNavigation } from "./step-navigation"

const cropFields: Array<{ key: keyof CropSettings; label: string }> = [
  { key: "marginLeft", label: "ระยะขอบซ้าย" },
  { key: "marginRight", label: "ระยะขอบขวา" },
  { key: "marginTop", label: "ระยะขอบบน" },
  { key: "marginBottom", label: "ระยะขอบล่าง" },
  { key: "gapX", label: "ช่องว่างแนวนอน" },
  { key: "gapY", label: "ช่องว่างแนวตั้ง" },
]

type GridCropStepProps = {
  source: SourceGridImage | null
  cropSettings: CropSettings
  croppedStickers: BrowserImageAsset[]
  onSourceChange: (source: SourceGridImage) => void
  onCropSettingsChange: (settings: CropSettings) => void
  onCroppedChange: (assets: BrowserImageAsset[]) => void
  onBack: () => void
  onNext: () => void
  showToast: (message: string) => void
}

export function GridCropStep({
  source,
  cropSettings,
  croppedStickers,
  onSourceChange,
  onCropSettingsChange,
  onCroppedChange,
  onBack,
  onNext,
  showToast,
}: GridCropStepProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function selectFile(file: File | undefined) {
    if (!file) return
    setBusy(true)
    setError("")
    try {
      const asset = await createSourceGridImage(file)
      onSourceChange(asset)
      showToast("เปิดภาพใน Browser แล้ว")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "ไม่สามารถเปิดไฟล์ภาพนี้ได้")
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  async function handleAutomaticLines() {
    if (!source) return
    setBusy(true)
    setError("")
    try {
      const suggested = await suggestCropSettings(source)
      onCropSettingsChange(suggested)
      showToast("คำนวณเส้นตัดอัตโนมัติแล้ว กรุณาตรวจ Preview")
    } catch {
      onCropSettingsChange({ ...defaultCropSettings })
      showToast("ใช้การแบ่งเท่า ๆ กันเป็นค่าเริ่มต้น")
    } finally {
      setBusy(false)
    }
  }

  async function cropStickers() {
    if (!source) return
    setBusy(true)
    setError("")
    try {
      const assets = await cropGridImage(source, cropSettings)
      onCroppedChange(assets)
      showToast("ตัดภาพครบ 16 ภาพแล้ว")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "ไม่สามารถตัดภาพได้")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section aria-labelledby="crop-step-heading" className="rounded-[2rem] border border-sky-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">Step 2</p>
          <h2 id="crop-step-heading" className="mt-2 text-2xl font-extrabold text-slate-950 sm:text-3xl">เลือกภาพและตัดตาราง 4×4</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">รองรับ PNG, JPG, JPEG และ WebP สูงสุด 20 MB ระบบ Crop จาก Pixel ต้นฉบับโดยไม่ Resize ก่อนตัด</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">
          <FileImage size={15} aria-hidden="true" />
          ประมวลผลใน Browser เท่านั้น
        </span>
      </div>

      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp" className="sr-only" aria-label="เลือกภาพตารางสติกเกอร์ 4 คูณ 4" onChange={(event) => void selectFile(event.target.files?.[0])} />

      {!source ? (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="mt-7 flex min-h-56 w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-pink-200 bg-gradient-to-br from-pink-50 via-white to-sky-50 p-6 text-center transition hover:border-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:opacity-50">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-pink-600 shadow-sm"><ImagePlus size={27} aria-hidden="true" /></span>
          <span className="mt-4 text-base font-extrabold text-slate-900">เลือกภาพ 4×4 จากเครื่อง</span>
          <span className="mt-2 max-w-lg text-xs leading-6 text-slate-500">ภาพจะถูกเปิดและประมวลผลใน Browser เท่านั้น ไม่ถูกส่งขึ้น Server</span>
        </button>
      ) : (
        <div className="mt-7 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <GridCropCanvas source={source} settings={cropSettings} />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>{source.filename} • {source.width}×{source.height}px • {(source.fileSize / 1024 / 1024).toFixed(2)} MB</span>
              <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 font-bold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500"><ImagePlus size={15} aria-hidden="true" />เปลี่ยนภาพต้นฉบับ</button>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5 xl:sticky xl:top-24">
            <div className="flex items-center gap-2"><ScanLine size={19} className="text-sky-600" aria-hidden="true" /><h3 className="font-extrabold text-slate-900">ปรับเส้นตัด (Pixel)</h3></div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {cropFields.map((field) => {
                const id = `crop-${field.key}`
                return (
                  <label key={field.key} htmlFor={id} className="text-xs font-bold text-slate-700">
                    {field.label}
                    <input id={id} type="number" min={0} step={1} value={cropSettings[field.key]} onChange={(event) => onCropSettingsChange({ ...cropSettings, [field.key]: Math.max(0, Number(event.target.value) || 0) })} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
                  </label>
                )
              })}
            </div>
            <div className="mt-4 grid gap-2">
              <button type="button" onClick={() => void handleAutomaticLines()} disabled={busy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-3 text-xs font-bold text-white hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50"><Grid3X3 size={16} aria-hidden="true" />ใช้เส้นตัดอัตโนมัติ</button>
              <button type="button" onClick={() => onCropSettingsChange({ ...defaultCropSettings })} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500"><RotateCcw size={15} aria-hidden="true" />คืนค่าการตัด</button>
              <button type="button" onClick={() => void cropStickers()} disabled={busy} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 px-3 text-sm font-bold text-white shadow-lg shadow-pink-100 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:opacity-50"><Crop size={17} aria-hidden="true" />{busy ? "กำลังประมวลผล…" : "ตัดเป็น 16 ภาพ"}</button>
            </div>
          </aside>
        </div>
      )}

      {error ? <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">{error}</p> : null}

      {croppedStickers.length === 16 ? (
        <div className="mt-8">
          <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-extrabold text-slate-950">Preview หลังตัด 16 ภาพ</h3><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">ครบ 01.png–16.png</span></div>
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8 lg:grid-cols-16">
            {croppedStickers.map((sticker) => <figure key={sticker.id} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1"><img src={sticker.url} alt={`ภาพที่ตัดแล้ว ${sticker.filename}`} className="aspect-square w-full object-contain" /><figcaption className="mt-1 text-center text-[9px] font-bold text-slate-600">{sticker.filename}</figcaption></figure>)}
          </div>
        </div>
      ) : null}

      <StepNavigation onBack={onBack} onNext={onNext} nextDisabled={croppedStickers.length !== 16} nextLabel="ไปลบพื้นหลัง" helperText={croppedStickers.length === 16 ? "ภาพทั้ง 16 พร้อมส่งต่อโดยยังเก็บต้นฉบับ Crop ไว้สำหรับ Undo" : "ตัดภาพให้ครบ 16 ภาพก่อนเข้าสู่ขั้นถัดไป"} />
    </section>
  )
}
