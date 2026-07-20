export type PortraitStorageMode = "indexeddb" | "memory"

export type PortraitStorageStatus = {
  mode: PortraitStorageMode
  persistent: boolean
  warning?: string
}

export const PORTRAIT_DB_NAME = "krit-ai-portrait"
export const PORTRAIT_DB_VERSION = 1

export const PORTRAIT_STORES = {
  projects: "projects",
  answers: "answers",
  promptVersions: "promptVersions",
  customRecipes: "customRecipes",
  settings: "settings",
  exportHistory: "exportHistory",
} as const

export type PortraitStoreName =
  (typeof PORTRAIT_STORES)[keyof typeof PORTRAIT_STORES]

export type StoredAnswer = {
  id: string
  projectId: string
  stepId: string
  optionIds: string[]
  customValue?: string
  updatedAt: string
}

