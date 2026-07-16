import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

import Container from "@/components/common/Container"
import { tutorPrimaryLinkClass } from "@/components/tutor/TutorShell"

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const value = (key: string) => (typeof params[key] === "string" ? params[key] : "-")
  const priceValue = (key: string) => {
    const raw = value(key)
    const number = Number(raw)
    return Number.isFinite(number) ? `${number.toLocaleString("th-TH")} บาท` : "-"
  }
  const rows = [
    ["เลขอ้างอิง", value("booking_reference")],
    ["วันที่", value("booking_date")],
    ["เวลา", value("time_slot")],
    ["จำนวนผู้เรียน", `${value("number_of_students")} คน`],
    ["ราคาต่อคน", priceValue("price_per_person")],
    ["ราคารวม", priceValue("total_price")],
    ["รูปแบบเรียน", value("learning_format")],
    ["สถานะ", "รอตรวจสอบ (pending)"],
  ]

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-10">
          <CheckCircle2 className="h-12 w-12 text-emerald-600" aria-hidden="true" />
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950">จองคิวสำเร็จ</h1>
          <p className="mt-3 leading-7 text-slate-600">ระบบบันทึกคำขอแล้ว สถานะยังเป็นรอตรวจสอบ ผู้สอนจะติดต่อกลับตามข้อมูลที่ให้ไว้</p>
          <dl className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {rows.map(([label, detail]) => (
              <div key={label} className="grid gap-1 px-5 py-4 sm:grid-cols-[150px_1fr]">
                <dt className="text-sm font-semibold text-slate-500">{label}</dt>
                <dd className="break-words font-bold text-slate-900">{detail}</dd>
              </div>
            ))}
          </dl>
          <Link href="/tutor" className={`${tutorPrimaryLinkClass} mt-8`}>กลับหน้า Tutor</Link>
        </div>
      </Container>
    </section>
  )
}
