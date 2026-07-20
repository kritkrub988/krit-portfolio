"use client"

import { lookRecipeById, portraitModelById } from "@/data/ai-portrait"
import { getOptionAvailability } from "@/lib/ai-portrait/dependency-rules"
import { recommendedOptionIds } from "@/lib/ai-portrait/recommendation-engine"
import { validateStepAnswer } from "@/lib/ai-portrait/validation"
import { ModelDetailCard } from "@/components/ai-portrait-prompt/model-detail-card"
import { RecipeDetailCard } from "@/components/ai-portrait-prompt/recipe-detail-card"
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
  const firstSelectedId = answer?.optionIds[0] ?? ""
  const selectedOption = step.options?.find((option) => option.id === firstSelectedId)
  const showCustom = step.allowsCustom && (Boolean(answer?.customValue) || /custom|กำหนดเอง|ผู้ใช้กำหนดเอง/i.test(selectedOption?.label ?? ""))
  const model = selectedModel(project, step)
  const recipe = selectedRecipe(project, step)
  const inputId = `portrait-${step.id}`

  function emit(optionIds: string[], customValue = answer?.customValue) {
    onChange({ stepId: step.id, optionIds, customValue, updatedAt: new Date().toISOString() })
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-6 sm:px-8 sm:py-8">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Step {step.code}</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{step.title}</h1>
      {step.description ? <p className="mt-3 text-base leading-7 text-slate-600">{step.description}</p> : null}

      {step.id === "step-9-1" ? (
        <div className="mt-7 max-h-[28rem] overflow-auto rounded-3xl border border-slate-200 bg-slate-950 p-5 font-mono text-xs leading-6 text-slate-100 whitespace-pre-wrap">{brief}</div>
      ) : null}

      <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        {step.inputType === "multiselect" ? (
          <fieldset>
            <legend className="text-sm font-bold text-slate-900">เลือกได้มากกว่าหนึ่งรายการ</legend>
            <div className="mt-3 grid gap-2">
              {step.options?.map((option) => {
                const availability = getOptionAvailability(project, step.id, option)
                const checked = answer?.optionIds.includes(option.id) ?? false
                return (
                  <label key={option.id} className={`flex gap-3 rounded-2xl border p-3 ${checked ? "border-blue-500 bg-blue-50" : "border-slate-200"} ${availability.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                    <input type="checkbox" checked={checked} disabled={availability.disabled} onChange={(event) => emit(event.target.checked ? [...(answer?.optionIds ?? []), option.id] : (answer?.optionIds ?? []).filter((id) => id !== option.id))} />
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
              value={firstSelectedId}
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

        {recommendations.size > 0 ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-800">แนะนำไม่เกิน 2 ตัวเลือก</p>
            <ul className="mt-2 space-y-1 text-sm text-emerald-900">{[...recommendations].map(([optionId, reason]) => <li key={optionId}>• {step.options?.find((option) => option.id === optionId)?.label}: {reason}</li>)}</ul>
          </div>
        ) : null}

        {selectedOption ? (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Selected option</p>
            <p className="mt-1 font-bold text-slate-900">{selectedOption.label}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{getOptionAvailability(project, step.id, selectedOption).reason ?? selectedOption.description}</p>
          </div>
        ) : null}

        {showCustom ? (
          <label htmlFor={`${inputId}-custom`} className="mt-5 block text-sm font-bold text-slate-900">
            รายละเอียด Custom
            <textarea id={`${inputId}-custom`} value={answer?.customValue ?? ""} onChange={(event) => emit(answer?.optionIds ?? [], event.target.value)} rows={5} className="mt-2 w-full resize-y rounded-2xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="ระบุรายละเอียดที่ต้องการ..." />
          </label>
        ) : null}
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

