"use client"

import { lookRecipeById, portraitModelById } from "@/data/ai-portrait"
import { getOptionAvailability } from "@/lib/ai-portrait/dependency-rules"
import { recommendedOptionIds } from "@/lib/ai-portrait/recommendation-engine"
import { validateStepAnswer } from "@/lib/ai-portrait/validation"
import { approvalStepIds, effectiveOptionIds } from "@/lib/ai-portrait/answer-utils"
import { ModelDetailCard } from "@/components/ai-portrait-prompt/model-detail-card"
import { RecipeDetailCard } from "@/components/ai-portrait-prompt/recipe-detail-card"
import { ImageRatioFields } from "@/components/ai-portrait-prompt/image-ratio-fields"
import { ShotRatioOverrideEditor } from "@/components/ai-portrait-prompt/shot-ratio-override-editor"
import { IMAGE_RATIO_STEP_ID } from "@/lib/ai-portrait/image-ratio"
import type { PortraitProject, ProjectAnswer, WorkflowStep } from "@/types/ai-portrait"

type StepFormProps = {
  project: PortraitProject
  step: WorkflowStep
  brief: string
  canGoPrevious: boolean
  isLastStep: boolean
  onChange: (answer: ProjectAnswer) => void
  onPrevious: () => void
  onNext: () => void
}

function selectedModel(project: PortraitProject, step: WorkflowStep) {
  if (step.id !== "step-2-1" && step.id !== "step-2-2") return null
  return portraitModelById.get(project.selectedModelId ?? "") ?? null
}

function selectedRecipe(project: PortraitProject, step: WorkflowStep) {
  if (step.id !== "step-3-1") return null
  return lookRecipeById.get(project.selectedRecipeId ?? "") ?? null
}

export function StepForm({ project, step, brief, canGoPrevious, isLastStep, onChange, onPrevious, onNext }: StepFormProps) {
  const answer = project.answers[step.id]
  const errors = validateStepAnswer(step, answer)
  const recommendations = recommendedOptionIds(project, step.id)
  const optionIds = effectiveOptionIds(answer)
  const firstSelectedId = optionIds[0] ?? ""
  const selectedOption = step.options?.find((option) => option.id === firstSelectedId)
  const mode = answer?.selectionMode ?? (approvalStepIds.has(step.id) ? "manual" : "auto")
  const showCustom = step.allowsCustom && mode === "custom"
  const model = selectedModel(project, step)
  const recipe = selectedRecipe(project, step)
  const inputId = `portrait-${step.id}`

  function emit(selectedOptionIds: string[], customValue = answer?.customValue, selectionMode = mode) {
    onChange({
      stepId: step.id,
      selectionMode,
      selectedOptionIds,
      resolvedOptionIds: answer?.resolvedOptionIds ?? [],
      customValue,
      autoReason: answer?.autoReason,
      autoConfidence: answer?.autoConfidence,
      imageRatio: answer?.imageRatio,
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-6 sm:px-8 sm:py-8">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Step {step.displayCode ?? step.code}</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{step.title}</h1>
      {step.description ? <p className="mt-3 text-base leading-7 text-slate-600">{step.description}</p> : null}

      {step.id === "step-9-1" ? (
        <div className="mt-7 max-h-[28rem] overflow-auto rounded-3xl border border-slate-200 bg-slate-950 p-5 font-mono text-xs leading-6 text-slate-100 whitespace-pre-wrap">{brief}</div>
      ) : null}

      <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        {step.id !== IMAGE_RATIO_STEP_ID && !approvalStepIds.has(step.id) ? (
          <label htmlFor={`${inputId}-mode`} className="mb-5 block text-sm font-bold text-slate-900">
            Selection Mode
            <select
              id={`${inputId}-mode`}
              value={step.id === "step-2-1" && mode === "manual" ? `model:${answer?.selectedOptionIds[0] ?? ""}` : mode}
              onChange={(event) => {
                if (event.target.value.startsWith("model:")) {
                  emit([event.target.value.slice(6)], undefined, "manual")
                  return
                }
                const nextMode = event.target.value as "auto" | "manual" | "custom"
                const promoted = nextMode === "manual" && mode === "auto" ? optionIds : answer?.selectedOptionIds ?? []
                emit(promoted, nextMode === "custom" ? answer?.customValue : undefined, nextMode)
              }}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="auto">AUTO. อัตโนมัติ</option>
              {step.id === "step-2-1" ? step.options?.map((option) => <option key={option.id} value={`model:${option.id}`}>{option.label}</option>) : <option value="manual">MANUAL. เลือกเอง</option>}
              {step.id !== "step-2-1" && step.allowsCustom ? <option value="custom">CUSTOM. กำหนดเอง</option> : null}
            </select>
          </label>
        ) : null}

        {step.id !== IMAGE_RATIO_STEP_ID && mode !== "auto" ? <span className={`mb-4 inline-flex rounded-full px-2.5 py-1 text-[11px] font-black text-white ${mode === "custom" ? "bg-violet-700" : "bg-slate-700"}`}>{mode.toUpperCase()}</span> : null}

        {step.id === IMAGE_RATIO_STEP_ID ? (
          <ImageRatioFields project={project} step={step} answer={answer} onChange={onChange} />
        ) : mode === "auto" ? (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-blue-700 px-2.5 py-1 text-[11px] font-black text-white">AUTO</span>
              <span className="text-xs font-bold uppercase text-blue-800">Confidence: {answer?.autoConfidence ?? "low"}</span>
            </div>
            <p className="mt-3 text-xs font-black uppercase tracking-wider text-blue-700">ค่าที่ระบบแนะนำ</p>
            <p className="mt-1 font-bold text-slate-950">{optionIds.map((id) => step.options?.find((option) => option.id === id)?.label).filter(Boolean).join(", ") || "กำลังประเมิน"}</p>
            <details className="mt-3 text-sm text-slate-700">
              <summary className="cursor-pointer font-bold">แสดงรายละเอียด Auto Decision</summary>
              <p className="mt-2 leading-6">{answer?.autoReason ?? "ระบบจะประเมินจาก Model safety, goal, platform, recipe และ technical compatibility"}</p>
            </details>
            <button type="button" onClick={() => emit(optionIds, undefined, "manual")} className="mt-4 rounded-xl border border-blue-300 bg-white px-3 py-2 text-xs font-bold text-blue-800">ใช้ค่าที่ระบบแนะนำเป็น Manual</button>
          </div>
        ) : step.id === "step-2-1" ? null : step.inputType === "multiselect" ? (
          <fieldset>
            <legend className="text-sm font-bold text-slate-900">เลือกได้มากกว่าหนึ่งรายการ</legend>
            <div className="mt-3 grid gap-2">
              {step.options?.map((option) => {
                const availability = getOptionAvailability(project, step.id, option)
                const checked = answer?.selectedOptionIds.includes(option.id) ?? false
                return (
                  <label key={option.id} className={`flex gap-3 rounded-2xl border p-3 ${checked ? "border-blue-500 bg-blue-50" : "border-slate-200"} ${availability.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                    <input type="checkbox" checked={checked} disabled={availability.disabled} onChange={(event) => emit(event.target.checked ? [...(answer?.selectedOptionIds ?? []), option.id] : (answer?.selectedOptionIds ?? []).filter((id) => id !== option.id))} />
                    <span><span className="font-bold text-slate-900">{option.code}. {option.label}</span><span className="mt-1 block text-xs text-slate-500">{availability.reason ?? option.description}</span></span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        ) : (
          <label htmlFor={inputId} className="block text-sm font-bold text-slate-900">
            เลือกคำตอบ
            <select
              id={inputId}
              value={answer?.selectedOptionIds[0] ?? ""}
              onChange={(event) => emit(event.target.value ? [event.target.value] : [], "")}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base font-medium text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">— กรุณาเลือก —</option>
              {step.options?.map((option) => {
                const availability = getOptionAvailability(project, step.id, option)
                const recommendation = recommendations.get(option.id)
                return <option key={option.id} value={option.id} disabled={availability.disabled}>{option.code}. {option.label}{recommendation ? " — แนะนำ" : ""}</option>
              })}
            </select>
          </label>
        )}

        {mode === "manual" && recommendations.size > 0 ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-800">แนะนำไม่เกิน 2 ตัวเลือก</p>
            <ul className="mt-2 space-y-1 text-sm text-emerald-900">{[...recommendations].map(([optionId, reason]) => <li key={optionId}>• {step.options?.find((option) => option.id === optionId)?.label}: {reason}</li>)}</ul>
          </div>
        ) : null}

        {step.id !== IMAGE_RATIO_STEP_ID && mode !== "auto" && selectedOption ? (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Selected option</p>
            <p className="mt-1 font-bold text-slate-900">{selectedOption.label}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{getOptionAvailability(project, step.id, selectedOption).reason ?? selectedOption.description}</p>
          </div>
        ) : null}

        {step.id !== IMAGE_RATIO_STEP_ID && showCustom ? (
          <label htmlFor={`${inputId}-custom`} className="mt-5 block text-sm font-bold text-slate-900">
            รายละเอียด Custom
            <textarea id={`${inputId}-custom`} value={answer?.customValue ?? ""} onChange={(event) => emit([], event.target.value, "custom")} rows={5} className="mt-2 w-full resize-y rounded-2xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="ระบุรายละเอียดที่ต้องการ..." />
          </label>
        ) : null}

        {step.id === "step-8-2" ? <ShotRatioOverrideEditor project={project} onChange={onChange} /> : null}
      </div>

      {model ? <ModelDetailCard model={model} /> : null}
      {recipe ? <RecipeDetailCard recipe={recipe} /> : null}

      <div aria-live="polite" className="mt-5 min-h-6">
        {errors.length > 0 ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">{errors[0]}</p> : null}
      </div>

      <div className="sticky bottom-3 mt-7 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
        <button type="button" onClick={onPrevious} disabled={!canGoPrevious} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 disabled:opacity-40">← Previous</button>
        <button type="button" onClick={onNext} disabled={errors.length > 0} className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40">{isLastStep ? "เสร็จสิ้น" : "Next →"}</button>
      </div>
    </section>
  )
}
