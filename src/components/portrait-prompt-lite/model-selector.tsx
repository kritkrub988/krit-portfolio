import { UserRound } from "lucide-react"
import { portraitModels } from "@/data/portrait-lite/portrait-models"

type ModelSelectorProps = {
  value: string
  onChange: (modelId: string) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <section aria-labelledby="model-heading">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="model-heading" className="text-sm font-semibold text-slate-100">
          01 / Model
        </h2>
        <span className="text-xs text-slate-500">เลือก 1 คน</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {portraitModels.map((model) => {
          const selected = model.id === value
          return (
            <button
              key={model.id}
              type="button"
              aria-label={`เลือก Model ${model.name}`}
              aria-pressed={selected}
              onClick={() => onChange(model.id)}
              className={`overflow-hidden rounded-2xl border text-left transition-colors focus-visible:outline-violet-400 ${
                selected
                  ? "border-violet-400 bg-violet-500/15 shadow-[0_0_0_1px_rgba(167,139,250,0.3)]"
                  : "border-slate-700 bg-slate-900/70 hover:border-slate-500"
              }`}
            >
              <span className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-500">
                <UserRound aria-hidden="true" size={28} strokeWidth={1.5} />
              </span>
              <span className="flex items-center justify-between gap-2 px-3 py-2.5">
                <span className="text-xs font-semibold tracking-[0.12em] text-slate-100">
                  {model.name}
                </span>
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full ${selected ? "bg-violet-400" : "bg-slate-700"}`}
                />
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
