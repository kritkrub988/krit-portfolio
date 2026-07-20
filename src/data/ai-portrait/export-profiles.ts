import type { ExportProfile } from "../../types/ai-portrait.ts"

export const portraitExportProfiles: ExportProfile[] = [
  {
    id: "EXPORT_PROMPT_TXT",
    name: "Prompt TXT",
    description: "Full production prompt as plain UTF-8 text",
    formats: ["TXT"],
    ratios: ["Not applicable"],
    requirements: ["Final prompt", "Versioned filename"],
  },
  {
    id: "EXPORT_PROMPT_MD",
    name: "Prompt Markdown",
    description: "Project metadata, final brief, full prompt, version, and timestamp",
    formats: ["Markdown"],
    ratios: ["Not applicable"],
    requirements: ["Project metadata", "Final brief", "Full prompt", "Version", "Timestamp"],
  },
  {
    id: "EXPORT_PROMPT_JSON",
    name: "Prompt JSON",
    description: "Structured browser-only project backup and downstream handoff",
    formats: ["JSON"],
    ratios: ["Not applicable"],
    requirements: ["Project", "Answers", "Model", "Recipe", "Prompt blocks", "Warnings", "Version"],
  },
]
