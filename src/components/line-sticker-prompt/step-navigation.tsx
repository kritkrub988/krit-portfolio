import { ArrowLeft, ArrowRight } from "lucide-react"

type StepNavigationProps = {
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  helperText?: string
}

export function StepNavigation({
  onBack,
  onNext,
  nextLabel = "ขั้นตอนถัดไป",
  nextDisabled = false,
  helperText,
}: StepNavigationProps) {
  return (
    <div className="mt-7 border-t border-slate-100 pt-5">
      {helperText ? <p className="mb-3 text-center text-xs leading-5 text-slate-500 sm:text-right">{helperText}</p> : null}
      <div className="grid gap-2 sm:flex sm:justify-end">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            ย้อนกลับ
          </button>
        ) : null}
        {onNext ? (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 px-6 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
          >
            {nextLabel}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
