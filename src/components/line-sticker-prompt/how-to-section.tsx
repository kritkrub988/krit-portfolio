import { Crop, Download, ExternalLink, ImageMinus, MessageSquareText, ShieldAlert } from "lucide-react"

const howToSteps = [
  { title: "สร้าง Prompt", description: "เลือกชุดสติกเกอร์และสไตล์ภาพ แล้วนำ Prompt พร้อมรูปอ้างอิงไปใช้กับ ChatGPT หรือ Gemini เอง", icon: ExternalLink, color: "bg-violet-100 text-violet-700" },
  { title: "ตัดตาราง 4×4", description: "เลือกภาพจากเครื่อง ปรับขอบและช่องว่าง แล้ว Crop เป็น 01.png–16.png", icon: Crop, color: "bg-sky-100 text-sky-700" },
  { title: "ลบพื้นหลัง", description: "เลือกสี ปรับ Tolerance และใช้ Flood Fill จากขอบเพื่อรักษารายละเอียดภายใน", icon: ImageMinus, color: "bg-emerald-100 text-emerald-700" },
  { title: "ใส่ข้อความ", description: "แก้ข้อความไทย เลือก Style ลากตำแหน่ง และตรวจ Safe Area ทีละภาพ", icon: MessageSquareText, color: "bg-pink-100 text-pink-700" },
  { title: "ตรวจและดาวน์โหลด", description: "ตรวจ Alpha และข้อความ จากนั้นดาวน์โหลด PNG, Main, Tab หรือ ZIP", icon: Download, color: "bg-amber-100 text-amber-700" },
]

export function HowToSection() {
  return (
    <section className="bg-[#f8fbff] py-12 sm:py-16" aria-labelledby="how-to-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Browser-only workflow</p><h2 id="how-to-heading" className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">ทำครบในหน้าเดียว 5 ขั้นตอน</h2></div>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {howToSteps.map((step, index) => { const Icon = step.icon; return <li key={step.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className={`grid h-11 w-11 place-items-center rounded-2xl ${step.color}`}><Icon size={21} aria-hidden="true" /></span><span className="text-2xl font-black text-slate-100">0{index + 1}</span></div><h3 className="mt-4 text-sm font-extrabold text-slate-900">{step.title}</h3><p className="mt-2 text-xs leading-6 text-slate-600">{step.description}</p></li> })}
        </ol>
        <div className="mt-7 grid gap-3 md:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-950"><ShieldAlert size={20} className="mt-0.5 shrink-0 text-amber-700" aria-hidden="true" /><p>ระบบลบพื้นหลังเหมาะกับสีเรียบ ไม่รับประกันฉากซับซ้อนหรือผลลัพธ์สมบูรณ์ 100% ควรตรวจ Preview ทุกภาพ</p></div>
          <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs leading-6 text-rose-950"><ShieldAlert size={20} className="mt-0.5 shrink-0 text-rose-700" aria-hidden="true" /><p>เว็บไซต์ไม่ได้สร้างภาพด้วย AI ผู้ใช้ต้องนำ Prompt ไปใช้ภายนอกเอง และควรตรวจสิทธิ์ของรูปบุคคลก่อนนำไปใช้</p></div>
        </div>
      </div>
    </section>
  )
}
