import { Check, PawPrint, UserRound, UsersRound } from "lucide-react"
import {
  stickerPackModeLabels,
  stickerPacks,
} from "@/data/line-sticker/sticker-packs"
import type { StickerPackMode } from "@/types/line-sticker"

type StickerPackSelectorProps = {
  value: string
  onChange: (stickerPackId: string) => void
}

const modeIcons = {
  single: UserRound,
  animal: PawPrint,
  pair: UsersRound,
} satisfies Record<StickerPackMode, typeof UserRound>

export function StickerPackSelector({
  value,
  onChange,
}: StickerPackSelectorProps) {
  return (
    <section aria-labelledby="sticker-pack-heading">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-pink-600">
          Sticker Pack
        </p>
        <h2
          id="sticker-pack-heading"
          className="mt-1 text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl"
        >
          1. เลือกชุดสติกเกอร์
        </h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          เลือกชุดข้อความและท่าทาง 16 ภาพ ระบบจะนำรายการทั้งหมดไปประกอบใน Prompt และใช้เป็นข้อความเริ่มต้นสำหรับขั้นใส่ข้อความภายหลัง
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {stickerPacks.map((pack) => {
          const selected = pack.id === value
          const ModeIcon = modeIcons[pack.characterMode]

          return (
            <button
              key={pack.id}
              type="button"
              aria-pressed={selected}
              aria-label={`เลือกชุดสติกเกอร์ ${pack.name}`}
              onClick={() => onChange(pack.id)}
              className={`relative min-h-64 rounded-3xl border bg-white p-5 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 ${
                selected
                  ? "border-pink-400 shadow-lg shadow-pink-100/80 ring-2 ring-pink-200"
                  : "border-slate-200 hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
              }`}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-pink-100 via-amber-50 to-sky-100 text-2xl shadow-inner">
                  {pack.icon}
                </span>
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full border-2 ${
                    selected
                      ? "border-pink-500 bg-pink-500 text-white"
                      : "border-slate-200 bg-white text-transparent"
                  }`}
                  aria-hidden="true"
                >
                  <Check size={17} strokeWidth={3} />
                </span>
              </span>

              <span className="mt-4 block text-base font-extrabold text-slate-950">
                {pack.name}
              </span>
              <span className="mt-1.5 block min-h-10 text-xs leading-5 text-slate-600">
                {pack.description}
              </span>

              <span className="mt-4 flex flex-wrap gap-1.5">
                {pack.previewTexts.map((text) => (
                  <span
                    key={text}
                    className="rounded-full border border-pink-100 bg-pink-50 px-2.5 py-1 text-[11px] font-semibold text-pink-800"
                  >
                    {text}
                  </span>
                ))}
              </span>

              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1.5 text-[11px] font-bold text-slate-700">
                <ModeIcon size={14} aria-hidden="true" />
                {stickerPackModeLabels[pack.characterMode]}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
