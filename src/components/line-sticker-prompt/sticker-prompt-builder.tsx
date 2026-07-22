"use client"

import { CheckCircle2 } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { defaultStickerMessages } from "@/data/line-sticker/default-messages"
import { defaultStickerTextStyleId } from "@/data/line-sticker/text-styles"
import { defaultStickerThemeId } from "@/data/line-sticker/themes"
import { stickerPromptFilename } from "@/data/line-sticker/prompt-templates"
import { buildStickerPrompt } from "@/lib/line-sticker/build-sticker-prompt"
import { copyTextToClipboard, downloadTextFile } from "@/lib/line-sticker/browser-utils"
import { MessageEditor } from "./message-editor"
import { PromptResultPanel } from "./prompt-result-panel"
import { TextStyleSelector } from "./text-style-selector"
import { ThemeSelector } from "./theme-selector"

const stepLabels = ["เลือก Theme", "เลือก Text Style", "ใส่ข้อความ", "Copy Prompt"]

function initialMessages() {
  return [...defaultStickerMessages]
}

function buildDefaultPrompt() {
  return buildStickerPrompt({
    themeId: defaultStickerThemeId,
    textStyleId: defaultStickerTextStyleId,
    messages: initialMessages(),
  })
}

export function StickerPromptBuilder() {
  const [themeId, setThemeId] = useState(defaultStickerThemeId)
  const [textStyleId, setTextStyleId] = useState(defaultStickerTextStyleId)
  const [messages, setMessages] = useState<string[]>(initialMessages)
  const [generatedPrompt, setGeneratedPrompt] = useState(buildDefaultPrompt)
  const [toast, setToast] = useState("")
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const draftPrompt = useMemo(
    () => buildStickerPrompt({ themeId, textStyleId, messages }),
    [themeId, textStyleId, messages],
  )
  const isDirty = draftPrompt !== generatedPrompt

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  function showToast(message: string) {
    setToast(message)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(""), 2400)
  }

  function changeMessage(index: number, value: string) {
    setMessages((current) =>
      current.map((message, messageIndex) => (messageIndex === index ? value : message)),
    )
  }

  function restoreMessages() {
    setMessages(initialMessages())
    showToast("คืนค่าข้อความเริ่มต้นแล้ว")
  }

  function clearMessages() {
    setMessages(Array.from({ length: 16 }, () => ""))
    showToast("ล้างข้อความทั้งหมดแล้ว")
  }

  function generatePrompt() {
    setGeneratedPrompt(draftPrompt)
    showToast("สร้าง Prompt แล้ว")
  }

  async function copyPrompt() {
    try {
      await copyTextToClipboard(generatedPrompt)
      showToast("คัดลอก Prompt แล้ว")
    } catch {
      showToast("คัดลอกอัตโนมัติไม่สำเร็จ กรุณาเลือกข้อความแล้วคัดลอกเอง")
    }
  }

  function downloadPrompt() {
    downloadTextFile(stickerPromptFilename, generatedPrompt)
    showToast("ดาวน์โหลด Prompt แล้ว")
  }

  function resetAll() {
    setThemeId(defaultStickerThemeId)
    setTextStyleId(defaultStickerTextStyleId)
    setMessages(initialMessages())
    setGeneratedPrompt(buildDefaultPrompt())
    showToast("คืนค่าทั้งหมดแล้ว")
  }

  return (
    <section className="bg-[#fffafd] py-14 sm:py-18" aria-label="เครื่องมือสร้าง Prompt สติกเกอร์">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 overflow-x-auto pb-2" aria-label="ขั้นตอนการใช้งาน">
          <ol className="flex min-w-max items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:grid sm:min-w-0 sm:grid-cols-4">
            {stepLabels.map((label, index) => (
              <li key={label} className="flex min-h-12 items-center gap-2 rounded-xl px-3 text-xs font-bold text-slate-700 sm:justify-center">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-pink-100 to-violet-100 text-[11px] text-violet-700">
                  {index + 1}
                </span>
                {label}
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-8">
          <div className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
            <ThemeSelector value={themeId} onChange={setThemeId} />
          </div>

          <div className="rounded-[2rem] border border-violet-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
            <TextStyleSelector value={textStyleId} onChange={setTextStyleId} />
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.72fr)]">
            <div className="rounded-[2rem] border border-sky-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
              <MessageEditor
                messages={messages}
                onMessageChange={changeMessage}
                onRestoreDefaults={restoreMessages}
                onClearAll={clearMessages}
              />
            </div>
            <PromptResultPanel
              prompt={generatedPrompt}
              isDirty={isDirty}
              onGenerate={generatePrompt}
              onCopy={copyPrompt}
              onDownload={downloadPrompt}
              onReset={resetAll}
            />
          </div>
        </div>
      </div>

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-2xl"
        >
          <CheckCircle2 size={17} className="text-emerald-400" aria-hidden="true" />
          {toast}
        </div>
      ) : null}
    </section>
  )
}
