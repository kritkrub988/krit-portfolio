"use client"

import {
  defaultImageRatioId,
  defaultMultiImageRatioSecondary,
  imageRatioOptions,
} from "@/data/ai-portrait"
import {
  CUSTOM_RATIO_OPTION_ID,
  IMAGE_RATIO_STEP_ID,
  MULTI_RATIO_OPTION_ID,
  imageRatioOptionIdByPreset,
  presetForOptionId,
  presetSuggestion,
  resolveImageRatio,
} from "@/lib/ai-portrait/image-ratio"
import type { ImageRatioPresetId, PortraitProject, ProjectAnswer, WorkflowStep } from "@/types/ai-portrait"

type RatioFieldsProps = {
  project: PortraitProject
  step: WorkflowStep
  answer?: ProjectAnswer
  onChange: (answer: ProjectAnswer) => void
}

function answerWith(answer: ProjectAnswer | undefined, patch: Partial<ProjectAnswer>): ProjectAnswer {
  return {
    stepId: IMAGE_RATIO_STEP_ID,
    selectionMode: answer?.selectionMode ?? "auto",
    selectedOptionIds: answer?.selectedOptionIds ?? [],
    resolvedOptionIds: answer?.resolvedOptionIds ?? [],
    customValue: answer?.customValue,
    autoReason: answer?.autoReason,
    autoConfidence: answer?.autoConfidence,
    imageRatio: answer?.imageRatio ?? { secondary: [] },
    updatedAt: new Date().toISOString(),
    ...patch,
  }
}

export function ImageRatioFields({ project, step, answer, onChange }: RatioFieldsProps) {
  const selectedId = answer?.selectedOptionIds[0]
  const selectValue = answer?.selectionMode === "auto" ? "auto" : selectedId ?? ""
  const resolved = resolveImageRatio(project)
  const customWidth = answer?.imageRatio?.customWidthRatio ?? 4
  const customHeight = answer?.imageRatio?.customHeightRatio ?? 3
  const suggestion = presetSuggestion(customWidth, customHeight)
  const isCustom = selectedId === CUSTOM_RATIO_OPTION_ID || answer?.selectionMode === "custom"
  const isMulti = selectedId === MULTI_RATIO_OPTION_ID

  function updateRatio(patch: NonNullable<ProjectAnswer["imageRatio"]>) {
    onChange(answerWith(answer, { imageRatio: patch }))
  }

  return (
    <div className="space-y-5">
      <label htmlFor="portrait-step-8-ratio-mode" className="block text-sm font-bold text-slate-900">
        สัดส่วนภาพ
        <select
          id="portrait-step-8-ratio-mode"
          value={selectValue}
          onChange={(event) => {
            const value = event.target.value
            if (value === "auto") {
              onChange(answerWith(answer, { selectionMode: "auto", selectedOptionIds: [] }))
              return
            }
            if (value === CUSTOM_RATIO_OPTION_ID) {
              onChange(answerWith(answer, {
                selectionMode: "custom",
                selectedOptionIds: [value],
                imageRatio: {
                  primary: `${customWidth}:${customHeight}`,
                  secondary: [],
                  customWidthRatio: customWidth,
                  customHeightRatio: customHeight,
                  shotOverrides: answer?.imageRatio?.shotOverrides,
                },
              }))
              return
            }
            if (value === MULTI_RATIO_OPTION_ID) {
              const currentPrimary = resolved.primary as ImageRatioPresetId
              const primary = imageRatioOptionIdByPreset.has(currentPrimary) ? currentPrimary : defaultImageRatioId
              const candidateSecondary = answer?.imageRatio?.secondary.length
                ? answer.imageRatio.secondary
                : defaultMultiImageRatioSecondary
              onChange(answerWith(answer, {
                selectionMode: "manual",
                selectedOptionIds: [value],
                imageRatio: {
                  primary,
                  secondary: candidateSecondary.filter((ratio) => ratio !== primary),
                  shotOverrides: answer?.imageRatio?.shotOverrides,
                },
              }))
              return
            }
            const preset = presetForOptionId(value)
            onChange(answerWith(answer, {
              selectionMode: "manual",
              selectedOptionIds: [value],
              imageRatio: { primary: preset ?? defaultImageRatioId, secondary: [], shotOverrides: answer?.imageRatio?.shotOverrides },
            }))
          }}
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        >
          <option value="auto">AUTO. อัตโนมัติ — เลือกตาม Platform และ Deliverables</option>
          {step.options?.map((option) => <option key={option.id} value={option.id}>{option.code}. {option.label}</option>)}
        </select>
      </label>

      {answer?.selectionMode === "auto" ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-blue-700 px-2.5 py-1 text-[11px] font-black text-white">AUTO</span>
            <span className="text-xs font-bold uppercase text-blue-800">Confidence: {answer.autoConfidence ?? "low"}</span>
          </div>
          <p className="mt-3 font-black text-slate-950">{resolved.primary} · {resolved.orientation.toUpperCase()}</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{answer.autoReason}</p>
        </div>
      ) : null}

      {isCustom ? (
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
          <p className="text-xs font-black uppercase tracking-wider text-violet-800">Custom Ratio</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="text-sm font-bold text-slate-800">Width Ratio
              <input type="number" min={1} max={10000} step={1} value={customWidth} onChange={(event) => updateRatio({ ...(answer?.imageRatio ?? { secondary: [] }), customWidthRatio: Number(event.target.value), customHeightRatio: customHeight, primary: `${event.target.value}:${customHeight}`, secondary: [] })} className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-3 py-2" />
            </label>
            <label className="text-sm font-bold text-slate-800">Height Ratio
              <input type="number" min={1} max={10000} step={1} value={customHeight} onChange={(event) => updateRatio({ ...(answer?.imageRatio ?? { secondary: [] }), customWidthRatio: customWidth, customHeightRatio: Number(event.target.value), primary: `${customWidth}:${event.target.value}`, secondary: [] })} className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-3 py-2" />
            </label>
          </div>
          <p className="mt-3 text-sm font-semibold text-violet-900">ย่ออัตราส่วนอัตโนมัติ: {resolved.primary}</p>
          {suggestion ? <p className="mt-1 text-xs text-violet-800">ตรงกับ Preset {suggestion} — สามารถเลือก Preset เพื่อใช้ pixel reference มาตรฐานได้</p> : null}
        </div>
      ) : null}

      {isMulti ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-black uppercase tracking-wider text-emerald-800">Multi-ratio Package</p>
          <label className="mt-3 block text-sm font-bold text-slate-800">Primary Ratio
            <select value={answer?.imageRatio?.primary ?? defaultImageRatioId} onChange={(event) => updateRatio({ ...(answer?.imageRatio ?? { secondary: [] }), primary: event.target.value, secondary: (answer?.imageRatio?.secondary ?? []).filter((ratio) => ratio !== event.target.value) })} className="mt-1 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2">
              {imageRatioOptions.map((ratio) => <option key={ratio.id} value={ratio.id}>{ratio.label}</option>)}
            </select>
          </label>
          <fieldset className="mt-4">
            <legend className="text-sm font-bold text-slate-800">Secondary Export Ratios</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {imageRatioOptions.filter((ratio) => ratio.id !== answer?.imageRatio?.primary).map((ratio) => {
                const checked = answer?.imageRatio?.secondary.includes(ratio.id as ImageRatioPresetId) ?? false
                return <label key={ratio.id} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${checked ? "border-emerald-500 bg-white" : "border-emerald-100"}`}><input type="checkbox" checked={checked} onChange={(event) => updateRatio({ ...(answer?.imageRatio ?? { secondary: [] }), secondary: event.target.checked ? [...(answer?.imageRatio?.secondary ?? []), ratio.id as ImageRatioPresetId] : (answer?.imageRatio?.secondary ?? []).filter((item) => item !== ratio.id) })} />{ratio.id}</label>
              })}
            </div>
          </fieldset>
          {resolved.needsDedicatedComposition ? <p className="mt-3 rounded-xl bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-900">แนะนำให้สร้าง Composition เฉพาะ Ratio เพราะชุดนี้ผสมแนวตั้ง แนวนอน หรือสี่เหลี่ยม และไม่ควรพึ่งการ Crop เพียงอย่างเดียว</p> : null}
        </div>
      ) : null}

      <div className="grid gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[12rem_1fr] sm:items-center">
        <div className="flex h-64 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 p-4">
          <div className="relative max-h-full max-w-full rounded-lg border-2 border-blue-700 bg-white/80 shadow-lg" style={resolved.orientation === "landscape" ? { width: "100%", aspectRatio: `${resolved.widthRatio} / ${resolved.heightRatio}` } : { height: "100%", aspectRatio: `${resolved.widthRatio} / ${resolved.heightRatio}` }}>
            <div className="absolute inset-[10%] rounded border border-dashed border-violet-500" />
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm font-black text-blue-950">{resolved.primary}</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">Orientation Preview</p>
          <p className="mt-1 text-2xl font-black text-slate-950">{resolved.orientation.toUpperCase()}</p>
          <p className="mt-1 font-mono text-sm text-slate-700">{resolved.pixelReference}</p>
          <ul className="mt-3 space-y-1 text-sm leading-6 text-slate-600">{resolved.compositionGuidance.slice(0, 4).map((guidance) => <li key={guidance}>• {guidance}</li>)}</ul>
        </div>
      </div>
    </div>
  )
}
