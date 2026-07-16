import type { Metadata } from "next"

import { TutorFooter, TutorHeader } from "@/components/tutor/TutorShell"

export const metadata: Metadata = {
  title: "KRIT HUB AI Tutor",
  description: "ดูหลักสูตร ราคา รอบว่าง และจองคิวเรียนคอมพิวเตอร์และ AI",
  alternates: { canonical: "/tutor" },
  openGraph: { locale: "th_TH", url: "/tutor" },
}

export default function TutorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div lang="th" className="min-h-screen bg-slate-50 text-slate-950">
      <TutorHeader />
      <main>{children}</main>
      <TutorFooter />
    </div>
  )
}
