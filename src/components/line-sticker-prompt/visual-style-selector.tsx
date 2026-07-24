import {
  Box,
  Candy,
  Check,
  Cloud,
  Heart,
  Palette,
  Pencil,
  Sparkles,
  Star,
  Sun,
} from "lucide-react"
import {
  getStickerVisualStyle,
  stickerVisualStyles,
} from "@/data/line-sticker/themes"
import type { StickerVisualStyle } from "@/types/line-sticker"

type VisualStyleSelectorProps = {
  value: string
  onChange: (visualStyleId: string) => void
}

const motifIcons = {
  hearts: Heart,
  clouds: Cloud,
  stars: Star,
  candy: Candy,
  doodle: Pencil,
  minimal: Sun,
  pop: Sparkles,
  kawaii: Palette,
  "soft-3d": Box,
}

function VisualStyleArtwork({
  visualStyle,
}: {
  visualStyle: StickerVisualStyle
}) {
  const Icon = motifIcons[visualStyle.motif]

  return (
    <span
      className="relative block h-14 overflow-hidden rounded-xl border border-white/80"
      style={{
        background: `linear-gradient(135deg, ${visualStyle.colors[0]}cc, ${visualStyle.colors[1]}d9 52%, ${visualStyle.colors[2]}cc)`,
      }}
      aria-hidden="true"
    >
      <span className="absolute -left-3 -top-4 h-10 w-10 rounded-full bg-white/45" />
      <span className="absolute -bottom-5 right-2 h-12 w-12 rounded-full bg-white/35" />
      <span className="absolute bottom-1.5 left-2 grid h-7 w-7 place-items-center rounded-lg bg-white/80 text-slate-700 shadow-sm">
        <Icon size={15} strokeWidth={1.8} />
      </span>
    </span>
  )
}

export function VisualStyleSelector({
  value,
  onChange,
}: VisualStyleSelectorProps) {
  const selectedVisualStyle = getStickerVisualStyle(value)

  return (
    <section aria-labelledby="visual-style-heading">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
          Visual Style
        </p>
        <h2
          id="visual-style-heading"
          className="mt-1 text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl"
        >
          2. เลือกสไตล์ภาพ
        </h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          เลือกหน้าตา สี และรูปแบบการ์ตูนที่ต้องการ สามารถผสมกับชุดสติกเกอร์ได้อย่างอิสระ
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        {stickerVisualStyles.map((visualStyle) => {
          const selected = visualStyle.id === value
          return (
            <button
              key={visualStyle.id}
              type="button"
              aria-pressed={selected}
              aria-label={`เลือกสไตล์ภาพ ${visualStyle.nameEnglish} ${visualStyle.nameThai}`}
              onClick={() => onChange(visualStyle.id)}
              className={`relative min-h-36 rounded-2xl border bg-white p-2.5 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
                selected
                  ? "border-violet-400 shadow-md shadow-violet-100 ring-2 ring-violet-200"
                  : "border-slate-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
              }`}
            >
              <VisualStyleArtwork visualStyle={visualStyle} />
              <span className="mt-2.5 block pr-6 text-xs font-extrabold leading-4 text-slate-900">
                {visualStyle.nameEnglish}
              </span>
              <span className="mt-1 block text-[11px] font-semibold leading-4 text-violet-700">
                {visualStyle.nameThai}
              </span>
              <span
                className={`absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full border-2 shadow-sm ${
                  selected
                    ? "border-violet-500 bg-violet-500 text-white"
                    : "border-white bg-white/90 text-transparent"
                }`}
                aria-hidden="true"
              >
                <Check size={13} strokeWidth={3} />
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
        <p className="font-extrabold text-slate-950">
          {selectedVisualStyle.nameEnglish}
          <span className="ml-2 text-sm font-bold text-violet-700">
            {selectedVisualStyle.nameThai}
          </span>
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          {selectedVisualStyle.description}
        </p>
      </div>
    </section>
  )
}
