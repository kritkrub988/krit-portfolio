import { PRICE_BY_STUDENT_COUNT } from "./constants.ts"

export interface BookingPrice {
  pricePerPerson: number
  totalPrice: number
}

export function getBookingPrice(numberOfStudents: number): BookingPrice {
  if (!Number.isInteger(numberOfStudents) || numberOfStudents < 1 || numberOfStudents > 4) {
    throw new RangeError("numberOfStudents must be an integer from 1 to 4")
  }

  return PRICE_BY_STUDENT_COUNT[numberOfStudents as keyof typeof PRICE_BY_STUDENT_COUNT]
}
