/** Validation helpers shared by doPost and configuration functions. */

function parseBookingDate_(value) {
  var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
  if (!match) return null;

  var year = Number(match[1]);
  var month = Number(match[2]);
  var day = Number(match[3]);
  var date = new Date(Date.UTC(year, month - 1, day, 5, 0, 0));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return { value: match[0], dayOfWeek: date.getUTCDay() };
}

function validateBookingRequest_(payload, settings) {
  var errors = [];
  var data = payload && typeof payload === "object" ? payload : {};

  var customerName = String(data.customer_name || "").trim();
  var phone = String(data.phone || "").trim();
  var email = normalizeEmail_(data.email);
  var emailVerificationToken = String(data.email_verification_token || "").trim();
  var bookingDate = String(data.booking_date || "").trim();
  var timeSlot = String(data.time_slot || "").trim();
  var learningFormat = String(data.learning_format || "").trim().toLowerCase();
  var location = String(data.location || "").trim();
  var note = String(data.note || "").trim();
  var lineUserId = String(data.line_user_id || "").trim();
  var numberOfStudents = typeof data.number_of_students === "number"
    ? data.number_of_students
    : NaN;
  var parsedDate = parseBookingDate_(bookingDate);

  if (!customerName) errors.push("customer_name ต้องไม่ว่าง");
  if (customerName.length > 150) errors.push("customer_name ยาวเกิน 150 ตัวอักษร");
  if (!phone) errors.push("phone ต้องไม่ว่าง");
  if (phone.length > 50) errors.push("phone ยาวเกิน 50 ตัวอักษร");
  if (!isValidEmail_(email)) errors.push("email ต้องเป็นอีเมลที่ถูกต้อง");
  if (!emailVerificationToken) errors.push("ต้องยืนยันอีเมลก่อนจอง");
  else if (emailVerificationToken.length > 200) errors.push("โทเค็นยืนยันอีเมลไม่ถูกต้อง");
  if (!parsedDate) errors.push("booking_date ต้องเป็นวันที่จริงในรูปแบบ YYYY-MM-DD");
  if (parsedDate) {
    var today = Utilities.formatDate(new Date(), settings.timezone, "yyyy-MM-dd");
    if (bookingDate < today) errors.push("booking_date ต้องไม่เป็นวันที่ย้อนหลัง");
    if (getAllowedSlotsForDate(bookingDate, settings).indexOf(timeSlot) === -1) {
      errors.push("time_slot ไม่ใช่รอบที่เปิดให้จองในวันดังกล่าว");
    }
  }
  if (!Number.isInteger(numberOfStudents) || numberOfStudents < 1 || numberOfStudents > 4) {
    errors.push("number_of_students ต้องเป็นจำนวนเต็ม 1 ถึง 4");
  }
  if (["onsite", "online"].indexOf(learningFormat) === -1) {
    errors.push("learning_format ต้องเป็น onsite หรือ online");
  }
  if (learningFormat === "onsite" && !location) {
    errors.push("location ต้องไม่ว่างสำหรับการเรียน onsite");
  }
  if (location.length > 500) errors.push("location ยาวเกิน 500 ตัวอักษร");
  if (note.length > 2000) errors.push("note ยาวเกิน 2000 ตัวอักษร");
  if (lineUserId.length > 200) errors.push("line_user_id ยาวเกิน 200 ตัวอักษร");

  return {
    valid: errors.length === 0,
    errors: errors,
    value: {
      customerName: customerName,
      phone: phone,
      email: email,
      emailVerificationToken: emailVerificationToken,
      bookingDate: bookingDate,
      timeSlot: timeSlot,
      numberOfStudents: numberOfStudents,
      learningFormat: learningFormat,
      location: location,
      note: note,
      lineUserId: lineUserId,
    },
  };
}

function constantTimeEquals_(left, right) {
  var a = String(left || "");
  var b = String(right || "");
  var difference = a.length ^ b.length;
  var length = Math.max(a.length, b.length);
  for (var index = 0; index < length; index += 1) {
    difference |= (a.charCodeAt(index % Math.max(a.length, 1)) || 0) ^
      (b.charCodeAt(index % Math.max(b.length, 1)) || 0);
  }
  return difference === 0;
}
