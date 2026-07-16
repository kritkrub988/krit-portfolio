"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setMessage("")
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const result = (await response.json()) as { success?: boolean; message?: string }
      if (!response.ok || !result.success) {
        setMessage(result.message || "ไม่สามารถเข้าสู่ระบบได้")
        return
      }
      setPassword("")
      router.refresh()
    } catch {
      setMessage("ไม่สามารถเชื่อมต่อระบบเข้าสู่ระบบได้")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <label className="block text-sm font-bold text-slate-800">
        รหัสผ่านผู้ดูแล
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </label>
      {message && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{message}</p>}
      <button disabled={isSubmitting} className="min-h-11 w-full rounded-xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-50">
        {isSubmitting ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
      </button>
    </form>
  )
}
