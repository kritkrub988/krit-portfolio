type SectionHeaderProps = {
  eyebrow: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignment = align === "center" ? "mx-auto text-center" : ""

  return (
    <div className={`max-w-3xl ${alignment} ${className}`}>
      <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
        {eyebrow}
      </p>

      <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-violet-600" />

      <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-6 text-lg leading-8 text-slate-600">
          {description}
        </p>
      )}
    </div>
  )
}
