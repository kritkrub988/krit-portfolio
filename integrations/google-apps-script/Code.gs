/** Entry points and booking mutations for the Apps Script Web App. */

function doGet() {
  return jsonResponse_({
    success: true,
    service: BOOKING_CONFIG.serviceName,
    status: "ok",
  });
}

function doPost(event) {
  var lock = null;
  try {
    var payload = parseJsonBody_(event);
    var expectedSecret = PropertiesService.getScriptProperties().getProperty(
      "BOOKING_API_SECRET",
    );
    if (!expectedSecret) {
      safeLog_("CONFIGURATION_ERROR", "BOOKING_API_SECRET is missing");
      return errorResponse_("CONFIGURATION_ERROR", "ระบบยังตั้งค่าไม่ครบ กรุณาติดต่อผู้ดูแล");
    }
    if (!constantTimeEquals_(payload.api_secret, expectedSecret)) {
      safeLog_("UNAUTHORIZED", "Rejected request");
      return errorResponse_("UNAUTHORIZED", "ไม่สามารถยืนยันคำขอได้");
    }

    delete payload.api_secret;
    var settings = getSettings();
    var validation = validateBookingRequest_(payload, settings);
    if (!validation.valid) {
      return jsonResponse_({
        success: false,
        code: "VALIDATION_ERROR",
        message: "ข้อมูลการจองไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง",
        errors: validation.errors,
      });
    }

    lock = LockService.getScriptLock();
    if (!lock.tryLock(BOOKING_CONFIG.lockTimeoutMs)) {
      safeLog_("LOCK_TIMEOUT", "Could not acquire booking lock");
      return errorResponse_("LOCK_TIMEOUT", "ระบบกำลังประมวลผลการจองอื่น กรุณาลองใหม่อีกครั้ง");
    }

    var spreadsheet = getSpreadsheet_();
    var bookings = spreadsheet.getSheetByName(BOOKING_CONFIG.bookingsSheetName);
    if (!bookings) {
      safeLog_("CONFIGURATION_ERROR", "Bookings sheet missing");
      return errorResponse_("CONFIGURATION_ERROR", "ไม่พบ Sheet Bookings กรุณารัน initializeSheets");
    }

    var booking = validation.value;
    if (isSlotUnavailable_(bookings, booking.bookingDate, booking.timeSlot)) {
      return errorResponse_("SLOT_UNAVAILABLE", "รอบเวลานี้ถูกจองแล้ว กรุณาเลือกรอบเวลาอื่น");
    }

    var bookingReference = createUniqueBookingReference_(bookings, booking.bookingDate);
    var pricing = getPricing(booking.numberOfStudents, settings);
    var createdAt = Utilities.formatDate(new Date(), settings.timezone, "yyyy-MM-dd HH:mm:ss");

    bookings.appendRow([
      bookingReference,
      createdAt,
      booking.bookingDate,
      booking.timeSlot,
      booking.customerName,
      booking.phone,
      booking.numberOfStudents,
      pricing.pricePerPerson,
      pricing.totalPrice,
      settings.courseName,
      booking.learningFormat,
      booking.location,
      booking.note,
      "pending",
      booking.lineUserId,
    ]);

    safeLog_("BOOKING_CREATED", bookingReference);
    return jsonResponse_({
      success: true,
      message: "จองเรียนเรียบร้อย",
      booking: {
        booking_reference: bookingReference,
        booking_date: booking.bookingDate,
        time_slot: booking.timeSlot,
        number_of_students: booking.numberOfStudents,
        price_per_person: pricing.pricePerPerson,
        total_price: pricing.totalPrice,
        course_name: settings.courseName,
        status: "pending",
      },
    });
  } catch (error) {
    if (error && String(error.message || "").indexOf("VALIDATION_ERROR:") === 0) {
      return jsonResponse_({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Request body ต้องเป็น JSON Object ที่ถูกต้อง",
        errors: ["ไม่สามารถอ่าน JSON Request Body ได้"],
      });
    }
    safeLog_("INTERNAL_ERROR", error && error.message ? error.message.split(":")[0] : "Unknown");
    return errorResponse_(
      "INTERNAL_ERROR",
      "ไม่สามารถบันทึกการจองได้ กรุณาลองใหม่อีกครั้ง",
    );
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function parseJsonBody_(event) {
  if (!event || !event.postData || !event.postData.contents) {
    throw new Error("VALIDATION_ERROR: Empty request body");
  }
  var parsed;
  try {
    parsed = JSON.parse(event.postData.contents);
  } catch (error) {
    throw new Error("VALIDATION_ERROR: Invalid JSON request body");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("VALIDATION_ERROR: JSON body must be an object");
  }
  return parsed;
}

function isSlotUnavailable_(sheet, bookingDate, timeSlot) {
  if (sheet.getLastRow() < 2) return false;
  var rows = sheet.getRange(2, 3, sheet.getLastRow() - 1, 12).getDisplayValues();
  return rows.some(function (row) {
    var status = String(row[11] || "").toLowerCase();
    return row[0] === bookingDate && row[1] === timeSlot &&
      (status === "pending" || status === "confirmed");
  });
}

function createUniqueBookingReference_(sheet, bookingDate) {
  var datePart = bookingDate.replace(/-/g, "");
  var existing = {};
  if (sheet.getLastRow() > 1) {
    sheet
      .getRange(2, 1, sheet.getLastRow() - 1, 1)
      .getDisplayValues()
      .forEach(function (row) {
        existing[row[0]] = true;
      });
  }

  for (var attempt = 0; attempt < 25; attempt += 1) {
    var suffix = Utilities.getUuid().replace(/-/g, "").slice(0, 6).toUpperCase();
    var reference = "KHA-" + datePart + "-" + suffix;
    if (!existing[reference]) return reference;
  }
  throw new Error("REFERENCE_GENERATION_ERROR");
}

function updateBookingStatus(bookingReference, newStatus) {
  var reference = String(bookingReference || "").trim();
  var status = String(newStatus || "").trim().toLowerCase();
  if (!reference) throw new Error("VALIDATION_ERROR: bookingReference is required");
  if (["pending", "confirmed", "cancelled"].indexOf(status) === -1) {
    throw new Error("VALIDATION_ERROR: status must be pending, confirmed, or cancelled");
  }

  var sheet = getSpreadsheet_().getSheetByName(BOOKING_CONFIG.bookingsSheetName);
  if (!sheet) throw new Error("CONFIGURATION_ERROR: Bookings sheet missing");
  var references = sheet.getLastRow() > 1
    ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getDisplayValues()
    : [];
  for (var index = 0; index < references.length; index += 1) {
    if (references[index][0] === reference) {
      sheet.getRange(index + 2, 14).setValue(status);
      safeLog_("STATUS_UPDATED", reference);
      return true;
    }
  }
  throw new Error("NOT_FOUND: booking reference not found");
}

function jsonResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function errorResponse_(code, message) {
  return jsonResponse_({ success: false, code: code, message: message });
}

function safeLog_(code, detail) {
  Logger.log("[%s] %s", code, detail || "");
}
