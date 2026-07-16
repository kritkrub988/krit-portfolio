import { Clock3, Laptop, MapPin, ShieldCheck } from "lucide-react"
import Link from "next/link"

import Container from "@/components/common/Container"
import {
  TutorPageIntro,
  tutorPrimaryLinkClass,
  tutorSecondaryLinkClass,
} from "@/components/tutor/TutorShell"

const highlights = [
  { icon: Laptop, title: "เรียนได้ 2 รูปแบบ", text: "เลือกเรียน onsite หรือ online ตามความเหมาะสม" },
  { icon: Clock3, title: "90 นาทีต่อคลาส", text: "มีช่วงพักระหว่างคลาส 30 นาที" },
  { icon: MapPin, title: "ในเมืองพิษณุโลก", text: "ไม่มีค่าเดินทางสำหรับพื้นที่ในเมือง" },
  { icon: ShieldCheck, title: "จองรอบอย่างชัดเจน", text: "ตรวจรอบว่างและรับเลขอ้างอิงหลังจอง" },
]

export default function TutorHomePage() {
  return (
    <>
      <section className="overflow-hidden border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-violet-50 py-16 sm:py-24">
        <Container>
          <TutorPageIntro
            eyebrow="KRIT HUB AI TUTOR"
            title="หลักสูตรคอมพิวเตอร์และ AI — Level 2 + 2.5 Extra"
            description="เรียนรู้ด้านคอมพิวเตอร์และ AI ในรูปแบบที่เป็นมิตร เข้าใจง่าย และเลือกเวลาเรียนได้จากรอบที่ยังว่าง"
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tutor/course" className={tutorSecondaryLinkClass}>ดูหลักสูตร</Link>
            <Link href="/tutor/pricing" className={tutorSecondaryLinkClass}>ดูราคา</Link>
            <Link href="/tutor/booking" className={tutorPrimaryLinkClass}>จองคิวเรียน</Link>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <Icon className="h-7 w-7 text-blue-600" aria-hidden="true" />
                <h2 className="mt-5 text-lg font-bold">{title}</h2>
                <p className="mt-2 leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
