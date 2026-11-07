import type { Transition, Variants } from "motion/react"

/**
 * KURS motion system.
 * Every preset is spring-based so that motion feels physical, not scripted.
 * Reduced motion is handled globally by <MotionConfig reducedMotion="user">
 * in `components/site/providers.tsx`: transforms are dropped, opacity stays.
 */

/** Soft, unhurried reveal on scroll. */
export const springReveal: Transition = {
  type: "spring",
  stiffness: 40,
  damping: 22,
}

/** Card lift on hover — quick to react, settles without wobble. */
export const springHover: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 26,
  mass: 0.8,
}

/** Button press feedback. */
export const springTap: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 30,
}

/** Step change inside the booking wizard. */
export const springSlide: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
}

/** Fade-in-up used by <Reveal /> and section content. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: springReveal },
}

/** Container that staggers its children. */
export function stagger(staggerChildren = 0.1, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  }
}

/** Masked word reveal for display headings. */
export const wordReveal: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { type: "spring", stiffness: 40, damping: 16, mass: 0.9 },
  },
}

/** Card hover target: slight lift and micro-scale. */
export const cardHover = { y: -6, scale: 1.01 } as const

/** Inner gradient glow fade on card hover. */
export const glowTransition: Transition = { duration: 0.3, ease: "easeOut" }

/** Physical press response for every button. */
export const buttonTap = { scale: 0.96 } as const

/** Viewport options for scroll-triggered reveals. */
export const viewportOnce = { once: true, amount: 0.3 } as const

/** Direction-aware horizontal slide for AnimatePresence (custom = direction). */
export const slide: Variants = {
  enter: (direction: number) => ({ x: direction * 56, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: springSlide },
  exit: (direction: number) => ({
    x: direction * -56,
    opacity: 0,
    transition: { duration: 0.18, ease: "easeIn" },
  }),
}
