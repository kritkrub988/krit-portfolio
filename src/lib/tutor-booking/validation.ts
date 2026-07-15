import { z } from "zod"

import {
  ALL_TIME_SLOTS,
  BANGKOK_TIMEZONE,
  WEEKDAY_TIME_SLOTS,
  WEEKEND_TIME_SLOTS,
} from "./constants.ts"
import type {
  AdminListResponse,
  AdminUpdateResponse,
  AvailabilityResponse,
  BookingRequest,
  BookingResponse,
  TimeSlot,
} from "./types.ts"

export function isRealIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const parsed = new Date(Date.UTC(year, month - 1, day))

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  )
}

export function getBangkokDateString(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BANGKOK_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now)
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${value.year}-${value.month}-${value.day}`
}

export function getAllowedTimeSlots(bookingDate: string): readonly TimeSlot[] {
  if (!isRealIsoDate(bookingDate)) return []
  const [year, month, day] = bookingDate.split("-").map(Number)
  const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return dayOfWeek === 0 || dayOfWeek === 6 ? WEEKEND_TIME_SLOTS : WEEKDAY_TIME_SLOTS
}

const studentCountSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])

export const bookingRequestSchema: z.ZodType<BookingRequest> = z
  .object({
    customer_name: z.string().trim().min(1, "customer_name ต้องไม่ว่าง").max(150),
    phone: z.string().trim().min(1, "phone ต้องไม่ว่าง").max(50),
    booking_date: z
      .string()
      .trim()
      .refine(isRealIsoDate, "booking_date ต้องเป็นวันที่จริงในรูปแบบ YYYY-MM-DD"),
    time_slot: z.enum(ALL_TIME_SLOTS),
    number_of_students: studentCountSchema,
    learning_format: z.enum(["onsite", "online"]),
    location: z.string().trim().max(500),
    note: z.string().trim().max(2_000).optional().default(""),
    line_user_id: z.string().trim().max(200).optional().default(""),
  })
  .strict()
  .superRefine((booking, context) => {
    if (isRealIsoDate(booking.booking_date) && booking.booking_date < getBangkokDateString()) {
      context.addIssue({
        code: "custom",
        path: ["booking_date"],
        message: "booking_date ต้องไม่เป็นวันที่ย้อนหลังตามเวลา Asia/Bangkok",
      })
    }

    if (
      isRealIsoDate(booking.booking_date) &&
      !getAllowedTimeSlots(booking.booking_date).includes(booking.time_slot)
    ) {
      context.addIssue({
        code: "custom",
        path: ["time_slot"],
        message: "time_slot ไม่ใช่รอบที่เปิดให้จองในวันดังกล่าว",
      })
    }

    if (booking.learning_format === "onsite" && !booking.location.trim()) {
      context.addIssue({
        code: "custom",
        path: ["location"],
        message: "กรุณาระบุสถานที่สำหรับการเรียนแบบ onsite",
      })
    }
  })

export const bookingFormSchema = bookingRequestSchema.and(
  z
    .object({
      consent: z.literal(true, { error: "กรุณายอมรับการใช้ข้อมูลเพื่อจัดการการจอง" }),
      website: z.string().max(0, "ตรวจพบข้อมูลที่ไม่ควรมี"),
      form_started_at: z.number().int().positive(),
      submission_id: z.string().uuid(),
    })
    .strict(),
)

export function validateFormTiming(startedAt: number, now = Date.now()): boolean {
  const elapsed = now - startedAt
  return elapsed >= 1_500 && elapsed <= 86_400_000
}

export function toBookingRequest(value: z.infer<typeof bookingFormSchema>): BookingRequest {
  return {
    customer_name: value.customer_name,
    phone: value.phone,
    booking_date: value.booking_date,
    time_slot: value.time_slot,
    number_of_students: value.number_of_students,
    learning_format: value.learning_format,
    location: value.location,
    note: value.note,
    line_user_id: value.line_user_id,
  }
}

const bookingSummarySchema = z
  .object({
    booking_reference: z.string().regex(/^KHA-\d{8}-[A-Z0-9]{6}$/),
    booking_date: z.string().refine(isRealIsoDate),
    time_slot: z.enum(ALL_TIME_SLOTS),
    number_of_students: studentCountSchema,
    price_per_person: z.number().nonnegative(),
    total_price: z.number().nonnegative(),
    course_name: z.string().min(1),
    learning_format: z.enum(["onsite", "online"]),
    status: z.literal("pending"),
  })
  .strict()

const bookingSuccessResponseSchema = z
  .object({
    success: z.literal(true),
    message: z.string().min(1),
    booking: bookingSummarySchema,
  })
  .strict()

const bookingErrorResponseSchema = z
  .object({
    success: z.literal(false),
    code: z.string().min(1),
    message: z.string().min(1),
    errors: z.array(z.string()).optional(),
  })
  .strict()

const bookingResponseSchema: z.ZodType<BookingResponse> = z.discriminatedUnion("success", [
  bookingSuccessResponseSchema,
  bookingErrorResponseSchema,
])

export function parseAppsScriptResponse(value: unknown): BookingResponse | null {
  const result = bookingResponseSchema.safeParse(value)
  return result.success ? result.data : null
}

const availabilityResponseSchema: z.ZodType<AvailabilityResponse> = z.discriminatedUnion(
  "success",
  [
    z
      .object({
        success: z.literal(true),
        date: z.string().refine(isRealIsoDate),
        dayType: z.enum(["weekday", "weekend"]),
        availableSlots: z.array(z.enum(ALL_TIME_SLOTS)),
        unavailableSlots: z.array(z.enum(ALL_TIME_SLOTS)),
      })
      .strict(),
    bookingErrorResponseSchema,
  ],
)

const adminBookingSchema = z
  .object({
    booking_reference: z.string().regex(/^KHA-\d{8}-[A-Z0-9]{6}$/),
    created_at: z.string().min(1),
    booking_date: z.string().refine(isRealIsoDate),
    time_slot: z.enum(ALL_TIME_SLOTS),
    customer_name: z.string(),
    phone: z.string(),
    number_of_students: studentCountSchema,
    price_per_person: z.number().nonnegative(),
    total_price: z.number().nonnegative(),
    course_name: z.string(),
    learning_format: z.enum(["onsite", "online"]),
    location: z.string(),
    note: z.string(),
    status: z.enum(["pending", "confirmed", "cancelled"]),
    line_user_id: z.string(),
  })
  .strict()

const adminListResponseSchema: z.ZodType<AdminListResponse> = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true), bookings: z.array(adminBookingSchema) }).strict(),
  bookingErrorResponseSchema,
])

const adminUpdateResponseSchema: z.ZodType<AdminUpdateResponse> = z.discriminatedUnion(
  "success",
  [
    z
      .object({
        success: z.literal(true),
        booking_reference: z.string().regex(/^KHA-\d{8}-[A-Z0-9]{6}$/),
        status: z.enum(["pending", "confirmed", "cancelled"]),
      })
      .strict(),
    bookingErrorResponseSchema,
  ],
)

export function parseAvailabilityResponse(value: unknown): AvailabilityResponse | null {
  const result = availabilityResponseSchema.safeParse(value)
  return result.success ? result.data : null
}

export function parseAdminListResponse(value: unknown): AdminListResponse | null {
  const result = adminListResponseSchema.safeParse(value)
  return result.success ? result.data : null
}

export function parseAdminUpdateResponse(value: unknown): AdminUpdateResponse | null {
  const result = adminUpdateResponseSchema.safeParse(value)
  return result.success ? result.data : null
}

export function formatValidationErrors(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const field = issue.path.join(".")
    return field ? `${field}: ${issue.message}` : issue.message
  })
}
