import type { Metadata } from "next"
import { PromptBuilderShell } from "@/components/ai-portrait-prompt/prompt-builder-shell"

export const metadata: Metadata = {
  title: "Portrait Project",
  robots: { index: false, follow: false },
}

export default async function PortraitProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  return <PromptBuilderShell initialProjectId={projectId} />
}

