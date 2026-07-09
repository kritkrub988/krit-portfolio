import { layout } from "@/lib/design-system"

type SectionProps = {
  id?: string
  children: React.ReactNode
  className?: string
}

export default function Section({
  id,
  children,
  className = "bg-white",
}: SectionProps) {
  return (
    <section id={id} className={`${className} ${layout.section}`}>
      {children}
    </section>
  )
}