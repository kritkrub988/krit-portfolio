import type { Metadata } from "next"
import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"
import { HowToSection } from "@/components/line-sticker-prompt/how-to-section"
import { SplitPromptSection } from "@/components/line-sticker-prompt/split-prompt-section"
import { StickerHero } from "@/components/line-sticker-prompt/sticker-hero"
import { StickerPromptBuilder } from "@/components/line-sticker-prompt/sticker-prompt-builder"

export const metadata: Metadata = {
  title: "LINE Sticker Prompt Builder",
  description:
    "ตัวช่วยสร้าง Prompt สติกเกอร์ไลน์ 16 อารมณ์ เลือกธีม รูปแบบตัวอักษร และข้อความ พร้อมนำไปใช้กับ ChatGPT หรือ Gemini",
}

export default function LineStickerPromptPage() {
  return (
    <div className="line-sticker-page">
      <Navbar homeHrefPrefix="/" />
      <main>
        <StickerHero />
        <StickerPromptBuilder />
        <SplitPromptSection />
        <HowToSection />
      </main>
      <Footer />
    </div>
  )
}
