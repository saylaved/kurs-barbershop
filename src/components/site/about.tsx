"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import * as React from "react"

import { Reveal, ScrollRevealText } from "@/components/site/motion-primitives"
import { SectionHeading } from "@/components/site/section-heading"
import { Separator } from "@/components/ui/separator"

const STATS = [
  { value: "2020", label: "рік заснування" },
  { value: "6", label: "послуг під ваш стиль" },
  { value: "11", label: "годин на день для вас" },
]

export function About() {
  const imageRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])

  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto w-full max-w-7xl px-5 py-28 sm:px-8 sm:py-40">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-10 lg:col-span-7">
          <SectionHeading id="about-title" index="01" kicker="Про нас" title="Новий курс — від стрижки" />
          <ScrollRevealText
            className="text-2xl leading-snug font-medium text-pretty sm:text-3xl"
            text="Барбершоп KURS — місце, яке об’єднує однодумців. Нас надихає природа, мистецтво, екстрим, подорожі та активні, цілеспрямовані люди."
          />
          <Reveal className="flex max-w-xl flex-col gap-4 text-muted-foreground">
            <p>
              Ми — команда майстрів своєї справи: постійно вдосконалюємось, вчимося, розвиваємося і підтримуємо
              один одного. Ми оточуємо себе сильними і вільними духом людьми, будуємо простір, в якому
              змінюється життя і прокладається новий КУРС — від стрижки до нового, якісного життя.
            </p>
          </Reveal>
          <Separator />
          <dl className="grid grid-cols-3 gap-6">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="flex flex-col gap-1">
                <dt className="order-2 text-xs text-muted-foreground sm:text-sm">{s.label}</dt>
                <dd className="order-1 font-heading text-3xl font-semibold text-primary tabular-nums sm:text-5xl">
                  {s.value}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
        <Reveal className="lg:col-span-5 lg:pt-24">
          <div ref={imageRef} className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-border">
            <motion.div className="absolute -inset-y-[10%] inset-x-0" style={{ y }}>
              <Image
                src="/img/school_photo.jpg"
                alt="Майстри KURS за роботою в барбершопі"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </motion.div>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent" />
            <p className="absolute bottom-5 left-5 text-xs tracking-[0.3em] text-foreground/80 uppercase">
              Стиль · характер · деталі
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
