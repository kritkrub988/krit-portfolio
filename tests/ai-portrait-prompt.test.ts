import assert from "node:assert/strict"
import test from "node:test"

import {
  firstWorkflowStepId,
  portraitWorkflow,
  workflowStepById,
} from "../src/data/ai-portrait/workflow.ts"
import { buildPortraitPrompt } from "../src/lib/ai-portrait/prompt-builder.ts"
import {
  findInvalidatedAnswerStepIds,
  getOptionAvailability,
} from "../src/lib/ai-portrait/dependency-rules.ts"
import {
  createPromptFilename,
  getBangkokDateForFilename,
} from "../src/lib/ai-portrait/ids.ts"
import { recommendRecipes } from "../src/lib/ai-portrait/recommendation-engine.ts"
import {
  validateMasterData,
  validateStepAnswer,
} from "../src/lib/ai-portrait/validation.ts"
import { MemoryPortraitProjectRepository } from "../src/services/portrait-storage/memory-repository.ts"
import { nextPromptVersionNumber } from "../src/services/portrait-storage/prompt-version-repository.ts"
import {
  PORTRAIT_DB_VERSION,
  PORTRAIT_STORES,
} from "../src/services/portrait-storage/types.ts"
import type {
  PortraitProject,
  ProjectAnswer,
  PromptVersion,
} from "../src/types/ai-portrait.ts"

function optionId(stepId: string, code: string): string {
  const option = workflowStepById
    .get(stepId)
    ?.options?.find((item) => item.code === code)
  assert.ok(option, `Missing option ${stepId}:${code}`)
  return option.id
}

function answer(stepId: string, code: string, customValue?: string): ProjectAnswer {
  return {
    stepId,
    optionIds: [optionId(stepId, code)],
    customValue,
    updatedAt: "2026-07-20T00:00:00.000Z",
  }
}

function createProject(overrides: Partial<PortraitProject> = {}): PortraitProject {
  return {
    id: "portrait_test",
    name: "Test Portrait",
    status: "draft",
    currentStepId: firstWorkflowStepId,
    answers: {},
    createdAt: "2026-07-20T00:00:00.000Z",
    updatedAt: "2026-07-20T00:00:00.000Z",
    ...overrides,
  }
}

test("master data passes ID, model, recipe, and dependency validation", () => {
  assert.deepEqual(validateMasterData(), [])
})

test("export filename date follows the Bangkok calendar day", () => {
  assert.equal(
    getBangkokDateForFilename("2026-07-19T18:30:00.000Z"),
    "2026-07-20",
  )
})

test("prompt builder creates each live block once and preserves custom values", () => {
  const project = createProject({
    answers: {
      "step-0-1": answer("step-0-1", "J", "Portrait launch for a sustainable design studio"),
      "step-0-2": answer("step-0-2", "D"),
      "step-0-3": answer("step-0-3", "C"),
      "step-0-4": answer("step-0-4", "C"),
      "step-2-1": answer("step-2-1", "B"),
      "step-2-2": answer("step-2-2", "A"),
      "step-3-1": answer("step-3-1", "K"),
      "step-8-1": answer("step-8-1", "B"),
    },
    selectedModelId: "MODEL_B_MEI",
    selectedRecipeId: "PR-11",
  })

  const built = buildPortraitPrompt(portraitWorkflow, project)
  assert.equal(new Set(built.blocks.map((block) => block.key)).size, built.blocks.length)
  assert.match(built.fullPrompt, /Portrait launch for a sustainable design studio/)
  assert.match(built.fullPrompt, /S08 — Negative-space Cover/)
  assert.equal((built.fullPrompt.match(/## 11\. Shot List/g) ?? []).length, 1)
  assert.match(built.fullPrompt, /The subject is a fictional person/)
  assert.match(built.fullPrompt, /Prompt พร้อมแล้ว คัดลอกไปวางใน ChatGPT Project/)
})

test("Social Content updates the project setup prompt without duplicate goal text", () => {
  const project = createProject({ answers: { "step-0-1": answer("step-0-1", "B") } })
  const built = buildPortraitPrompt(portraitWorkflow, project)
  assert.match(built.fullPrompt, /Goal: Social Content/)
  assert.equal((built.fullPrompt.match(/Goal: Social Content/g) ?? []).length, 1)
})

test("YUNA Japanese film scenario recommends only two compatible recipes", () => {
  const project = createProject({
    selectedModelId: "MODEL_A_YUNA",
    answers: {
      "step-0-1": answer("step-0-1", "I"),
      "step-1-1": answer("step-1-1", "C"),
      "step-1-3": answer("step-1-3", "C"),
      "step-2-1": answer("step-2-1", "A"),
    },
  })
  const recommendations = recommendRecipes(project)
  assert.equal(recommendations.length, 2)
  assert.equal(recommendations[0].recipe.id, "PR-02")
  assert.ok(recommendations.every((item) => item.recipe.recommendedModels.includes("MODEL_A_YUNA")))
})

test("restricted recipe is disabled and upstream change invalidates it", () => {
  const project = createProject({
    selectedModelId: "MODEL_A_YUNA",
    selectedRecipeId: "PR-14",
    answers: {
      "step-2-1": answer("step-2-1", "A"),
      "step-3-1": answer("step-3-1", "N"),
    },
  })
  const recipeOption = workflowStepById.get("step-3-1")?.options?.find((item) => item.metadata?.recipeId === "PR-14")
  assert.ok(recipeOption)
  assert.equal(getOptionAvailability(project, "step-3-1", recipeOption).disabled, true)
  assert.deepEqual(findInvalidatedAnswerStepIds(project), ["step-3-1"])
})

test("required step validation rejects missing answers and accepts a valid answer", () => {
  const step = workflowStepById.get("step-0-1")
  assert.ok(step)
  assert.ok(validateStepAnswer(step, undefined).length > 0)
  assert.deepEqual(validateStepAnswer(step, answer("step-0-1", "B")), [])
})

test("prompt versions increment and filename uses stable production format", () => {
  const versions = [1, 2, 4].map((versionNumber) => ({ versionNumber }) as PromptVersion)
  assert.equal(nextPromptVersionNumber(versions), 5)
  assert.equal(
    createPromptFilename({
      date: "2026-07-20",
      projectName: "Modern Femininity",
      modelName: "MEI",
      versionNumber: 1,
      extension: "json",
    }),
    "2026-07-20_MODERN_FEMININITY_MEI_PROMPT_V001.json",
  )
})

test("memory repository supports create, save, reload, version, approval invalidation, and delete", async () => {
  const repository = new MemoryPortraitProjectRepository()
  const project = await repository.createProject({ name: "Storage Test", currentStepId: firstWorkflowStepId })
  await repository.updateProject(project.id, {
    status: "brief-approved",
    briefApprovedAt: "2026-07-20T01:00:00.000Z",
  })
  await repository.saveAnswer(project.id, answer("step-0-1", "B"))
  const reloaded = await repository.getProject(project.id)
  assert.equal(reloaded?.answers["step-0-1"].optionIds[0], "step-0-1:b")
  assert.equal(reloaded?.status, "draft")
  assert.equal(reloaded?.briefApprovedAt, undefined)

  const version: PromptVersion = {
    id: "version_storage_test",
    projectId: project.id,
    versionNumber: 1,
    promptText: "prompt",
    briefText: "brief",
    snapshot: {
      name: reloaded?.name ?? "Storage Test",
      status: "draft",
      currentStepId: firstWorkflowStepId,
      answers: reloaded?.answers ?? {},
    },
    createdAt: "2026-07-20T02:00:00.000Z",
  }
  await repository.savePromptVersion(project.id, version)
  assert.equal((await repository.listPromptVersions(project.id)).length, 1)
  await repository.deleteProject(project.id)
  assert.equal(await repository.getProject(project.id), null)
  assert.equal((await repository.listPromptVersions(project.id)).length, 0)
})

test("IndexedDB schema v1 declares all required stores", () => {
  assert.equal(PORTRAIT_DB_VERSION, 1)
  assert.deepEqual(Object.values(PORTRAIT_STORES).sort(), [
    "answers",
    "customRecipes",
    "exportHistory",
    "projects",
    "promptVersions",
    "settings",
  ])
})

test("required MEI Social Content scenario produces a complete coherent 8-shot prompt", () => {
  const selections: Array<[string, string]> = [
    ["step-0-1", "B"], ["step-0-2", "D"], ["step-0-3", "C"], ["step-0-4", "C"],
    ["step-1-1", "B"], ["step-1-2", "F"], ["step-1-3", "B"],
    ["step-2-1", "B"], ["step-2-2", "A"],
    ["step-3-1", "K"], ["step-3-2", "B"], ["step-3-3", "C"],
    ["step-4-1", "A"], ["step-4-2", "F"], ["step-4-3", "H"], ["step-4-4", "G"],
    ["step-5-1", "B"], ["step-5-2", "A"], ["step-5-3", "C"], ["step-5-4", "B"],
    ["step-6-1", "D"], ["step-6-2", "A"],
    ["step-7-1", "A"], ["step-7-2", "A"], ["step-7-3", "A"], ["step-7-4", "A"],
    ["step-8-1", "B"], ["step-8-2", "A"], ["step-8-3", "A"],
    ["step-9-1", "A"], ["step-9-2", "A"],
    ["step-10-1", "A"], ["step-10-2", "A"], ["step-10-3", "A"],
  ]
  const answers = Object.fromEntries(
    selections.map(([stepId, code]) => [stepId, answer(stepId, code)]),
  )
  const project = createProject({
    name: "MEI Modern Femininity",
    status: "prompt-ready",
    currentStepId: "step-10-3",
    selectedModelId: "MODEL_B_MEI",
    selectedRecipeId: "PR-11",
    briefApprovedAt: "2026-07-20T03:00:00.000Z",
    answers,
  })
  const built = buildPortraitPrompt(portraitWorkflow, project)

  assert.equal(built.warnings.length, 0)
  assert.match(built.fullPrompt, /MEI_ID_V1\.0/)
  assert.match(built.fullPrompt, /Hasselblad X2D 100C/)
  assert.match(built.fullPrompt, /Clean Beauty Clamshell/)
  assert.match(built.fullPrompt, /Kodak Portra 160/)
  assert.match(built.fullPrompt, /Post Grade: Clean Editorial/)
  assert.equal((built.fullPrompt.match(/S0[1-8] —/g) ?? []).length, 8)
  for (let section = 1; section <= 16; section += 1) {
    assert.match(built.fullPrompt, new RegExp(`## ${section}\\.`))
  }
})
