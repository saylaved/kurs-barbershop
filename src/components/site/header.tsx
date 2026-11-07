"use client"

import * as React from "react"
import Image from "next/image"
import { motion, useMotionValueEvent, useScroll } from "motion/react"

import { BookButton } from "@/components/site/book-button"
import { nav } from "@/lib/data"
import { springReveal } from "@/lib/motion"
import { cn } from "@/lib/utils"

export function Header() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = React.useState(false)
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24))

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...springReveal, delay: 0.2 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled ? "border-b bg-background/75 backdrop-blur-xl" : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-3 rounded-md" aria-label="KURS Barbershop — на початок">
          <Image src="/img/logo.png" alt="" width={27} height={33} priority className="opacity-90" />
          <span className="font-heading text-lg font-semibold tracking-[0.25em]">KURS</span>
        </a>
        <nav aria-label="Основна навігація" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <BookButton size="default" variant="outline" className="h-9 px-4 text-xs" />
      </div>
    </motion.header>
  )
}
