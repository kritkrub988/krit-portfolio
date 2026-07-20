import {
  PORTRAIT_DB_NAME,
  PORTRAIT_DB_VERSION,
  PORTRAIT_STORES,
  type PortraitStoreName,
} from "@/services/portrait-storage/types"

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

function migrateDatabase(database: IDBDatabase, transaction: IDBTransaction): void {
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

  void transaction
}

export function openPortraitDatabase(): Promise<IDBDatabase> {
  if (!isIndexedDbSupported()) {
    return Promise.reject(new Error("IndexedDB is not supported in this browser"))
  }
  if (databasePromise) return databasePromise

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(PORTRAIT_DB_NAME, PORTRAIT_DB_VERSION)

    request.onupgradeneeded = () => {
      if (!request.transaction) throw new Error("IndexedDB migration transaction is missing")
      migrateDatabase(request.result, request.transaction)
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

