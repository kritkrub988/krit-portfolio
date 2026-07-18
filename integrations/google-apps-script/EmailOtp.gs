/** Email OTP issuance and server-side verification for booking requests. */

var EMAIL_OTP_CONFIG = Object.freeze({
  otpTtlSeconds: 600,
  resendCooldownMs: 60 * 1000,
  maxSendsPerWindow: 3,
  sendWindowMs: 30 * 60 * 1000,
  maxAttempts: 5,
});

function handleSendEmailOtp_(rawEmail) {
  var email = normalizeEmail_(rawEmail);
  if (!isValidEmail_(email)) {
    return errorResponse_("VALIDATION_ERROR", "กรุณากรอกอีเมลให้ถูกต้อง");
  }

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(BOOKING_CONFIG.lockTimeoutMs)) {
    return errorResponse_("LOCK_TIMEOUT", "ระบบกำลังประมวลผล กรุณาลองใหม่อีกครั้ง");
  }

  var cache = CacheService.getScriptCache();
  var metaKey = "email_otp_meta_" + sha256Hex_(email);
  var recordKey = "email_otp_";
  try {
    var remainingQuota;
    try {
      remainingQuota = MailApp.getRemainingDailyQuota();
    } catch (quotaError) {
      return errorResponse_("EMAIL_QUOTA_UNAVAILABLE", "ไม่สามารถตรวจสอบโควตาอีเมลได้ในขณะนี้ กรุณาลองใหม่ภายหลัง");
    }
    if (remainingQuota < 1) {
      return errorResponse_("EMAIL_QUOTA_EXCEEDED", "ไม่สามารถส่งอีเมลได้ในขณะนี้ กรุณาลองใหม่ภายหลัง");
    }

    var now = Date.now();
    var meta = parseCacheJson_(cache.get(metaKey));
    if (meta && now - Number(meta.last_sent_at || 0) < EMAIL_OTP_CONFIG.resendCooldownMs) {
      var waitSeconds = Math.ceil((EMAIL_OTP_CONFIG.resendCooldownMs - (now - meta.last_sent_at)) / 1000);
      return errorResponse_("OTP_RESEND_COOLDOWN", "กรุณารอ " + waitSeconds + " วินาทีก่อนส่งรหัสอีกครั้ง");
    }
    if (!meta || now - Number(meta.window_started_at || 0) >= EMAIL_OTP_CONFIG.sendWindowMs) {
      meta = { window_started_at: now, send_count: 0 };
    }
    if (Number(meta.send_count || 0) >= EMAIL_OTP_CONFIG.maxSendsPerWindow) {
      return errorResponse_("OTP_SEND_LIMIT", "ส่งรหัสเกินจำนวนที่กำหนด กรุณาลองใหม่ภายหลัง");
    }

    var previousMeta = JSON.parse(JSON.stringify(meta));
    var previousRequestId = String(meta.active_request_id || "");
    var requestId = Utilities.getUuid().replace(/-/g, "");
    var otp = generateOtp_();
    var record = {
      email: email,
      otp_hash: hashOtp_(otp, email, requestId),
      created_at: now,
      expires_at: now + EMAIL_OTP_CONFIG.otpTtlSeconds * 1000,
      attempt_count: 0,
      used: false,
    };
    cache.put(recordKey + requestId, JSON.stringify(record), EMAIL_OTP_CONFIG.otpTtlSeconds);

    meta.active_request_id = requestId;
    meta.last_sent_at = now;
    meta.send_count = Number(meta.send_count || 0) + 1;
    cache.put(metaKey, JSON.stringify(meta), Math.ceil(EMAIL_OTP_CONFIG.sendWindowMs / 1000));

    try {
      MailApp.sendEmail({
        to: email,
        subject: "รหัสยืนยันการจองคลาส KRIT HUB AI Tutor",
        body: [
          "KRIT HUB AI Tutor",
          "",
          "รหัสยืนยันของคุณคือ: " + otp,
          "รหัสนี้มีอายุ 10 นาที และใช้ได้เพียงครั้งเดียว",
          "โปรดอย่าส่งต่อรหัสนี้ให้ผู้อื่น",
          "",
          "หากคุณไม่ได้เป็นผู้ร้องขอ สามารถละเว้นอีเมลนี้ได้",
        ].join("\n"),
        name: "KRIT HUB AI Tutor",
      });
    } catch (error) {
      cache.remove(recordKey + requestId);
      if (previousMeta && Object.keys(previousMeta).length > 0) {
        cache.put(
          metaKey,
          JSON.stringify(previousMeta),
          Math.ceil(EMAIL_OTP_CONFIG.sendWindowMs / 1000),
        );
      } else {
        cache.remove(metaKey);
      }
      return errorResponse_("EMAIL_SEND_FAILED", "ไม่สามารถส่งอีเมลได้ในขณะนี้ กรุณาลองใหม่ภายหลัง");
    }

    if (previousRequestId && previousRequestId !== requestId) {
      invalidateOtpRecord_(cache, recordKey + previousRequestId);
    }

    return jsonResponse_({
      success: true,
      message: "ส่งรหัสยืนยันไปยังอีเมลแล้ว",
      request_id: requestId,
      expires_in_seconds: EMAIL_OTP_CONFIG.otpTtlSeconds,
      resend_after_seconds: EMAIL_OTP_CONFIG.resendCooldownMs / 1000,
    });
  } finally {
    releaseLockSafely_(lock);
  }
}

function handleVerifyEmailOtp_(rawEmail, rawRequestId, rawOtp) {
  var email = normalizeEmail_(rawEmail);
  var requestId = String(rawRequestId || "").trim();
  var otp = String(rawOtp || "").trim();
  if (!isValidEmail_(email) || !/^\d{6}$/.test(otp) || requestId.length < 16) {
    return errorResponse_("VALIDATION_ERROR", "กรุณากรอกรหัสยืนยัน 6 หลัก");
  }

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(BOOKING_CONFIG.lockTimeoutMs)) {
    return errorResponse_("LOCK_TIMEOUT", "ระบบกำลังประมวลผล กรุณาลองใหม่อีกครั้ง");
  }

  var cache = CacheService.getScriptCache();
  var key = "email_otp_" + requestId;
  try {
    var record = parseCacheJson_(cache.get(key));
    if (!record || record.email !== email || record.used || Date.now() >= Number(record.expires_at || 0)) {
      return errorResponse_("OTP_EXPIRED", "รหัสยืนยันหมดอายุ กรุณาขอรหัสใหม่");
    }
    if (Number(record.attempt_count || 0) >= EMAIL_OTP_CONFIG.maxAttempts) {
      record.used = true;
      cache.put(key, JSON.stringify(record), 60);
      return errorResponse_("OTP_ATTEMPTS_EXCEEDED", "กรอกรหัสไม่ถูกต้องเกินจำนวนที่กำหนด กรุณาขอรหัสใหม่");
    }
    if (!constantTimeEquals_(record.otp_hash, hashOtp_(otp, email, requestId))) {
      record.attempt_count = Number(record.attempt_count || 0) + 1;
      var remainingSeconds = Math.max(1, Math.ceil((Number(record.expires_at) - Date.now()) / 1000));
      cache.put(key, JSON.stringify(record), Math.min(EMAIL_OTP_CONFIG.otpTtlSeconds, remainingSeconds));
      return errorResponse_(record.attempt_count >= EMAIL_OTP_CONFIG.maxAttempts ? "OTP_ATTEMPTS_EXCEEDED" : "OTP_INVALID", record.attempt_count >= EMAIL_OTP_CONFIG.maxAttempts ? "กรอกรหัสไม่ถูกต้องเกินจำนวนที่กำหนด กรุณาขอรหัสใหม่" : "รหัสยืนยันไม่ถูกต้อง");
    }

    record.used = true;
    cache.put(key, JSON.stringify(record), 60);
    var verificationToken = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
    var verificationRecord = {
      email: email,
      used: false,
      expires_at: Date.now() + EMAIL_OTP_CONFIG.otpTtlSeconds * 1000,
    };
    var verificationJson = JSON.stringify(verificationRecord);
    PropertiesService.getScriptProperties().setProperty(
      emailVerificationPropertyKey_(verificationToken),
      verificationJson,
    );
    cache.put("email_verified_" + verificationToken, verificationJson, EMAIL_OTP_CONFIG.otpTtlSeconds);
    try {
      cleanupExpiredEmailVerificationTokens_();
    } catch (cleanupError) {
      safeLog_("EMAIL_VERIFICATION_CLEANUP_FAILED", "Expired token cleanup failed");
    }
    return jsonResponse_({ success: true, message: "ยืนยันอีเมลสำเร็จ", verification_token: verificationToken, expires_in_seconds: EMAIL_OTP_CONFIG.otpTtlSeconds });
  } finally {
    releaseLockSafely_(lock);
  }
}

function validateEmailVerification_(email, token) {
  var normalizedEmail = normalizeEmail_(email);
  var normalizedToken = String(token || "").trim();
  var cache = CacheService.getScriptCache();
  var value = parseCacheJson_(cache.get("email_verified_" + normalizedToken));
  if (!value) {
    value = parseCacheJson_(
      PropertiesService.getScriptProperties().getProperty(
        emailVerificationPropertyKey_(normalizedToken),
      ),
    );
  }
  if (!value || value.used || value.email !== normalizedEmail || Date.now() >= Number(value.expires_at || 0)) {
    return { valid: false, code: "EMAIL_NOT_VERIFIED", message: "กรุณายืนยันอีเมลก่อนจอง" };
  }
  cache.put(
    "email_verified_" + normalizedToken,
    JSON.stringify(value),
    Math.max(1, Math.ceil((Number(value.expires_at) - Date.now()) / 1000)),
  );
  return { valid: true };
}

function markEmailVerificationUsed_(token) {
  var normalizedToken = String(token || "").trim();
  var key = "email_verified_" + normalizedToken;
  var cache = CacheService.getScriptCache();
  var properties = PropertiesService.getScriptProperties();
  var propertyKey = emailVerificationPropertyKey_(normalizedToken);
  var value = parseCacheJson_(cache.get(key)) || parseCacheJson_(properties.getProperty(propertyKey));
  properties.deleteProperty(propertyKey);
  if (value) {
    value.used = true;
    cache.put(key, JSON.stringify(value), 60);
  } else {
    cache.remove(key);
  }
}

function emailVerificationPropertyKey_(token) {
  return "EMAIL_VERIFICATION_" + String(token || "").trim();
}

function cleanupExpiredEmailVerificationTokens_() {
  var properties = PropertiesService.getScriptProperties();
  var allProperties = properties.getProperties();
  var now = Date.now();
  Object.keys(allProperties).forEach(function (key) {
    if (key.indexOf("EMAIL_VERIFICATION_") !== 0) return;
    var value = parseCacheJson_(allProperties[key]);
    if (!value || now >= Number(value.expires_at || 0)) properties.deleteProperty(key);
  });
}

function invalidateOtpRecord_(cache, key) {
  var record = parseCacheJson_(cache.get(key));
  if (!record) return;
  record.used = true;
  cache.put(key, JSON.stringify(record), 60);
}

function parseCacheJson_(value) {
  if (!value) return null;
  try { return JSON.parse(value); } catch (error) { return null; }
}

function generateOtp_() {
  var seed = Utilities.getUuid().replace(/-/g, "").slice(0, 8);
  return String((parseInt(seed, 16) % 900000) + 100000);
}

function normalizeEmail_(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail_(value) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hashOtp_(otp, email, requestId) {
  var secret = PropertiesService.getScriptProperties().getProperty("BOOKING_API_SECRET");
  if (!secret) {
    throw new Error("CONFIGURATION_ERROR: BOOKING_API_SECRET is missing");
  }
  var input = otp + "|" + email + "|" + requestId + "|" + secret;
  return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input));
}

function sha256Hex_(value) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value || ""));
  return bytes.map(function (byte) {
    var normalized = byte < 0 ? byte + 256 : byte;
    return (normalized < 16 ? "0" : "") + normalized.toString(16);
  }).join("");
}
