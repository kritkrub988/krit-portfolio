import { Check, RotateCcw } from "lucide-react"
import type { StudioStep } from "@/types/line-sticker"

const steps = [
  "สร้าง Prompt",
  "ตัดภาพ 4×4",
  "ลบพื้นหลัง",
  "ใส่ข้อความ",
  "ตรวจและดาวน์โหลด",
] as const

type StudioStepperProps = {
  currentStep: StudioStep
  maxCompletedStep: StudioStep
  onStepChange: (step: StudioStep) => void
  onStartOver: () => void
}

export function StudioStepper({
  currentStep,
  maxCompletedStep,
  onStepChange,
  onStartOver,
}: StudioStepperProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-pink-100 bg-[#fffafd]/95 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <nav className="min-w-0 flex-1 overflow-x-auto pb-1" aria-label="ขั้นตอนทำสติกเกอร์">
          <ol className="flex min-w-max items-center gap-2 lg:grid lg:min-w-0 lg:grid-cols-5">
            {steps.map((label, index) => {
              const step = (index + 1) as StudioStep
              const active = currentStep === step
              const completed = step < currentStep || step <= maxCompletedStep
              const available = step <= maxCompletedStep
              return (
                <li key={label}>
                  <button
                    type="button"
                    disabled={!available}
                    onClick={() => onStepChange(step)}
                    aria-current={active ? "step" : undefined}
                    className={`flex min-h-12 w-full items-center gap-2 rounded-2xl border px-3 text-left text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 lg:justify-center ${
                      active
                        ? "border-violet-300 bg-violet-600 text-white shadow-lg shadow-violet-200"
                        : completed
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-slate-200 bg-white text-slate-400"
                    } disabled:cursor-not-allowed`}
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${active ? "bg-white/20" : "bg-white"}`}>
                      {completed && !active ? <Check size={14} strokeWidth={3} aria-hidden="true" /> : step}
                    </span>
                    <span>{label}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>
        <button
          type="button"
          onClick={onStartOver}
          className="hidden min-h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-rose-200 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500 sm:inline-flex"
        >
          <RotateCcw size={15} aria-hidden="true" />
          เริ่มใหม่
        </button>
      </div>
    </div>
  )
}
