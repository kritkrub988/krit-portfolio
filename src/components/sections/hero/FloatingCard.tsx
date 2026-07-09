import { BarChart3, Code2, Cpu } from "lucide-react"

type FloatingCardProps = {
  title: string
  description: string
  icon: "ai" | "data" | "web"
  className?: string
}

const iconMap = {
  ai: Cpu,
  data: BarChart3,
  web: Code2,
}

export default function FloatingCard({
  title,
  description,
  icon,
  className = "",
}: FloatingCardProps) {
  const Icon = iconMap[icon]

  return (
    <div
      className={`absolute z-30 overflow-hidden rounded-2xl border border-white/70 bg-white/85 px-5 py-4 shadow-xl shadow-slate-300/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.06)_1px,transparent_1px)] bg-[size:18px_18px] opacity-50" />

      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-blue-400/20 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-violet-400/20 blur-2xl" />

      <div className="relative flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
          <Icon size={20} strokeWidth={2.4} />
        </div>

        <div>
          <p className="text-sm font-extrabold text-slate-950">{title}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}