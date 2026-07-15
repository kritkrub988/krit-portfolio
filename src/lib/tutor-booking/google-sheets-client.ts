import "server-only"

import { GOOGLE_APPS_SCRIPT_TIMEOUT_MS } from "./constants.ts"
import type { BookingRequest, BookingResponse } from "./types.ts"
import { parseAppsScriptResponse } from "./validation.ts"

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
    if (url.protocol !== "https:") return null
    return { url: url.toString(), secret }
  } catch {
    return null
  }
}

function integrationError(code: string, message: string): BookingResponse {
  return { success: false, code, message }
}

export async function createTutorBooking(request: BookingRequest): Promise<BookingResponse> {
  const config = getGoogleAppsScriptConfig()
  if (!config) {
    return integrationError(
      "INTEGRATION_NOT_CONFIGURED",
      "ยังไม่ได้ตั้งค่า Google Apps Script Web App URL หรือ API Secret",
    )
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), GOOGLE_APPS_SCRIPT_TIMEOUT_MS)

  try {
    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-booking-api-secret": config.secret,
      },
      body: JSON.stringify({ ...request, api_secret: config.secret }),
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
    })

    const text = await response.text()
    let body: unknown
    try {
      body = JSON.parse(text)
    } catch {
      return integrationError("INVALID_UPSTREAM_JSON", "Apps Script ตอบกลับด้วย JSON ที่ไม่ถูกต้อง")
    }

    const parsed = parseAppsScriptResponse(body)
    if (!parsed) {
      return integrationError(
        "INVALID_UPSTREAM_RESPONSE",
        "รูปแบบข้อมูลตอบกลับจาก Apps Script ไม่ถูกต้อง",
      )
    }
    return parsed
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return integrationError("UPSTREAM_TIMEOUT", "Apps Script ใช้เวลาตอบกลับนานเกินกำหนด")
    }
    return integrationError("UPSTREAM_NETWORK_ERROR", "ไม่สามารถเชื่อมต่อ Apps Script ได้")
  } finally {
    clearTimeout(timeout)
  }
}
