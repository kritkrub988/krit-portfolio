import assert from "node:assert/strict"
import test from "node:test"

import { getBookingPrice } from "../src/lib/tutor-booking/price.ts"
import {
  bookingRequestSchema,
  getBangkokDateString,
  parseAppsScriptResponse,
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
    phone: "0800000000",
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

for (const [count, expected] of [
  [1, { pricePerPerson: 300, totalPrice: 300 }],
  [2, { pricePerPerson: 250, totalPrice: 500 }],
  [3, { pricePerPerson: 220, totalPrice: 660 }],
  [4, { pricePerPerson: 220, totalPrice: 880 }],
] as const) {
  test(`pricing for ${count} student(s)`, () => {
    assert.deepEqual(getBookingPrice(count), expected)
  })
}

test("pricing rejects fewer than 1 student", () => {
  assert.throws(() => getBookingPrice(0), RangeError)
})

test("pricing rejects more than 4 students", () => {
  assert.throws(() => getBookingPrice(5), RangeError)
})

test("validation rejects an empty customer name", () => {
  assert.equal(bookingRequestSchema.safeParse(validRequest({ customer_name: "" })).success, false)
})

test("validation rejects an empty phone", () => {
  assert.equal(bookingRequestSchema.safeParse(validRequest({ phone: "" })).success, false)
})

test("validation rejects an invalid calendar date", () => {
  assert.equal(
    bookingRequestSchema.safeParse(validRequest({ booking_date: "2026-02-30" })).success,
    false,
  )
})

test("validation rejects a past date in Asia/Bangkok", () => {
  assert.equal(
    bookingRequestSchema.safeParse(validRequest({ booking_date: "2000-01-01" })).success,
    false,
  )
})

test("weekday validation rejects the weekend-only 15:00 slot", () => {
  assert.equal(
    bookingRequestSchema.safeParse(validRequest({ time_slot: "15:00-16:30" })).success,
    false,
  )
})

test("Saturday validation accepts the 15:00 slot", () => {
  assert.equal(
    bookingRequestSchema.safeParse(
      validRequest({ booking_date: nextDateWithDay(6), time_slot: "15:00-16:30" }),
    ).success,
    true,
  )
})

test("Sunday validation accepts the 15:00 slot", () => {
  assert.equal(
    bookingRequestSchema.safeParse(
      validRequest({ booking_date: nextDateWithDay(0), time_slot: "15:00-16:30" }),
    ).success,
    true,
  )
})

test("Apps Script success response is parsed", () => {
  const response = parseAppsScriptResponse({
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
      status: "pending",
    },
  })
  assert.equal(response?.success, true)
})

test("Apps Script error response is parsed", () => {
  const response = parseAppsScriptResponse({
    success: false,
    code: "SLOT_UNAVAILABLE",
    message: "รอบเวลานี้ถูกจองแล้ว",
  })
  assert.deepEqual(response, {
    success: false,
    code: "SLOT_UNAVAILABLE",
    message: "รอบเวลานี้ถูกจองแล้ว",
  })
})
