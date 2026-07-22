/* eslint-disable @next/next/no-img-element */
"use client"

import { Pipette } from "lucide-react"
import { useEffect, useRef } from "react"
import type { RgbColor } from "@/types/line-sticker"

type BackgroundPreviewProps = {
  sourceBlob: Blob
  previewUrl: string
  filename: string
  onPickColor: (color: RgbColor) => void
}

export function BackgroundPreview({
  sourceBlob,
  previewUrl,
  filename,
  onPickColor,
}: BackgroundPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let cancelled = false
    let bitmap: ImageBitmap | null = null
    void createImageBitmap(sourceBlob).then((image) => {
      bitmap = image
      if (cancelled || !canvasRef.current) return
      const canvas = canvasRef.current
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext("2d", { willReadFrequently: true })
      context?.drawImage(image, 0, 0)
    })
    return () => {
      cancelled = true
      bitmap?.close()
    }
  }, [sourceBlob])

  function pickColor(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = Math.max(0, Math.min(canvas.width - 1, Math.floor(((event.clientX - rect.left) / rect.width) * canvas.width)))
    const y = Math.max(0, Math.min(canvas.height - 1, Math.floor(((event.clientY - rect.top) / rect.height) * canvas.height)))
    const pixel = canvas.getContext("2d", { willReadFrequently: true })?.getImageData(x, y, 1, 1).data
    if (pixel) onPickColor({ r: pixel[0], g: pixel[1], b: pixel[2] })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <figure>
        <figcaption className="mb-2 flex items-center justify-between gap-2 text-xs font-bold text-slate-700">
          ก่อนลบพื้นหลัง
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-violet-700"><Pipette size={13} aria-hidden="true" />แตะภาพเพื่อเลือกสี</span>
        </figcaption>
        <button type="button" onClick={() => canvasRef.current?.focus()} className="sticker-checkerboard block w-full overflow-hidden rounded-2xl border border-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500" aria-label={`เลือกสีพื้นหลังจาก ${filename}`}>
          <canvas ref={canvasRef} onPointerDown={pickColor} className="block h-auto max-h-[430px] w-full cursor-crosshair object-contain" tabIndex={0} />
        </button>
      </figure>
      <figure>
        <figcaption className="mb-2 text-xs font-bold text-slate-700">Preview Alpha หลังลบ</figcaption>
        <div className="sticker-checkerboard flex min-h-44 items-center justify-center overflow-hidden rounded-2xl border border-slate-200">
          {previewUrl ? <img src={previewUrl} alt={`Preview ${filename} หลังลบพื้นหลัง`} className="block h-auto max-h-[430px] w-full object-contain" /> : <span className="text-xs text-slate-500">กำลังสร้าง Preview…</span>}
        </div>
      </figure>
    </div>
  )
}
