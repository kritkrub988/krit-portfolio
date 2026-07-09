import { layout } from "@/lib/design-system"

type ContainerProps = {
  children: React.ReactNode
  className?: string
}

export default function Container({ children, className = "" }: ContainerProps) {
  return <div className={`${layout.container} ${className}`}>{children}</div>
}