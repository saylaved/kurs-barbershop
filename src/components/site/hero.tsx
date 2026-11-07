"use client"

import * as React from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import { ArrowDownIcon } from "lucide-react"

import { BookButton } from "@/components/site/book-button"
import { contacts } from "@/lib/data"
import { fadeInUp, springReveal, stagger, wordReveal } from "@/lib/motion"

const LINES = [["Круті", "укладки,"], ["рівні", "стрижки"]]

export function Hero() {
  const ref = React.useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden"
    >
      <motion.div aria-hidden className="absolute inset-0 -z-10" style={{ y: imageY, scale: imageScale }}>
        <Image
          src="/img/masters.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-45 grayscale-[35%]"
        />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_70%_10%,transparent,var(--background)_70%),linear-gradient(to_top,var(--background),transparent_60%)]"
      />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 pt-32 pb-16 sm:px-8 sm:pb-24"
      >
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ ...springReveal, delay: 0.1 }}
          className="flex items-center gap-3 text-xs font-medium tracking-[0.35em] text-muted-foreground uppercase"
        >
          <span aria-hidden className="h-px w-10 bg-primary" />
          Барбершоп · {contacts.city}
        </motion.p>

        <motion.h1
          id="hero-title"
          aria-label="Круті укладки, рівні стрижки"
          variants={stagger(0.14, 0.25)}
          initial="hidden"
          animate="visible"
          className="font-heading text-[clamp(2.75rem,11vw,9.5rem)] leading-[0.88] font-extrabold tracking-[-0.03em] uppercase"
        >
          {LINES.map((line, li) => (
            <span key={li} aria-hidden className="block">
              {line.map((word, wi) => (
                <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span
                    variants={wordReveal}
                    className={
                      li === 1 && wi === 1
                        ? "inline-block bg-gradient-to-r from-primary to-primary-highlight bg-clip-text text-transparent"
                        : "inline-block"
                    }
                  >
                    {word}
                  </motion.span>
                  {wi < line.length - 1 && "\u00A0"}
                </span>
              ))}
            </span>
          ))}
        </motion.h1>

        <motion.div
          variants={stagger(0.12, 0.9)}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <motion.p variants={fadeInUp} className="max-w-md text-base text-pretty text-muted-foreground sm:text-lg">
            Місце, яке об’єднує однодумців. Від стрижки — до нового, якісного життя.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex items-center gap-6">
            <BookButton />
            <a
              href="#services"
              className="group/scroll flex items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Послуги та ціни
              <ArrowDownIcon aria-hidden className="size-4 transition-transform group-hover/scroll:translate-y-0.5" />
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
