import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react"

type SharedProps = {
  children: ReactNode
  variant?: "primary" | "secondary"
}

type AnchorProps = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

type NativeButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
  }

type ButtonProps = AnchorProps | NativeButtonProps

export default function Button({
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"

  const styles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20",
    secondary:
      "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-blue-300",
  }

  if (href) {
    return (
      <a
        href={href}
        className={`${base} ${styles[variant]} ${className}`}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={`${base} ${styles[variant]} ${className}`}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}
