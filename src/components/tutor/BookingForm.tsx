"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { ALL_TIME_SLOTS } from "@/lib/tutor-booking/constants.ts"
import { getBookingPrice } from "@/lib/tutor-booking/price.ts"
import type {
  AvailabilityResponse,
  BookingResponse,
  LearningFormat,
  TimeSlot,
} from "@/lib/tutor-booking/types.ts"
import { emailSchema, getBangkokDateString, normalizeEmail } from "@/lib/tutor-booking/validation.ts"

const fieldClass =
  "mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"

export default function BookingForm() {
  const router = useRouter()
  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [emailRequestId, setEmailRequestId] = useState("")
  const [emailOtp, setEmailOtp] = useState("")
  const [emailVerificationToken, setEmailVerificationToken] = useState("")
  const [resendAvailableAt, setResendAvailableAt] = useState(0)
  const [countdownNow, setCountdownNow] = useState(() => Date.now())
  const [bookingDate, setBookingDate] = useState("")
  const [timeSlot, setTimeSlot] = useState<TimeSlot | "">("")
  const [studentCount, setStudentCount] = useState<1 | 2 | 3 | 4>(1)
  const [learningFormat, setLearningFormat] = useState<LearningFormat>("onsite")
  const [location, setLocation] = useState("ในเมืองพิษณุโลก")
  const [note, setNote] = useState("")
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState("")
  const [formStartedAt] = useState(() => Date.now())
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID())
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [message, setMessage] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  const minimumDate = getBangkokDateString()
  const price = useMemo(() => getBookingPrice(studentCount), [studentCount])

  useEffect(() => {
    if (!bookingDate) return

    const controller = new AbortController()
    const timeout = window.setTimeout(() => {
      setIsLoadingSlots(true)
      setMessage("")
      fetch(`/api/tutor/availability?date=${encodeURIComponent(bookingDate)}`, {
        cache: "no-store",
        signal: controller.signal,
      })
        .then(async (response) => (await response.json()) as AvailabilityResponse)
        .then((result) => {
          setAvailability(result)
          if (!result.success) {
            setTimeSlot("")
            setMessage(result.message)
          } else {
            setTimeSlot((current) =>
              current && !result.availableSlots.includes(current) ? "" : current,
            )
          }
        })
        .catch((error: unknown) => {
          if (error instanceof Error && error.name === "AbortError") return
          setAvailability(null)
          setTimeSlot("")
          setMessage("ไม่สามารถโหลดรอบว่างได้ กรุณาลองใหม่")
        })
        .finally(() => setIsLoadingSlots(false))
    }, 0)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [bookingDate, refreshKey])

  useEffect(() => {
    if (!resendAvailableAt) return
    const timer = window.setInterval(() => setCountdownNow(Date.now()), 1_000)
    return () => window.clearInterval(timer)
  }, [resendAvailableAt])

  function handleEmailChange(value: string) {
    setEmail(value)
    setEmailRequestId("")
    setEmailOtp("")
    setEmailVerificationToken("")
    setResendAvailableAt(0)
  }

  async function handleSendEmailOtp() {
    const normalizedEmail = normalizeEmail(email)
    const validation = emailSchema.safeParse(normalizedEmail)
    if (!validation.success) {
      setMessage("กรุณากรอกอีเมลให้ถูกต้อง")
      return
    }
    if (resendAvailableAt > Date.now()) {
      setMessage(`กรุณารอ ${Math.ceil((resendAvailableAt - Date.now()) / 1_000)} วินาทีก่อนส่งรหัสอีกครั้ง`)
      return
    }
    setIsSendingOtp(true)
    setMessage("")
    try {
      const response = await fetch("/api/tutor/email-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "send", email: normalizedEmail }),
      })
      const result = await response.json() as { success: boolean; message: string; request_id?: string; resend_after_seconds?: number }
      if (!result.success || !result.request_id) {
        setMessage(result.message || "ไม่สามารถส่งอีเมลได้ในขณะนี้ กรุณาลองใหม่ภายหลัง")
        return
      }
      setEmail(normalizedEmail)
      setEmailRequestId(result.request_id)
      setEmailOtp("")
      setEmailVerificationToken("")
      setResendAvailableAt(Date.now() + (result.resend_after_seconds || 60) * 1_000)
      setCountdownNow(Date.now())
      setMessage(`ส่งรหัสยืนยันไปยัง ${normalizedEmail} แล้ว รหัสมีอายุ 10 นาที`)
    } catch {
      setMessage("ไม่สามารถส่งอีเมลได้ในขณะนี้ กรุณาลองใหม่ภายหลัง")
    } finally {
      setIsSendingOtp(false)
    }
  }

  async function handleVerifyEmailOtp() {
    if (!emailRequestId || !/^[0-9]{6}$/.test(emailOtp)) {
      setMessage("กรุณากรอกรหัสยืนยัน 6 หลัก")
      return
    }
    setIsVerifyingOtp(true)
    setMessage("")
    try {
      const response = await fetch("/api/tutor/email-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "verify", email: normalizeEmail(email), request_id: emailRequestId, otp: emailOtp }),
      })
      const result = await response.json() as { success: boolean; message: string; verification_token?: string }
      if (!result.success || !result.verification_token) {
        setMessage(result.message || "รหัสยืนยันไม่ถูกต้อง")
        return
      }
      setEmailVerificationToken(result.verification_token)
      setMessage("ยืนยันอีเมลสำเร็จ")
    } catch {
      setMessage("ไม่สามารถยืนยันรหัสได้ กรุณาลองใหม่")
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting || !timeSlot || !submissionId) return
    setIsSubmitting(true)
    setMessage("")

    try {
      const response = await fetch("/api/tutor/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          phone,
          email: normalizeEmail(email),
          email_verification_token: emailVerificationToken,
          booking_date: bookingDate,
          time_slot: timeSlot,
          number_of_students: studentCount,
          learning_format: learningFormat,
          location: learningFormat === "onsite" ? location : "",
          note,
          line_user_id: "",
          consent,
          website,
          form_started_at: formStartedAt,
          submission_id: submissionId,
        }),
      })
      const result = (await response.json()) as BookingResponse
      if (!result.success) {
        setMessage(result.message)
        if (result.code === "SLOT_UNAVAILABLE") setRefreshKey((value) => value + 1)
        if (["UPSTREAM_TIMEOUT", "UPSTREAM_NETWORK_ERROR"].includes(result.code)) {
          setSubmissionId(crypto.randomUUID())
        }
        return
      }

      const query = new URLSearchParams({
        booking_reference: result.booking.booking_reference,
        booking_date: result.booking.booking_date,
        time_slot: result.booking.time_slot,
        number_of_students: String(result.booking.number_of_students),
        price_per_person: String(result.booking.price_per_person),
        total_price: String(result.booking.total_price),
        learning_format: result.booking.learning_format,
        status: result.booking.status,
      })
      router.push(`/tutor/booking/success?${query.toString()}`)
    } catch {
      setMessage("ไม่สามารถส่งคำขอจองได้ กรุณาตรวจการเชื่อมต่อแล้วลองใหม่")
      setSubmissionId(crypto.randomUUID())
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableSlots = availability?.success ? availability.availableSlots : []
  const unavailableSlots = availability?.success ? availability.unavailableSlots : []

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-8" aria-describedby="booking-form-message">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-800">
          ชื่อผู้จอง <span className="text-red-600">*</span>
          <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} className={fieldClass} maxLength={150} autoComplete="name" required />
        </label>
        <label className="text-sm font-bold text-slate-800">
          เบอร์โทรศัพท์ <span className="text-red-600">*</span>
          <input value={phone} onChange={(event) => setPhone(event.target.value)} className={fieldClass} maxLength={50} inputMode="tel" autoComplete="tel" required />
        </label>
        <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="block text-sm font-bold text-slate-800">
            อีเมลผู้จอง <span className="text-red-600">*</span>
            <input type="email" value={email} onChange={(event) => handleEmailChange(event.target.value)} className={fieldClass} maxLength={254} placeholder="example@email.com" autoComplete="email" required />
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={() => void handleSendEmailOtp()} disabled={isSendingOtp || !email.trim() || resendAvailableAt > countdownNow} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-300 bg-white px-4 py-3 text-sm font-bold text-blue-700 transition hover:border-blue-500 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50">
              {isSendingOtp ? "กำลังส่งรหัส…" : emailRequestId ? "ส่งรหัสอีกครั้ง" : "ส่งรหัสยืนยัน"}
            </button>
            {emailRequestId && !emailVerificationToken && <p className="text-xs leading-6 text-slate-600">OTP มีอายุ 10 นาที{resendAvailableAt > countdownNow ? ` · ส่งซ้ำได้ใน ${Math.ceil((resendAvailableAt - countdownNow) / 1_000)} วินาที` : ""}</p>}
            {emailVerificationToken && <p className="text-sm font-bold text-emerald-700" role="status">ยืนยันอีเมลสำเร็จ</p>}
          </div>
          {emailRequestId && !emailVerificationToken && (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="block flex-1 text-sm font-bold text-slate-800">
                รหัส OTP 6 หลัก
                <input value={emailOtp} onChange={(event) => setEmailOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} className={`${fieldClass} tracking-[0.35em]`} inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" />
              </label>
              <button type="button" onClick={() => void handleVerifyEmailOtp()} disabled={isVerifyingOtp || emailOtp.length !== 6} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50">
                {isVerifyingOtp ? "กำลังตรวจสอบ…" : "ยืนยันรหัส"}
              </button>
            </div>
          )}
        </div>
        <label className="text-sm font-bold text-slate-800">
          วันที่เรียน <span className="text-red-600">*</span>
          <input type="date" value={bookingDate} min={minimumDate} onChange={(event) => { setBookingDate(event.target.value); setAvailability(null); setTimeSlot("") }} className={fieldClass} required />
        </label>
        <label className="text-sm font-bold text-slate-800">
          จำนวนผู้เรียน <span className="text-red-600">*</span>
          <select value={studentCount} onChange={(event) => setStudentCount(Number(event.target.value) as 1 | 2 | 3 | 4)} className={fieldClass}>
            {[1, 2, 3, 4].map((count) => <option key={count} value={count}>{count} คน</option>)}
          </select>
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-bold text-slate-800">รูปแบบการเรียน</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {(["onsite", "online"] as const).map((format) => (
            <label key={format} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold">
              <input type="radio" name="learning_format" value={format} checked={learningFormat === format} onChange={() => setLearningFormat(format)} />
              {format === "onsite" ? "Onsite" : "Online"}
            </label>
          ))}
        </div>
      </fieldset>

      {learningFormat === "onsite" && (
        <label className="block text-sm font-bold text-slate-800">
          สถานที่เรียน <span className="text-red-600">*</span>
          <input value={location} onChange={(event) => setLocation(event.target.value)} className={fieldClass} maxLength={500} required />
        </label>
      )}

      <fieldset>
        <legend className="text-sm font-bold text-slate-800">รอบเวลา <span className="text-red-600">*</span></legend>
        {!bookingDate && <p className="mt-3 text-sm text-slate-500">กรุณาเลือกวันที่ก่อน ระบบจึงจะแสดงรอบเวลา</p>}
        {isLoadingSlots && <p className="mt-3 text-sm font-semibold text-blue-700" role="status">กำลังตรวจสอบรอบว่าง…</p>}
        {availability?.success && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_TIME_SLOTS.map((slot) => {
              const isAvailable = availableSlots.includes(slot)
              const isUnavailable = unavailableSlots.includes(slot)
              if (!isAvailable && !isUnavailable) return null
              return (
                <label key={slot} className={`flex min-h-12 items-center gap-2 rounded-xl border px-4 py-3 font-semibold ${isAvailable ? "cursor-pointer border-slate-300 bg-white hover:border-blue-400" : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"}`}>
                  <input type="radio" name="time_slot" value={slot} checked={timeSlot === slot} disabled={!isAvailable} onChange={() => setTimeSlot(slot)} />
                  <span>{slot}</span>
                  {!isAvailable && <span className="ml-auto text-xs">ไม่ว่าง</span>}
                </label>
              )
            })}
          </div>
        )}
      </fieldset>

      <label className="block text-sm font-bold text-slate-800">
        หมายเหตุ (ถ้ามี)
        <textarea value={note} onChange={(event) => setNote(event.target.value)} className={`${fieldClass} min-h-28 resize-y`} maxLength={2_000} />
      </label>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5" aria-live="polite">
        <p className="text-sm font-bold text-blue-900">สรุปราคา {studentCount} คน</p>
        <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-slate-700">
          <p>ราคาต่อคน <strong>{price.pricePerPerson.toLocaleString("th-TH")} บาท</strong></p>
          <p>ราคารวม <strong className="text-blue-800">{price.totalPrice.toLocaleString("th-TH")} บาท</strong></p>
        </div>
        <p className="mt-2 text-xs text-slate-500">ราคานี้เป็น Preview ระบบจะคำนวณใหม่ฝั่ง Server ก่อนบันทึก</p>
      </div>

      <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>เว็บไซต์<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
      </div>

      <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4" required />
        <span>ฉันยินยอมให้ใช้ข้อมูลนี้เพื่อการติดต่อและจัดการการจองเท่านั้น</span>
      </label>

      {message && <p id="booking-form-message" role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{message}</p>}

      <button type="submit" disabled={isSubmitting || isLoadingSlots || !timeSlot || !consent || !submissionId || !emailVerificationToken} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
        {isSubmitting ? "กำลังส่งคำขอ…" : "ยืนยันการจองคิว"}
      </button>
    </form>
  )
}
