import "server-only"

import { cookies } from "next/headers"

import {
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "./core.ts"

export const ADMIN_COOKIE_NAME = "krit_admin_session"

export function getAdminConfig(): { password: string; sessionSecret: string } | null {
  const password = process.env.ADMIN_PASSWORD?.trim()
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim()
  if (!password || !sessionSecret || sessionSecret.length < 32) return null
  return { password, sessionSecret }
}

export async function hasValidAdminSession(): Promise<boolean> {
  const config = getAdminConfig()
  if (!config) return false
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value
  return Boolean(token && verifyAdminSessionToken(token, config.sessionSecret))
}

export async function setAdminSessionCookie(sessionSecret: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, createAdminSessionToken(sessionSecret), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    priority: "high",
  })
}

export async function clearAdminSessionCookie(): Promise<void> {
  ;(await cookies()).delete(ADMIN_COOKIE_NAME)
}
