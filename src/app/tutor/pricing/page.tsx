import Link from "next/link"

import Container from "@/components/common/Container"
import { TutorPageIntro, tutorPrimaryLinkClass } from "@/components/tutor/TutorShell"
import { PRICE_BY_STUDENT_COUNT } from "@/lib/tutor-booking/constants.ts"

export default function PricingPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <TutorPageIntro
          eyebrow="PRICING"
          title="ราคาเรียน 1–4 คน"
          description="ราคาต่อคลาส 90 นาที ระบบจะคำนวณราคาใหม่ฝั่ง Server ทุกครั้งเมื่อส่งคำขอจอง"
        />
        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left">
              <thead className="bg-slate-950 text-sm text-white">
                <tr><th className="px-6 py-4">จำนวนผู้เรียน</th><th className="px-6 py-4">ราคาต่อคน</th><th className="px-6 py-4">ราคารวม</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Object.entries(PRICE_BY_STUDENT_COUNT).map(([count, price]) => (
                  <tr key={count}>
                    <td className="px-6 py-5 font-bold">{count} คน</td>
                    <td className="px-6 py-5">{price.pricePerPerson.toLocaleString("th-TH")} บาท/คน</td>
                    <td className="px-6 py-5 font-bold text-blue-700">{price.totalPrice.toLocaleString("th-TH")} บาท</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <ul className="mt-6 space-y-2 text-sm leading-7 text-slate-600">
          <li>• ต่อคลาส 90 นาที</li>
          <li>• ไม่มีค่าเดินทางสำหรับพื้นที่ในเมืองพิษณุโลก</li>
          <li>• ราคานี้ไม่รวมอุปกรณ์เพิ่มเติมถ้ามี</li>
        </ul>
        <Link href="/tutor/booking" className={`${tutorPrimaryLinkClass} mt-8`}>จองคิวเรียน</Link>
      </Container>
    </section>
  )
}
