"use client"

import { imageRatioOptions } from "@/data/ai-portrait"
import { IMAGE_RATIO_STEP_ID } from "@/lib/ai-portrait/image-ratio"
import { resolveShotDefinitions } from "@/lib/ai-portrait/shot-planning"
import type { ImageRatioPresetId, PortraitProject, ProjectAnswer } from "@/types/ai-portrait"

export function ShotRatioOverrideEditor({ project, onChange }: { project: PortraitProject; onChange: (answer: ProjectAnswer) => void }) {
  const answer = project.answers[IMAGE_RATIO_STEP_ID]
  const shots = resolveShotDefinitions(project)
  if (!answer || shots.length === 0) return null
  const overrides = answer.imageRatio?.shotOverrides ?? {}

  return (
    <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-xs font-black uppercase tracking-wider text-amber-900">Shot Ratio Overrides</p>
      <p className="mt-1 text-sm text-amber-800">ปล่อยเป็น Project Ratio เพื่อใช้ค่าหลัก หรือกำหนด Ratio เฉพาะ Shot เมื่อจำเป็น</p>
      <div className="mt-3 grid gap-2">
        {shots.map((shot) => (
          <label key={shot.id} className="grid gap-2 rounded-xl border border-amber-100 bg-white p-3 sm:grid-cols-[1fr_12rem] sm:items-center">
            <span className="text-sm font-bold text-slate-900">{shot.id} — {shot.label}{overrides[shot.id] ? <span className="ml-2 rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-black text-white">SHOT RATIO OVERRIDE</span> : null}</span>
            <select
              value={overrides[shot.id] ?? ""}
              onChange={(event) => {
                const next = { ...overrides }
                if (event.target.value) next[shot.id] = event.target.value as ImageRatioPresetId
                else delete next[shot.id]
                onChange({
                  ...answer,
                  imageRatio: { ...(answer.imageRatio ?? { secondary: [] }), shotOverrides: next },
                  updatedAt: new Date().toISOString(),
                })
              }}
              className="rounded-lg border border-amber-200 px-2 py-1.5 text-sm"
            >
              <option value="">Project Ratio</option>
              {imageRatioOptions.map((ratio) => <option key={ratio.id} value={ratio.id}>{ratio.id}</option>)}
            </select>
          </label>
        ))}
      </div>
    </div>
  )
}
