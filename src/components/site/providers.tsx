"use client"

import * as React from "react"
import { MotionConfig } from "motion/react"

import { BookingProvider } from "@/components/site/booking/booking-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <BookingProvider>{children}</BookingProvider>
    </MotionConfig>
  )
}
