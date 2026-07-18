import "server-only"

import { GOOGLE_APPS_SCRIPT_TIMEOUT_MS } from "./constants.ts"
import type {
  AdminListResponse,
  AdminUpdateResponse,
  AvailabilityResponse,
  BookingErrorResponse,
  BookingRequest,
  BookingResponse,
  BookingStatus,
  EmailOtpResponse,
  EmailOtpVerifyResponse,
} from "./types.ts"
import {
  parseAdminListResponse,
  parseAdminUpdateResponse,
  parseAppsScriptResponse,
  parseAvailabilityResponse,
  parseEmailOtpResponse,
  parseEmailOtpVerifyResponse,
} from "./validation.ts"

interface GoogleAppsScriptConfig {
  url: string
  secret: string
}

function getGoogleAppsScriptConfig(): GoogleAppsScriptConfig | null {
  const rawUrl = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL?.trim()
  const secret = process.env.GOOGLE_APPS_SCRIPT_API_SECRET?.trim()
  if (!rawUrl || !secret) return null

  try {
    const url = new URL(rawUrl)
    if (url.protocol !== "https:" || !url.pathname.endsWith("/exec")) return null
    return { url: url.toString(), secret }
  } catch {
    return null
  }
}

function integrationError(code: string, message: string): BookingErrorResponse {
  return { success: false, code, message }
}

async function callAppsScript(payload: Record<string, unknown>): Promise<unknown> {
  const config = getGoogleAppsScriptConfig()
  if (!config) {
    return integrationError(
      "INTEGRATION_NOT_CONFIGURED",
      "ยังไม่ได้ตั้งค่า Google Apps Script Web App สำหรับระบบจอง",
    )
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), GOOGLE_APPS_SCRIPT_TIMEOUT_MS)
  try {
    const response = await fetch(config.url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, api_secret: config.secret }),
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
    })
    const text = await response.text()
    try {
      return JSON.parse(text) as unknown
    } catch {
      return integrationError("INVALID_UPSTREAM_JSON", "Apps Script ตอบกลับด้วย JSON ที่ไม่ถูกต้อง")
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return integrationError("UPSTREAM_TIMEOUT", "Apps Script ใช้เวลาตอบกลับนานเกินกำหนด")
    }
    return integrationError("UPSTREAM_NETWORK_ERROR", "ไม่สามารถเชื่อมต่อ Apps Script ได้")
  } finally {
    clearTimeout(timeout)
  }
}

export async function createTutorBooking(request: BookingRequest): Promise<BookingResponse> {
  const raw = await callAppsScript({ action: "createBooking", ...request })
  return (
    parseAppsScriptResponse(raw) ??
    integrationError("INVALID_UPSTREAM_RESPONSE", "รูปแบบข้อมูลตอบกลับจาก Apps Script ไม่ถูกต้อง")
  )
}

export async function sendEmailOtp(email: string): Promise<EmailOtpResponse> {
  const raw = await callAppsScript({ action: "sendEmailOtp", email })
  return (
    parseEmailOtpResponse(raw) ??
    integrationError("INVALID_UPSTREAM_RESPONSE", "รูปแบบผลการส่งรหัสยืนยันไม่ถูกต้อง")
  )
}

export async function verifyEmailOtp(
  email: string,
  requestId: string,
  otp: string,
): Promise<EmailOtpVerifyResponse> {
  const raw = await callAppsScript({
    action: "verifyEmailOtp",
    email,
    request_id: requestId,
    otp,
  })
  return (
    parseEmailOtpVerifyResponse(raw) ??
    integrationError("INVALID_UPSTREAM_RESPONSE", "รูปแบบผลการยืนยันอีเมลไม่ถูกต้อง")
  )
}

export async function getTutorAvailability(bookingDate: string): Promise<AvailabilityResponse> {
  const raw = await callAppsScript({ action: "availability", booking_date: bookingDate })
  return (
    parseAvailabilityResponse(raw) ??
    integrationError("INVALID_UPSTREAM_RESPONSE", "รูปแบบข้อมูลรอบว่างไม่ถูกต้อง")
  )
}

export async function listTutorBookings(): Promise<AdminListResponse> {
  const raw = await callAppsScript({ action: "listBookings", limit: 500 })
  return (
    parseAdminListResponse(raw) ??
    integrationError("INVALID_UPSTREAM_RESPONSE", "รูปแบบรายการจองจาก Apps Script ไม่ถูกต้อง")
  )
}

export async function updateTutorBookingStatus(
  bookingReference: string,
  status: BookingStatus,
): Promise<AdminUpdateResponse> {
  const raw = await callAppsScript({
    action: "updateStatus",
    booking_reference: bookingReference,
    status,
  })
  return (
    parseAdminUpdateResponse(raw) ??
    integrationError("INVALID_UPSTREAM_RESPONSE", "รูปแบบผลการแก้สถานะไม่ถูกต้อง")
  )
}
