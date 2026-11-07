"use client"

import * as React from "react"
import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  buttonTap,
  cardHover,
  fadeInUp,
  glowTransition,
  springHover,
  springTap,
  stagger,
  viewportOnce,
} from "@/lib/motion"

/** shadcn Button with physical press feedback (whileTap scale 0.96). */
const MotionButtonBase = motion.create(Button)

export function TapButton(props: React.ComponentProps<typeof MotionButtonBase>) {
  return <MotionButtonBase whileTap={buttonTap} transition={springTap} {...props} />
}

/** Scroll-triggered fade-in-up (stiffness 40, damping 22). */
export function Reveal({
  className,
  delay = 0,
  as = "div",
  children,
}: {
  className?: string
  delay?: number
  as?: "div" | "li" | "p" | "header"
  children: React.ReactNode
}) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </Comp>
  )
}

/** Staggered group: children should use `variants={fadeInUp}`. */
export function RevealGroup({
  className,
  children,
  gap = 0.08,
}: {
  className?: string
  children: React.ReactNode
  gap?: number
}) {
  return (
    <motion.div
      className={className}
      variants={stagger(gap)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Hover lift (y -6, scale 1.01) + an inner gradient glow that follows the
 * pointer and fades in over 0.3s.
 */
export function SpotlightSurface({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const [hovered, setHovered] = React.useState(false)
  const background = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, color-mix(in oklch, var(--primary) 16%, transparent), transparent 65%)`

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={cardHover}
      transition={springHover}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        x.set(e.clientX - rect.left)
        y.set(e.clientY - rect.top)
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={cn("relative h-full min-w-0", className)}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{ background }}
        initial={false}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={glowTransition}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-primary/30"
        initial={false}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={glowTransition}
      />
    </motion.div>
  )
}

/** Text that lights up word by word as it scrolls through the viewport. */
export function ScrollRevealText({ text, className }: { text: string; className?: string }) {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.45"] })
  const words = text.split(" ")

  if (reduce) {
    return <p className={className}>{text}</p>
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  )
}

function Word({
  children,
  progress,
  range,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </>
  )
}
