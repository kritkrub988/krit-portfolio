import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, BookOpen, Heart, ShieldCheck, Sparkles, Star, WandSparkles } from "lucide-react"
import Container from "@/components/common/Container"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"

export function StickerHero() {
  return (
    <section className="relative overflow-hidden border-b border-pink-100 bg-[radial-gradient(circle_at_12%_12%,rgba(253,164,175,0.20),transparent_30%),radial-gradient(circle_at_88%_8%,rgba(167,243,208,0.28),transparent_27%),linear-gradient(180deg,#fff_0%,#fffafd_100%)] py-10 sm:py-14 lg:py-18">
      <Star className="absolute left-[4%] top-28 hidden text-amber-300 lg:block" size={24} aria-hidden="true" />
      <Heart className="absolute left-[48%] top-20 hidden text-pink-300 lg:block" size={26} aria-hidden="true" />
      <Sparkles className="absolute right-[3%] top-44 hidden text-violet-300 lg:block" size={28} aria-hidden="true" />

      <Container>
        <Link
          href="/#projects"
          className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          กลับไป Featured Projects
        </Link>

        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] xl:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
              <ShieldCheck size={15} aria-hidden="true" />
              ไม่ต้องสมัคร • ไม่อัปโหลดรูป • ไม่เชื่อมต่อ API
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
              สร้าง Prompt สติกเกอร์ไลน์
              <span className="mt-2 block bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
                16 อารมณ์ในไม่กี่ขั้นตอน
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              เลือกธีม รูปแบบตัวอักษร และใส่ข้อความที่ต้องการ ระบบจะประกอบ Prompt ให้พร้อมนำไปใช้กับ ChatGPT หรือ Gemini
            </p>
            <div className="mt-7 grid gap-3 sm:flex">
              <Button href="#theme-section" className="min-h-12 gap-2">
                <WandSparkles size={18} aria-hidden="true" />
                เริ่มสร้าง Prompt
              </Button>
              <Button href="#how-to-use" variant="secondary" className="min-h-12 gap-2">
                <BookOpen size={18} aria-hidden="true" />
                ดูวิธีใช้งาน
              </Button>
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-500">
              เครื่องมือนี้สร้างเฉพาะ Prompt คุณเป็นผู้เลือกบริการ AI และแนบรูปต้นฉบับด้วยตนเอง
            </p>
          </div>

          <Card className="relative overflow-hidden border-pink-100 bg-white p-3 shadow-xl shadow-pink-100/70 hover:translate-y-0 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-pink-500">Preview</p>
                <h2 className="mt-1 text-base font-extrabold text-slate-900 sm:text-lg">
                  ตัวอย่างสติกเกอร์ 16 อารมณ์
                </h2>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-amber-50 text-amber-500">
                <Star size={19} aria-hidden="true" />
              </span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-pink-100 bg-pink-50">
              <Image
                src="/images/projects/line-sticker-prompt-preview.png"
                alt="ตัวอย่างสติกเกอร์เด็กผู้หญิงเอวา 16 อารมณ์ จัดวางเป็นตาราง 4 คูณ 4"
                width={1536}
                height={1536}
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="h-auto w-full object-contain"
              />
            </div>
            <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-[11px] leading-5 text-slate-600">
              ภาพนี้เป็นเพียงตัวอย่าง ผู้ใช้ต้องนำรูปของตัวเองไปแนบกับ AI ภายนอกเว็บไซต์
            </p>
          </Card>
        </div>
      </Container>
    </section>
  )
}
