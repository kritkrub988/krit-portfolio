type ButtonProps = {
  children: React.ReactNode
  variant?: "primary" | "secondary"
  href?: string
}

export default function Button({
  children,
  variant = "primary",
  href,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"

  const styles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20",
    secondary:
      "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-blue-300",
  }

  if (href) {
    return (
      <a href={href} className={`${base} ${styles[variant]}`}>
        {children}
      </a>
    )
  }

  return <button className={`${base} ${styles[variant]}`}>{children}</button>
}