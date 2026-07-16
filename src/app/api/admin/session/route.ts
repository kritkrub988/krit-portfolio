import { clearAdminSessionCookie, getAdminConfig, setAdminSessionCookie } from "@/lib/admin-auth/session"
import { verifyAdminPassword } from "@/lib/admin-auth/core.ts"
import {
  checkRateLimit,
  getRequestClientKey,
  isAllowedOrigin,
} from "@/lib/tutor-booking/request-guards"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request): Promise<Response> {
  const headers = { "cache-control": "no-store" }
  if (!isAllowedOrigin(request)) {
    return Response.json({ success: false, message: "ไม่อนุญาตคำขอจากเว็บไซต์อื่น" }, { status: 403, headers })
  }

  const rateLimit = checkRateLimit(`admin-login:${getRequestClientKey(request)}`, 5, 900_000)
  if (!rateLimit.allowed) {
    return Response.json(
      { success: false, message: "เข้าสู่ระบบผิดหลายครั้ง กรุณารอก่อนลองใหม่" },
      { status: 429, headers: { ...headers, "retry-after": String(rateLimit.retryAfterSeconds) } },
    )
  }

  const config = getAdminConfig()
  if (!config) {
    return Response.json(
      { success: false, message: "ระบบผู้ดูแลยังไม่ได้ตั้งค่า" },
      { status: 503, headers },
    )
  }

  let password = ""
  try {
    const body = (await request.json()) as { password?: unknown }
    password = typeof body.password === "string" ? body.password : ""
  } catch {
    return Response.json({ success: false, message: "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง" }, { status: 400, headers })
  }

  if (!verifyAdminPassword(password, config.password)) {
    return Response.json({ success: false, message: "รหัสผ่านไม่ถูกต้อง" }, { status: 401, headers })
  }

  await setAdminSessionCookie(config.sessionSecret)
  return Response.json({ success: true }, { status: 200, headers })
}

export async function DELETE(request: Request): Promise<Response> {
  if (!isAllowedOrigin(request)) {
    return Response.json({ success: false }, { status: 403, headers: { "cache-control": "no-store" } })
  }
  await clearAdminSessionCookie()
  return Response.json({ success: true }, { headers: { "cache-control": "no-store" } })
}
