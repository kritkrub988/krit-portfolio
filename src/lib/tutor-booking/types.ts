import type { ALL_TIME_SLOTS } from "./constants.ts"

export type BookingStatus = "pending" | "confirmed" | "cancelled"
export type LearningFormat = "onsite" | "online"
export type TimeSlot = (typeof ALL_TIME_SLOTS)[number]

export interface BookingRequest {
  customer_name: string
  phone: string
  email: string
  email_verification_token: string
  booking_date: string
  time_slot: TimeSlot
  number_of_students: 1 | 2 | 3 | 4
  learning_format: LearningFormat
  location: string
  note?: string
  line_user_id?: string
}

export interface BookingSummary {
  booking_reference: string
  booking_date: string
  time_slot: TimeSlot
  number_of_students: 1 | 2 | 3 | 4
  price_per_person: number
  total_price: number
  course_name: string
  learning_format: LearningFormat
  status: "pending"
}

export interface BookingSuccessResponse {
  success: true
  message: string
  booking: BookingSummary
}

export interface BookingErrorResponse {
  success: false
  code: string
  message: string
  errors?: string[]
}

export type BookingResponse = BookingSuccessResponse | BookingErrorResponse

export interface EmailOtpSendSuccessResponse {
  success: true
  message: string
  request_id: string
  expires_in_seconds: number
  resend_after_seconds: number
}

export type EmailOtpResponse = EmailOtpSendSuccessResponse | BookingErrorResponse

export interface EmailOtpVerifySuccessResponse {
  success: true
  message: string
  verification_token: string
  expires_in_seconds: number
}

export type EmailOtpVerifyResponse = EmailOtpVerifySuccessResponse | BookingErrorResponse

export interface AvailabilitySuccessResponse {
  success: true
  date: string
  dayType: "weekday" | "weekend"
  availableSlots: TimeSlot[]
  unavailableSlots: TimeSlot[]
}

export type AvailabilityResponse = AvailabilitySuccessResponse | BookingErrorResponse

export interface AdminBooking {
  booking_reference: string
  created_at: string
  booking_date: string
  time_slot: TimeSlot
  customer_name: string
  phone: string
  email: string
  number_of_students: 1 | 2 | 3 | 4
  price_per_person: number
  total_price: number
  course_name: string
  learning_format: LearningFormat
  location: string
  note: string
  status: BookingStatus
  line_user_id: string
}

export interface AdminBookingsResponse {
  success: true
  bookings: AdminBooking[]
}

export interface AdminStatusUpdateResponse {
  success: true
  booking_reference: string
  status: BookingStatus
}

export type AdminListResponse = AdminBookingsResponse | BookingErrorResponse
export type AdminUpdateResponse = AdminStatusUpdateResponse | BookingErrorResponse
