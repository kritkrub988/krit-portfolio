import {
  ArrowRight,
  BookOpenCheck,
  Bot,
  Check,
  Clock3,
  Coffee,
  FileCheck2,
  FolderOpen,
  Globe2,
  Home,
  Laptop,
  MapPin,
  MessageCircle,
  MousePointer2,
  Network,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UsersRound,
} from "lucide-react"
import Link from "next/link"

import Container from "@/components/common/Container"
import { tutorSecondaryLinkClass } from "@/components/tutor/TutorShell"

const levelOneLearning = [
  "รู้จักอุปกรณ์คอมพิวเตอร์และการใช้งานเบื้องต้น",
  "ฝึกใช้เมาส์ คีย์บอร์ด ไฟล์ และโฟลเดอร์",
  "ใช้อินเทอร์เน็ตและค้นหาข้อมูลอย่างเหมาะสม",
  "เรียนรู้ Google Drive, Docs, Sheets และ Slides",
  "ใช้อีเมลและประชุมออนไลน์เบื้องต้น",
  "เรียนรู้ความปลอดภัยบนอินเทอร์เน็ต",
  "ทดลองใช้ AI อย่างเหมาะสมตามวัย",
  "ฝึกทำชิ้นงานจากสิ่งที่เรียน",
]

const levelTwoLearning = [
  "เลือก AI ให้เหมาะกับงาน",
  "เขียน Prompt แบบมีเป้าหมายและ Requirement",
  "แยกงานใหญ่เป็นขั้นตอนและควบคุมงาน AI",
  "ใช้ AI กับเอกสาร ข้อมูล และงานค้นคว้า",
  "จัดข้อมูลให้พร้อมใช้กับเว็บไซต์และระบบ",
  "สร้างคอนเทนต์ ภาพ และวิดีโอเบื้องต้น",
  "วางโครงสร้างเว็บไซต์และ Web App",
  "เข้าใจ Database, API, Automation และ LINE OA",
  "วางแผนโปรเจกต์สำหรับนำไปต่อยอดจริง",
]

const levelOneFor = [
  "น้องประถมที่ยังใช้คอมพิวเตอร์ไม่คล่อง",
  "ผู้ปกครองที่อยากให้มีพื้นฐานดิจิทัลที่ดี",
  "น้องที่ต้องใช้คอมพิวเตอร์ทำการบ้านหรือเรียนออนไลน์",
  "น้องที่อยากเริ่มเรียน AI แต่ยังขาดพื้นฐานคอมพิวเตอร์",
]

const levelTwoFor = [
  "นักเรียนมัธยมที่อยากเพิ่มทักษะด้าน AI",
  "นักเรียนที่ต้องการทำ Portfolio หรือโปรเจกต์",
  "คนทำงานที่ต้องการลดเวลางานซ้ำ",
  "ผู้เริ่มต้นที่อยากทำเว็บไซต์ โปรแกรม หรือระบบเล็ก ๆ",
  "ผู้สนใจคอนเทนต์ ขายสินค้า หรือทำ Affiliate",
  "ผู้ที่อยากต่อยอดไปสู่ AI Agent, Automation หรือ LINE Chatbot",
]

const highlights = [
  { icon: BookOpenCheck, text: "เนื้อหาเป็นขั้นตอน ไม่กระโดดข้ามพื้นฐาน" },
  { icon: Trophy, text: "มีตัวอย่างและ Workshop ในคลาส" },
  { icon: UsersRound, text: "ปรับเนื้อหาตามระดับของผู้เรียน" },
  { icon: Sparkles, text: "เน้นเข้าใจ ไม่เน้นท่องจำ" },
  { icon: Target, text: "เรียนจากโจทย์ที่ใกล้ตัวและใช้งานจริง" },
  { icon: FileCheck2, text: "มีชิ้นงานหรือผลลัพธ์หลังเรียน" },
  { icon: ShieldCheck, text: "ไม่รับรองผลเกินจริง แต่เน้นทักษะที่ต่อยอดได้" },
]

const learningFormats = [
  { icon: UsersRound, title: "เรียนแบบตัวต่อตัวหรือกลุ่มเล็ก" },
  { icon: Clock3, title: "คลาสละ 90 นาที" },
  { icon: Coffee, title: "พักระหว่างคลาส 30 นาที" },
  { icon: Laptop, title: "เลือกเรียน Onsite หรือ Online" },
  { icon: MapPin, title: "Onsite ในเมืองพิษณุโลก" },
  { icon: Home, title: "เรียนได้ที่บ้าน คาเฟ่ หรือสถานที่นัดหมาย" },
]

function LearningList({ items, tone }: { items: string[]; tone: "blue" | "violet" }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700">
          <span
            className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
              tone === "blue" ? "bg-blue-600" : "bg-violet-600"
            }`}
          >
            <Check className="h-3 w-3 text-white" strokeWidth={3} aria-hidden="true" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function LevelCard({
  id,
  level,
  title,
  subtitle,
  description,
  learning,
  suitableFor,
  result,
  tone,
  icon: Icon,
}: {
  id: string
  level: string
  title: string
  subtitle: string
  description: string
  learning: string[]
  suitableFor: string[]
  result: string
  tone: "blue" | "violet"
  icon: typeof Laptop
}) {
  const accent = tone === "blue" ? "text-blue-700" : "text-violet-700"
  const soft = tone === "blue" ? "bg-blue-50 text-blue-700" : "bg-violet-50 text-violet-700"
  const divider = tone === "blue" ? "border-blue-100" : "border-violet-100"

  return (
    <article id={id} className="flex scroll-mt-24 flex-col rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)] sm:p-7">
      <div className="flex items-start gap-4">
        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${soft}`}>
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <div>
          <p className={`text-sm font-extrabold tracking-wide ${accent}`}>{level}</p>
          <h2 className={`mt-1 text-xl font-extrabold leading-tight ${accent} sm:text-2xl`}>{title}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-600">{subtitle}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-slate-600">{description}</p>
      <div className={`mt-5 grid gap-6 border-t pt-5 md:grid-cols-2 ${divider}`}>
        <div>
          <h3 className={`mb-4 flex items-center gap-2 text-sm font-extrabold ${accent}`}>
            <FolderOpen className="h-4 w-4" aria-hidden="true" /> สิ่งที่จะได้เรียน
          </h3>
          <LearningList items={learning} tone={tone} />
        </div>
        <div>
          <h3 className={`mb-4 flex items-center gap-2 text-sm font-extrabold ${accent}`}>
            <UsersRound className="h-4 w-4" aria-hidden="true" /> เหมาะกับใคร
          </h3>
          <ul className="space-y-3">
            {suitableFor.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`mt-6 rounded-2xl p-4 ${soft}`}>
        <h3 className={`flex items-center gap-2 text-sm font-extrabold ${accent}`}>
          <Trophy className="h-4 w-4" aria-hidden="true" /> ผลลัพธ์ที่คาดหวัง
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">{result}</p>
      </div>
    </article>
  )
}

export default function CoursePage() {
  return (
    <div className="overflow-hidden bg-slate-50">
      <section className="bg-gradient-to-br from-blue-50 via-white to-violet-50 py-12 sm:py-16 lg:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div>
              <p className="inline-flex rounded-lg border border-blue-200 bg-white px-4 py-2 text-xs font-extrabold tracking-[0.2em] text-blue-700 shadow-sm">
                COURSE
              </p>
              <h1 className="mt-6 max-w-xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                หลักสูตร
                <br />
                คอมพิวเตอร์และ <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="mt-6 max-w-lg text-xl font-semibold leading-9 text-slate-700 sm:text-2xl">
                เลือกระดับให้เหมาะกับผู้เรียน และนำไปใช้ได้จริง
              </p>
              <p className="mt-5 max-w-lg leading-8 text-slate-600">
                เรียนแบบเป็นขั้นตอน เน้นความเข้าใจ ลงมือทำ และเห็นผลลัพธ์จากสิ่งที่เรียน ไม่ใช่แค่ฟังทฤษฎี
              </p>
            </div>
            <div className="relative min-h-[18rem] overflow-hidden rounded-[2rem] border border-blue-100 bg-white/80 p-6 shadow-[0_25px_70px_rgba(37,99,235,0.14)] sm:min-h-[22rem] sm:p-10">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-200/60 blur-2xl" />
              <div className="absolute -bottom-20 -left-14 h-52 w-52 rounded-full bg-blue-200/70 blur-2xl" />
              <div className="relative flex h-full min-h-[15rem] items-center justify-center">
                <div className="relative w-full max-w-md rounded-2xl border-8 border-slate-800 bg-slate-900 p-3 shadow-2xl">
                  <div className="flex aspect-[16/9] items-center justify-center rounded-lg bg-gradient-to-br from-blue-950 via-blue-800 to-violet-700">
                    <div className="grid grid-cols-3 gap-3 opacity-90">
                      {[Network, Bot, MessageCircle, Globe2, MousePointer2, Sparkles].map((Icon, index) => (
                        <span key={index} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm sm:h-12 sm:w-12">
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 h-3 w-4/5 rounded-full bg-slate-300 shadow-inner" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <LevelCard
              id="level-1"
              level="Level 1"
              title="พื้นฐานคอมพิวเตอร์สำหรับน้องประถม"
              subtitle="เรียนให้ใช้คอมพิวเตอร์ได้อย่างมั่นใจและปลอดภัย"
              description="เหมาะสำหรับน้อง ๆ ที่ยังใช้คอมพิวเตอร์ไม่คล่อง หรืออยากวางพื้นฐานให้แน่นก่อนต่อยอดสู่การเรียน การทำงาน และการใช้ AI ในอนาคต"
              learning={levelOneLearning}
              suitableFor={levelOneFor}
              result="น้องสามารถใช้คอมพิวเตอร์ได้คล่องขึ้น จัดการไฟล์ได้ ทำงานพื้นฐานได้ และรู้วิธีใช้อินเทอร์เน็ตกับ AI อย่างปลอดภัย"
              tone="blue"
              icon={Laptop}
            />
            <LevelCard
              id="level-2"
              level="Level 2"
              title="AI สำหรับนักเรียนมัธยมและคนทำงาน"
              subtitle="จากผู้ใช้ AI ทั่วไป สู่การใช้ AI สร้างผลงานจริง"
              description="เหมาะสำหรับผู้ที่เคยใช้ ChatGPT หรือ AI มาแล้ว แต่อยากพัฒนาให้ใช้ AI ได้เป็นระบบมากขึ้น ตั้งแต่การวางโจทย์ไปจนถึงการสร้างชิ้นงาน"
              learning={levelTwoLearning}
              suitableFor={levelTwoFor}
              result="ผู้เรียนสามารถใช้ AI เป็นระบบมากขึ้น รู้จักวางแผนงาน เขียน Prompt เตรียมข้อมูล และสร้างชิ้นงานที่นำไปใช้ต่อได้จริง"
              tone="violet"
              icon={Bot}
            />
          </div>
        </Container>
      </section>

      <section className="border-y border-slate-200 bg-white py-10 sm:py-14">
        <Container>
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-950 sm:text-3xl">จุดเด่นของหลักสูตร</h2>
            <p className="mt-2 text-slate-600">เรียนแล้วนำไปใช้ต่อได้</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {highlights.map(({ icon: Icon, text }) => (
              <article key={text} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <Icon className="mx-auto h-8 w-8 text-blue-600" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-950 sm:text-3xl">รูปแบบการเรียน</h2>
          </div>
          <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-6 lg:grid-cols-3 xl:grid-cols-6">
            {learningFormats.map(({ icon: Icon, title }) => (
              <div key={title} className="flex items-center gap-3 border-slate-200 px-2 py-3 sm:flex-col sm:border-r sm:px-4 sm:text-center xl:last:border-r-0">
                <Icon className="h-8 w-8 shrink-0 text-blue-600" aria-hidden="true" />
                <p className="text-sm font-semibold leading-6 text-slate-700">{title}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-12 sm:pb-16">
        <Container>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-blue-950 via-blue-700 to-fuchsia-600 p-6 text-white shadow-xl sm:p-9">
            <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-fuchsia-400/30 blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-fuchsia-600">
                    <Sparkles className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h2 className="text-2xl font-extrabold sm:text-3xl">เลือกเรียนจากระดับที่เหมาะกับคุณ</h2>
                </div>
                <p className="mt-4 leading-7 text-blue-50">ไม่จำเป็นต้องเก่งคอมพิวเตอร์มาก่อน ผู้สอนจะประเมินพื้นฐานและปรับเนื้อหาให้เหมาะกับผู้เรียนแต่ละคน</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
                <a href="#level-1" className={tutorSecondaryLinkClass}>ดูรายละเอียด Level 1 <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></a>
                <a href="#level-2" className={tutorSecondaryLinkClass}>ดูรายละเอียด Level 2 <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></a>
                <Link href="/tutor/pricing" className={tutorSecondaryLinkClass}>ดูราคาเรียน <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
                <Link href="/tutor/booking" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-fuchsia-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-fuchsia-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">จองคิวเรียน <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
