import { sendEmailOtp, verifyEmailOtp } from "@/lib/tutor-booking/google-sheets-client"
import { checkRateLimit, getRequestClientKey, isAllowedOrigin } from "@/lib/tutor-booking/request-guards"
import { emailSchema, normalizeEmail } from "@/lib/tutor-booking/validation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const headers = { "cache-control": "no-store" }

export async function POST(request: Request): Promise<Response> {
  if (!isAllowedOrigin(request)) {
    return Response.json({ success: false, code: "INVALID_ORIGIN", message: "ไม่อนุญาตคำขอจากเว็บไซต์อื่น" }, { status: 403, headers })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ success: false, code: "INVALID_JSON", message: "ข้อมูลคำขอไม่ถูกต้อง" }, { status: 400, headers })
  }

  const data = body && typeof body === "object" ? body as Record<string, unknown> : {}
  const action = String(data.action || "")
  const emailResult = emailSchema.safeParse(data.email)
  if (!emailResult.success) {
    return Response.json({ success: false, code: "VALIDATION_ERROR", message: "กรุณากรอกอีเมลให้ถูกต้อง" }, { status: 400, headers })
  }
  const email = normalizeEmail(emailResult.data)

  if (action === "send") {
    const limit = checkRateLimit(`email-otp-send:${getRequestClientKey(request)}`, 5, 600_000)
    if (!limit.allowed) {
      return Response.json({ success: false, code: "RATE_LIMITED", message: "ส่งคำขอถี่เกินไป กรุณาลองใหม่ภายหลัง" }, { status: 429, headers: { ...headers, "retry-after": String(limit.retryAfterSeconds) } })
    }
    const result = await sendEmailOtp(email)
    return Response.json(result, { status: result.success ? 200 : 400, headers })
  }

  if (action === "verify") {
    const limit = checkRateLimit(`email-otp-verify:${getRequestClientKey(request)}`, 10, 600_000)
    if (!limit.allowed) {
      return Response.json({ success: false, code: "RATE_LIMITED", message: "กรอกข้อมูลถี่เกินไป กรุณาลองใหม่ภายหลัง" }, { status: 429, headers: { ...headers, "retry-after": String(limit.retryAfterSeconds) } })
    }
    const requestId = typeof data.request_id === "string" ? data.request_id.trim() : ""
    const otp = typeof data.otp === "string" ? data.otp.trim() : ""
    if (!/^[0-9]{6}$/.test(otp) || requestId.length < 16) {
      return Response.json({ success: false, code: "VALIDATION_ERROR", message: "กรุณากรอกรหัสยืนยัน 6 หลัก" }, { status: 400, headers })
    }
    const result = await verifyEmailOtp(email, requestId, otp)
    return Response.json(result, { status: result.success ? 200 : 400, headers })
  }

  return Response.json({ success: false, code: "VALIDATION_ERROR", message: "ไม่รองรับคำขอที่ระบุ" }, { status: 400, headers })
}
