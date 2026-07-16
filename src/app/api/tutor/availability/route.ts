import { getTutorAvailability } from "@/lib/tutor-booking/google-sheets-client"
import { checkRateLimit, getRequestClientKey } from "@/lib/tutor-booking/request-guards"
import { bookingDateSchema, formatValidationErrors } from "@/lib/tutor-booking/validation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request): Promise<Response> {
  const rateLimit = checkRateLimit(`availability:${getRequestClientKey(request)}`, 60, 60_000)
  if (!rateLimit.allowed) {
    return Response.json(
      { success: false, code: "RATE_LIMITED", message: "เรียกตรวจรอบถี่เกินไป กรุณารอสักครู่" },
      {
        status: 429,
        headers: { "cache-control": "no-store", "retry-after": String(rateLimit.retryAfterSeconds) },
      },
    )
  }

  const date = new URL(request.url).searchParams.get("date") ?? ""
  const validation = bookingDateSchema.safeParse(date)
  if (!validation.success) {
    return Response.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "วันที่ไม่ถูกต้อง",
        errors: formatValidationErrors(validation.error),
      },
      { status: 400, headers: { "cache-control": "no-store" } },
    )
  }

  const result = await getTutorAvailability(validation.data)
  const status = result.success
    ? 200
    : result.code === "INTEGRATION_NOT_CONFIGURED"
      ? 503
      : result.code === "VALIDATION_ERROR"
        ? 400
        : 502
  return Response.json(result, { status, headers: { "cache-control": "no-store" } })
}
