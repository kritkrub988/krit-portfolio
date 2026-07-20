import type { ReactNode } from "react"
import { validateMasterData } from "@/lib/ai-portrait/validation"

export default function AiPortraitPromptLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV !== "production") {
    const issues = validateMasterData()
    if (issues.length > 0) {
      throw new Error(
        `AI Portrait master data is invalid: ${issues.map((issue) => issue.message).join("; ")}`,
      )
    }
  }
  return children
}
