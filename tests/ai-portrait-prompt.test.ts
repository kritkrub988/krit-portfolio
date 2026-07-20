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
import { resolveAllAutomaticAnswers } from "../src/lib/ai-portrait/auto-resolution-engine.ts"
import { effectiveOptionIds, normalizeProjectAnswer } from "../src/lib/ai-portrait/answer-utils.ts"
import { validateImportedPortraitProject, validateModelSafety } from "../src/lib/ai-portrait/safety-validation.ts"
import { migrateV1AnswerRecord, migrateV2ProjectWithImageRatio } from "../src/services/portrait-storage/indexed-db.ts"
import {
  CUSTOM_RATIO_OPTION_ID,
  IMAGE_RATIO_STEP_ID,
  MULTI_RATIO_OPTION_ID,
  resolveImageRatio,
  simplifyRatio,
  validateImageRatioAnswer,
} from "../src/lib/ai-portrait/image-ratio.ts"
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
    selectionMode: customValue ? "custom" : "manual",
    selectedOptionIds: [optionId(stepId, code)],
    resolvedOptionIds: [optionId(stepId, code)],
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
  assert.equal((built.fullPrompt.match(/## 12\. Shot List/g) ?? []).length, 1)
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
  assert.equal(effectiveOptionIds(reloaded?.answers["step-0-1"])[0], "step-0-1:b")
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

test("IndexedDB schema v3 declares all required stores", () => {
  assert.equal(PORTRAIT_DB_VERSION, 3)
  assert.deepEqual(Object.values(PORTRAIT_STORES).sort(), [
    "answers",
    "customRecipes",
    "decisionLogs",
    "exportHistory",
    "projects",
    "promptVersions",
    "settings",
  ])
})

test("V1 answers migrate to manual while empty answers migrate to auto", () => {
  const populated = migrateV1AnswerRecord({ stepId: "step-0-1", optionIds: ["step-0-1:b"], updatedAt: "2026-01-01T00:00:00.000Z" })
  const empty = migrateV1AnswerRecord({ stepId: "step-0-2", optionIds: [], updatedAt: "2026-01-01T00:00:00.000Z" })
  assert.equal(populated.selectionMode, "manual")
  assert.deepEqual(populated.selectedOptionIds, populated.resolvedOptionIds)
  assert.equal(empty.selectionMode, "auto")
  assert.deepEqual(empty.resolvedOptionIds, [])
  assert.equal(normalizeProjectAnswer("step-0-1", populated).selectionMode, "manual")
})

test("image ratio step appears before Shot Coverage without changing stable shot step IDs", () => {
  const ratioIndex = portraitWorkflow.phases.flatMap((phase) => phase.steps).findIndex((step) => step.id === IMAGE_RATIO_STEP_ID)
  const coverageIndex = portraitWorkflow.phases.flatMap((phase) => phase.steps).findIndex((step) => step.id === "step-8-1")
  assert.ok(ratioIndex >= 0 && ratioIndex < coverageIndex)
  assert.equal(workflowStepById.get(IMAGE_RATIO_STEP_ID)?.displayCode, "8.1")
  assert.equal(workflowStepById.get("step-8-1")?.displayCode, "8.2")
  assert.equal(workflowStepById.get("step-8-2")?.displayCode, "8.3")
  assert.equal(workflowStepById.get("step-8-3")?.displayCode, "8.4")
})

test("auto image ratio resolves deterministically from platform and creative intent", () => {
  const scenarios: Array<{ answers: Record<string, ProjectAnswer>; expected: string }> = [
    { answers: { "step-0-3": answer("step-0-3", "D") }, expected: "9:16" },
    { answers: { "step-0-3": answer("step-0-3", "B") }, expected: "4:5" },
    { answers: { "step-0-3": answer("step-0-3", "E"), "step-0-1": answer("step-0-1", "H") }, expected: "16:9" },
    { answers: { "step-0-3": answer("step-0-3", "F") }, expected: "2:3" },
    { answers: { "step-0-1": answer("step-0-1", "J", "travel environmental camera-standard landscape") }, expected: "3:2" },
  ]
  for (const scenario of scenarios) {
    const project = resolveAllAutomaticAnswers(createProject({ answers: scenario.answers })).project
    assert.equal(resolveImageRatio(project).primary, scenario.expected)
    assert.equal(project.answers[IMAGE_RATIO_STEP_ID].selectionMode, "auto")
  }
})

test("custom ratio simplifies 1080:1920 to 9:16 and suggests the preset", () => {
  assert.deepEqual(simplifyRatio(1080, 1920), { width: 9, height: 16, value: "9:16" })
  const custom = {
    ...answer(IMAGE_RATIO_STEP_ID, "H"),
    selectionMode: "custom" as const,
    selectedOptionIds: [CUSTOM_RATIO_OPTION_ID],
    imageRatio: { primary: "1080:1920", secondary: [], customWidthRatio: 1080, customHeightRatio: 1920 },
  }
  assert.deepEqual(validateImageRatioAnswer(custom), [])
  const project = createProject({ answers: { [IMAGE_RATIO_STEP_ID]: custom } })
  assert.equal(resolveImageRatio(project).primary, "9:16")
})

test("manual image ratio is never overwritten by auto recalculation", () => {
  const manual = {
    ...answer(IMAGE_RATIO_STEP_ID, "C"),
    imageRatio: { primary: "4:5", secondary: [] },
  }
  const project = createProject({ answers: { "step-0-3": answer("step-0-3", "D"), [IMAGE_RATIO_STEP_ID]: manual } })
  const resolved = resolveAllAutomaticAnswers(project).project
  assert.equal(resolveImageRatio(resolved).primary, "4:5")
  assert.deepEqual(resolved.answers[IMAGE_RATIO_STEP_ID], manual)
})

test("multi-ratio requires one primary and valid secondary ratios", () => {
  const valid: ProjectAnswer = {
    ...answer(IMAGE_RATIO_STEP_ID, "I"),
    selectedOptionIds: [MULTI_RATIO_OPTION_ID],
    imageRatio: { primary: "4:5", secondary: ["9:16", "1:1"] },
  }
  assert.deepEqual(validateImageRatioAnswer(valid), [])
  assert.ok(validateImageRatioAnswer({ ...valid, imageRatio: { primary: "4:5", secondary: [] } }).length > 0)
})

test("legacy draft migration adds Auto ratio and leaves immutable prompt versions unchanged", () => {
  const legacy = createProject({ answers: { "step-0-3": answer("step-0-3", "B") } })
  const snapshot: PromptVersion = {
    id: "legacy_version",
    projectId: legacy.id,
    versionNumber: 1,
    promptText: "immutable prompt",
    briefText: "immutable brief",
    snapshot: { name: legacy.name, status: legacy.status, currentStepId: legacy.currentStepId, answers: structuredClone(legacy.answers) },
    createdAt: legacy.createdAt,
  }
  const before = structuredClone(snapshot)
  const migrated = migrateV2ProjectWithImageRatio(legacy)
  assert.equal(migrated.answers[IMAGE_RATIO_STEP_ID].selectionMode, "auto")
  assert.deepEqual(snapshot, before)
  const resolved = resolveAllAutomaticAnswers(migrated).project
  assert.equal(resolveImageRatio(resolved).primary, "4:5")
})

test("prompt and JSON export include ratio composition, shot fields, and filename-safe token", () => {
  const ratioAnswer: ProjectAnswer = {
    ...answer(IMAGE_RATIO_STEP_ID, "I"),
    selectedOptionIds: [MULTI_RATIO_OPTION_ID],
    imageRatio: { primary: "4:5", secondary: ["9:16", "1:1"], shotOverrides: { S02: "9:16" } },
  }
  const project = createProject({
    answers: {
      [IMAGE_RATIO_STEP_ID]: ratioAnswer,
      "step-8-1": answer("step-8-1", "A"),
    },
  })
  const built = buildPortraitPrompt(portraitWorkflow, project)
  assert.match(built.fullPrompt, /## 11\. Image Format and Composition/)
  assert.match(built.fullPrompt, /ASPECT_RATIO: 4:5/)
  assert.match(built.fullPrompt, /composition-specific master/)
  assert.match(built.fullPrompt, /aspect_ratio: 9:16/)
  assert.match(built.fullPrompt, /SHOT RATIO OVERRIDE/)
  assert.equal(built.json.imageRatio.primary, "4:5")
  assert.deepEqual(built.json.imageRatio.secondary, ["9:16", "1:1"])
  assert.equal(built.json.schemaVersion, 3)
  const filename = createPromptFilename({ date: "2026-07-20", projectName: "Ratio Test", modelName: "MEI", imageRatio: "4:5", versionNumber: 1, extension: "json" })
  assert.match(filename, /_4x5_PROMPT_/)
  assert.doesNotMatch(filename, /4:5/)
})

test("new project auto resolution starts model-first with YUNA and never auto-approves", () => {
  const project = createProject()
  const resolved = resolveAllAutomaticAnswers(project, { triggeredBy: "test" }).project
  assert.equal(firstWorkflowStepId, "step-2-1")
  assert.equal(resolved.selectedModelId, "MODEL_A_YUNA")
  assert.equal(resolved.answers["step-2-1"].selectionMode, "auto")
  assert.deepEqual(effectiveOptionIds(resolved.answers["step-2-2"]), [])
  assert.equal(resolved.answers["step-2-2"].selectionMode, "manual")
  assert.equal(resolveImageRatio(resolved).primary, "4:5")
})

test("auto model recalculates from goal while manual and custom answers remain unchanged", () => {
  const initial = resolveAllAutomaticAnswers(createProject()).project
  initial.answers["step-0-1"] = answer("step-0-1", "D")
  initial.answers["step-0-2"] = { ...answer("step-0-2", "G", "Korean university campus audience"), selectionMode: "custom" }
  const manualBefore = structuredClone(initial.answers["step-0-1"])
  const customBefore = structuredClone(initial.answers["step-0-2"])
  const resolved = resolveAllAutomaticAnswers(initial, { triggeredBy: "step-0-2" }).project
  assert.equal(resolved.selectedModelId, "MODEL_F_HAEUN")
  assert.deepEqual(resolved.answers["step-0-1"], manualBefore)
  assert.deepEqual(resolved.answers["step-0-2"], customBefore)
})

test("switching a previously selected model back to auto does not make that model sticky", () => {
  const project = resolveAllAutomaticAnswers(createProject()).project
  project.selectedModelId = "MODEL_F_HAEUN"
  project.answers["step-2-1"] = {
    ...project.answers["step-2-1"],
    resolvedOptionIds: ["step-2-1:f"],
    autoReason: "Previous automatic model",
  }
  project.answers["step-0-1"] = answer("step-0-1", "D")

  const resolved = resolveAllAutomaticAnswers(project, { triggeredBy: "step-0-1" }).project

  assert.equal(resolved.selectedModelId, "MODEL_B_MEI")
  assert.deepEqual(effectiveOptionIds(resolved.answers["step-2-1"]), ["step-2-1:b"])
})

test("adult or sensual signal cannot auto-select AKARI", () => {
  const project = createProject({ answers: { "step-0-1": { ...answer("step-0-1", "J", "sensual school fashion"), selectionMode: "custom" } } })
  const resolved = resolveAllAutomaticAnswers(project).project
  assert.notEqual(resolved.selectedModelId, "MODEL_E_AKARI")
})

test("AKARI minor sexualization and age-up bypass are hard-blocked", () => {
  const project = createProject({
    selectedModelId: "MODEL_E_AKARI",
    answers: {
      "step-2-1": answer("step-2-1", "E"),
      "step-5-1": { ...answer("step-5-1", "J", "sensual lingerie, make her older, body focus on thighs"), selectionMode: "custom" },
    },
  })
  const codes = validateModelSafety(project).map((issue) => issue.code)
  assert.ok(codes.includes("MINOR_SEXUALIZATION"))
  assert.ok(codes.includes("MINOR_AGE_UP_BYPASS"))
  assert.equal(validateImportedPortraitProject(project).valid, false)
})

test("HAEUN age-down, body exaggeration, and whitening imports are rejected", () => {
  const project = createProject({
    selectedModelId: "MODEL_F_HAEUN",
    answers: {
      "step-2-1": answer("step-2-1", "F"),
      "step-5-1": { ...answer("step-5-1", "J", "make her younger, high-school look, extremely thin tiny waist, artificial whitening"), selectionMode: "custom" },
    },
  })
  const codes = validateModelSafety(project).map((issue) => issue.code)
  assert.ok(codes.includes("HAEUN_AGE_DOWN"))
  assert.ok(codes.includes("BODY_EXAGGERATION"))
  assert.ok(codes.includes("ARTIFICIAL_WHITENING"))
  assert.equal(validateImportedPortraitProject(project).valid, false)
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
    [IMAGE_RATIO_STEP_ID, "C"],
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
  for (let section = 1; section <= 17; section += 1) {
    assert.match(built.fullPrompt, new RegExp(`## ${section}\\.`))
  }
})
