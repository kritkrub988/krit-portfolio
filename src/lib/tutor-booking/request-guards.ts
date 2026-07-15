const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>()
const submissionClaims = new Map<string, number>()

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): { allowed: boolean; retryAfterSeconds: number } {
  const existing = rateLimitBuckets.get(key)
  if (!existing || existing.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1_000)),
    }
  }

  existing.count += 1
  return { allowed: true, retryAfterSeconds: 0 }
}

export function claimSubmission(id: string, now = Date.now()): boolean {
  for (const [key, expiresAt] of submissionClaims) {
    if (expiresAt <= now) submissionClaims.delete(key)
  }
  if (submissionClaims.has(id)) return false
  submissionClaims.set(id, now + 600_000)
  return true
}

export function releaseSubmission(id: string): void {
  submissionClaims.delete(id)
}

export function getRequestClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return forwarded || request.headers.get("x-real-ip") || "unknown"
}

export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return true
  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}
