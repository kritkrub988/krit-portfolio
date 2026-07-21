import type { Metadata } from "next"
import { PortraitPromptApp } from "@/components/portrait-prompt-lite/portrait-prompt-app"

export const metadata: Metadata = {
  title: "AI Portrait Prompt — เที่ยวทิพย์",
  description:
    "สร้าง Prompt ภาพท่องเที่ยวจากรูปใบหน้า พร้อมเลือกระยะภาพ ชุด สถานที่ Mood กล้อง และโทนฟิล์มได้ในหน้าเดียว",
}

export default function AiPortraitPromptLitePage() {
  return <PortraitPromptApp />
}
