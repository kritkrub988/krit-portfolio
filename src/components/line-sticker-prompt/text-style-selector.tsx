import { Check } from "lucide-react"
import { stickerTextStyles } from "@/data/line-sticker/text-styles"
import { TextStylePreview } from "./text-style-preview"

type TextStyleSelectorProps = {
  value: string
  onChange: (textStyleId: string) => void
}

export function TextStyleSelector({ value, onChange }: TextStyleSelectorProps) {
  return (
    <section aria-labelledby="text-style-heading">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pink-100 text-sm font-extrabold text-pink-700">
          Aa
        </span>
        <div>
          <h2 id="text-style-heading" className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
            เลือกรูปแบบตัวอักษรของภาพนี้
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            เลือกจาก 24 แบบ แต่ละภาพเก็บ Style แยกกันและปรับสีหรือขนาดต่อได้
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
              className={`relative min-h-36 overflow-visible rounded-2xl border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
                selected
                  ? "border-violet-400 bg-violet-50 shadow-md ring-2 ring-violet-200"
                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-sm"
              }`}
            >
              <TextStylePreview styleId={textStyle.id} previewClass={textStyle.previewClass} />
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
