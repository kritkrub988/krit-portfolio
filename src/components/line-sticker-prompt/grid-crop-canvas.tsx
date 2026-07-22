/* eslint-disable @next/next/no-img-element */

import { calculateGridCropRects } from "@/lib/line-sticker/crop-sticker-grid"
import type { CropSettings, SourceGridImage } from "@/types/line-sticker"

export function GridCropCanvas({
  source,
  settings,
}: {
  source: SourceGridImage
  settings: CropSettings
}) {
  let error = ""
  let rects = [] as ReturnType<typeof calculateGridCropRects>
  try {
    rects = calculateGridCropRects(source.width, source.height, settings)
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "ค่าการตัดไม่ถูกต้อง"
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-pink-200 bg-slate-100">
        <img src={source.url} alt="ภาพต้นฉบับตารางสติกเกอร์ 4 คูณ 4 พร้อมเส้น Preview สำหรับตัดภาพ" className="block h-auto w-full" />
        {!error ? (
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${source.width} ${source.height}`} preserveAspectRatio="none" aria-hidden="true">
            {rects.map((rect) => (
              <g key={rect.filename}>
                <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} fill="none" stroke="rgba(236,72,153,0.95)" strokeWidth={Math.max(2, source.width / 600)} />
                <rect x={rect.x + source.width * 0.008} y={rect.y + source.height * 0.008} width={source.width * 0.04} height={source.height * 0.028} rx={source.width * 0.006} fill="rgba(15,23,42,0.78)" />
                <text x={rect.x + source.width * 0.028} y={rect.y + source.height * 0.028} fill="white" fontSize={source.width * 0.015} fontWeight="700" textAnchor="middle">{String(rect.index).padStart(2, "0")}</text>
              </g>
            ))}
          </svg>
        ) : null}
      </div>
      {error ? <p role="alert" className="mt-2 text-xs font-semibold text-rose-700">{error}</p> : null}
    </div>
  )
}
