"use client"

import { Archive, Download, FileCheck2, Images, RotateCcw } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { stickerExportConfig } from "@/config/sticker-export"
import { createStickerZip } from "@/lib/line-sticker/create-sticker-zip"
import { downloadBlob } from "@/lib/line-sticker/browser-utils"
import { blobHasTransparentPixel } from "@/lib/line-sticker/image-browser-utils"
import { renderPngToSize, renderStickerToPng } from "@/lib/line-sticker/render-sticker-text"
import { waitForStickerFontsForSettings } from "@/lib/line-sticker/sticker-fonts-browser"
import { validateStickerFiles } from "@/lib/line-sticker/validate-sticker-files"
import type {
  BrowserImageAsset,
  StickerTextSettings,
  StickerValidationResult,
} from "@/types/line-sticker"
import { ExportPreviewGrid, type RenderedStickerPreview } from "./export-preview-grid"
import { StepNavigation } from "./step-navigation"

type ExportStepProps = {
  assets: BrowserImageAsset[]
  textSettings: StickerTextSettings[]
  selectedMainSticker: number
  selectedTabSticker: number
  onMainStickerChange: (index: number) => void
  onTabStickerChange: (index: number) => void
  onValidationResultsChange: (results: StickerValidationResult[]) => void
  onEditSticker: (index: number) => void
  onBack: () => void
  onStartOver: () => void
  showToast: (message: string) => void
}

export function ExportStep({
  assets,
  textSettings,
  selectedMainSticker,
  selectedTabSticker,
  onMainStickerChange,
  onTabStickerChange,
  onValidationResultsChange,
  onEditSticker,
  onBack,
  onStartOver,
  showToast,
}: ExportStepProps) {
  const [previews, setPreviews] = useState<RenderedStickerPreview[]>([])
  const [mainBlob, setMainBlob] = useState<Blob | null>(null)
  const [tabBlob, setTabBlob] = useState<Blob | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [busy, setBusy] = useState(true)
  const [busyLabel, setBusyLabel] = useState("กำลังโหลดฟอนต์…")
  const [error, setError] = useState("")
  const previewRef = useRef<RenderedStickerPreview[]>([])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const generated: RenderedStickerPreview[] = []
      try {
        await Promise.resolve()
        if (cancelled) return
        setBusy(true)
        setBusyLabel("กำลังโหลดฟอนต์…")
        setError("")
        await waitForStickerFontsForSettings(textSettings)
        if (cancelled) return
        setBusyLabel("กำลังสร้าง Preview…")
        for (let index = 0; index < assets.length; index += 1) {
          const rendered = await renderStickerToPng(assets[index].blob, textSettings[index])
          const hasTransparency = await blobHasTransparentPixel(rendered.blob)
          generated.push({
            filename: assets[index].filename,
            blob: rendered.blob,
            url: URL.createObjectURL(rendered.blob),
            validation: {
              stickerId: assets[index].id,
              filename: assets[index].filename,
              hasTransparency,
              textOverflow: rendered.validation.overflow,
              textNearEdge: rendered.validation.nearEdge,
            },
          })
          if ((index + 1) % 4 === 0) await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
        }
        const nextMain = await renderPngToSize(generated[selectedMainSticker].blob, stickerExportConfig.mainCanvasWidth, stickerExportConfig.mainCanvasHeight)
        const nextTab = await renderPngToSize(generated[selectedTabSticker].blob, stickerExportConfig.tabCanvasWidth, stickerExportConfig.tabCanvasHeight)
        if (cancelled) {
          generated.forEach((preview) => URL.revokeObjectURL(preview.url))
          return
        }
        previewRef.current.forEach((preview) => URL.revokeObjectURL(preview.url))
        previewRef.current = generated
        setPreviews(generated)
        setMainBlob(nextMain)
        setTabBlob(nextTab)
        onValidationResultsChange(generated.map((preview) => preview.validation))
      } catch (cause) {
        generated.forEach((preview) => URL.revokeObjectURL(preview.url))
        if (!cancelled) setError(cause instanceof Error ? cause.message : "สร้างไฟล์ Preview ไม่สำเร็จ")
      } finally {
        if (!cancelled) setBusy(false)
      }
    })()
    return () => { cancelled = true }
  }, [assets, onValidationResultsChange, selectedMainSticker, selectedTabSticker, textSettings])

  useEffect(() => () => {
    previewRef.current.forEach((preview) => URL.revokeObjectURL(preview.url))
  }, [])

  const summary = validateStickerFiles(
    previews.map((preview) => ({
      ...preview.validation,
      isPng: preview.blob.type === "image/png",
      isEmpty: preview.blob.size === 0,
    })),
    Boolean(mainBlob),
    Boolean(tabBlob),
  )

  function confirmWarnings() {
    if (!summary.warnings.length) return true
    return window.confirm(`พบคำเตือนใน ${summary.warningFiles.join(", ")}\n\n${summary.warnings.join("\n")}\n\nต้องการดาวน์โหลดต่อหรือไม่?`)
  }

  function downloadSelected() {
    const preview = previews[selectedIndex]
    if (!preview || !confirmWarnings()) return
    downloadBlob(preview.filename, preview.blob)
    showToast(`ดาวน์โหลด ${preview.filename} แล้ว`)
  }

  async function downloadStickerPack() {
    if (!summary.valid || !confirmWarnings()) return
    setBusy(true)
    try {
      const zip = await createStickerZip(previews.map(({ filename, blob }) => ({ filename, blob })))
      downloadBlob(stickerExportConfig.stickerZipFilename, zip)
      showToast("ดาวน์โหลดชุด 16 ภาพแล้ว")
    } finally {
      setBusy(false)
    }
  }

  async function downloadCompleteZip() {
    if (!summary.valid || !mainBlob || !tabBlob || !confirmWarnings()) return
    setBusy(true)
    try {
      const zip = await createStickerZip([
        ...previews.map(({ filename, blob }) => ({ filename, blob })),
        { filename: "main.png", blob: mainBlob },
        { filename: "tab.png", blob: tabBlob },
      ])
      downloadBlob(stickerExportConfig.completeZipFilename, zip)
      showToast("ดาวน์โหลด ZIP ครบ 18 ไฟล์แล้ว")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section aria-labelledby="export-step-heading" className="rounded-[2rem] border border-violet-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Step 5</p>
          <h2 id="export-step-heading" className="mt-2 text-2xl font-extrabold text-slate-950 sm:text-3xl">ตรวจ Preview และดาวน์โหลด</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">ตรวจความโปร่งใส Safe Area และลำดับไฟล์ก่อน Export คุณยังดาวน์โหลดต่อได้เมื่อมี Warning หลังยืนยัน</p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${summary.valid && !summary.warnings.length ? "bg-emerald-100 text-emerald-800" : summary.valid ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}><FileCheck2 size={15} aria-hidden="true" />{busy ? busyLabel : summary.valid ? summary.warnings.length ? `${summary.warningFiles.length} ไฟล์มี Warning` : "พร้อมดาวน์โหลด" : "กำลังตรวจไฟล์"}</span>
      </div>

      {error ? <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">{error}</p> : null}
      {busy && !previews.length ? <div className="mt-6 grid min-h-72 place-items-center rounded-3xl border border-dashed border-violet-200 bg-violet-50 text-sm font-bold text-violet-700">{busyLabel === "กำลังโหลดฟอนต์…" ? "กำลังโหลดฟอนต์สำหรับทั้ง 16 ภาพ…" : "กำลัง Render ข้อความและตรวจ Alpha ทั้ง 16 ภาพ…"}</div> : null}
      {previews.length === 16 ? (
        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <ExportPreviewGrid previews={previews} selectedIndex={selectedIndex} onSelect={setSelectedIndex} onEdit={onEditSticker} />
          <aside className="space-y-4 xl:sticky xl:top-24">
            <div className="rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-sky-50 p-5">
              <h3 className="font-extrabold text-slate-900">เลือกภาพ Main และ Tab</h3>
              <label htmlFor="main-sticker" className="mt-4 block text-xs font-bold text-slate-700">main.png
                <select id="main-sticker" value={selectedMainSticker} onChange={(event) => onMainStickerChange(Number(event.target.value))} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900">{previews.map((preview, index) => <option key={preview.filename} value={index}>{preview.filename}</option>)}</select>
              </label>
              <label htmlFor="tab-sticker" className="mt-3 block text-xs font-bold text-slate-700">tab.png
                <select id="tab-sticker" value={selectedTabSticker} onChange={(event) => onTabStickerChange(Number(event.target.value))} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900">{previews.map((preview, index) => <option key={preview.filename} value={index}>{preview.filename}</option>)}</select>
              </label>
              <p className="mt-4 text-[11px] leading-5 text-slate-500">ค่าเริ่มต้นใช้ภาพ 01 ทั้งคู่ ภาพจะถูกย่อแบบรักษาสัดส่วน วางกึ่งกลาง และไม่ Crop ส่วนสำคัญ</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-extrabold text-slate-900">ค่าตั้งต้นสำหรับ Export</h3>
              <dl className="mt-3 space-y-2 text-xs text-slate-600"><div className="flex justify-between"><dt>Sticker</dt><dd className="font-bold">{stickerExportConfig.stickerCanvasWidth}×{stickerExportConfig.stickerCanvasHeight}px</dd></div><div className="flex justify-between"><dt>Main</dt><dd className="font-bold">{stickerExportConfig.mainCanvasWidth}×{stickerExportConfig.mainCanvasHeight}px</dd></div><div className="flex justify-between"><dt>Tab</dt><dd className="font-bold">{stickerExportConfig.tabCanvasWidth}×{stickerExportConfig.tabCanvasHeight}px</dd></div><div className="flex justify-between"><dt>Safe margin</dt><dd className="font-bold">{stickerExportConfig.safeMargin}px</dd></div></dl>
              <p className="mt-3 text-[10px] leading-5 text-amber-800">เป็นค่าตั้งต้นใน Config ไม่ได้อ้างว่าเป็นขนาดทางการล่าสุด กรุณาตรวจนโยบายแพลตฟอร์มก่อนนำไปเผยแพร่</p>
            </div>

            {summary.errors.length ? <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs leading-6 text-rose-900"><strong>ยัง Export ไม่ได้</strong><ul className="mt-1 list-disc pl-5">{summary.errors.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
            {summary.warnings.length ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900"><strong>Warning: {summary.warningFiles.join(", ")}</strong><p>ยัง Export ได้ แต่ระบบจะขอให้ยืนยันก่อนดาวน์โหลด</p></div> : null}

            <div className="grid gap-2">
              <button type="button" onClick={downloadSelected} disabled={busy || !previews[selectedIndex]} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-3 text-xs font-bold text-violet-700 hover:bg-violet-50 disabled:opacity-45"><Download size={15} aria-hidden="true" />ดาวน์โหลดภาพที่เลือก</button>
              <button type="button" onClick={() => void downloadStickerPack()} disabled={busy || !summary.valid} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-600 px-3 text-sm font-bold text-white hover:bg-sky-500 disabled:opacity-45"><Images size={17} aria-hidden="true" />ดาวน์โหลดทั้ง 16 ภาพ</button>
              <button type="button" onClick={() => void downloadCompleteZip()} disabled={busy || !summary.valid} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 px-3 text-sm font-bold text-white shadow-lg shadow-pink-100 hover:-translate-y-0.5 disabled:opacity-45"><Archive size={17} aria-hidden="true" />ดาวน์โหลดทั้งหมดเป็น ZIP</button>
              <button type="button" onClick={onStartOver} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50"><RotateCcw size={15} aria-hidden="true" />เริ่มใหม่</button>
            </div>
          </aside>
        </div>
      ) : null}

      <StepNavigation onBack={onBack} />
    </section>
  )
}
