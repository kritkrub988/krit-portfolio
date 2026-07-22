"use client"

import { Check, Copy, FileArchive, Info } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { splitStickerPrompt } from "@/data/line-sticker/prompt-templates"
import { copyTextToClipboard } from "@/lib/line-sticker/browser-utils"

export function SplitPromptSection() {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [])

  async function copySplitPrompt() {
    try {
      await copyTextToClipboard(splitStickerPrompt)
      setCopied(true)
      setError(false)
      if (resetTimer.current) clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => setCopied(false), 2200)
    } catch {
      setError(true)
    }
  }

  return (
    <section className="bg-white py-14 sm:py-18" aria-labelledby="split-prompt-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 overflow-hidden rounded-[2rem] border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-sky-50 p-5 shadow-sm sm:p-8 lg:grid-cols-[0.72fr_1.28fr] lg:p-10">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-100 text-pink-700">
              <FileArchive size={24} aria-hidden="true" />
            </span>
            <h2 id="split-prompt-heading" className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              Prompt สำหรับแยกภาพและตั้งชื่อไฟล์
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              หลังจากได้ภาพตาราง 4×4 แล้ว ให้นำภาพนั้นไปแนบกับ ChatGPT หรือเครื่องมือที่รองรับการจัดการไฟล์ แล้วใช้ Prompt นี้
            </p>
            <div className="mt-5 flex gap-3 rounded-2xl border border-sky-200 bg-white/80 p-4 text-xs leading-6 text-sky-900">
              <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <p>
                ผลลัพธ์ขึ้นอยู่กับความสามารถของ AI หรือเครื่องมือที่ผู้ใช้เลือก เว็บไซต์นี้ไม่ได้ตัดภาพให้โดยตรง
              </p>
            </div>
          </div>

          <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <pre className="max-h-[430px] overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-slate-950 p-4 font-mono text-[12px] leading-6 text-slate-200 sm:p-5">
              {splitStickerPrompt}
            </pre>
            <button
              type="button"
              onClick={copySplitPrompt}
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
            >
              {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
              {copied ? "คัดลอก Prompt แยกไฟล์แล้ว" : "Copy Prompt แยกไฟล์"}
            </button>
            {error ? (
              <p role="alert" className="mt-3 text-xs text-rose-700">
                คัดลอกอัตโนมัติไม่สำเร็จ กรุณาเลือกข้อความแล้วคัดลอกเอง
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
