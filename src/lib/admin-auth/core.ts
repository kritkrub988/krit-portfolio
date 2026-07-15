import { createHmac, timingSafeEqual } from "node:crypto"

export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  if (leftBuffer.length !== rightBuffer.length) return false
  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function verifyAdminPassword(provided: string, expected: string): boolean {
  return Boolean(provided && expected) && safeEqual(provided, expected)
}

export function createAdminSessionToken(secret: string, now = Date.now()): string {
  const expiresAt = now + ADMIN_SESSION_MAX_AGE_SECONDS * 1_000
  const payload = Buffer.from(JSON.stringify({ version: 1, expiresAt })).toString("base64url")
  const signature = createHmac("sha256", secret).update(payload).digest("base64url")
  return `${payload}.${signature}`
}

export function verifyAdminSessionToken(token: string, secret: string, now = Date.now()): boolean {
  const [payload, signature, extra] = token.split(".")
  if (!payload || !signature || extra) return false
  const expected = createHmac("sha256", secret).update(payload).digest("base64url")
  if (!safeEqual(signature, expected)) return false

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      version?: unknown
      expiresAt?: unknown
    }
    return parsed.version === 1 && typeof parsed.expiresAt === "number" && parsed.expiresAt > now
  } catch {
    return false
  }
}
