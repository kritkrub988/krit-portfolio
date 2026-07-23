/* eslint-disable @next/next/no-img-element */
"use client"

import { Check, Pipette, RotateCcw, Sparkles, Undo2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import {
  createTransparentAsset,
  getAutomaticBackgroundColor,
  removeBackgroundFromBlob,
} from "@/lib/line-sticker/image-browser-utils"
import { createDefaultBackgroundRemovalSettings } from "@/lib/line-sticker/sticker-state"
import type {
  BackgroundRemovalSettings,
  BrowserImageAsset,
  RgbColor,
} from "@/types/line-sticker"
import { BackgroundPreview } from "./background-preview"
import { StepNavigation } from "./step-navigation"

function colorToHex(color: RgbColor) {
  return `#${[color.r, color.g, color.b].map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0")).join("")}`
}

function hexToColor(hex: string): RgbColor {
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16),
  }
}

type BackgroundRemovalStepProps = {
  croppedStickers: BrowserImageAsset[]
  transparentStickers: Array<BrowserImageAsset | null>
  settings: BackgroundRemovalSettings
  onSettingsChange: (settings: BackgroundRemovalSettings) => void
  onTransparentChange: (assets: Array<BrowserImageAsset | null>) => void
  onBack: () => void
  onNext: () => void
  showToast: (message: string) => void
}

export function BackgroundRemovalStep({
  croppedStickers,
  transparentStickers,
  settings,
  onSettingsChange,
  onTransparentChange,
  onBack,
  onNext,
  showToast,
}: BackgroundRemovalStepProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [previewUrl, setPreviewUrl] = useState("")
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const previewUrlRef = useRef("")
  const selected = croppedStickers[selectedIndex]
  const completedCount = transparentStickers.filter(Boolean).length

  useEffect(() => {
    let cancelled = false
    const timer = window.setTimeout(() => {
      if (!selected) return
      void removeBackgroundFromBlob(selected.blob, settings)
        .then((blob) => {
          if (cancelled) return
          const url = URL.createObjectURL(blob)
          if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
          previewUrlRef.current = url
          setPreviewBlob(blob)
          setPreviewUrl(url)
        })
        .catch((cause) => {
          if (!cancelled) setError(cause instanceof Error ? cause.message : "สร้าง Preview ไม่สำเร็จ")
        })
    }, 80)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [selected, settings])

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
  }, [])

  async function autoPickColor() {
    if (!selected) return
    setBusy(true)
    try {
      const color = await getAutomaticBackgroundColor(selected.blob)
      onSettingsChange({ ...settings, color })
      showToast("เลือกสีจากมุมภาพอัตโนมัติแล้ว")
    } catch {
      setError("ไม่สามารถอ่านสีจากมุมภาพได้")
    } finally {
      setBusy(false)
    }
  }

  function applyCurrent() {
    if (!selected || !previewBlob) return
    const next = [...transparentStickers]
    if (next[selectedIndex]?.url) URL.revokeObjectURL(next[selectedIndex]!.url)
    next[selectedIndex] = { ...selected, blob: previewBlob, url: URL.createObjectURL(previewBlob) }
    onTransparentChange(next)
    showToast(`ใช้ค่ากับ ${selected.filename} แล้ว`)
  }

  async function applyAll() {
    setBusy(true)
    setError("")
    const created: BrowserImageAsset[] = []
    try {
      for (let index = 0; index < croppedStickers.length; index += 1) {
        created.push(await createTransparentAsset(croppedStickers[index], settings))
        if ((index + 1) % 4 === 0) await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      }
      transparentStickers.forEach((asset) => { if (asset?.url) URL.revokeObjectURL(asset.url) })
      onTransparentChange(created)
      showToast("ใช้ค่าลบพื้นหลังกับทั้ง 16 ภาพแล้ว")
    } catch (cause) {
      created.forEach((asset) => URL.revokeObjectURL(asset.url))
      setError(cause instanceof Error ? cause.message : "ลบพื้นหลังทั้งชุดไม่สำเร็จ")
    } finally {
      setBusy(false)
    }
  }

  function undoCurrent() {
    const next = [...transparentStickers]
    if (next[selectedIndex]?.url) URL.revokeObjectURL(next[selectedIndex]!.url)
    next[selectedIndex] = null
    onTransparentChange(next)
    showToast(`คืน ${selected.filename} เป็นภาพ Crop ต้นฉบับแล้ว`)
  }

  return (
    <section aria-labelledby="background-step-heading" className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Step 3</p>
          <h2 id="background-step-heading" className="mt-2 text-2xl font-extrabold text-slate-950 sm:text-3xl">ลบพื้นหลังสีเรียบ</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">เหมาะกับพื้นหลังสีขาว สีอ่อน หรือสีเดียวใกล้เคียงกัน ระบบจะคำนวณใหม่จากภาพ Crop ต้นฉบับทุกครั้ง</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-800">เสร็จแล้ว {completedCount}/16</span>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="เลือกภาพสำหรับลบพื้นหลัง">
        {croppedStickers.map((sticker, index) => {
          const active = index === selectedIndex
          const applied = Boolean(transparentStickers[index])
          return (
            <button key={sticker.id} type="button" onClick={() => setSelectedIndex(index)} aria-pressed={active} className={`relative w-20 shrink-0 rounded-2xl border p-1.5 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${active ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200" : "border-slate-200 bg-white"}`}>
              <img src={transparentStickers[index]?.url ?? sticker.url} alt={`Thumbnail ${sticker.filename}`} className="sticker-checkerboard aspect-square w-full rounded-xl object-contain" />
              <span className="mt-1 block text-[10px] font-bold text-slate-700">{sticker.filename}</span>
              {applied ? <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-600 text-white"><Check size={12} strokeWidth={3} aria-hidden="true" /></span> : null}
            </button>
          )
        })}
      </div>

      {selected ? (
        <div className="mt-5 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <BackgroundPreview sourceBlob={selected.blob} previewUrl={previewUrl} filename={selected.filename} onPickColor={(color) => onSettingsChange({ ...settings, color })} />

          <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5 xl:sticky xl:top-24">
            <h3 className="flex items-center gap-2 font-extrabold text-slate-900"><Pipette size={18} className="text-violet-600" aria-hidden="true" />ตั้งค่าพื้นหลัง</h3>
            <label htmlFor="background-color" className="mt-4 block text-xs font-bold text-slate-700">สีพื้นหลัง
              <span className="mt-1 flex items-center gap-2"><input id="background-color" type="color" value={colorToHex(settings.color)} onChange={(event) => onSettingsChange({ ...settings, color: hexToColor(event.target.value) })} className="h-12 w-16 cursor-pointer rounded-xl border border-slate-200 bg-white p-1" /><code className="text-xs text-slate-500">{colorToHex(settings.color).toUpperCase()}</code></span>
            </label>
            <button type="button" onClick={() => void autoPickColor()} disabled={busy} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-3 text-xs font-bold text-violet-700 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 disabled:opacity-50"><Sparkles size={15} aria-hidden="true" />เลือกสีจากมุมภาพอัตโนมัติ</button>

            <label htmlFor="color-tolerance" className="mt-5 block text-xs font-bold text-slate-700">Color Tolerance: {settings.tolerance}
              <input id="color-tolerance" type="range" min={0} max={180} step={1} value={settings.tolerance} onChange={(event) => onSettingsChange({ ...settings, tolerance: Number(event.target.value) })} className="mt-2 h-11 w-full cursor-pointer accent-violet-600" />
            </label>
            <label htmlFor="edge-connected" className="mt-3 flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700"><input id="edge-connected" type="checkbox" checked={settings.edgeConnected} onChange={(event) => onSettingsChange({ ...settings, edgeConnected: event.target.checked })} className="h-5 w-5 accent-emerald-600" />ลบเฉพาะพื้นที่ที่เชื่อมต่อกับขอบภาพ</label>
            <label htmlFor="feather" className="mt-4 block text-xs font-bold text-slate-700">Feather ขอบ: {settings.feather}px
              <input id="feather" type="range" min={0} max={5} step={1} value={settings.feather} onChange={(event) => onSettingsChange({ ...settings, feather: Number(event.target.value) })} className="mt-2 h-11 w-full cursor-pointer accent-pink-500" />
            </label>

            <div className="mt-4 grid gap-2">
              <button type="button" onClick={applyCurrent} disabled={!previewBlob || busy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-45"><Check size={15} aria-hidden="true" />ใช้ค่ากับภาพนี้</button>
              <button type="button" onClick={() => void applyAll()} disabled={busy} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 px-3 text-sm font-bold text-white shadow-lg shadow-pink-100 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:opacity-45"><RotateCcw size={16} aria-hidden="true" />{busy ? "กำลังประมวลผล…" : "ใช้ค่ากับทั้ง 16 ภาพ"}</button>
              <button type="button" onClick={undoCurrent} disabled={!transparentStickers[selectedIndex]} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500 disabled:opacity-45"><Undo2 size={15} aria-hidden="true" />Undo ภาพนี้</button>
              <button type="button" onClick={() => { onSettingsChange(createDefaultBackgroundRemovalSettings()); showToast("คืนค่าลบพื้นหลังเริ่มต้นแล้ว") }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500"><RotateCcw size={15} aria-hidden="true" />Reset ค่าลบพื้นหลัง</button>
            </div>
          </aside>
        </div>
      ) : null}

      <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-900">ถ้าสีพื้นหลังใกล้กับสีตัวละครมาก ควรลดค่า Tolerance และตรวจ Preview ก่อนใช้กับทุกภาพ</p>
      {error ? <p role="alert" className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">{error}</p> : null}
      <StepNavigation onBack={onBack} onNext={onNext} nextDisabled={completedCount !== 16} nextLabel="ไปใส่ข้อความ" helperText={completedCount === 16 ? "ภาพโปร่งใสทั้ง 16 พร้อมสำหรับใส่ข้อความ" : "ใช้ค่ากับภาพให้ครบ 16 ภาพก่อนเข้าสู่ขั้นถัดไป"} />
    </section>
  )
}
