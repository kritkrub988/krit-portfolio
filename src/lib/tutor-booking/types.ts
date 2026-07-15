import type { ALL_TIME_SLOTS } from "./constants.ts"

export type BookingStatus = "pending" | "confirmed" | "cancelled"
export type LearningFormat = "onsite" | "online"
export type TimeSlot = (typeof ALL_TIME_SLOTS)[number]

export interface BookingRequest {
  customer_name: string
  phone: string
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
