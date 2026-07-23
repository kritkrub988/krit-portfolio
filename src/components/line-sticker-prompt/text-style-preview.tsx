"use client"

import { useEffect, useRef, useState } from "react"
import { drawTextStylePreview } from "@/lib/line-sticker/render-sticker-text"

type TextStylePreviewProps = {
  styleId: string
  previewClass: string
}

export function TextStylePreview({ styleId, previewClass }: TextStylePreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderVersion = useRef(0)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return
    const previewWrapper = wrapper
    const previewCanvas = canvas

    async function renderPreview() {
      const version = renderVersion.current + 1
      renderVersion.current = version
      setStatus("loading")
      try {
        const width = Math.max(120, Math.floor(previewWrapper.getBoundingClientRect().width))
        await drawTextStylePreview(previewCanvas, styleId, "สวัสดี", width, 72)
        if (renderVersion.current === version) setStatus("ready")
      } catch {
        if (renderVersion.current === version) setStatus("error")
      }
    }

    const resizeObserver = new ResizeObserver(() => { void renderPreview() })
    resizeObserver.observe(wrapper)
    void renderPreview()
    return () => {
      renderVersion.current += 1
      resizeObserver.disconnect()
    }
  }, [styleId])

  return (
    <div
      ref={wrapperRef}
      className="relative flex h-[72px] w-full items-center justify-center overflow-visible rounded-xl bg-gradient-to-br from-rose-50 via-white to-sky-50 px-1 pt-1"
      data-font-ready={status === "ready" ? "true" : "false"}
      data-preview-style={previewClass}
    >
      <canvas ref={canvasRef} className="block max-w-full" aria-label={`ตัวอย่างรูปแบบ ${styleId} คำว่า สวัสดี`} />
      {status === "loading" ? (
        <span className="absolute inset-0 grid place-items-center text-[9px] font-semibold text-violet-500">
          กำลังโหลดฟอนต์
        </span>
      ) : null}
      {status === "error" ? (
        <span className="absolute inset-0 grid place-items-center text-sm font-bold text-slate-700">สวัสดี</span>
      ) : null}
    </div>
  )
}
