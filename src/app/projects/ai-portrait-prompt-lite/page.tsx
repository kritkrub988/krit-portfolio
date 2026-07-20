import type { Metadata } from "next"
import { PortraitPromptApp } from "@/components/portrait-prompt-lite/portrait-prompt-app"

export const metadata: Metadata = {
  title: "AI Portrait Prompt — Lite",
  description:
    "ระบบสร้าง Prompt สำหรับภาพ Portrait เลือก Model ชุด สถานที่ Mood กล้อง และโทนฟิล์มได้ในหน้าเดียว",
}

export default function AiPortraitPromptLitePage() {
  return <PortraitPromptApp />
}
