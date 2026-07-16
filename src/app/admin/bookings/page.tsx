import type { Metadata } from "next"
import Link from "next/link"

import AdminBookingsClient from "@/components/admin/AdminBookingsClient"
import AdminLoginForm from "@/components/admin/AdminLoginForm"
import Container from "@/components/common/Container"
import { getAdminConfig, hasValidAdminSession } from "@/lib/admin-auth/session"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "จัดการรายการจอง",
  robots: { index: false, follow: false, nocache: true },
}

export default async function AdminBookingsPage() {
  const isConfigured = Boolean(getAdminConfig())
  const isAuthenticated = isConfigured && (await hasValidAdminSession())

  return (
    <main lang="th" className="min-h-screen bg-slate-100 py-10 text-slate-950">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-sm font-bold tracking-wider text-blue-700">KRIT HUB AI TUTOR</p><h1 className="mt-2 text-3xl font-extrabold">จัดการรายการจอง</h1></div>
          <Link href="/" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold">กลับ Portfolio</Link>
        </div>
        {!isConfigured ? (
          <div className="mt-8 max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-6"><h2 className="font-bold text-amber-950">ระบบผู้ดูแลยังไม่พร้อม</h2><p className="mt-2 leading-7 text-amber-900">กรุณาตั้งค่า ADMIN_PASSWORD และ ADMIN_SESSION_SECRET ใน Environment ของ Server</p></div>
        ) : isAuthenticated ? (
          <AdminBookingsClient />
        ) : (
          <div className="mt-8 max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-bold">เข้าสู่ระบบผู้ดูแล</h2><p className="mt-2 text-sm leading-6 text-slate-600">Session จะเก็บใน Signed HttpOnly Cookie และหมดอายุภายใน 8 ชั่วโมง</p><AdminLoginForm /></div>
        )}
      </Container>
    </main>
  )
}
