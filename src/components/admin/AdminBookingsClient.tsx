"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import type { AdminBooking, AdminListResponse, BookingStatus } from "@/lib/tutor-booking/types.ts"

const statusLabels: Record<BookingStatus, string> = {
  pending: "รอตรวจสอบ",
  confirmed: "ยืนยันแล้ว",
  cancelled: "ยกเลิก",
}

export default function AdminBookingsClient() {
  const router = useRouter()
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [query, setQuery] = useState("")
  const [date, setDate] = useState("")
  const [status, setStatus] = useState<BookingStatus | "">("")
  const [sort, setSort] = useState<"newest" | "classDate">("newest")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [updatingReference, setUpdatingReference] = useState("")

  const loadBookings = useCallback(async () => {
    setIsLoading(true)
    setMessage("")
    try {
      const response = await fetch("/api/admin/bookings", { cache: "no-store" })
      const result = (await response.json()) as AdminListResponse
      if (!response.ok || !result.success) {
        setMessage(result.success ? "ไม่สามารถโหลดรายการได้" : result.message)
        if (response.status === 401) router.refresh()
        return
      }
      setBookings(result.bookings)
    } catch {
      setMessage("ไม่สามารถเชื่อมต่อรายการจองได้")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadBookings(), 0)
    return () => window.clearTimeout(timeout)
  }, [loadBookings])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return bookings
      .filter((booking) => !date || booking.booking_date === date)
      .filter((booking) => !status || booking.status === status)
      .filter((booking) => {
        if (!normalized) return true
        return [booking.booking_reference, booking.customer_name, booking.phone, booking.email].some((value) =>
          value.toLowerCase().includes(normalized),
        )
      })
      .sort((left, right) =>
        sort === "newest"
          ? right.created_at.localeCompare(left.created_at)
          : `${left.booking_date} ${left.time_slot}`.localeCompare(`${right.booking_date} ${right.time_slot}`),
      )
  }, [bookings, date, query, sort, status])

  async function updateStatus(booking: AdminBooking, nextStatus: BookingStatus) {
    if (booking.status === nextStatus) return
    if (!window.confirm(`ยืนยันเปลี่ยน ${booking.booking_reference} เป็น “${statusLabels[nextStatus]}” หรือไม่`)) return
    setUpdatingReference(booking.booking_reference)
    setMessage("")
    try {
      const response = await fetch(`/api/admin/bookings/${encodeURIComponent(booking.booking_reference)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
      const result = (await response.json()) as { success?: boolean; message?: string }
      if (!response.ok || !result.success) {
        setMessage(result.message || "ไม่สามารถเปลี่ยนสถานะได้")
        return
      }
      await loadBookings()
    } catch {
      setMessage("ไม่สามารถเชื่อมต่อเพื่อเปลี่ยนสถานะได้")
    } finally {
      setUpdatingReference("")
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" })
    router.refresh()
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">พบ {filtered.length} จาก {bookings.length} รายการ</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => void loadBookings()} disabled={isLoading} className="min-h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold">รีเฟรช</button>
          <button onClick={() => void logout()} className="min-h-10 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white">ออกจากระบบ</button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-bold text-slate-600">ค้นหา Reference/ชื่อ/เบอร์/อีเมล
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="mt-1 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
        </label>
        <label className="text-xs font-bold text-slate-600">วันที่เรียน
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-1 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
        </label>
        <label className="text-xs font-bold text-slate-600">สถานะ
          <select value={status} onChange={(event) => setStatus(event.target.value as BookingStatus | "")} className="mt-1 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm">
            <option value="">ทั้งหมด</option><option value="pending">รอตรวจสอบ</option><option value="confirmed">ยืนยันแล้ว</option><option value="cancelled">ยกเลิก</option>
          </select>
        </label>
        <label className="text-xs font-bold text-slate-600">เรียงลำดับ
          <select value={sort} onChange={(event) => setSort(event.target.value as "newest" | "classDate")} className="mt-1 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm">
            <option value="newest">ใหม่ล่าสุด</option><option value="classDate">วันเรียนใกล้ที่สุด</option>
          </select>
        </label>
      </div>

      {message && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{message}</p>}
      {isLoading ? (
        <p className="mt-8 text-center font-semibold text-blue-700" role="status">กำลังโหลดรายการจอง…</p>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-[1480px] w-full text-left text-sm">
            <thead className="bg-slate-950 text-white"><tr>{["Reference", "สร้างเมื่อ", "วัน/เวลาเรียน", "ผู้จอง", "เบอร์โทร", "อีเมล", "คน", "ราคา", "รูปแบบ/สถานที่", "หมายเหตุ", "สถานะ"].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((booking) => (
                <tr key={booking.booking_reference} className="align-top">
                  <td className="px-4 py-4 font-mono font-bold">{booking.booking_reference}</td>
                  <td className="px-4 py-4">{booking.created_at}</td>
                  <td className="px-4 py-4 font-semibold">{booking.booking_date}<br />{booking.time_slot}</td>
                  <td className="px-4 py-4">{booking.customer_name}</td>
                  <td className="px-4 py-4">{booking.phone}</td>
                  <td className="px-4 py-4">{booking.email || "-"}</td>
                  <td className="px-4 py-4">{booking.number_of_students}</td>
                  <td className="px-4 py-4">{booking.price_per_person}/คน<br /><strong>{booking.total_price} บาท</strong></td>
                  <td className="px-4 py-4">{booking.learning_format}<br />{booking.location || "-"}</td>
                  <td className="max-w-56 whitespace-normal px-4 py-4">{booking.note || "-"}</td>
                  <td className="px-4 py-4">
                    <select aria-label={`สถานะ ${booking.booking_reference}`} value={booking.status} disabled={updatingReference === booking.booking_reference} onChange={(event) => void updateStatus(booking, event.target.value as BookingStatus)} className="min-h-10 rounded-lg border border-slate-300 px-2 disabled:opacity-50">
                      <option value="pending">รอตรวจสอบ</option><option value="confirmed">ยืนยันแล้ว</option><option value="cancelled">ยกเลิก</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <p className="p-8 text-center text-slate-500">ไม่พบรายการตามตัวกรอง</p>}
        </div>
      )}
    </div>
  )
}
