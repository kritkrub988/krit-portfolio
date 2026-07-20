import { IndexedDbPortraitProjectRepository } from "@/services/portrait-storage/project-repository"
import { isIndexedDbSupported } from "@/services/portrait-storage/indexed-db"
import { MemoryPortraitProjectRepository } from "@/services/portrait-storage/memory-repository"
import type { PortraitStorageStatus } from "@/services/portrait-storage/types"
import type { PortraitProjectRepository } from "@/types/ai-portrait"

export type PortraitStorage = {
  repository: PortraitProjectRepository
  status: PortraitStorageStatus
}

let storage: PortraitStorage | null = null

export function getPortraitStorage(): PortraitStorage {
  if (storage) return storage
  if (isIndexedDbSupported()) {
    storage = {
      repository: new IndexedDbPortraitProjectRepository(),
      status: { mode: "indexeddb", persistent: true },
    }
  } else {
    storage = {
      repository: new MemoryPortraitProjectRepository(),
      status: {
        mode: "memory",
        persistent: false,
        warning: "เบราว์เซอร์นี้ไม่รองรับ IndexedDB ระบบจะเก็บ Draft ในหน่วยความจำชั่วคราวและข้อมูลจะหายเมื่อ Refresh",
      },
    }
  }
  return storage
}

export function fallbackToMemoryPortraitStorage(warning: string): PortraitStorage {
  storage = {
    repository: new MemoryPortraitProjectRepository(),
    status: {
      mode: "memory",
      persistent: false,
      warning,
    },
  }
  return storage
}

export * from "@/services/portrait-storage/export-service"
export * from "@/services/portrait-storage/custom-recipe-repository"
export * from "@/services/portrait-storage/prompt-version-repository"
export * from "@/services/portrait-storage/types"
