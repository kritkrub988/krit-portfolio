"use client"

import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { useState } from "react"
import { PortraitFormatSelector } from "@/components/portrait-prompt-lite/portrait-format-selector"
import { OptionSelector } from "@/components/portrait-prompt-lite/option-selector"
import { PromptPreview } from "@/components/portrait-prompt-lite/prompt-preview"
import {
  cameraOptions,
  defaultPortraitSelection,
  filmOptions,
  imageCountOptions,
  locationOptions,
  moodOptions,
  outfitOptions,
  ratioOptions,
} from "@/data/portrait-lite/portrait-options"
import { generatePortraitPrompt } from "@/lib/portrait-lite/generate-portrait-prompt"
import type { PortraitSelection } from "@/types/portrait-lite"

export function PortraitPromptApp() {
  const [selection, setSelection] = useState<PortraitSelection>(defaultPortraitSelection)
  const prompt = generatePortraitPrompt(selection)

  function updateSelection(field: keyof PortraitSelection, value: string) {
    setSelection((current) => ({ ...current, [field]: value }))
  }

  return (
    <main className="min-h-screen bg-[#07101f] text-slate-100">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-8 border-b border-slate-800 pb-7">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white focus-visible:outline-violet-400"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            กลับหน้า Portfolio
          </Link>
          <div className="mt-7 flex items-start gap-4">
            <span className="mt-1 hidden rounded-2xl border border-violet-400/30 bg-violet-500/10 p-3 text-violet-300 sm:block">
              <Sparkles aria-hidden="true" size={24} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-400">
                TRAVEL PORTRAIT PROMPT GENERATOR
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                AI Portrait Prompt — เที่ยวทิพย์
              </h1>
              <p className="mt-3 text-base text-slate-300 sm:text-lg">
                พร้อมเที่ยวภายใน 10 วินาที
              </p>
              <p className="mt-2 text-sm text-slate-500">
                แนบรูปใบหน้าของคุณพร้อม Prompt เพื่อสร้างภาพท่องเที่ยวในแบบที่ต้องการ
              </p>
            </div>
          </div>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] xl:gap-10">
          <div className="space-y-7 rounded-3xl border border-slate-800 bg-[#0b1628]/85 p-4 shadow-xl shadow-slate-950/20 sm:p-6">
            <PortraitFormatSelector
              value={selection.formatId}
              onChange={(value) => updateSelection("formatId", value)}
            />
            <OptionSelector heading="Outfit Style" step="02" options={outfitOptions} value={selection.outfitId} onChange={(value) => updateSelection("outfitId", value)} />
            <OptionSelector heading="Location" step="03" options={locationOptions} value={selection.locationId} onChange={(value) => updateSelection("locationId", value)} />
            <OptionSelector heading="Feel / Mood" step="04" options={moodOptions} value={selection.moodId} onChange={(value) => updateSelection("moodId", value)} />
            <div className="grid gap-7 xl:grid-cols-2">
              <OptionSelector heading="Ratio" step="05" options={ratioOptions} value={selection.ratioId} onChange={(value) => updateSelection("ratioId", value)} />
              <OptionSelector heading="จำนวนภาพ" step="06" options={imageCountOptions} value={selection.imageCountId} onChange={(value) => updateSelection("imageCountId", value)} />
            </div>
            <OptionSelector heading="Camera + Lens" step="07" options={cameraOptions} value={selection.cameraId} onChange={(value) => updateSelection("cameraId", value)} />
            <OptionSelector heading="Film Filter" step="08" options={filmOptions} value={selection.filmId} onChange={(value) => updateSelection("filmId", value)} />
          </div>

          <PromptPreview
            prompt={prompt}
            selection={selection}
            onReset={() => setSelection({ ...defaultPortraitSelection })}
          />
        </div>
      </div>
    </main>
  )
}
