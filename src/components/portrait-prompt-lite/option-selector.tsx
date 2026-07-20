import type { PortraitOption } from "@/types/portrait-lite"

type OptionSelectorProps = {
  heading: string
  step: string
  options: PortraitOption[]
  value: string
  onChange: (optionId: string) => void
}

export function OptionSelector({
  heading,
  step,
  options,
  value,
  onChange,
}: OptionSelectorProps) {
  const headingId = `portrait-option-${step}`

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="mb-3 text-sm font-semibold text-slate-100">
        {step} / {heading}
      </h2>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.id === value
          return (
            <button
              key={option.id}
              type="button"
              aria-label={`เลือก ${heading}: ${option.label}`}
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
              className={`min-h-11 rounded-xl border px-3.5 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-violet-400 ${
                selected
                  ? "border-violet-400 bg-violet-500/15 text-violet-100"
                  : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
