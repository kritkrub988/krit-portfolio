"use client"

import { useEffect, useRef, useState } from "react"
import { drawStickerComposition } from "@/lib/line-sticker/render-sticker-text"
import type {
  BrowserImageAsset,
  StickerTextSettings,
  StickerValidationResult,
} from "@/types/line-sticker"

type StickerTextCanvasProps = {
  asset: BrowserImageAsset
  settings: StickerTextSettings
  onSettingsChange: (settings: StickerTextSettings) => void
  onValidationChange: (result: StickerValidationResult) => void
}

export function StickerTextCanvas({
  asset,
  settings,
  onSettingsChange,
  onValidationChange,
}: StickerTextCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [renderError, setRenderError] = useState("")
  const dragging = useRef(false)

  useEffect(() => {
    let cancelled = false
    const canvas = canvasRef.current
    if (!canvas) return
    void drawStickerComposition(canvas, asset.blob, settings, { showSafeArea: true })
      .then((status) => {
        if (cancelled) return
        setRenderError("")
        onValidationChange({
          stickerId: asset.id,
          filename: asset.filename,
          hasTransparency: true,
          textOverflow: status.overflow,
          textNearEdge: status.nearEdge,
        })
      })
      .catch((cause) => {
        if (!cancelled) setRenderError(cause instanceof Error ? cause.message : "Preview ไม่สำเร็จ")
      })
    return () => {
      cancelled = true
    }
  }, [asset, onValidationChange, settings])

  function moveText(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragging.current && event.type !== "pointerdown") return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
    onSettingsChange({ ...settings, x, y })
  }

  return (
    <div>
      <div className="sticker-checkerboard overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-inner">
        <canvas
          ref={canvasRef}
          aria-label={`Canvas แก้ข้อความ ${asset.filename} ลากเพื่อเปลี่ยนตำแหน่งข้อความ`}
          className="block h-auto w-full touch-none cursor-move"
          tabIndex={0}
          onPointerDown={(event) => {
            dragging.current = true
            event.currentTarget.setPointerCapture(event.pointerId)
            moveText(event)
          }}
          onPointerMove={moveText}
          onPointerUp={(event) => {
            dragging.current = false
            event.currentTarget.releasePointerCapture(event.pointerId)
          }}
          onPointerCancel={() => { dragging.current = false }}
        />
      </div>
      <p className="mt-2 text-center text-[11px] leading-5 text-slate-500">เส้นประสีเขียวคือ Safe Area • ลากบน Canvas เพื่อย้ายข้อความ</p>
      {renderError ? <p role="alert" className="mt-2 text-center text-xs font-semibold text-rose-700">{renderError}</p> : null}
    </div>
  )
}
