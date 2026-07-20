"use client"

import Link from "next/link"

export default function AiPortraitPromptError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <div className="max-w-lg rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-xl">
        <p className="text-sm font-bold uppercase tracking-wider text-rose-600">Workspace Error</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">เปิด Prompt Builder ไม่สำเร็จ</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Draft ใน IndexedDB จะไม่ถูกลบ ลองเปิดหน้านี้อีกครั้ง หรือกลับหน้า Portfolio หากปัญหายังเกิดซ้ำ</p>
        <div className="mt-6 flex justify-center gap-3"><button type="button" onClick={reset} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">ลองอีกครั้ง</button><Link href="/" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700">กลับ Portfolio</Link></div>
      </div>
    </main>
  )
}
