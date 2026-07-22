import type { CSSProperties } from "react"
import { Check } from "lucide-react"
import { stickerTextStyles } from "@/data/line-sticker/text-styles"

type TextStyleSelectorProps = {
  value: string
  onChange: (textStyleId: string) => void
}

function previewStyle(id: string): CSSProperties {
  const styles: Record<string, CSSProperties> = {
    "bold-rounded": { color: "#1f2937", fontWeight: 900, WebkitTextStroke: "1px white" },
    "sweet-handwriting": { color: "#ec4899", fontStyle: "italic", transform: "rotate(-2deg)" },
    "jelly-text": { color: "#a855f7", fontWeight: 900, textShadow: "0 3px 0 #f3e8ff, 0 5px 8px #d8b4fe" },
    "puffy-text": { color: "#fb7185", fontWeight: 900, textShadow: "0 3px 0 white, 0 5px 0 #fecdd3" },
    "sticker-outline": { color: "#111827", fontWeight: 900, WebkitTextStroke: "3px white", paintOrder: "stroke fill" },
    "shadow-pop": { color: "#059669", fontWeight: 900, textShadow: "4px 4px 0 #f9a8d4" },
    "bubble-gum": { color: "#f472b6", fontWeight: 900, textShadow: "0 2px 0 #fce7f3, 0 4px 0 #f9a8d4" },
    "neon-glow": { color: "#7c3aed", fontWeight: 800, textShadow: "0 0 5px white, 0 0 10px #c4b5fd" },
    "comic-fun": { color: "#eab308", fontWeight: 900, WebkitTextStroke: "1px #1f2937", transform: "skew(-4deg)" },
    "chalk-style": { color: "#f8fafc", fontWeight: 700, textShadow: "1px 1px 0 #64748b" },
    "cute-brush": { color: "#e11d48", fontWeight: 800, fontStyle: "italic", letterSpacing: "-0.04em" },
    "pastel-stroke": { color: "white", fontWeight: 900, WebkitTextStroke: "2px #a78bfa", paintOrder: "stroke fill" },
    "kawaii-outline": { color: "#f472b6", fontWeight: 900, WebkitTextStroke: "2px white", paintOrder: "stroke fill", textShadow: "0 0 0 #f472b6" },
    "marker-pen": { color: "#334155", fontWeight: 800, transform: "rotate(1deg)" },
    "thin-minimal": { color: "#475569", fontWeight: 400, letterSpacing: "0.08em" },
    "gradient-fill": { fontWeight: 900, background: "linear-gradient(90deg,#ec4899,#8b5cf6,#0ea5e9)", color: "transparent", WebkitBackgroundClip: "text" },
    "retro-pixel": { color: "#6d28d9", fontWeight: 900, letterSpacing: "0.08em", textShadow: "2px 2px 0 #fde68a" },
    "cloud-text": { color: "white", fontWeight: 900, textShadow: "0 2px 0 #93c5fd, 2px 0 0 #93c5fd, -2px 0 0 #93c5fd" },
    "sparkle-text": { color: "#7c3aed", fontWeight: 900, textShadow: "0 0 8px #fde68a" },
    "cute-3d": { color: "#38bdf8", fontWeight: 900, textShadow: "0 3px 0 #0369a1, 0 6px 8px #bae6fd" },
    "hand-drawn": { color: "#475569", fontWeight: 600, fontStyle: "italic", transform: "rotate(-1deg)" },
    "doodle-outline": { color: "white", fontWeight: 800, WebkitTextStroke: "1.5px #f97316", paintOrder: "stroke fill" },
    "soft-type": { color: "#0f766e", fontWeight: 700, letterSpacing: "0.02em", textShadow: "0 2px 7px #99f6e4" },
    "candy-text": { color: "#fb7185", fontWeight: 900, textShadow: "2px 2px 0 #fef08a, 4px 4px 0 #a7f3d0" },
  }
  return styles[id] ?? {}
}

export function TextStyleSelector({ value, onChange }: TextStyleSelectorProps) {
  return (
    <section aria-labelledby="text-style-heading">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pink-100 text-sm font-extrabold text-pink-700">
          2
        </span>
        <div>
          <h2 id="text-style-heading" className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
            เลือกรูปแบบตัวอักษร
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            รูปแบบนี้จะถูกนำไปใช้กับข้อความบนสติกเกอร์ทั้ง 16 ภาพ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {stickerTextStyles.map((textStyle) => {
          const selected = textStyle.id === value
          return (
            <button
              key={textStyle.id}
              type="button"
              aria-pressed={selected}
              aria-label={`เลือกรูปแบบตัวอักษร ${textStyle.nameEnglish} ${textStyle.nameThai}`}
              onClick={() => onChange(textStyle.id)}
              className={`relative min-h-28 overflow-hidden rounded-2xl border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
                selected
                  ? "border-violet-400 bg-violet-50 shadow-md ring-2 ring-violet-200"
                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-sm"
              }`}
            >
              <span className="flex h-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-50 via-white to-sky-50 px-1 text-center text-lg" style={previewStyle(textStyle.id)}>
                สวัสดี
              </span>
              <span className="mt-2 block pr-5 text-[11px] font-bold leading-4 text-slate-800">
                {textStyle.nameEnglish}
              </span>
              <span className="block text-[10px] leading-4 text-slate-500">{textStyle.nameThai}</span>
              {selected ? (
                <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-violet-600 text-white">
                  <Check size={12} strokeWidth={3} aria-hidden="true" />
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </section>
  )
}
