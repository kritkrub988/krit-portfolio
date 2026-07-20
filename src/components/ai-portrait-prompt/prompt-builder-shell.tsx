"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ConfirmDialog } from "@/components/ai-portrait-prompt/confirm-dialog"
import { LivePromptPreview } from "@/components/ai-portrait-prompt/live-prompt-preview"
import { ProjectList } from "@/components/ai-portrait-prompt/project-list"
import { StartScreen } from "@/components/ai-portrait-prompt/start-screen"
import { StepForm } from "@/components/ai-portrait-prompt/step-form"
import { WorkflowSidebar } from "@/components/ai-portrait-prompt/workflow-sidebar"
import {
  firstWorkflowStepId,
  portraitModelById,
  portraitWorkflow,
  workflowStepById,
  workflowSteps,
} from "@/data/ai-portrait"
import { deriveSelectedModelId, findInvalidatedAnswerStepIds } from "@/lib/ai-portrait/dependency-rules"
import { buildPortraitPrompt } from "@/lib/ai-portrait/prompt-builder"
import { validateStepAnswer } from "@/lib/ai-portrait/validation"
import {
  copyPromptToClipboard,
  createPromptVersion,
  downloadPreparedExport,
  getPortraitStorage,
  nextPromptVersionNumber,
  preparePromptExport,
  recordExport,
  saveCustomRecipeForProject,
  fallbackToMemoryPortraitStorage,
  type PortraitStorageStatus,
} from "@/services/portrait-storage"
import type {
  BuiltPrompt,
  PortraitProject,
  PortraitProjectRepository,
  ProjectAnswer,
  PromptVersion,
} from "@/types/ai-portrait"

type View = "loading" | "start" | "projects" | "builder"

type Confirmation = {
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  action: () => void | Promise<void>
}

export function PromptBuilderShell({ initialProjectId }: { initialProjectId?: string }) {
  const repositoryRef = useRef<PortraitProjectRepository | null>(null)
  const projectRef = useRef<PortraitProject | null>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [storageStatus, setStorageStatus] = useState<PortraitStorageStatus>({
    mode: "indexeddb",
    persistent: true,
  })
  const [view, setView] = useState<View>("loading")
  const [projects, setProjects] = useState<PortraitProject[]>([])
  const [project, setProject] = useState<PortraitProject | null>(null)
  const [versions, setVersions] = useState<PromptVersion[]>([])
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [query, setQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)

  useEffect(() => {
    const portraitStorage = getPortraitStorage()
    repositoryRef.current = portraitStorage.repository
    let cancelled = false

    async function initialize() {
      try {
        const savedProjects = await portraitStorage.repository.listProjects()
        if (cancelled) return
        setStorageStatus(portraitStorage.status)
        setProjects(savedProjects)
        if (initialProjectId) {
          const savedProject = await portraitStorage.repository.getProject(initialProjectId)
          if (savedProject) {
            const savedVersions = await portraitStorage.repository.listPromptVersions(savedProject.id)
            projectRef.current = savedProject
            setProject(savedProject)
            setVersions(savedVersions)
            setView("builder")
            return
          }
          setNotice("ไม่พบ Project ที่ระบุ อาจถูกลบหรือเป็นข้อมูลจากเบราว์เซอร์อื่น")
          setView("projects")
          return
        }
        setView("start")
      } catch (error) {
        console.error(error)
        if (cancelled) return
        const fallback = fallbackToMemoryPortraitStorage(
          "IndexedDB เปิดหรือย้ายข้อมูลไม่สำเร็จ ระบบจะเก็บ Draft ในหน่วยความจำชั่วคราวและข้อมูลจะหายเมื่อ Refresh",
        )
        repositoryRef.current = fallback.repository
        setStorageStatus(fallback.status)
        setProjects([])
        setNotice("เปิด IndexedDB ไม่สำเร็จ จึงเปลี่ยนเป็น Memory Mode ชั่วคราว")
        setView("start")
      }
    }
    void initialize()
    return () => {
      cancelled = true
    }
  }, [initialProjectId])

  useEffect(() => {
    projectRef.current = project
  }, [project])

  useEffect(() => {
    function flushPendingSave() {
      const pending = projectRef.current
      const repository = repositoryRef.current
      if (!pending || !repository || !saveTimerRef.current) return
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
      void repository.updateProject(pending.id, pending)
    }
    window.addEventListener("pagehide", flushPendingSave)
    return () => {
      flushPendingSave()
      window.removeEventListener("pagehide", flushPendingSave)
    }
  }, [])

  const builtPrompt = useMemo<BuiltPrompt | null>(
    () => project ? buildPortraitPrompt(portraitWorkflow, project) : null,
    [project],
  )

  function repository(): PortraitProjectRepository {
    if (!repositoryRef.current) throw new Error("Storage is not ready")
    return repositoryRef.current
  }

  function updateUrl(projectId?: string) {
    const url = projectId
      ? `/projects/ai-portrait-prompt/projects/${projectId}`
      : "/projects/ai-portrait-prompt"
    window.history.pushState(null, "", url)
  }

  async function refreshProjects() {
    const saved = await repository().listProjects()
    setProjects(saved)
  }

  function scheduleProjectSave(nextProject: PortraitProject) {
    setProject(nextProject)
    projectRef.current = nextProject
    setSaveStatus("saving")
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null
      repository().updateProject(nextProject.id, nextProject)
        .then(() => {
          setSaveStatus("saved")
          return refreshProjects()
        })
        .catch((error: unknown) => {
          console.error(error)
          setSaveStatus("error")
        })
    }, 450)
  }

  async function persistImmediately(nextProject: PortraitProject) {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }
    setProject(nextProject)
    projectRef.current = nextProject
    setSaveStatus("saving")
    try {
      const saved = await repository().updateProject(nextProject.id, nextProject)
      setProject(saved)
      projectRef.current = saved
      setSaveStatus("saved")
      await refreshProjects()
      return saved
    } catch (error) {
      console.error(error)
      setSaveStatus("error")
      throw error
    }
  }

  async function createNewProject() {
    try {
      const created = await repository().createProject({ currentStepId: firstWorkflowStepId })
      setProject(created)
      projectRef.current = created
      setVersions([])
      setView("builder")
      setSidebarOpen(false)
      updateUrl(created.id)
      await refreshProjects()
    } catch (error) {
      console.error(error)
      setNotice("สร้าง Project ไม่สำเร็จ กรุณาตรวจสิทธิ์พื้นที่จัดเก็บของเบราว์เซอร์")
    }
  }

  async function openProject(selected: PortraitProject) {
    const latest = await repository().getProject(selected.id)
    if (!latest) return
    setProject(latest)
    projectRef.current = latest
    setVersions(await repository().listPromptVersions(latest.id))
    setView("builder")
    setSidebarOpen(false)
    updateUrl(latest.id)
  }

  function goStart() {
    setView("start")
    setProject(null)
    projectRef.current = null
    setVersions([])
    updateUrl()
  }

  function applyAnswer(answer: ProjectAnswer) {
    if (!project) return
    const step = workflowStepById.get(answer.stepId)
    const isPostBriefControl = step ? Number(step.phaseId.replace("phase-", "")) >= 10 : false
    const selectedOption = step?.options?.find((option) => answer.optionIds.includes(option.id))
    const selectedModelId = step?.id === "step-2-1"
      ? (typeof selectedOption?.metadata?.modelId === "string" ? selectedOption.metadata.modelId : undefined)
      : project.selectedModelId
    const selectedRecipeId = step?.id === "step-3-1"
      ? (typeof selectedOption?.metadata?.recipeId === "string" ? selectedOption.metadata.recipeId : undefined)
      : project.selectedRecipeId
    const tentative: PortraitProject = {
      ...project,
      answers: { ...project.answers, [answer.stepId]: answer },
      selectedModelId,
      selectedRecipeId,
      status: isPostBriefControl ? project.status : "draft",
      briefApprovedAt: isPostBriefControl ? project.briefApprovedAt : undefined,
      updatedAt: answer.updatedAt,
    }
    const invalidated = findInvalidatedAnswerStepIds(tentative)
      .filter((stepId) => stepId !== answer.stepId && Boolean(tentative.answers[stepId]))

    const commit = () => {
      const answers = { ...tentative.answers }
      for (const stepId of invalidated) delete answers[stepId]
      const committedProject = {
        ...tentative,
        answers,
        selectedRecipeId: invalidated.includes("step-3-1") ? undefined : tentative.selectedRecipeId,
      }
      scheduleProjectSave(committedProject)
      if (
        storageStatus.persistent &&
        step?.id === "step-3-1" &&
        /custom/i.test(selectedOption?.label ?? "") &&
        answer.customValue?.trim()
      ) {
        void saveCustomRecipeForProject(committedProject).catch((error: unknown) => {
          console.error(error)
          setNotice("บันทึก Custom Recipe ไม่สำเร็จ แต่คำตอบใน Project ยังถูกเก็บไว้")
        })
      }
    }

    if (invalidated.length > 0) {
      const labels = invalidated.map((stepId) => workflowStepById.get(stepId)?.code ?? stepId).join(", ")
      setConfirmation({
        title: "คำตอบปลายทางไม่สอดคล้องแล้ว",
        message: `การเปลี่ยนคำตอบนี้จะล้างคำตอบ Step ${labels} ซึ่งขัดกับ Model/Recipe/Capture Medium ใหม่ ต้องการดำเนินการต่อหรือไม่?`,
        confirmLabel: "เปลี่ยนและล้างคำตอบ",
        action: commit,
      })
      return
    }
    commit()
  }

  function navigateToStep(stepId: string) {
    if (!project) return
    scheduleProjectSave({ ...project, currentStepId: stepId, updatedAt: new Date().toISOString() })
    setSidebarOpen(false)
  }

  async function saveVersion(targetProject = project, targetBuiltPrompt = builtPrompt) {
    if (!targetProject || !targetBuiltPrompt) return
    const existingVersions = await repository().listPromptVersions(targetProject.id)
    const version = createPromptVersion(
      targetProject,
      targetBuiltPrompt,
      nextPromptVersionNumber(existingVersions),
    )
    await repository().savePromptVersion(targetProject.id, version)
    setVersions(await repository().listPromptVersions(targetProject.id))
    setNotice(`บันทึก Prompt Version ${version.versionNumber.toString().padStart(3, "0")} แล้ว`)
  }

  async function goNext() {
    if (!project) return
    const index = workflowSteps.findIndex((step) => step.id === project.currentStepId)
    const step = workflowSteps[index]
    if (!step || validateStepAnswer(step, project.answers[step.id]).length > 0) return
    const nextStep = workflowSteps[index + 1]
    let nextProject = { ...project }

    if (step.id === "step-9-2" && project.answers[step.id]?.optionIds[0] === "step-9-2:a") {
      nextProject = {
        ...nextProject,
        status: "brief-approved",
        briefApprovedAt: new Date().toISOString(),
      }
      const saved = await persistImmediately({
        ...nextProject,
        currentStepId: nextStep?.id ?? step.id,
        updatedAt: new Date().toISOString(),
      })
      await saveVersion(saved, buildPortraitPrompt(portraitWorkflow, saved))
      return
    }

    if (step.id === "step-10-3" && project.answers[step.id]?.optionIds[0] === "step-10-3:a") {
      nextProject = { ...nextProject, status: "prompt-ready" }
    }

    scheduleProjectSave({
      ...nextProject,
      currentStepId: nextStep?.id ?? step.id,
      updatedAt: new Date().toISOString(),
    })
  }

  function goPrevious() {
    if (!project) return
    const index = workflowSteps.findIndex((step) => step.id === project.currentStepId)
    if (index > 0) navigateToStep(workflowSteps[index - 1].id)
  }

  async function copyText(value: string, message: string) {
    try {
      await copyPromptToClipboard(value)
      setNotice(message)
    } catch (error) {
      console.error(error)
      setNotice("คัดลอกไม่สำเร็จ เบราว์เซอร์อาจไม่อนุญาต Clipboard กรุณาเลือกข้อความและคัดลอกด้วยตนเอง")
    }
  }

  async function exportCurrent(format: "txt" | "md" | "json") {
    if (!project || !builtPrompt) return
    try {
      const model = portraitModelById.get(deriveSelectedModelId(project) ?? "")
      const versionNumber = versions[0]?.versionNumber ?? 1
      const prepared = preparePromptExport({ format, project, builtPrompt, versionNumber, modelName: model?.stageName, timestamp: new Date().toISOString() })
      downloadPreparedExport(prepared)
      if (storageStatus?.persistent) await recordExport(project.id, format, prepared.filename, versions[0]?.id)
      setNotice(`Export ${prepared.filename} แล้ว`)
    } catch (error) {
      console.error(error)
      setNotice("Export ไม่สำเร็จ กรุณาลองใหม่")
    }
  }

  function askReset() {
    if (!project) return
    setConfirmation({
      title: "Reset Project นี้?",
      message: "คำตอบและ Brief ปัจจุบันจะถูกล้าง แต่ Prompt Version เดิมจะยังอยู่ใน Version History",
      confirmLabel: "Reset",
      danger: true,
      action: () => scheduleProjectSave({ ...project, answers: {}, selectedModelId: undefined, selectedRecipeId: undefined, status: "draft", briefApprovedAt: undefined, currentStepId: firstWorkflowStepId, updatedAt: new Date().toISOString() }),
    })
  }

  async function renameProject(target: PortraitProject) {
    const name = window.prompt("ชื่อ Project ใหม่", target.name)?.trim()
    if (!name || name === target.name) return
    const updated = await repository().updateProject(target.id, { name })
    if (project?.id === updated.id) setProject(updated)
    await refreshProjects()
  }

  async function duplicateProject(target: PortraitProject) {
    const created = await repository().createProject({ name: `${target.name} (Copy)`, currentStepId: target.currentStepId })
    await repository().updateProject(created.id, {
      answers: structuredClone(target.answers),
      selectedModelId: target.selectedModelId,
      selectedRecipeId: target.selectedRecipeId,
      status: "draft",
      briefApprovedAt: undefined,
    })
    await refreshProjects()
    setNotice("สร้างสำเนา Project แล้ว")
  }

  async function toggleArchive(target: PortraitProject) {
    await repository().updateProject(target.id, { status: target.status === "archived" ? "draft" : "archived" })
    await refreshProjects()
  }

  function askDeleteProject(target: PortraitProject) {
    setConfirmation({
      title: `ลบ ${target.name}?`,
      message: "Project, Answers, Prompt Versions, Custom Recipes และ Export History ที่เกี่ยวข้องจะถูกลบจาก Browser นี้และกู้คืนไม่ได้",
      confirmLabel: "ลบ Project",
      danger: true,
      action: async () => {
        await repository().deleteProject(target.id)
        await refreshProjects()
        if (project?.id === target.id) goStart()
      },
    })
  }

  async function restoreVersion(version: PromptVersion) {
    const created = await repository().createProject({ name: `${version.snapshot.name} (Restored V${version.versionNumber.toString().padStart(3, "0")})`, currentStepId: version.snapshot.currentStepId })
    const restored = await repository().updateProject(created.id, {
      answers: structuredClone(version.snapshot.answers),
      selectedModelId: version.snapshot.selectedModelId,
      selectedRecipeId: version.snapshot.selectedRecipeId,
      status: "draft",
      briefApprovedAt: undefined,
    })
    await refreshProjects()
    await openProject(restored)
  }

  function askDeleteVersion(version: PromptVersion) {
    setConfirmation({
      title: `ลบ Version ${version.versionNumber.toString().padStart(3, "0")}?`,
      message: "Version นี้เป็น immutable snapshot และจะถูกลบถาวรจาก Browser นี้",
      confirmLabel: "ลบ Version",
      danger: true,
      action: async () => {
        await repository().deletePromptVersion(version.id)
        if (project) setVersions(await repository().listPromptVersions(project.id))
      },
    })
  }

  function exportVersion(version: PromptVersion) {
    if (!project || !builtPrompt) return
    const versionProject: PortraitProject = {
      ...version.snapshot,
      id: project.id,
      createdAt: project.createdAt,
      updatedAt: version.createdAt,
    }
    const prepared = preparePromptExport({
      format: "md",
      project: versionProject,
      builtPrompt: { ...builtPrompt, fullPrompt: version.promptText, brief: version.briefText },
      versionNumber: version.versionNumber,
      modelName: portraitModelById.get(version.snapshot.selectedModelId ?? "")?.stageName,
      timestamp: version.createdAt,
    })
    downloadPreparedExport(prepared)
  }

  if (view === "loading") {
    return <main className="grid min-h-screen place-items-center bg-slate-50"><p className="font-semibold text-slate-600">กำลังเปิด Portrait Workspace…</p></main>
  }

  if (view === "start") {
    return <StartScreen hasProjects={projects.length > 0} persistent={storageStatus.persistent} warning={storageStatus.warning} onStart={() => void createNewProject()} onResume={() => { if (projects[0]) void openProject(projects[0]) }} onViewProjects={() => setView("projects")} />
  }

  if (view === "projects") {
    return <ProjectList projects={projects} query={query} onQueryChange={setQuery} onBack={goStart} onNew={() => void createNewProject()} onOpen={(target) => void openProject(target)} onRename={(target) => void renameProject(target)} onDuplicate={(target) => void duplicateProject(target)} onArchive={(target) => void toggleArchive(target)} onDelete={askDeleteProject} />
  }

  if (!project || !builtPrompt) {
    return <main className="grid min-h-screen place-items-center bg-slate-50"><button type="button" onClick={goStart} className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white">กลับหน้าเริ่มต้น</button></main>
  }

  const currentIndex = workflowSteps.findIndex((step) => step.id === project.currentStepId)
  const currentStep = workflowSteps[currentIndex] ?? workflowSteps[0]
  const canUseFinal = Boolean(project.briefApprovedAt) && ["brief-approved", "prompt-ready"].includes(project.status)

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50">
      <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={() => setSidebarOpen((value) => !value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold lg:hidden" aria-expanded={sidebarOpen}>Workflow</button>
          <button type="button" onClick={() => setView("projects")} className="hidden text-sm font-bold text-blue-700 sm:block">← Projects</button>
          <div className="min-w-0"><p className="truncate text-sm font-extrabold text-slate-950">{project.name}</p><p className="truncate text-xs text-slate-500">{project.selectedModelId ?? "No model"} · {project.selectedRecipeId ?? "No recipe"}</p></div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => void renameProject(project)} className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 sm:block">Rename</button>
          <button type="button" onClick={() => void createNewProject()} className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white">New</button>
        </div>
      </header>

      {notice ? <div className="fixed right-4 top-20 z-40 max-w-sm rounded-2xl border border-blue-200 bg-white p-4 text-sm font-semibold text-slate-800 shadow-xl" role="status"><button type="button" onClick={() => setNotice(null)} className="float-right ml-3 text-slate-400" aria-label="ปิดข้อความ">×</button>{notice}</div> : null}
      {!storageStatus.persistent && storageStatus.warning ? <p className="border-b border-amber-200 bg-amber-50 px-5 py-2 text-center text-xs font-semibold text-amber-900">{storageStatus.warning}</p> : null}

      <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:h-[calc(100vh-4rem)] lg:grid-cols-[280px_minmax(420px,1fr)_minmax(380px,0.9fr)] lg:overflow-hidden">
        <div className={`${sidebarOpen ? "block" : "hidden"} min-w-0 lg:block lg:overflow-hidden`}><WorkflowSidebar project={project} currentStepId={currentStep.id} onNavigate={navigateToStep} /></div>
        <div className="min-w-0 overflow-y-auto"><StepForm project={project} step={currentStep} brief={builtPrompt.brief} canGoPrevious={currentIndex > 0} isLastStep={currentIndex === workflowSteps.length - 1} onChange={applyAnswer} onPrevious={goPrevious} onNext={() => void goNext()} /></div>
        <div className="min-w-0 lg:overflow-hidden"><LivePromptPreview builtPrompt={builtPrompt} canUseFinal={canUseFinal} saveStatus={saveStatus} versions={versions} highlightedBlock={currentStep.promptBlock} onCopyPrompt={() => void copyText(builtPrompt.fullPrompt, "คัดลอก Final Prompt แล้ว")} onCopyBlock={(content) => void copyText(content, "คัดลอก Prompt Block แล้ว")} onSaveVersion={() => void saveVersion()} onExport={(format) => void exportCurrent(format)} onReset={askReset} onCopyVersion={(version) => void copyText(version.promptText, `คัดลอก Version ${version.versionNumber.toString().padStart(3, "0")} แล้ว`)} onExportVersion={exportVersion} onRestoreVersion={(version) => void restoreVersion(version)} onDeleteVersion={askDeleteVersion} /></div>
      </div>

      <ConfirmDialog open={Boolean(confirmation)} title={confirmation?.title ?? "ยืนยัน"} message={confirmation?.message ?? ""} confirmLabel={confirmation?.confirmLabel} danger={confirmation?.danger} onCancel={() => setConfirmation(null)} onConfirm={() => { const action = confirmation?.action; setConfirmation(null); void action?.() }} />
    </main>
  )
}
