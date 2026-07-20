type ProgressBarProps = {
  completed: number
  total: number
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  return (
    <div aria-label={`ความคืบหน้า ${percent}%`}>
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
        <span>Progress</span>
        <span>{completed}/{total} · {percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

