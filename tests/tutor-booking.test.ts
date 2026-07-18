import assert from "node:assert/strict"
import test from "node:test"

import {
  createAdminSessionToken,
  verifyAdminPassword,
  verifyAdminSessionToken,
} from "../src/lib/admin-auth/core.ts"
import { getBookingPrice } from "../src/lib/tutor-booking/price.ts"
import {
  checkRateLimit,
  claimSubmission,
  releaseSubmission,
} from "../src/lib/tutor-booking/request-guards.ts"
import {
  bookingDateSchema,
  bookingFormSchema,
  bookingRequestSchema,
  getAllowedTimeSlots,
  getBangkokDateString,
  parseAdminListResponse,
  parseAdminUpdateResponse,
  parseAppsScriptResponse,
  parseAvailabilityResponse,
  parseEmailOtpResponse,
  parseEmailOtpVerifyResponse,
  normalizeEmail,
  validateFormTiming,
} from "../src/lib/tutor-booking/validation.ts"

function nextDateWithDay(targetDay: number): string {
  const [year, month, day] = getBangkokDateString().split("-").map(Number)
  const current = new Date(Date.UTC(year, month - 1, day))
  let daysToAdd = (targetDay - current.getUTCDay() + 7) % 7
  if (daysToAdd === 0) daysToAdd = 7
  current.setUTCDate(current.getUTCDate() + daysToAdd)
  return current.toISOString().slice(0, 10)
}

function validRequest(overrides: Record<string, unknown> = {}) {
  return {
    customer_name: "ผู้จองทดสอบ",
    phone: "0999999999",
    email: "test@example.com",
    email_verification_token: "verification-token-1234567890",
    booking_date: nextDateWithDay(1),
    time_slot: "09:00-10:30",
    number_of_students: 1,
    learning_format: "onsite",
    location: "ในเมืองพิษณุโลก",
    note: "",
    line_user_id: "",
    ...overrides,
  }
}

function validForm(overrides: Record<string, unknown> = {}) {
  return {
    ...validRequest(),
    consent: true,
    website: "",
    form_started_at: Date.now() - 5_000,
    submission_id: "11111111-1111-4111-8111-111111111111",
    ...overrides,
  }
}

for (const [count, expected] of [
  [1, { pricePerPerson: 300, totalPrice: 300 }],
  [2, { pricePerPerson: 250, totalPrice: 500 }],
  [3, { pricePerPerson: 220, totalPrice: 660 }],
  [4, { pricePerPerson: 220, totalPrice: 880 }],
] as const) {
  test(`pricing ${count} student(s)`, () => assert.deepEqual(getBookingPrice(count), expected))
}

test("pricing rejects fewer than 1", () => assert.throws(() => getBookingPrice(0), RangeError))
test("pricing rejects more than 4", () => assert.throws(() => getBookingPrice(5), RangeError))

test("date rejects wrong format", () => assert.equal(bookingDateSchema.safeParse("20-07-2026").success, false))
test("date rejects impossible calendar date", () => assert.equal(bookingDateSchema.safeParse("2026-02-30").success, false))
test("date rejects past date", () => assert.equal(bookingDateSchema.safeParse("2000-01-01").success, false))
test("date accepts today in Asia/Bangkok", () => assert.equal(bookingDateSchema.safeParse(getBangkokDateString()).success, true))
test("date accepts a future date", () => assert.equal(bookingDateSchema.safeParse(nextDateWithDay(1)).success, true))
test("Bangkok date avoids UTC rollover", () => {
  assert.equal(getBangkokDateString(new Date("2026-07-14T18:30:00.000Z")), "2026-07-15")
})

test("weekday exposes five confirmed slots", () => assert.equal(getAllowedTimeSlots(nextDateWithDay(1)).length, 5))
test("weekend exposes six confirmed slots", () => assert.equal(getAllowedTimeSlots(nextDateWithDay(6)).length, 6))
test("weekday rejects 15:00 slot", () => assert.equal(bookingRequestSchema.safeParse(validRequest({ time_slot: "15:00-16:30" })).success, false))
test("Saturday accepts 15:00 slot", () => assert.equal(bookingRequestSchema.safeParse(validRequest({ booking_date: nextDateWithDay(6), time_slot: "15:00-16:30" })).success, true))
test("Sunday accepts 15:00 slot", () => assert.equal(bookingRequestSchema.safeParse(validRequest({ booking_date: nextDateWithDay(0), time_slot: "15:00-16:30" })).success, true))
test("unknown slot is rejected", () => assert.equal(bookingRequestSchema.safeParse(validRequest({ time_slot: "08:00-09:30" })).success, false))

test("valid booking passes", () => assert.equal(bookingRequestSchema.safeParse(validRequest()).success, true))
test("missing name is rejected", () => assert.equal(bookingRequestSchema.safeParse(validRequest({ customer_name: "" })).success, false))
test("missing phone is rejected", () => assert.equal(bookingRequestSchema.safeParse(validRequest({ phone: "" })).success, false))
test("missing email is rejected", () => assert.equal(bookingRequestSchema.safeParse(validRequest({ email: "" })).success, false))
test("invalid email is rejected", () => assert.equal(bookingRequestSchema.safeParse(validRequest({ email: "not-an-email" })).success, false))
test("verification token is required", () => assert.equal(bookingRequestSchema.safeParse(validRequest({ email_verification_token: "" })).success, false))
test("email normalization trims and lowercases", () => assert.equal(normalizeEmail("  User@Example.COM "), "user@example.com"))
test("invalid student count is rejected", () => assert.equal(bookingRequestSchema.safeParse(validRequest({ number_of_students: 5 })).success, false))
test("invalid learning format is rejected", () => assert.equal(bookingRequestSchema.safeParse(validRequest({ learning_format: "hybrid" })).success, false))
test("onsite requires location", () => assert.equal(bookingRequestSchema.safeParse(validRequest({ location: "" })).success, false))
test("online allows empty location", () => assert.equal(bookingRequestSchema.safeParse(validRequest({ learning_format: "online", location: "" })).success, true))
test("valid anti-spam form passes", () => assert.equal(bookingFormSchema.safeParse(validForm()).success, true))
test("honeypot content is rejected", () => assert.equal(bookingFormSchema.safeParse(validForm({ website: "spam.example" })).success, false))
test("missing consent is rejected", () => assert.equal(bookingFormSchema.safeParse(validForm({ consent: false })).success, false))
test("minimum submit timing rejects instant submit", () => assert.equal(validateFormTiming(Date.now()), false))
test("minimum submit timing accepts normal submit", () => assert.equal(validateFormTiming(Date.now() - 2_000), true))
test("duplicate submission ID is rejected", () => {
  const id = "22222222-2222-4222-8222-222222222222"
  assert.equal(claimSubmission(id, 1_000), true)
  assert.equal(claimSubmission(id, 1_001), false)
  releaseSubmission(id)
})

test("rate limiter allows within limit and blocks overflow", () => {
  const key = `test-${Math.random()}`
  assert.equal(checkRateLimit(key, 2, 10_000, 1_000).allowed, true)
  assert.equal(checkRateLimit(key, 2, 10_000, 1_001).allowed, true)
  assert.equal(checkRateLimit(key, 2, 10_000, 1_002).allowed, false)
})

test("email OTP send success response parses", () => {
  assert.equal(parseEmailOtpResponse({
    success: true,
    message: "ส่งรหัสแล้ว",
    request_id: "1234567890123456",
    expires_in_seconds: 600,
    resend_after_seconds: 60,
  })?.success, true)
})

test("email OTP verify success response parses", () => {
  assert.equal(parseEmailOtpVerifyResponse({
    success: true,
    message: "ยืนยันแล้ว",
    verification_token: "1234567890123456",
    expires_in_seconds: 600,
  })?.success, true)
})

test("email OTP verify compatibility response normalizes camel-case token", () => {
  const parsed = parseEmailOtpVerifyResponse({
    success: true,
    message: "ยืนยันแล้ว",
    verificationToken: "1234567890123456",
    expires_in_seconds: 600,
  })
  assert.equal(parsed?.success, true)
  if (parsed?.success) assert.equal(parsed.verification_token, "1234567890123456")
})

test("email OTP response rejects leaked OTP", () => {
  assert.equal(parseEmailOtpResponse({
    success: true,
    message: "ส่งรหัสแล้ว",
    request_id: "1234567890123456",
    expires_in_seconds: 600,
    resend_after_seconds: 60,
    otp: "123456",
  }), null)
})

const successResponse = {
  success: true,
  message: "จองเรียนเรียบร้อย",
  booking: {
    booking_reference: "KHA-20260720-A1B2C3",
    booking_date: "2026-07-20",
    time_slot: "09:00-10:30",
    number_of_students: 2,
    price_per_person: 250,
    total_price: 500,
    course_name: "Level 2 + 2.5 Extra",
    learning_format: "onsite",
    status: "pending",
  },
}

test("Apps Script success response parses", () => assert.equal(parseAppsScriptResponse(successResponse)?.success, true))
for (const code of ["SLOT_UNAVAILABLE", "VALIDATION_ERROR", "INTERNAL_ERROR", "UPSTREAM_TIMEOUT"]) {
  test(`Apps Script ${code} response parses`, () => {
    assert.deepEqual(parseAppsScriptResponse({ success: false, code, message: "ทดสอบ" }), {
      success: false,
      code,
      message: "ทดสอบ",
    })
  })
}
test("invalid JSON-equivalent value is rejected", () => assert.equal(parseAppsScriptResponse("not-json"), null))
test("wrong response shape is rejected", () => assert.equal(parseAppsScriptResponse({ success: true }), null))

test("availability success parses", () => {
  const parsed = parseAvailabilityResponse({
    success: true,
    date: "2026-07-20",
    dayType: "weekday",
    availableSlots: ["09:00-10:30"],
    unavailableSlots: ["11:00-12:30"],
  })
  assert.equal(parsed?.success, true)
})
test("availability unavailable error parses", () => assert.equal(parseAvailabilityResponse({ success: false, code: "UPSTREAM_NETWORK_ERROR", message: "ทดสอบ" })?.success, false))
test("availability invalid date shape is rejected", () => assert.equal(parseAvailabilityResponse({ success: true, date: "bad", dayType: "weekday", availableSlots: [], unavailableSlots: [] }), null))

test("admin password success", () => assert.equal(verifyAdminPassword("correct", "correct"), true))
test("admin password failure", () => assert.equal(verifyAdminPassword("wrong", "correct"), false))
test("admin signed session verifies", () => {
  const token = createAdminSessionToken("a".repeat(32), 1_000)
  assert.equal(verifyAdminSessionToken(token, "a".repeat(32), 2_000), true)
})
test("admin expired session fails", () => {
  const token = createAdminSessionToken("a".repeat(32), 1_000)
  assert.equal(verifyAdminSessionToken(token, "a".repeat(32), 99_999_999), false)
})
test("admin tampered session fails", () => {
  const token = createAdminSessionToken("a".repeat(32), 1_000)
  assert.equal(verifyAdminSessionToken(`${token}x`, "a".repeat(32), 2_000), false)
})
test("admin list response parses", () => assert.equal(parseAdminListResponse({ success: true, bookings: [] })?.success, true))
test("admin status update validation accepts supported status", () => assert.equal(parseAdminUpdateResponse({ success: true, booking_reference: "KHA-20260720-A1B2C3", status: "cancelled" })?.success, true))
test("admin status update rejects unknown status", () => assert.equal(parseAdminUpdateResponse({ success: true, booking_reference: "KHA-20260720-A1B2C3", status: "deleted" }), null))
