"use client"

import * as React from "react"

import { BookingDialog } from "@/components/site/booking/booking-dialog"

type OpenOptions = { barberId?: string; serviceId?: string }

type BookingContextValue = {
  openBooking: (options?: OpenOptions) => void
}

const BookingContext = React.createContext<BookingContextValue | null>(null)

export function useBooking() {
  const ctx = React.useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used within <BookingProvider>")
  return ctx
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [preset, setPreset] = React.useState<OpenOptions>({})
  // Remount the wizard on every open so it always starts clean.
  const [session, setSession] = React.useState(0)

  const openBooking = React.useCallback((options: OpenOptions = {}) => {
    setPreset(options)
    setSession((s) => s + 1)
    setOpen(true)
  }, [])

  const value = React.useMemo(() => ({ openBooking }), [openBooking])

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingDialog key={session} open={open} onOpenChange={setOpen} preset={preset} />
    </BookingContext.Provider>
  )
}
