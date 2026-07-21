import { Check } from "lucide-react"
import { portraitFormats } from "@/data/portrait-lite/portrait-formats"

type PortraitFormatSelectorProps = {
  value: string
  onChange: (formatId: string) => void
}

function FormatIllustration({ formatId }: { formatId: string }) {
  const frame = {
    headshot: { head: 22, shoulder: 38, bodyBottom: 48 },
    "half-body": { head: 16, shoulder: 30, bodyBottom: 58 },
    "three-quarter": { head: 13, shoulder: 26, bodyBottom: 67 },
    "full-body": { head: 10, shoulder: 21, bodyBottom: 72 },
  }[formatId] ?? { head: 13, shoulder: 26, bodyBottom: 67 }

  return (
    <svg
      viewBox="0 0 64 80"
      aria-hidden="true"
      className="h-20 w-16 text-slate-400"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    >
      <rect x="5" y="4" width="54" height="72" rx="8" className="stroke-slate-700" />
      <circle cx="32" cy={frame.head} r="7" />
      <path d={`M${frame.shoulder - 13} ${frame.shoulder} Q32 ${frame.shoulder - 8} ${frame.shoulder + 13} ${frame.shoulder}`} />
      <path d={`M${frame.shoulder - 10} ${frame.shoulder + 1} L${frame.shoulder - 7} ${frame.bodyBottom} M${frame.shoulder + 10} ${frame.shoulder + 1} L${frame.shoulder + 7} ${frame.bodyBottom}`} />
      {formatId === "full-body" ? (
        <path d="M25 72 L29 49 M39 72 L35 49" />
      ) : null}
      <path d="M9 10 H17 M47 10 H55 M9 70 H17 M47 70 H55" className="stroke-violet-400/70" />
    </svg>
  )
}

export function PortraitFormatSelector({ value, onChange }: PortraitFormatSelectorProps) {
  return (
    <section aria-labelledby="portrait-format-heading">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="portrait-format-heading" className="text-sm font-semibold text-slate-100">
          01 / Portrait Format
        </h2>
        <span className="text-xs text-slate-500">เลือก 1 รูปแบบ</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {portraitFormats.map((format) => {
          const selected = format.id === value
          return (
            <button
              key={format.id}
              type="button"
              aria-label={`เลือกรูปแบบภาพ ${format.label}`}
              aria-pressed={selected}
              onClick={() => onChange(format.id)}
              className={`group relative overflow-hidden rounded-2xl border text-left transition-colors focus-visible:outline-violet-400 ${
                selected
                  ? "border-violet-400 bg-violet-500/15 shadow-[0_0_0_1px_rgba(167,139,250,0.3)]"
                  : "border-slate-700 bg-slate-900/70 hover:border-slate-500"
              }`}
            >
              <span className="flex min-h-28 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
                <FormatIllustration formatId={format.id} />
              </span>
              <span className="block min-h-24 px-3 py-3">
                <span className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold tracking-wide text-slate-100">
                    {format.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex size-4 shrink-0 items-center justify-center rounded-full ${
                      selected ? "bg-violet-400 text-slate-950" : "bg-slate-700 text-transparent"
                    }`}
                  >
                    <Check size={11} strokeWidth={3} />
                  </span>
                </span>
                <span className="mt-1.5 block text-xs leading-5 text-slate-400">
                  {format.description}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
