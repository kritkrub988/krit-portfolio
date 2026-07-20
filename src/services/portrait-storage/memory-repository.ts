import { createPortraitId } from "../../lib/ai-portrait/ids.ts"
import { resolveAllAutomaticAnswers } from "../../lib/ai-portrait/auto-resolution-engine.ts"
import { createInitialAnswer, normalizePortraitProject } from "../../lib/ai-portrait/answer-utils.ts"
import { workflowSteps } from "../../data/ai-portrait/workflow.ts"
import type {
  CreateProjectInput,
  PortraitProject,
  PortraitProjectRepository,
  ProjectAnswer,
  PromptVersion,
  AutoDecisionLog,
} from "../../types/ai-portrait.ts"

const projects = new Map<string, PortraitProject>()
const versions = new Map<string, PromptVersion>()
const decisionLogs = new Map<string, AutoDecisionLog>()

function copyProject(project: PortraitProject): PortraitProject {
  return structuredClone(project)
}

export class MemoryPortraitProjectRepository implements PortraitProjectRepository {
  async createProject(input: CreateProjectInput): Promise<PortraitProject> {
    const timestamp = new Date().toISOString()
    const base: PortraitProject = {
      id: createPortraitId("memory_portrait"),
      name: input.name?.trim() || "Untitled Portrait Project",
      status: "draft",
      currentStepId: input.currentStepId,
      answers: Object.fromEntries(workflowSteps.map((step) => [step.id, createInitialAnswer(step, timestamp)])),
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    const { project, logs } = resolveAllAutomaticAnswers(base, { triggeredBy: "project-created" })
    for (const log of logs) decisionLogs.set(log.id, log)
    projects.set(project.id, project)
    return copyProject(project)
  }

  async getProject(id: string): Promise<PortraitProject | null> {
    const project = projects.get(id)
    return project ? copyProject(resolveAllAutomaticAnswers(normalizePortraitProject(project), { triggeredBy: "project-opened" }).project) : null
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

  async saveAutoDecisionLogs(logs: AutoDecisionLog[]): Promise<void> {
    for (const log of logs) decisionLogs.set(log.id, structuredClone(log))
  }

  async listAutoDecisionLogs(projectId: string): Promise<AutoDecisionLog[]> {
    return [...decisionLogs.values()].filter((log) => log.projectId === projectId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((log) => structuredClone(log))
  }
}
