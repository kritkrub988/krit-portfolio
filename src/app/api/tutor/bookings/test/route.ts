import { createTutorBooking } from "@/lib/tutor-booking/google-sheets-client"
import {
  bookingRequestSchema,
  formatValidationErrors,
} from "@/lib/tutor-booking/validation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request): Promise<Response> {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ success: false, code: "NOT_FOUND", message: "Not found" }, { status: 404 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { success: false, code: "INVALID_JSON", message: "Request body ต้องเป็น JSON" },
      { status: 400 },
    )
  }

  const validation = bookingRequestSchema.safeParse(body)
  if (!validation.success) {
    return Response.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "ข้อมูลการจองไม่ถูกต้อง",
        errors: formatValidationErrors(validation.error),
      },
      { status: 400 },
    )
  }

  const result = await createTutorBooking(validation.data)
  const status = result.success ? 201 : result.code === "SLOT_UNAVAILABLE" ? 409 : 502
  return Response.json(result, { status })
}
