import Container from "@/components/common/Container"
import BookingForm from "@/components/tutor/BookingForm"
import { TutorPageIntro } from "@/components/tutor/TutorShell"

export default function BookingPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <TutorPageIntro
          eyebrow="BOOKING"
          title="ตรวจรอบว่างและจองคิวเรียน"
          description="เลือกวันที่ ระบบจะแสดงรอบที่เปิดและสถานะล่าสุด ก่อนส่งคำขอโปรดตรวจข้อมูลและราคา Preview"
        />
        <BookingForm />
      </Container>
    </section>
  )
}
