import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFileSync, readdirSync } from "node:fs"
import { extname, join } from "node:path"
import test from "node:test"
import vm from "node:vm"

const ROOT = process.cwd()
const BOOKING_HEADERS = [
  "booking_reference",
  "created_at",
  "booking_date",
  "time_slot",
  "customer_name",
  "phone",
  "number_of_students",
  "price_per_person",
  "total_price",
  "course_name",
  "learning_format",
  "location",
  "note",
  "status",
  "line_user_id",
  "email",
]

class MockRange {
  private readonly sheet: MockSheet
  private readonly row: number
  private readonly column: number
  private readonly rowCount: number
  private readonly columnCount: number

  constructor(
    sheet: MockSheet,
    row: number,
    column: number,
    rowCount = 1,
    columnCount = 1,
  ) {
    this.sheet = sheet
    this.row = row
    this.column = column
    this.rowCount = rowCount
    this.columnCount = columnCount
  }

  getValues() {
    return Array.from({ length: this.rowCount }, (_, rowOffset) =>
      Array.from({ length: this.columnCount }, (_, columnOffset) =>
        this.sheet.get(this.row + rowOffset, this.column + columnOffset),
      ),
    )
  }

  getDisplayValues() {
    return this.getValues().map((row) => row.map((value) => String(value ?? "")))
  }

  setValue(value: unknown) {
    this.sheet.set(this.row, this.column, value)
    return this
  }

  setValues(values: unknown[][]) {
    if (this.sheet.failDataWrite && this.row > 1) throw new Error("SHEET_WRITE_FAILED")
    values.forEach((row, rowOffset) => {
      row.forEach((value, columnOffset) => {
        this.sheet.set(this.row + rowOffset, this.column + columnOffset, value)
      })
    })
    return this
  }

  setFontWeight() { return this }
  setBackground() { return this }
  setNumberFormat() { return this }
  setDataValidation() { return this }
}

class MockSheet {
  readonly rows: unknown[][]
  failDataWrite = false

  constructor(headers = BOOKING_HEADERS) {
    this.rows = [headers.slice()]
  }

  get(row: number, column: number) {
    return this.rows[row - 1]?.[column - 1] ?? ""
  }

  set(row: number, column: number, value: unknown) {
    while (this.rows.length < row) this.rows.push([])
    while (this.rows[row - 1].length < column) this.rows[row - 1].push("")
    this.rows[row - 1][column - 1] = value
  }

  getLastRow() {
    for (let index = this.rows.length - 1; index >= 0; index -= 1) {
      if (this.rows[index].some((value) => value !== "" && value !== undefined)) return index + 1
    }
    return 0
  }

  getLastColumn() {
    return this.rows.reduce((width, row) => Math.max(width, row.length), 0)
  }

  getMaxRows() { return 100 }
  getRange(row: number, column: number, rowCount = 1, columnCount = 1) {
    return new MockRange(this, row, column, rowCount, columnCount)
  }
  setFrozenRows() { return this }
  autoResizeColumns() { return this }
}

interface Harness {
  context: Record<string, unknown>
  cache: Map<string, string>
  properties: Map<string, string>
  bookings: MockSheet
  sentEmails: Array<Record<string, unknown>>
  setMailFailure(value: boolean): void
}

function bangkokDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function nextWeekdayDate() {
  const today = bangkokDateString()
  const date = new Date(`${today}T00:00:00.000Z`)
  do date.setUTCDate(date.getUTCDate() + 1)
  while ([0, 6].includes(date.getUTCDay()))
  return date.toISOString().slice(0, 10)
}

function createHarness(): Harness {
  const cache = new Map<string, string>()
  const properties = new Map<string, string>([
    ["BOOKING_API_SECRET", "test-secret"],
    ["BOOKING_NOTIFICATION_EMAIL", "admin@example.com"],
  ])
  const bookings = new MockSheet()
  const sentEmails: Array<Record<string, unknown>> = []
  let mailFailure = false
  let uuidCounter = 0
  const scriptProperties = {
    getProperty: (key: string) => properties.get(key) ?? null,
    setProperty: (key: string, value: string) => { properties.set(key, value) },
    deleteProperty: (key: string) => { properties.delete(key) },
    getProperties: () => Object.fromEntries(properties),
  }
  const scriptCache = {
    get: (key: string) => cache.get(key) ?? null,
    put: (key: string, value: string) => { cache.set(key, value) },
    remove: (key: string) => { cache.delete(key) },
  }
  const context: Record<string, unknown> = {
    console,
    PropertiesService: { getScriptProperties: () => scriptProperties },
    CacheService: { getScriptCache: () => scriptCache },
    LockService: {
      getScriptLock: () => ({ tryLock: () => true, releaseLock: () => undefined }),
    },
    MailApp: {
      getRemainingDailyQuota: () => 100,
      sendEmail: (message: Record<string, unknown>) => {
        if (mailFailure) throw new Error("MAIL_FAILED")
        sentEmails.push(message)
      },
    },
    Utilities: {
      DigestAlgorithm: { SHA_256: "SHA_256" },
      getUuid: () => `${(++uuidCounter).toString(16).padStart(32, "0").slice(0, 8)}-0000-4000-8000-000000000000`,
      computeDigest: (_algorithm: string, value: string) => Array.from(createHash("sha256").update(value).digest()),
      base64Encode: (bytes: number[]) => Buffer.from(bytes.map((value) => value < 0 ? value + 256 : value)).toString("base64"),
      formatDate: (date: Date, _timezone: string, format: string) =>
        format === "yyyy-MM-dd" ? bangkokDateString(date) : date.toISOString().replace("T", " ").slice(0, 19),
    },
    ContentService: {
      MimeType: { JSON: "application/json" },
      createTextOutput: (text: string) => ({
        text,
        setMimeType() { return this },
      }),
    },
    SpreadsheetApp: {
      getActiveSpreadsheet: () => ({
        getSheetByName: (name: string) => name === "Bookings" ? bookings : null,
      }),
      newDataValidation: () => ({
        requireValueInList() { return this },
        setAllowInvalid() { return this },
        build() { return {} },
      }),
    },
    Session: { getEffectiveUser: () => ({ getEmail: () => "admin@example.com" }) },
    Logger: { log: () => undefined },
  }

  vm.createContext(context)
  for (const file of ["Config.gs", "Validation.gs", "EmailOtp.gs", "Code.gs"]) {
    const source = readFileSync(join(ROOT, "integrations", "google-apps-script", file), "utf8")
    vm.runInContext(source, context, { filename: file })
  }

  return {
    context,
    cache,
    properties,
    bookings,
    sentEmails,
    setMailFailure(value: boolean) { mailFailure = value },
  }
}

function call(context: Record<string, unknown>, name: string, ...args: unknown[]) {
  return (context[name] as (...values: unknown[]) => unknown)(...args)
}

function responseBody(value: unknown) {
  return JSON.parse((value as { text: string }).text) as Record<string, unknown>
}

function post(harness: Harness, payload: Record<string, unknown>) {
  return responseBody(call(harness.context, "doPost", {
    postData: { contents: JSON.stringify({ ...payload, api_secret: "test-secret" }) },
  }))
}

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    action: "createBooking",
    customer_name: "ผู้จองทดสอบ",
    phone: "0800000000",
    email: "test@example.com",
    email_verification_token: "verified-token-1234567890",
    booking_date: nextWeekdayDate(),
    time_slot: "09:00-10:30",
    number_of_students: 1,
    learning_format: "online",
    location: "",
    note: "",
    line_user_id: "",
    ...overrides,
  }
}

function addVerification(harness: Harness, token = "verified-token-1234567890", email = "test@example.com", expiresAt = Date.now() + 600_000) {
  const value = JSON.stringify({ email, used: false, expires_at: expiresAt })
  harness.cache.set(`email_verified_${token}`, value)
  harness.properties.set(`EMAIL_VERIFICATION_${token}`, value)
}

function sentOtp(harness: Harness) {
  const body = String(harness.sentEmails.at(-1)?.body ?? "")
  const match = /\b(\d{6})\b/.exec(body)
  assert.ok(match)
  return match[1]
}

test("Apps Script validation requires email", () => {
  const h = createHarness()
  const result = call(h.context, "validateBookingRequest_", validPayload({ email: "" }), call(h.context, "getDefaultSettings_")) as { valid: boolean }
  assert.equal(result.valid, false)
})

test("Apps Script validation rejects invalid email", () => {
  const h = createHarness()
  const result = call(h.context, "validateBookingRequest_", validPayload({ email: "invalid" }), call(h.context, "getDefaultSettings_")) as { valid: boolean }
  assert.equal(result.valid, false)
})

test("Apps Script validation normalizes email case and whitespace", () => {
  const h = createHarness()
  const result = call(h.context, "validateBookingRequest_", validPayload({ email: "  TEST@Example.COM " }), call(h.context, "getDefaultSettings_")) as { value: { email: string } }
  assert.equal(result.value.email, "test@example.com")
})

test("Apps Script validation accepts compatible token names and numeric strings", () => {
  const h = createHarness()
  const payload = validPayload({ email_verification_token: undefined, verificationToken: "compatible-token-123456", number_of_students: "2" })
  const result = call(h.context, "validateBookingRequest_", payload, call(h.context, "getDefaultSettings_")) as { valid: boolean; value: { numberOfStudents: number; emailVerificationToken: string } }
  assert.equal(result.valid, true)
  assert.equal(result.value.numberOfStudents, 2)
  assert.equal(result.value.emailVerificationToken, "compatible-token-123456")
})

test("Apps Script validation rejects missing token, bad date, bad slot, and missing onsite location", () => {
  const h = createHarness()
  const settings = call(h.context, "getDefaultSettings_")
  assert.equal((call(h.context, "validateBookingRequest_", validPayload({ email_verification_token: "" }), settings) as { valid: boolean }).valid, false)
  assert.equal((call(h.context, "validateBookingRequest_", validPayload({ booking_date: "2026-02-30" }), settings) as { valid: boolean }).valid, false)
  assert.equal((call(h.context, "validateBookingRequest_", validPayload({ time_slot: "08:00-09:30" }), settings) as { valid: boolean }).valid, false)
  assert.equal((call(h.context, "validateBookingRequest_", validPayload({ learning_format: "onsite", location: "" }), settings) as { valid: boolean }).valid, false)
})

test("OTP send succeeds and enforces resend cooldown", () => {
  const h = createHarness()
  const first = responseBody(call(h.context, "handleSendEmailOtp_", "test@example.com"))
  const second = responseBody(call(h.context, "handleSendEmailOtp_", "test@example.com"))
  assert.equal(first.success, true)
  assert.equal(second.code, "OTP_RESEND_COOLDOWN")
})

test("OTP send limit is enforced", () => {
  const h = createHarness()
  const key = `email_otp_meta_${call(h.context, "sha256Hex_", "test@example.com")}`
  h.cache.set(key, JSON.stringify({ window_started_at: Date.now(), last_sent_at: Date.now() - 61_000, send_count: 3 }))
  assert.equal(responseBody(call(h.context, "handleSendEmailOtp_", "test@example.com")).code, "OTP_SEND_LIMIT")
})

test("failed OTP email rolls back record and rate-limit metadata", () => {
  const h = createHarness()
  h.setMailFailure(true)
  const result = responseBody(call(h.context, "handleSendEmailOtp_", "test@example.com"))
  assert.equal(result.code, "EMAIL_SEND_FAILED")
  assert.equal(
    [...h.cache.keys()].some((key) => key.startsWith("email_otp_") && !key.startsWith("email_otp_meta_")),
    false,
  )
  const metaKey = `email_otp_meta_${call(h.context, "sha256Hex_", "test@example.com")}`
  const meta = JSON.parse(h.cache.get(metaKey) ?? "{}")
  assert.equal(meta.send_count, 0)
  assert.equal(meta.active_request_id, undefined)
})

test("OTP rejects wrong and expired codes", () => {
  const wrongHarness = createHarness()
  const sent = responseBody(call(wrongHarness.context, "handleSendEmailOtp_", "test@example.com"))
  assert.equal(responseBody(call(wrongHarness.context, "handleVerifyEmailOtp_", "test@example.com", sent.request_id, "000000")).code, "OTP_INVALID")

  const expiredHarness = createHarness()
  const expiredSent = responseBody(call(expiredHarness.context, "handleSendEmailOtp_", "test@example.com"))
  const recordKey = `email_otp_${expiredSent.request_id}`
  const record = JSON.parse(expiredHarness.cache.get(recordKey) ?? "{}")
  record.expires_at = 0
  expiredHarness.cache.set(recordKey, JSON.stringify(record))
  assert.equal(responseBody(call(expiredHarness.context, "handleVerifyEmailOtp_", "test@example.com", expiredSent.request_id, sentOtp(expiredHarness))).code, "OTP_EXPIRED")
})

test("correct OTP creates a token bound to the normalized email", () => {
  const h = createHarness()
  const sent = responseBody(call(h.context, "handleSendEmailOtp_", "Test@Example.com"))
  const verified = responseBody(call(h.context, "handleVerifyEmailOtp_", "test@example.com", sent.request_id, sentOtp(h)))
  assert.equal(verified.success, true)
  assert.equal(typeof verified.verification_token, "string")
  assert.equal((call(h.context, "validateEmailVerification_", "other@example.com", verified.verification_token) as { valid: boolean }).valid, false)
  assert.equal((call(h.context, "validateEmailVerification_", "test@example.com", verified.verification_token) as { valid: boolean }).valid, true)
})

test("booking rejects missing, mismatched, and expired verification tokens", () => {
  const missing = createHarness()
  assert.equal(post(missing, validPayload({ email_verification_token: "" })).code, "VALIDATION_ERROR")

  const mismatched = createHarness()
  addVerification(mismatched, "verified-token-1234567890", "other@example.com")
  assert.equal(post(mismatched, validPayload()).code, "EMAIL_NOT_VERIFIED")

  const expired = createHarness()
  addVerification(expired, "verified-token-1234567890", "test@example.com", Date.now() - 1)
  assert.equal(post(expired, validPayload()).code, "EMAIL_NOT_VERIFIED")
})

test("booking succeeds, writes email, appears in admin, and consumes token", () => {
  const h = createHarness()
  addVerification(h)
  const created = post(h, validPayload())
  assert.equal(created.success, true)
  const listed = responseBody(call(h.context, "handleListBookings_", 10))
  const bookings = listed.bookings as Array<Record<string, unknown>>
  assert.equal(bookings.length, 1)
  assert.equal(bookings[0].email, "test@example.com")
  assert.equal(bookings[0].status, "pending")
  assert.equal(post(h, validPayload({ time_slot: "11:00-12:30" })).code, "EMAIL_NOT_VERIFIED")
})

test("duplicate slot is rejected without consuming the token", () => {
  const h = createHarness()
  addVerification(h)
  const headers = Object.fromEntries(BOOKING_HEADERS.map((header, index) => [header, index]))
  const row = Array(BOOKING_HEADERS.length).fill("")
  row[headers.booking_reference] = "KHA-20260720-A1B2C3"
  row[headers.booking_date] = nextWeekdayDate()
  row[headers.time_slot] = "09:00-10:30"
  row[headers.status] = "pending"
  h.bookings.rows.push(row)
  assert.equal(post(h, validPayload()).code, "SLOT_UNAVAILABLE")
  assert.equal((call(h.context, "validateEmailVerification_", "test@example.com", "verified-token-1234567890") as { valid: boolean }).valid, true)
})

test("notification failure does not roll back a successful booking", () => {
  const h = createHarness()
  addVerification(h)
  h.setMailFailure(true)
  assert.equal(post(h, validPayload()).success, true)
  assert.equal(h.bookings.getLastRow(), 2)
})

test("sheet write failure leaves verification token unused", () => {
  const h = createHarness()
  addVerification(h)
  h.bookings.failDataWrite = true
  assert.equal(post(h, validPayload()).code, "INTERNAL_ERROR")
  assert.equal((call(h.context, "validateEmailVerification_", "test@example.com", "verified-token-1234567890") as { valid: boolean }).valid, true)
})

test("admin status update works and list route is explicitly uncached", () => {
  const h = createHarness()
  addVerification(h)
  const created = post(h, validPayload())
  const reference = (created.booking as Record<string, unknown>).booking_reference
  const updated = post(h, { action: "updateStatus", booking_reference: reference, status: "confirmed" })
  assert.equal(updated.status, "confirmed")
  const route = readFileSync(join(ROOT, "src", "app", "api", "admin", "bookings", "route.ts"), "utf8")
  assert.match(route, /force-dynamic/)
  assert.match(route, /no-store/)
})

test("source text is valid UTF-8 and contains no known Thai mojibake markers", () => {
  const extensions = new Set([".css", ".gs", ".js", ".json", ".md", ".ts", ".tsx"])
  const markers = [
    String.fromCodePoint(0x0e40, 0x0e18),
    String.fromCodePoint(0x0e40, 0x0e19, 0x20ac),
    String.fromCodePoint(0x0e40, 0x0e19, 0x0084),
  ]
  const offenders: string[] = []
  function walk(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if ([".git", ".next", "node_modules"].includes(entry.name)) continue
      const path = join(directory, entry.name)
      if (entry.isDirectory()) walk(path)
      else if (extensions.has(extname(entry.name))) {
        const source = readFileSync(path, "utf8")
        if (markers.some((marker) => source.includes(marker))) offenders.push(path)
      }
    }
  }
  walk(ROOT)
  assert.deepEqual(offenders, [])
})
