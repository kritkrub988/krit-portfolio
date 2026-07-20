import type { Metadata } from "next"
import { PromptBuilderShell } from "@/components/ai-portrait-prompt/prompt-builder-shell"

export const metadata: Metadata = {
  title: "AI Portrait Prompt Builder",
  description: "Professional browser-only portrait prompt builder with production workflow, IndexedDB drafts, version history, and exports.",
}

export default function AiPortraitPromptPage() {
  return <PromptBuilderShell />
}
