"use client"

import * as React from "react"
import { ArrowUpRightIcon } from "lucide-react"

import { TapButton } from "@/components/site/motion-primitives"
import { useBooking } from "@/components/site/booking/booking-provider"
import { cn } from "@/lib/utils"

/**
 * Primary CTA. A slow brass shimmer drifts across the surface — barely
 * noticeable, but enough to draw the eye. Static under reduced motion.
 */
export function BookButton({
  className,
  size = "lg",
  barberId,
  serviceId,
  children = "Записатись",
  variant = "shimmer",
}: {
  className?: string
  size?: "lg" | "default"
  barberId?: string
  serviceId?: string
  children?: React.ReactNode
  variant?: "shimmer" | "outline"
}) {
  const { openBooking } = useBooking()

  return (
    <TapButton
      type="button"
      size={size}
      variant={variant === "outline" ? "outline" : "default"}
      aria-haspopup="dialog"
      onClick={() => openBooking({ barberId, serviceId })}
      className={cn(
        "group/book relative overflow-hidden font-semibold tracking-wide uppercase",
        variant === "shimmer" &&
          "bg-[linear-gradient(110deg,var(--primary)_35%,var(--primary-highlight)_50%,var(--primary)_65%)] bg-[length:250%_100%] text-primary-foreground shadow-[0_0_40px_-12px_var(--primary)] hover:bg-[linear-gradient(110deg,var(--primary)_35%,var(--primary-highlight)_50%,var(--primary)_65%)] motion-safe:animate-shimmer",
        size === "lg" && "h-12 px-6 text-sm",
        className
      )}
    >
      {children}
      <ArrowUpRightIcon
        data-icon="inline-end"
        className="transition-transform duration-300 group-hover/book:translate-x-0.5 group-hover/book:-translate-y-0.5"
      />
    </TapButton>
  )
}
