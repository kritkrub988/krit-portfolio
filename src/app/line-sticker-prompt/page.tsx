import type { Metadata } from "next"
import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"
import { HowToSection } from "@/components/line-sticker-prompt/how-to-section"
import { StickerHero } from "@/components/line-sticker-prompt/sticker-hero"
import { StickerStudio } from "@/components/line-sticker-prompt/sticker-studio"
import { stickerFontVariables } from "./sticker-fonts"

export const metadata: Metadata = {
  title: "ตัวช่วยทำสติกเกอร์ไลน์",
  description:
    "สร้าง Prompt ภาพ 16 อารมณ์ ตัดภาพ ลบพื้นหลัง ใส่ข้อความไทย และดาวน์โหลดไฟล์ได้ใน Browser",
}

export default function LineStickerPromptPage() {
  return (
    <div className={`${stickerFontVariables} line-sticker-page`} data-sticker-font-root>
      <Navbar homeHrefPrefix="/" />
      <main>
        <StickerHero />
        <StickerStudio />
        <HowToSection />
      </main>
      <Footer />
    </div>
  )
}
