"use client"

import { CheckCircle2, ShieldAlert } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  defaultStickerPackId,
  getStickerPack,
} from "@/data/line-sticker/sticker-packs"
import {
  defaultStickerVisualStyleId,
  getStickerVisualStyle,
} from "@/data/line-sticker/themes"
import { buildStickerImagePrompt } from "@/lib/line-sticker/build-sticker-image-prompt"
import { defaultCropSettings } from "@/lib/line-sticker/crop-sticker-grid"
import {
  revokeImageAsset,
  revokeImageAssets,
} from "@/lib/line-sticker/image-browser-utils"
import {
  createDefaultBackgroundRemovalSettings,
  createDefaultStickerTextSettings,
  applyStickerPackMessages,
  stickerTextSettingsMatchPack,
} from "@/lib/line-sticker/sticker-state"
import type {
  BackgroundRemovalSettings,
  BrowserImageAsset,
  CropSettings,
  SourceGridImage,
  StickerTextSettings,
  StickerValidationResult,
  StudioStep,
} from "@/types/line-sticker"
import { BackgroundRemovalStep } from "./background-removal-step"
import { ExportStep } from "./export-step"
import { GridCropStep } from "./grid-crop-step"
import { PromptStep } from "./prompt-step"
import { StudioStepper } from "./studio-stepper"
import { TextEditorStep } from "./text-editor-step"

function emptyTransparentStickers() {
  return Array.from({ length: 16 }, () => null) as Array<BrowserImageAsset | null>
}

export function StickerStudio() {
  const [selectedStickerPackId, setSelectedStickerPackId] = useState(defaultStickerPackId)
  const [selectedVisualStyleId, setSelectedVisualStyleId] = useState(defaultStickerVisualStyleId)
  const [sourceGridImage, setSourceGridImage] = useState<SourceGridImage | null>(null)
  const [cropSettings, setCropSettings] = useState<CropSettings>({ ...defaultCropSettings })
  const [croppedStickers, setCroppedStickers] = useState<BrowserImageAsset[]>([])
  const [backgroundRemovalSettings, setBackgroundRemovalSettings] = useState<BackgroundRemovalSettings>(createDefaultBackgroundRemovalSettings)
  const [transparentStickers, setTransparentStickers] = useState<Array<BrowserImageAsset | null>>(emptyTransparentStickers)
  const [stickerTextSettings, setStickerTextSettings] = useState<StickerTextSettings[]>(createDefaultStickerTextSettings)
  const [selectedMainSticker, setSelectedMainSticker] = useState(0)
  const [selectedTabSticker, setSelectedTabSticker] = useState(0)
  const [validationResults, setValidationResults] = useState<StickerValidationResult[]>([])
  const [currentStep, setCurrentStep] = useState<StudioStep>(1)
  const [maxCompletedStep, setMaxCompletedStep] = useState<StudioStep>(1)
  const [selectedTextSticker, setSelectedTextSticker] = useState(0)
  const [toast, setToast] = useState("")
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resources = useRef({ sourceGridImage, croppedStickers, transparentStickers })
  const selectedStickerPack = useMemo(
    () => getStickerPack(selectedStickerPackId),
    [selectedStickerPackId],
  )
  const selectedVisualStyle = useMemo(
    () => getStickerVisualStyle(selectedVisualStyleId),
    [selectedVisualStyleId],
  )
  const generatedPrompt = useMemo(
    () => buildStickerImagePrompt(selectedStickerPackId, selectedVisualStyleId),
    [selectedStickerPackId, selectedVisualStyleId],
  )

  useEffect(() => {
    resources.current = { sourceGridImage, croppedStickers, transparentStickers }
  }, [croppedStickers, sourceGridImage, transparentStickers])

  useEffect(() => {
    if (!sourceGridImage) return
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", warnBeforeUnload)
    return () => window.removeEventListener("beforeunload", warnBeforeUnload)
  }, [sourceGridImage])

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    revokeImageAsset(resources.current.sourceGridImage)
    revokeImageAssets(resources.current.croppedStickers)
    revokeImageAssets(resources.current.transparentStickers)
  }, [])

  function showToast(message: string) {
    setToast(message)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(""), 2600)
  }

  function moveToStep(step: StudioStep) {
    if (step > maxCompletedStep) return
    setCurrentStep(step)
    window.setTimeout(() => document.getElementById("sticker-studio")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0)
  }

  function completeAndMove(step: StudioStep) {
    setMaxCompletedStep((current) => Math.max(current, step) as StudioStep)
    setCurrentStep(step)
    window.setTimeout(() => document.getElementById("sticker-studio")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0)
  }

  function clearDownstreamFromSource() {
    revokeImageAssets(croppedStickers)
    revokeImageAssets(transparentStickers)
    setCroppedStickers([])
    setTransparentStickers(emptyTransparentStickers())
    setStickerTextSettings(createDefaultStickerTextSettings(selectedStickerPackId))
    setValidationResults([])
    setSelectedMainSticker(0)
    setSelectedTabSticker(0)
    setSelectedTextSticker(0)
  }

  function handleSourceChange(nextSource: SourceGridImage) {
    revokeImageAsset(sourceGridImage)
    clearDownstreamFromSource()
    setSourceGridImage(nextSource)
    setCropSettings({ ...defaultCropSettings })
    setMaxCompletedStep(2)
  }

  function handleCropSettingsChange(nextSettings: CropSettings) {
    if (croppedStickers.length) clearDownstreamFromSource()
    setCropSettings(nextSettings)
    setMaxCompletedStep(2)
  }

  function handleCroppedChange(nextAssets: BrowserImageAsset[]) {
    revokeImageAssets(croppedStickers)
    revokeImageAssets(transparentStickers)
    setCroppedStickers(nextAssets)
    setTransparentStickers(emptyTransparentStickers())
    setStickerTextSettings(createDefaultStickerTextSettings(selectedStickerPackId))
    setValidationResults([])
    setMaxCompletedStep(2)
  }

  const handleValidationChange = useCallback((result: StickerValidationResult) => {
    setValidationResults((current) => {
      const existing = current.find((item) => item.stickerId === result.stickerId)
      if (
        existing &&
        existing.hasTransparency === result.hasTransparency &&
        existing.textOverflow === result.textOverflow &&
        existing.textNearEdge === result.textNearEdge &&
        existing.filename === result.filename
      ) return current
      return [...current.filter((item) => item.stickerId !== result.stickerId), result]
    })
  }, [])

  const replaceValidationResults = useCallback((results: StickerValidationResult[]) => {
    setValidationResults(results)
  }, [])

  function resetPromptStep() {
    const messagesWereEdited = !stickerTextSettingsMatchPack(
      stickerTextSettings,
      selectedStickerPackId,
    )
    if (
      messagesWereEdited &&
      !window.confirm("คุณแก้ข้อความสติกเกอร์แล้ว ต้องการแทนที่ทั้ง 16 ข้อด้วยชุดเริ่มต้นหรือไม่?")
    ) return

    setSelectedStickerPackId(defaultStickerPackId)
    setSelectedVisualStyleId(defaultStickerVisualStyleId)
    setStickerTextSettings((current) => applyStickerPackMessages(current, defaultStickerPackId))
    showToast("คืนค่าชุดสติกเกอร์ สไตล์ภาพ และ Prompt เริ่มต้นแล้ว")
  }

  function changeStickerPack(stickerPackId: string) {
    if (stickerPackId === selectedStickerPackId) return
    const messagesWereEdited = !stickerTextSettingsMatchPack(
      stickerTextSettings,
      selectedStickerPackId,
    )
    if (
      messagesWereEdited &&
      !window.confirm("คุณแก้ข้อความสติกเกอร์แล้ว ต้องการแทนที่ทั้ง 16 ข้อด้วยชุดที่เลือกใหม่หรือไม่?")
    ) return

    setSelectedStickerPackId(stickerPackId)
    setStickerTextSettings((current) => applyStickerPackMessages(current, stickerPackId))
  }

  function startOver() {
    if (sourceGridImage && !window.confirm("เริ่มใหม่แล้วงาน รูป และการตั้งค่าที่ยังไม่ได้ดาวน์โหลดจะหาย ต้องการดำเนินการต่อหรือไม่?")) return
    revokeImageAsset(sourceGridImage)
    revokeImageAssets(croppedStickers)
    revokeImageAssets(transparentStickers)
    setSelectedStickerPackId(defaultStickerPackId)
    setSelectedVisualStyleId(defaultStickerVisualStyleId)
    setSourceGridImage(null)
    setCropSettings({ ...defaultCropSettings })
    setCroppedStickers([])
    setBackgroundRemovalSettings(createDefaultBackgroundRemovalSettings())
    setTransparentStickers(emptyTransparentStickers())
    setStickerTextSettings(createDefaultStickerTextSettings(defaultStickerPackId))
    setSelectedMainSticker(0)
    setSelectedTabSticker(0)
    setValidationResults([])
    setSelectedTextSticker(0)
    setCurrentStep(1)
    setMaxCompletedStep(1)
    showToast("เริ่มงานใหม่แล้ว")
  }

  const readyTransparentAssets = useMemo(
    () => transparentStickers.filter((asset): asset is BrowserImageAsset => Boolean(asset)),
    [transparentStickers],
  )

  return (
    <section id="sticker-studio" className="scroll-mt-4 bg-[#fffafd] pb-16" aria-label="LINE Sticker Prompt and Studio">
      <StudioStepper currentStep={currentStep} maxCompletedStep={maxCompletedStep} onStepChange={moveToStep} onStartOver={startOver} />
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {currentStep === 1 ? (
          <PromptStep
            selectedStickerPack={selectedStickerPack}
            selectedVisualStyle={selectedVisualStyle}
            generatedPrompt={generatedPrompt}
            onStickerPackChange={changeStickerPack}
            onVisualStyleChange={setSelectedVisualStyleId}
            onReset={resetPromptStep}
            onNext={() => completeAndMove(2)}
            showToast={showToast}
          />
        ) : null}
        {currentStep === 2 ? <GridCropStep source={sourceGridImage} cropSettings={cropSettings} croppedStickers={croppedStickers} onSourceChange={handleSourceChange} onCropSettingsChange={handleCropSettingsChange} onCroppedChange={handleCroppedChange} onBack={() => moveToStep(1)} onNext={() => completeAndMove(3)} showToast={showToast} /> : null}
        {currentStep === 3 ? <BackgroundRemovalStep croppedStickers={croppedStickers} transparentStickers={transparentStickers} settings={backgroundRemovalSettings} onSettingsChange={setBackgroundRemovalSettings} onTransparentChange={setTransparentStickers} onBack={() => moveToStep(2)} onNext={() => completeAndMove(4)} showToast={showToast} /> : null}
        {currentStep === 4 && readyTransparentAssets.length === 16 ? <TextEditorStep assets={readyTransparentAssets} settings={stickerTextSettings} selectedIndex={selectedTextSticker} validationResults={validationResults} onSelectedIndexChange={setSelectedTextSticker} onSettingsChange={setStickerTextSettings} onValidationChange={handleValidationChange} onBack={() => moveToStep(3)} onNext={() => completeAndMove(5)} showToast={showToast} /> : null}
        {currentStep === 5 && readyTransparentAssets.length === 16 ? <ExportStep assets={readyTransparentAssets} textSettings={stickerTextSettings} selectedMainSticker={selectedMainSticker} selectedTabSticker={selectedTabSticker} onMainStickerChange={setSelectedMainSticker} onTabStickerChange={setSelectedTabSticker} onValidationResultsChange={replaceValidationResults} onEditSticker={(index) => { setSelectedTextSticker(index); setCurrentStep(4) }} onBack={() => moveToStep(4)} onStartOver={startOver} showToast={showToast} /> : null}

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-950 sm:p-5">
          <ShieldAlert size={20} className="mt-0.5 shrink-0 text-amber-700" aria-hidden="true" />
          <p>ภาพและงานทั้งหมดอยู่ชั่วคราวใน Browser การปิดหรือ Refresh หน้าอาจทำให้งานที่ยังไม่ดาวน์โหลดหาย และควรตรวจสิทธิ์ของรูปบุคคลก่อนนำไปใช้</p>
        </div>
      </div>

      {toast ? <div role="status" aria-live="polite" className="fixed bottom-5 left-1/2 z-[80] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white shadow-2xl"><CheckCircle2 size={17} className="shrink-0 text-emerald-400" aria-hidden="true" />{toast}</div> : null}
    </section>
  )
}
