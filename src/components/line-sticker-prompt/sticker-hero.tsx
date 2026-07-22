import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, ShieldCheck, Sparkles, Star, WandSparkles } from "lucide-react"
import Container from "@/components/common/Container"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"

export function StickerHero() {
  return (
    <section className="relative overflow-hidden border-b border-pink-100 bg-[radial-gradient(circle_at_12%_12%,rgba(253,164,175,0.20),transparent_30%),radial-gradient(circle_at_88%_8%,rgba(167,243,208,0.28),transparent_27%),linear-gradient(180deg,#fff_0%,#fffafd_100%)] py-8 sm:py-10 lg:py-12">
      <Heart className="absolute left-[4%] top-28 hidden text-pink-300 lg:block" size={24} aria-hidden="true" />
      <Sparkles className="absolute right-[3%] top-36 hidden text-violet-300 lg:block" size={26} aria-hidden="true" />
      <Container>
        <Link href="/#projects" className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          <ArrowLeft size={16} aria-hidden="true" />กลับไป Featured Projects
        </Link>

        <div className="grid items-center gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-violet-600">LINE Sticker Prompt &amp; Studio</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
              ตัวช่วยทำสติกเกอร์ไลน์
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              สร้าง Prompt ภาพ 16 อารมณ์ ตัดภาพ ลบพื้นหลัง ใส่ข้อความ และดาวน์โหลดไฟล์ได้ใน Browser
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">
              <ShieldCheck size={15} aria-hidden="true" />ไม่ส่งรูปขึ้น Server • ไม่เชื่อม AI API • ใช้งานใน Browser
            </span>
            <p className="mt-4 max-w-2xl rounded-2xl border border-sky-100 bg-white/80 px-4 py-3 text-xs leading-6 text-sky-900">
              รูปที่เลือกจะถูกประมวลผลบนอุปกรณ์ของคุณเท่านั้น เว็บไซต์ไม่อัปโหลดและไม่เก็บรูปไว้
            </p>
            <Button href="#sticker-studio" className="mt-5 min-h-12 w-full gap-2 sm:w-auto">
              <WandSparkles size={18} aria-hidden="true" />เริ่มทำสติกเกอร์
            </Button>
          </div>

          <Card className="relative overflow-hidden border-pink-100 bg-white p-3 shadow-xl shadow-pink-100/70 hover:translate-y-0 sm:p-4">
            <div className="mb-2 flex items-center justify-between gap-3 px-1">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-pink-500">Example workflow</p><h2 className="mt-1 text-sm font-extrabold text-slate-900 sm:text-base">ภาพตัวอย่างตาราง 4×4</h2></div>
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-amber-50 text-amber-500"><Star size={19} aria-hidden="true" /></span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-pink-100 bg-pink-50">
              <Image src="/images/projects/line-sticker-prompt-preview.png" alt="ตัวอย่างสติกเกอร์ 16 อารมณ์ในตาราง 4 คูณ 4" width={1536} height={1536} priority sizes="(max-width: 1024px) 100vw, 45vw" className="h-auto w-full object-contain" />
            </div>
          </Card>
        </div>
      </Container>
    </section>
  )
}
