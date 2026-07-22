import { Copy, ExternalLink, Palette, PencilLine, ShieldAlert } from "lucide-react"

const howToSteps = [
  {
    title: "เลือก Theme และ Text Style",
    description: "เลือกบรรยากาศสีและรูปแบบตัวอักษรที่เข้ากับสติกเกอร์ของคุณ",
    icon: Palette,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "แก้ข้อความทั้ง 16 ประโยค",
    description: "ใช้ข้อความเริ่มต้นหรือปรับเป็นคำพูดประจำตัวที่ต้องการได้ทุกช่อง",
    icon: PencilLine,
    color: "bg-sky-100 text-sky-700",
  },
  {
    title: "Copy Prompt",
    description: "กดสร้าง Prompt ตรวจเนื้อหา แล้วคัดลอกหรือดาวน์โหลดไฟล์ .txt",
    icon: Copy,
    color: "bg-violet-100 text-violet-700",
  },
  {
    title: "นำไปใช้กับ AI ที่เลือก",
    description: "เปิด ChatGPT หรือ Gemini แนบรูปต้นฉบับ แล้ววาง Prompt ที่คัดลอกไว้",
    icon: ExternalLink,
    color: "bg-pink-100 text-pink-700",
  },
]

export function HowToSection() {
  return (
    <section id="how-to-use" className="scroll-mt-24 bg-[#f8fbff] py-14 sm:py-18" aria-labelledby="how-to-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">How it works</p>
          <h2 id="how-to-heading" className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            วิธีใช้งาน 4 ขั้นตอน
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            เตรียม Prompt ได้ในเว็บ แล้วนำไปใช้ต่อกับบริการ AI ภายนอกด้วยตัวเอง
          </p>
        </div>

        <ol className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howToSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <li key={step.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className={`grid h-11 w-11 place-items-center rounded-2xl ${step.color}`}>
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <span className="text-2xl font-black text-slate-100">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-base font-extrabold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
              </li>
            )
          })}
        </ol>

        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-950 sm:p-5">
          <ShieldAlert size={21} className="mt-0.5 shrink-0 text-amber-700" aria-hidden="true" />
          <p>
            อย่าอัปโหลดภาพส่วนตัวของเด็กหรือบุคคลอื่นโดยไม่ได้รับอนุญาต และควรตรวจนโยบายความเป็นส่วนตัวของบริการ AI ที่นำ Prompt ไปใช้
          </p>
        </div>
      </div>
    </section>
  )
}
