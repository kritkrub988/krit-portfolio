export const BANGKOK_TIMEZONE = "Asia/Bangkok" as const

export const WEEKDAY_TIME_SLOTS = [
  "09:00-10:30",
  "11:00-12:30",
  "13:00-14:30",
  "17:00-18:30",
  "19:00-20:30",
] as const

export const WEEKEND_TIME_SLOTS = [
  "09:00-10:30",
  "11:00-12:30",
  "13:00-14:30",
  "15:00-16:30",
  "17:00-18:30",
  "19:00-20:30",
] as const

export const ALL_TIME_SLOTS = WEEKEND_TIME_SLOTS

export const COURSE_NAME = "Level 2 + 2.5 Extra" as const

export const PRICE_BY_STUDENT_COUNT = {
  1: { pricePerPerson: 300, totalPrice: 300 },
  2: { pricePerPerson: 250, totalPrice: 500 },
  3: { pricePerPerson: 220, totalPrice: 660 },
  4: { pricePerPerson: 220, totalPrice: 880 },
} as const

export const GOOGLE_APPS_SCRIPT_TIMEOUT_MS = 10_000
