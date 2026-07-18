/**
 * Configuration and sheet helpers for the KRIT HUB AI Tutor booking service.
 * This script is intended to be bound to the booking spreadsheet.
 */
var BOOKING_CONFIG = Object.freeze({
  serviceName: "KRIT HUB AI Tutor Booking API",
  bookingsSheetName: "Bookings",
  settingsSheetName: "Settings",
  timezone: "Asia/Bangkok",
  lockTimeoutMs: 10000,
  bookingHeaders: [
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
  ],
  settingsRows: [
    ["course_name", "Level 2 + 2.5 Extra"],
    ["class_duration_minutes", "90"],
    ["break_minutes", "30"],
    [
      "weekday_slots",
      "09:00-10:30,11:00-12:30,13:00-14:30,17:00-18:30,19:00-20:30",
    ],
    [
      "weekend_slots",
      "09:00-10:30,11:00-12:30,13:00-14:30,15:00-16:30,17:00-18:30,19:00-20:30",
    ],
    ["price_1_person", "300"],
    ["price_2_people", "500"],
    ["price_3_people", "660"],
    ["price_4_people", "880"],
    ["timezone", "Asia/Bangkok"],
  ],
});

function getSpreadsheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error("CONFIGURATION_ERROR: ไม่พบ Google Sheets ที่ผูกกับ Apps Script");
  }
  return spreadsheet;
}

function getDefaultSettings_() {
  var values = {};
  BOOKING_CONFIG.settingsRows.forEach(function (row) {
    values[row[0]] = row[1];
  });
  return normalizeSettings_(values);
}

function getSettings() {
  var sheet = getSpreadsheet_().getSheetByName(BOOKING_CONFIG.settingsSheetName);
  if (!sheet || sheet.getLastRow() < 2) {
    safeLog_("SETTINGS_FALLBACK", "Settings sheet missing or empty");
    return getDefaultSettings_();
  }

  var values = {};
  sheet
    .getRange(2, 1, sheet.getLastRow() - 1, 2)
    .getDisplayValues()
    .forEach(function (row) {
      var key = String(row[0] || "").trim();
      if (key) values[key] = String(row[1] || "").trim();
    });

  return normalizeSettings_(values);
}

function normalizeSettings_(values) {
  var defaults = {};
  BOOKING_CONFIG.settingsRows.forEach(function (row) {
    defaults[row[0]] = row[1];
  });

  function positiveInteger_(key) {
    var value = Number(values[key]);
    return Number.isInteger(value) && value > 0 ? value : Number(defaults[key]);
  }

  function priceTotal_(key, studentCount) {
    var value = Number(values[key]);
    return Number.isInteger(value) && value > 0 && value % studentCount === 0
      ? value
      : Number(defaults[key]);
  }

  function slots_(key) {
    var raw = String(values[key] || defaults[key]);
    var slots = raw
      .split(",")
      .map(function (slot) {
        return slot.trim();
      })
      .filter(Boolean);
    var valid = slots.length > 0 && slots.every(function (slot) {
      return /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(slot);
    });
    return valid ? slots : String(defaults[key]).split(",");
  }

  var courseName = String(values.course_name || defaults.course_name).trim();
  return {
    courseName: courseName || defaults.course_name,
    classDurationMinutes: positiveInteger_("class_duration_minutes"),
    breakMinutes: positiveInteger_("break_minutes"),
    weekdaySlots: slots_("weekday_slots"),
    weekendSlots: slots_("weekend_slots"),
    priceTotals: {
      1: priceTotal_("price_1_person", 1),
      2: priceTotal_("price_2_people", 2),
      3: priceTotal_("price_3_people", 3),
      4: priceTotal_("price_4_people", 4),
    },
    timezone:
      values.timezone === BOOKING_CONFIG.timezone
        ? values.timezone
        : BOOKING_CONFIG.timezone,
  };
}

function getAllowedSlotsForDate(date, settings) {
  var activeSettings = settings || getSettings();
  var parsed = parseBookingDate_(date);
  if (!parsed) return [];
  return parsed.dayOfWeek === 0 || parsed.dayOfWeek === 6
    ? activeSettings.weekendSlots.slice()
    : activeSettings.weekdaySlots.slice();
}

function getPricing(numberOfStudents, settings) {
  var count = Number(numberOfStudents);
  if (!Number.isInteger(count) || count < 1 || count > 4) {
    throw new Error("VALIDATION_ERROR: number_of_students ต้องเป็นจำนวนเต็ม 1 ถึง 4");
  }

  var activeSettings = settings || getSettings();
  var totalPrice = activeSettings.priceTotals[count];
  return {
    pricePerPerson: totalPrice / count,
    totalPrice: totalPrice,
  };
}

function initializeSheets() {
  var spreadsheet = getSpreadsheet_();
  var bookings = spreadsheet.getSheetByName(BOOKING_CONFIG.bookingsSheetName);
  if (!bookings) bookings = spreadsheet.insertSheet(BOOKING_CONFIG.bookingsSheetName);

  if (bookings.getLastRow() === 0) {
    bookings.getRange(1, 1, 1, BOOKING_CONFIG.bookingHeaders.length).setValues([
      BOOKING_CONFIG.bookingHeaders,
    ]);
  } else {
    var existingWidth = Math.max(bookings.getLastColumn(), BOOKING_CONFIG.bookingHeaders.length - 1);
    var existingHeaders = bookings.getRange(1, 1, 1, existingWidth).getDisplayValues()[0];
    var newHeadersMatch = BOOKING_CONFIG.bookingHeaders.every(function (header, index) {
      return existingHeaders[index] === header;
    });
    var legacyHeadersMatch = BOOKING_CONFIG.bookingHeaders.slice(0, -1).every(function (header, index) {
      return existingHeaders[index] === header;
    });
    if (legacyHeadersMatch && !existingHeaders[BOOKING_CONFIG.bookingHeaders.length - 1]) {
      bookings.getRange(1, BOOKING_CONFIG.bookingHeaders.length).setValue("email");
    } else if (!newHeadersMatch) {
      throw new Error("CONFIGURATION_ERROR: Header ของ Sheet Bookings ไม่ตรงตามที่กำหนด");
    }
  }

  styleBookingsSheet_(bookings);

  var settings = spreadsheet.getSheetByName(BOOKING_CONFIG.settingsSheetName);
  if (!settings) settings = spreadsheet.insertSheet(BOOKING_CONFIG.settingsSheetName);
  if (settings.getLastRow() === 0) settings.getRange(1, 1, 1, 2).setValues([["key", "value"]]);

  var existingKeys = {};
  if (settings.getLastRow() > 1) {
    settings
      .getRange(2, 1, settings.getLastRow() - 1, 1)
      .getDisplayValues()
      .forEach(function (row) {
        existingKeys[String(row[0] || "").trim()] = true;
      });
  }
  var missingRows = BOOKING_CONFIG.settingsRows.filter(function (row) {
    return !existingKeys[row[0]];
  });
  if (missingRows.length) {
    settings.getRange(settings.getLastRow() + 1, 1, missingRows.length, 2).setValues(missingRows);
  }

  settings.setFrozenRows(1);
  settings.getRange(1, 1, 1, 2).setFontWeight("bold").setBackground("#d9ead3");
  settings.autoResizeColumns(1, 2);
  safeLog_("INITIALIZE_OK", "Sheets initialized");
}

function styleBookingsSheet_(sheet) {
  sheet.setFrozenRows(1);
  sheet
    .getRange(1, 1, 1, BOOKING_CONFIG.bookingHeaders.length)
    .setFontWeight("bold")
    .setBackground("#cfe2f3");
  sheet.getRange("A:A").setNumberFormat("@");
  sheet.getRange("B:D").setNumberFormat("@");
  sheet.getRange("F:F").setNumberFormat("@");
  sheet.getRange("G:I").setNumberFormat("0");
  sheet.getRange("O:O").setNumberFormat("@");
  sheet.getRange("P:P").setNumberFormat("@");
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["pending", "confirmed", "cancelled"], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("N2:N").setDataValidation(statusRule);
  sheet.autoResizeColumns(1, BOOKING_CONFIG.bookingHeaders.length);
}
