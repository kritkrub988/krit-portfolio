import { z } from "zod"

import { hasValidAdminSession } from "@/lib/admin-auth/session"
import { updateTutorBookingStatus } from "@/lib/tutor-booking/google-sheets-client"
import { isAllowedOrigin } from "@/lib/tutor-booking/request-guards"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const referenceSchema = z.string().regex(/^KHA-\d{8}-[A-Z0-9]{6}$/)
const updateSchema = z.object({ status: z.enum(["pending", "confirmed", "cancelled"]) }).strict()

export async function PATCH(
  request: Request,
  context: { params: Promise<{ bookingReference: string }> },
): Promise<Response> {
  const headers = { "cache-control": "no-store, no-cache, must-revalidate, private" }
  if (!isAllowedOrigin(request)) {
    return Response.json({ success: false, code: "INVALID_ORIGIN" }, { status: 403, headers })
  }
  if (!(await hasValidAdminSession())) {
    return Response.json(
      { success: false, code: "UNAUTHORIZED", message: "กรุณาเข้าสู่ระบบผู้ดูแล" },
      { status: 401, headers },
    )
  }

  const { bookingReference } = await context.params
  const reference = referenceSchema.safeParse(bookingReference)
  let body: unknown
  try {
    body = await request.json()
  } catch {
    body = null
  }
  const update = updateSchema.safeParse(body)
  if (!reference.success || !update.success) {
    return Response.json(
      { success: false, code: "VALIDATION_ERROR", message: "Reference หรือสถานะไม่ถูกต้อง" },
      { status: 400, headers },
    )
  }

  const result = await updateTutorBookingStatus(reference.data, update.data.status)
  const status = result.success ? 200 : result.code === "NOT_FOUND" ? 404 : 502
  return Response.json(result, { status, headers })
}
