/** Shared contract between the booking API routes and the booking wizard. */

export type BookingMode = "live" | "demo"

export type BookingStaff = {
  id: string
  name: string
  meta: string
  avatar?: string
}

export type BookingService = {
  id: string
  title: string
  duration: string
  minutes: number
  priceFrom: number
  priceTo: number
}

export type BookingSlot = {
  time: string
  /** ISO datetime passed back to the provider when booking. */
  datetime: string
}

export type ApiResult<T> = { mode: BookingMode; data: T } | { mode: BookingMode; error: string }

export type BookingRequest = {
  staffId: string
  serviceIds: string[]
  datetime: string
  name: string
  phone: string
}

/** Sentinel for "any free master" — Altegio's staff_id 0. */
export const ANY_STAFF = "any"
