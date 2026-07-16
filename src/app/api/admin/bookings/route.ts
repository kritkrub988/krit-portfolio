import { hasValidAdminSession } from "@/lib/admin-auth/session"
import { listTutorBookings } from "@/lib/tutor-booking/google-sheets-client"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(): Promise<Response> {
  const headers = { "cache-control": "no-store, no-cache, must-revalidate, private" }
  if (!(await hasValidAdminSession())) {
    return Response.json(
      { success: false, code: "UNAUTHORIZED", message: "กรุณาเข้าสู่ระบบผู้ดูแล" },
      { status: 401, headers },
    )
  }

  const result = await listTutorBookings()
  return Response.json(result, { status: result.success ? 200 : 502, headers })
}
