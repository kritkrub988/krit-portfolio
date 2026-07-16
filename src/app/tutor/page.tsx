import {
  BookOpen,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Laptop,
  MapPin,
  Target,
  Tag,
  UsersRound,
} from "lucide-react"
import Link from "next/link"

import Container from "@/components/common/Container"
import { tutorPrimaryLinkClass, tutorSecondaryLinkClass } from "@/components/tutor/TutorShell"

const features = [
  {
    icon: UsersRound,
    tone: "bg-blue-50 text-blue-600",
    title: "เลือกได้ 2 ระดับ",
    text: "Level 1 สำหรับน้องประถม และ Level 2 สำหรับน้องมัธยมและคนทำงาน",
  },
  {
    icon: MapPin,
    tone: "bg-violet-50 text-violet-600",
    title: "เรียนแบบยืดหยุ่น",
    text: "เลือกเรียน Onsite ในพิษณุโลก หรือ Online ตามความสะดวก",
  },
  {
    icon: Clock3,
    tone: "bg-pink-50 text-pink-600",
    title: "คลาสละ 90 นาที",
    text: "มีช่วงพักระหว่างคลาส 30 นาที เรียนพอดี เข้าใจง่าย ไม่อัดแน่นเกินไป",
  },
  {
    icon: Target,
    tone: "bg-emerald-50 text-emerald-600",
    title: "เน้นผลลัพธ์ที่นำไปใช้ได้",
    text: "มีตัวอย่างและ Workshop ช่วยให้เข้าใจและนำไปต่อยอดได้จริง",
  },
]

const benefits = [
  { icon: CheckCircle2, text: "เข้าใจง่าย" },
  { icon: UsersRound, text: "ปรับตามพื้นฐาน" },
  { icon: Target, text: "ได้ทักษะที่นำไปใช้ต่อได้" },
  { icon: GraduationCap, text: "เหมาะทั้งการเรียนและการทำงาน" },
]

const graphicIcons = [Laptop, BrainCircuit, GraduationCap, Target]

export default function TutorHomePage() {
  return (
    <div className="overflow-hidden bg-slate-50">
      <section className="relative border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-violet-50 py-14 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border-[28px] border-violet-100/70" aria-hidden="true" />
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <div className="relative z-10">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-700 sm:text-base">KRIT HUB AI TUTOR</p>
              <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                หลักสูตรคอมพิวเตอร์และ AI
              </h1>
              <p className="mt-6 max-w-2xl text-xl font-bold leading-9 text-blue-700 sm:text-2xl">
                เลือกระดับที่เหมาะกับผู้เรียน และนำไปใช้ได้จริง
              </p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
                เรียนเป็นขั้นตอน เข้าใจง่าย ได้ลงมือทำจริง และต่อยอดได้ทั้งการเรียนและการทำงาน เหมาะสำหรับผู้เริ่มต้นที่ต้องการพื้นฐานที่ดี และผู้ที่อยากพัฒนาทักษะ AI อย่างเป็นระบบ
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/tutor/booking" className={tutorPrimaryLinkClass}>
                  <CalendarDays className="mr-2 h-5 w-5" aria-hidden="true" />
                  จองคิวเรียน
                </Link>
                <Link href="/tutor/course" className={tutorSecondaryLinkClass}>
                  <BookOpen className="mr-2 h-5 w-5 text-blue-600" aria-hidden="true" />
                  ดูหลักสูตร
                </Link>
                <Link href="/tutor/pricing" className={tutorSecondaryLinkClass}>
                  <Tag className="mr-2 h-5 w-5 text-blue-600" aria-hidden="true" />
                  ดูราคา
                </Link>
              </div>
            </div>

            <div className="relative min-h-[19rem] overflow-hidden rounded-[2rem] border border-blue-100 bg-white/70 p-6 shadow-[0_24px_80px_rgba(37,99,235,0.16)] sm:min-h-[25rem] sm:p-10" aria-label="กราฟิกการเรียนรู้คอมพิวเตอร์และ AI">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.2),transparent_44%),linear-gradient(135deg,rgba(255,255,255,0.9),rgba(237,233,254,0.7))]" aria-hidden="true" />
              <div className="absolute inset-x-8 bottom-8 h-20 rounded-[50%] border border-blue-200/70 bg-blue-100/50 blur-sm" aria-hidden="true" />
              <div className="relative flex h-full min-h-[17rem] items-center justify-center sm:min-h-[21rem]">
                <div className="relative flex h-36 w-36 rotate-[-6deg] items-center justify-center rounded-[1.7rem] border border-white/80 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 shadow-[0_20px_45px_rgba(37,99,235,0.35)] sm:h-44 sm:w-44">
                  <div className="absolute inset-3 rounded-2xl border border-white/30" aria-hidden="true" />
                  <span className="relative text-5xl font-black tracking-tight text-white sm:text-6xl">AI</span>
                  <SparkleIcon />
                </div>
                {graphicIcons.map((Icon, index) => (
                  <div key={index} className={`absolute flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/85 text-blue-600 shadow-lg backdrop-blur ${index === 0 ? "left-3 top-6 sm:left-8" : index === 1 ? "bottom-5 left-8 text-violet-600 sm:left-16" : index === 2 ? "right-3 top-10 text-indigo-600 sm:right-10" : "bottom-4 right-6 text-emerald-600 sm:right-16"}`}>
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                ))}
                <div className="absolute right-1/2 top-1/2 h-52 w-52 translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/40" aria-hidden="true" />
                <div className="absolute right-1/2 top-1/2 h-72 w-72 translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/30" aria-hidden="true" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14 lg:py-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, tone, title, text }) => (
              <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-lg">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${tone}`}>
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-extrabold leading-tight text-slate-950">{title}</h2>
                <p className="mt-3 leading-8 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-10 sm:pb-14">
        <Container>
          <div className="grid gap-3 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-violet-50 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, text }, index) => (
              <div key={text} className={`flex items-center gap-3 px-2 py-3 text-sm font-bold text-slate-700 sm:px-4 ${index > 0 ? "sm:border-l sm:border-slate-300" : ""}`}>
                <Icon className="h-6 w-6 shrink-0 text-blue-600" aria-hidden="true" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}

function SparkleIcon() {
  return (
    <span className="absolute -right-2 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-violet-600 shadow-md" aria-hidden="true">
      <span className="text-xl">✦</span>
    </span>
  )
}
