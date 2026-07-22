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
import { stickerThemes } from "@/data/line-sticker/themes"
import type { StickerTheme } from "@/types/line-sticker"

type ThemeSelectorProps = {
  value: string
  onChange: (themeId: string) => void
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

function ThemeArtwork({ theme }: { theme: StickerTheme }) {
  const Icon = motifIcons[theme.motif]

  return (
    <span
      className="relative block h-20 overflow-hidden rounded-2xl border border-white/80"
      style={{
        background: `linear-gradient(135deg, ${theme.colors[0]}cc, ${theme.colors[1]}d9 52%, ${theme.colors[2]}cc)`,
      }}
      aria-hidden="true"
    >
      <span className="absolute -left-3 -top-4 h-12 w-12 rounded-full bg-white/45" />
      <span className="absolute -bottom-6 right-3 h-16 w-16 rounded-full bg-white/35" />
      <span className="absolute bottom-2 left-3 grid h-9 w-9 place-items-center rounded-xl bg-white/80 text-slate-700 shadow-sm">
        <Icon size={19} strokeWidth={1.8} />
      </span>
      <span className="absolute right-3 top-3 flex gap-1">
        {theme.colors.map((color) => (
          <span
            key={color}
            className="h-3 w-3 rounded-full border border-white/90 shadow-sm"
            style={{ backgroundColor: color }}
          />
        ))}
      </span>
    </span>
  )
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <section id="theme-section" aria-labelledby="theme-heading" className="scroll-mt-28">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm font-extrabold text-emerald-700">
          1
        </span>
        <div>
          <h2 id="theme-heading" className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
            เลือกธีมสติกเกอร์
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            เลือกได้ครั้งละ 1 แบบ ระบบจะนำรายละเอียดของธีมไปใส่ใน Prompt
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {stickerThemes.map((theme) => {
          const selected = theme.id === value
          return (
            <button
              key={theme.id}
              type="button"
              aria-pressed={selected}
              aria-label={`เลือกธีม ${theme.nameEnglish} ${theme.nameThai}`}
              onClick={() => onChange(theme.id)}
              className={`relative min-h-44 rounded-3xl border bg-white p-2.5 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
                selected
                  ? "border-emerald-400 shadow-lg shadow-emerald-100/80 ring-2 ring-emerald-200"
                  : "border-slate-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              }`}
            >
              <ThemeArtwork theme={theme} />
              <span className="mt-3 block pr-7 text-sm font-extrabold text-slate-900">
                {theme.nameEnglish}
              </span>
              <span className="mt-0.5 block text-xs font-semibold text-emerald-700">
                {theme.nameThai}
              </span>
              <span className="mt-1.5 block text-[11px] leading-4 text-slate-500">
                {theme.description}
              </span>
              <span
                className={`absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border-2 shadow-sm ${
                  selected
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-white bg-white/90 text-transparent"
                }`}
              >
                <Check size={15} strokeWidth={3} aria-hidden="true" />
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
