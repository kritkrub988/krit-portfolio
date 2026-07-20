import { createPortraitId } from "@/lib/ai-portrait/ids"
import {
  deleteRecordsByProjectId,
  requestToPromise,
  withStore,
} from "@/services/portrait-storage/indexed-db"
import {
  PORTRAIT_STORES,
  type StoredAnswer,
} from "@/services/portrait-storage/types"
import type {
  CreateProjectInput,
  PortraitProject,
  PortraitProjectRepository,
  ProjectAnswer,
  PromptVersion,
} from "@/types/ai-portrait"

function nowIso(): string {
  return new Date().toISOString()
}

export class IndexedDbPortraitProjectRepository implements PortraitProjectRepository {
  async createProject(input: CreateProjectInput): Promise<PortraitProject> {
    const timestamp = nowIso()
    const project: PortraitProject = {
      id: createPortraitId("portrait"),
      name: input.name?.trim() || "Untitled Portrait Project",
      status: "draft",
      currentStepId: input.currentStepId,
      answers: {},
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    await withStore(PORTRAIT_STORES.projects, "readwrite", async (transaction) => {
      await requestToPromise(transaction.objectStore(PORTRAIT_STORES.projects).add(project))
    })
    return project
  }

  async getProject(id: string): Promise<PortraitProject | null> {
    return withStore(PORTRAIT_STORES.projects, "readonly", async (transaction) => {
      const result = await requestToPromise(
        transaction.objectStore(PORTRAIT_STORES.projects).get(id) as IDBRequest<PortraitProject | undefined>,
      )
      return result ?? null
    })
  }

  async listProjects(): Promise<PortraitProject[]> {
    return withStore(PORTRAIT_STORES.projects, "readonly", async (transaction) => {
      const projects = await requestToPromise(
        transaction.objectStore(PORTRAIT_STORES.projects).getAll() as IDBRequest<PortraitProject[]>,
      )
      return projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    })
  }

  async updateProject(
    id: string,
    patch: Partial<PortraitProject>,
  ): Promise<PortraitProject> {
    return withStore(PORTRAIT_STORES.projects, "readwrite", async (transaction) => {
      const store = transaction.objectStore(PORTRAIT_STORES.projects)
      const existing = await requestToPromise(
        store.get(id) as IDBRequest<PortraitProject | undefined>,
      )
      if (!existing) throw new Error("Project not found")

      const updated: PortraitProject = {
        ...existing,
        ...patch,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: nowIso(),
      }
      await requestToPromise(store.put(updated))
      return updated
    })
  }

  async deleteProject(id: string): Promise<void> {
    const stores = [
      PORTRAIT_STORES.projects,
      PORTRAIT_STORES.answers,
      PORTRAIT_STORES.promptVersions,
      PORTRAIT_STORES.customRecipes,
      PORTRAIT_STORES.exportHistory,
    ]
    await withStore(stores, "readwrite", async (transaction) => {
      transaction.objectStore(PORTRAIT_STORES.projects).delete(id)
      await Promise.all([
        deleteRecordsByProjectId(transaction, PORTRAIT_STORES.answers, id),
        deleteRecordsByProjectId(transaction, PORTRAIT_STORES.promptVersions, id),
        deleteRecordsByProjectId(transaction, PORTRAIT_STORES.customRecipes, id),
        deleteRecordsByProjectId(transaction, PORTRAIT_STORES.exportHistory, id),
      ])
    })
  }

  async saveAnswer(projectId: string, answer: ProjectAnswer): Promise<void> {
    await withStore(
      [PORTRAIT_STORES.projects, PORTRAIT_STORES.answers],
      "readwrite",
      async (transaction) => {
        const projects = transaction.objectStore(PORTRAIT_STORES.projects)
        const existing = await requestToPromise(
          projects.get(projectId) as IDBRequest<PortraitProject | undefined>,
        )
        if (!existing) throw new Error("Project not found")

        const storedAnswer: StoredAnswer = {
          id: `${projectId}:${answer.stepId}`,
          projectId,
          ...answer,
        }
        await requestToPromise(transaction.objectStore(PORTRAIT_STORES.answers).put(storedAnswer))
        await requestToPromise(projects.put({
          ...existing,
          answers: { ...existing.answers, [answer.stepId]: answer },
          status: "draft",
          briefApprovedAt: undefined,
          updatedAt: nowIso(),
        } satisfies PortraitProject))
      },
    )
  }

  async savePromptVersion(projectId: string, version: PromptVersion): Promise<void> {
    if (version.projectId !== projectId) throw new Error("Prompt version project does not match")
    await withStore(PORTRAIT_STORES.promptVersions, "readwrite", async (transaction) => {
      await requestToPromise(transaction.objectStore(PORTRAIT_STORES.promptVersions).add(version))
    })
  }

  async listPromptVersions(projectId: string): Promise<PromptVersion[]> {
    return withStore(PORTRAIT_STORES.promptVersions, "readonly", async (transaction) => {
      const versions = await requestToPromise(
        transaction
          .objectStore(PORTRAIT_STORES.promptVersions)
          .index("projectId")
          .getAll(IDBKeyRange.only(projectId)) as IDBRequest<PromptVersion[]>,
      )
      return versions.sort((a, b) => b.versionNumber - a.versionNumber)
    })
  }

  async deletePromptVersion(versionId: string): Promise<void> {
    await withStore(PORTRAIT_STORES.promptVersions, "readwrite", async (transaction) => {
      await requestToPromise(transaction.objectStore(PORTRAIT_STORES.promptVersions).delete(versionId))
    })
  }
}

