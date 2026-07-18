import { createTutorBooking } from "@/lib/tutor-booking/google-sheets-client"
import {
  checkRateLimit,
  claimSubmission,
  getRequestClientKey,
  isAllowedOrigin,
  releaseSubmission,
} from "@/lib/tutor-booking/request-guards"
import {
  bookingFormSchema,
  formatValidationErrors,
  toBookingRequest,
  validateFormTiming,
} from "@/lib/tutor-booking/validation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request): Promise<Response> {
  const headers = { "cache-control": "no-store" }
  if (!isAllowedOrigin(request)) {
    return Response.json(
      { success: false, code: "INVALID_ORIGIN", message: "ไม่อนุญาตคำขอจากเว็บไซต์อื่น" },
      { status: 403, headers },
    )
  }

  const rateLimit = checkRateLimit(`booking:${getRequestClientKey(request)}`, 5, 600_000)
  if (!rateLimit.allowed) {
    return Response.json(
      { success: false, code: "RATE_LIMITED", message: "ส่งคำขอจองถี่เกินไป กรุณาลองใหม่ภายหลัง" },
      { status: 429, headers: { ...headers, "retry-after": String(rateLimit.retryAfterSeconds) } },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { success: false, code: "INVALID_JSON", message: "Request body ต้องเป็น JSON" },
      { status: 400, headers },
    )
  }

  const validation = bookingFormSchema.safeParse(body)
  if (!validation.success || !validateFormTiming(validation.success ? validation.data.form_started_at : 0)) {
    return Response.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "ข้อมูลการจองไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง",
        errors: validation.success ? ["กรุณาใช้เวลาอ่านข้อความก่อนส่งแบบฟอร์ม"] : formatValidationErrors(validation.error),
      },
      { status: 400, headers },
    )
  }

  if (!claimSubmission(validation.data.submission_id)) {
    return Response.json(
      { success: false, code: "DUPLICATE_SUBMISSION", message: "คำขอนี้ถูกส่งแล้ว กรุณาตรวจผลการจอง" },
      { status: 409, headers },
    )
  }

  const result = await createTutorBooking(toBookingRequest(validation.data))
  if (!result.success) {
    releaseSubmission(validation.data.submission_id)
  }

  const status = result.success
    ? 201
    : result.code === "SLOT_UNAVAILABLE"
      ? 409
      : result.code === "EMAIL_NOT_VERIFIED"
        ? 400
      : result.code === "VALIDATION_ERROR"
        ? 400
        : result.code === "INTEGRATION_NOT_CONFIGURED"
          ? 503
          : 502
  return Response.json(result, { status, headers })
}
