import Link from "next/link"

type StartScreenProps = {
  hasProjects: boolean
  persistent: boolean
  warning?: string
  onStart: () => void
  onResume: () => void
  onViewProjects: () => void
}

export function StartScreen({
  hasProjects,
  persistent,
  warning,
  onStart,
  onResume,
  onViewProjects,
}: StartScreenProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dbeafe_0,_transparent_32%),radial-gradient(circle_at_top_right,_#ede9fe_0,_transparent_28%),#f8fafc] px-5 py-12 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-2xl shadow-blue-950/10 backdrop-blur">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <section className="p-8 sm:p-12 lg:p-16">
            <Link href="/" className="text-sm font-bold text-blue-700 hover:text-blue-900">← KRIT Portfolio</Link>
            <p className="mt-12 text-sm font-bold uppercase tracking-[0.2em] text-violet-600">AI PORTRAIT PROMPT</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">มาสร้าง Prompt Model Portrait กัน</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              เลือกเงื่อนไขทีละขั้น ระบบจะประกอบ Creative Brief และ Prompt ระดับ Production แบบเรียลไทม์ โดยไม่มีการเชื่อมต่อ AI API
            </p>
            {!persistent && warning ? (
              <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{warning}</p>
            ) : null}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button type="button" onClick={onStart} className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:-translate-y-0.5">เริ่มสร้าง Prompt</button>
              <button type="button" onClick={onResume} disabled={!hasProjects} className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:border-blue-300 disabled:cursor-not-allowed disabled:opacity-45">เปิด Draft ล่าสุด</button>
              <button type="button" onClick={onViewProjects} className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:border-blue-300">ดู Projects ที่บันทึกไว้</button>
            </div>
          </section>
          <section className="relative min-h-96 overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-950 to-violet-950 p-8 text-white sm:p-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
            <div className="relative mx-auto max-w-md rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" /></div>
              <div className="mt-6 grid gap-3">
                {['Creative Direction', 'Model Identity', 'Camera + Lighting', 'Film Look', 'Shot List'].map((label, index) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                    <p className="text-xs font-semibold text-blue-200">STEP {index + 1}</p>
                    <div className="mt-2 flex items-center justify-between"><span className="font-semibold">{label}</span><span className="text-violet-300">⌄</span></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
