import { createPortraitId } from "../../lib/ai-portrait/ids.ts"
import type {
  CreateProjectInput,
  PortraitProject,
  PortraitProjectRepository,
  ProjectAnswer,
  PromptVersion,
} from "../../types/ai-portrait.ts"

const projects = new Map<string, PortraitProject>()
const versions = new Map<string, PromptVersion>()

function copyProject(project: PortraitProject): PortraitProject {
  return structuredClone(project)
}

export class MemoryPortraitProjectRepository implements PortraitProjectRepository {
  async createProject(input: CreateProjectInput): Promise<PortraitProject> {
    const timestamp = new Date().toISOString()
    const project: PortraitProject = {
      id: createPortraitId("memory_portrait"),
      name: input.name?.trim() || "Untitled Portrait Project",
      status: "draft",
      currentStepId: input.currentStepId,
      answers: {},
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    projects.set(project.id, project)
    return copyProject(project)
  }

  async getProject(id: string): Promise<PortraitProject | null> {
    const project = projects.get(id)
    return project ? copyProject(project) : null
  }

  async listProjects(): Promise<PortraitProject[]> {
    return [...projects.values()]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map(copyProject)
  }

  async updateProject(id: string, patch: Partial<PortraitProject>): Promise<PortraitProject> {
    const existing = projects.get(id)
    if (!existing) throw new Error("Project not found")
    const updated: PortraitProject = {
      ...existing,
      ...structuredClone(patch),
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    }
    projects.set(id, updated)
    return copyProject(updated)
  }

  async deleteProject(id: string): Promise<void> {
    projects.delete(id)
    for (const [versionId, version] of versions) {
      if (version.projectId === id) versions.delete(versionId)
    }
  }

  async saveAnswer(projectId: string, answer: ProjectAnswer): Promise<void> {
    const project = projects.get(projectId)
    if (!project) throw new Error("Project not found")
    projects.set(projectId, {
      ...project,
      answers: { ...project.answers, [answer.stepId]: structuredClone(answer) },
      status: "draft",
      briefApprovedAt: undefined,
      updatedAt: new Date().toISOString(),
    })
  }

  async savePromptVersion(projectId: string, version: PromptVersion): Promise<void> {
    if (!projects.has(projectId)) throw new Error("Project not found")
    if (version.projectId !== projectId) throw new Error("Prompt version project does not match")
    versions.set(version.id, structuredClone(version))
  }

  async listPromptVersions(projectId: string): Promise<PromptVersion[]> {
    return [...versions.values()]
      .filter((version) => version.projectId === projectId)
      .sort((a, b) => b.versionNumber - a.versionNumber)
      .map((version) => structuredClone(version))
  }

  async deletePromptVersion(versionId: string): Promise<void> {
    versions.delete(versionId)
  }
}
