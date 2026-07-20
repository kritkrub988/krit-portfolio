import {
  PORTRAIT_DB_NAME,
  PORTRAIT_DB_VERSION,
  PORTRAIT_STORES,
  type PortraitStoreName,
} from "./types.ts"
import type { PortraitProject, ProjectAnswer } from "../../types/ai-portrait.ts"
import { IMAGE_RATIO_STEP_ID } from "../../lib/ai-portrait/image-ratio.ts"

let databasePromise: Promise<IDBDatabase> | null = null

export function isIndexedDbSupported(): boolean {
  return typeof window !== "undefined" && typeof window.indexedDB !== "undefined"
}

export function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"))
  })
}

export function transactionToPromise(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted"))
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed"))
  })
}

export function migrateV1AnswerRecord<T extends { optionIds?: string[]; stepId: string; updatedAt: string }>(answer: T) {
  const optionIds = answer.optionIds ?? []
  return {
    ...answer,
    selectionMode: optionIds.length > 0 ? "manual" as const : "auto" as const,
    selectedOptionIds: optionIds.length > 0 ? [...optionIds] : [],
    resolvedOptionIds: [...optionIds],
  }
}

export function migrateV2ProjectWithImageRatio<T extends { answers?: Record<string, ProjectAnswer>; updatedAt: string }>(project: T): T & { answers: Record<string, ProjectAnswer> } {
  if (project.answers?.[IMAGE_RATIO_STEP_ID]) return project as T & { answers: Record<string, ProjectAnswer> }
  const ratioAnswer: ProjectAnswer = {
    stepId: IMAGE_RATIO_STEP_ID,
    selectionMode: "auto",
    selectedOptionIds: [],
    resolvedOptionIds: [],
    imageRatio: { secondary: [] },
    updatedAt: project.updatedAt,
  }
  return { ...project, answers: { ...(project.answers ?? {}), [IMAGE_RATIO_STEP_ID]: ratioAnswer } }
}

function migrateDatabase(database: IDBDatabase, transaction: IDBTransaction, oldVersion: number): void {
  if (!database.objectStoreNames.contains(PORTRAIT_STORES.projects)) {
    const store = database.createObjectStore(PORTRAIT_STORES.projects, { keyPath: "id" })
    store.createIndex("updatedAt", "updatedAt")
    store.createIndex("status", "status")
  }

  if (!database.objectStoreNames.contains(PORTRAIT_STORES.answers)) {
    const store = database.createObjectStore(PORTRAIT_STORES.answers, { keyPath: "id" })
    store.createIndex("projectId", "projectId")
  }

  if (!database.objectStoreNames.contains(PORTRAIT_STORES.promptVersions)) {
    const store = database.createObjectStore(PORTRAIT_STORES.promptVersions, { keyPath: "id" })
    store.createIndex("projectId", "projectId")
    store.createIndex("projectVersion", ["projectId", "versionNumber"], { unique: true })
  }

  if (!database.objectStoreNames.contains(PORTRAIT_STORES.customRecipes)) {
    const store = database.createObjectStore(PORTRAIT_STORES.customRecipes, { keyPath: "id" })
    store.createIndex("projectId", "projectId")
  }

  if (!database.objectStoreNames.contains(PORTRAIT_STORES.settings)) {
    database.createObjectStore(PORTRAIT_STORES.settings, { keyPath: "key" })
  }

  if (!database.objectStoreNames.contains(PORTRAIT_STORES.exportHistory)) {
    const store = database.createObjectStore(PORTRAIT_STORES.exportHistory, { keyPath: "id" })
    store.createIndex("projectId", "projectId")
  }

  if (!database.objectStoreNames.contains(PORTRAIT_STORES.decisionLogs)) {
    const store = database.createObjectStore(PORTRAIT_STORES.decisionLogs, { keyPath: "id" })
    store.createIndex("projectId", "projectId")
  }

  if (oldVersion > 0 && oldVersion < 2) {
    const migrateCursor = (storeName: typeof PORTRAIT_STORES.answers | typeof PORTRAIT_STORES.projects) => {
      const store = transaction.objectStore(storeName)
      const request = store.openCursor()
      request.onsuccess = () => {
        const cursor = request.result
        if (!cursor) return
        if (storeName === PORTRAIT_STORES.answers) {
          cursor.update(migrateV1AnswerRecord(cursor.value))
        } else {
          const project = cursor.value
          const answers = Object.fromEntries(
            Object.entries(project.answers ?? {}).map(([stepId, raw]) => [
              stepId,
              migrateV1AnswerRecord({ ...(raw as Record<string, unknown>), stepId, updatedAt: (raw as { updatedAt?: string }).updatedAt ?? project.updatedAt }),
            ]),
          )
          const migrated = migrateV2ProjectWithImageRatio({ ...project, answers })
          cursor.update(migrated)
          transaction.objectStore(PORTRAIT_STORES.answers).put({
            id: `${project.id}:${IMAGE_RATIO_STEP_ID}`,
            projectId: project.id,
            ...migrated.answers[IMAGE_RATIO_STEP_ID],
          })
        }
        cursor.continue()
      }
    }
    migrateCursor(PORTRAIT_STORES.answers)
    migrateCursor(PORTRAIT_STORES.projects)
  }

  if (oldVersion >= 2 && oldVersion < 3) {
    const projects = transaction.objectStore(PORTRAIT_STORES.projects)
    const answers = transaction.objectStore(PORTRAIT_STORES.answers)
    const request = projects.openCursor()
    request.onsuccess = () => {
      const cursor = request.result
      if (!cursor) return
      const migrated = migrateV2ProjectWithImageRatio(cursor.value as PortraitProject)
      cursor.update(migrated)
      answers.put({
        id: `${migrated.id}:${IMAGE_RATIO_STEP_ID}`,
        projectId: migrated.id,
        ...migrated.answers[IMAGE_RATIO_STEP_ID],
      })
      cursor.continue()
    }
  }

  void transaction
}

export function openPortraitDatabase(): Promise<IDBDatabase> {
  if (!isIndexedDbSupported()) {
    return Promise.reject(new Error("IndexedDB is not supported in this browser"))
  }
  if (databasePromise) return databasePromise

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(PORTRAIT_DB_NAME, PORTRAIT_DB_VERSION)

    request.onupgradeneeded = (event) => {
      if (!request.transaction) throw new Error("IndexedDB migration transaction is missing")
      migrateDatabase(request.result, request.transaction, event.oldVersion)
    }
    request.onsuccess = () => {
      const database = request.result
      database.onversionchange = () => database.close()
      resolve(database)
    }
    request.onerror = () => {
      databasePromise = null
      reject(request.error ?? new Error("Could not open IndexedDB"))
    }
    request.onblocked = () => {
      databasePromise = null
      reject(new Error("IndexedDB migration is blocked by another open tab"))
    }
  })

  return databasePromise
}

export async function withStore<T>(
  storeNames: PortraitStoreName | PortraitStoreName[],
  mode: IDBTransactionMode,
  operation: (transaction: IDBTransaction) => Promise<T>,
): Promise<T> {
  const database = await openPortraitDatabase()
  const transaction = database.transaction(storeNames, mode)
  const completion = transactionToPromise(transaction)
  const result = await operation(transaction)
  await completion
  return result
}

export async function deleteRecordsByProjectId(
  transaction: IDBTransaction,
  storeName: PortraitStoreName,
  projectId: string,
): Promise<void> {
  const store = transaction.objectStore(storeName)
  if (!store.indexNames.contains("projectId")) return
  const request = store.index("projectId").openKeyCursor(IDBKeyRange.only(projectId))

  await new Promise<void>((resolve, reject) => {
    request.onsuccess = () => {
      const cursor = request.result
      if (!cursor) {
        resolve()
        return
      }
      store.delete(cursor.primaryKey)
      cursor.continue()
    }
    request.onerror = () => reject(request.error ?? new Error("Could not delete project records"))
  })
}
