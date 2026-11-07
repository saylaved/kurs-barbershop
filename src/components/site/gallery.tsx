"use client"

import * as React from "react"
import Image from "next/image"
import AutoScroll from "embla-carousel-auto-scroll"
import { PauseIcon, PlayIcon } from "lucide-react"
import { useReducedMotion } from "motion/react"

import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/site/motion-primitives"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { gallery } from "@/lib/data"

export function Gallery() {
  const reduce = useReducedMotion()
  const [api, setApi] = React.useState<CarouselApi>()
  // null = follow the system preference; true/false = the visitor's choice.
  const [choice, setChoice] = React.useState<boolean | null>(null)
  const playing = choice ?? !reduce
  const plugins = React.useMemo(
    () => [
      AutoScroll({
        speed: 0.9,
        startDelay: 400,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        playOnInit: !reduce,
      }),
    ],
    [reduce]
  )

  function toggle() {
    const auto = api?.plugins().autoScroll
    if (!auto) return
    if (auto.isPlaying()) {
      auto.stop()
      setChoice(false)
    } else {
      auto.play()
      setChoice(true)
    }
  }

  // Duplicate slides so the loop never shows a seam on wide screens.
  const slides = [...gallery, ...gallery]

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="py-28 sm:py-40">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <SectionHeading id="gallery-title" index="04" kicker="Галерея" title="Атмосфера KURS" />
        <Reveal>
          <Button
            variant="outline"
            size="icon-lg"
            className="rounded-full"
            onClick={toggle}
            aria-label={playing ? "Зупинити прокрутку галереї" : "Запустити прокрутку галереї"}
            aria-pressed={!playing}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </Button>
        </Reveal>
      </div>
      <Reveal className="mt-14">
        <Carousel
          setApi={setApi}
          opts={{ loop: true, dragFree: true, align: "start" }}
          plugins={plugins}
          aria-label="Галерея робіт"
          className="[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
        >
          <CarouselContent className="-ml-5">
            {slides.map((img, i) => (
              <CarouselItem key={i} className="basis-[85%] pl-5 sm:basis-[60%] lg:basis-[42%]">
                <figure className="group/img relative aspect-[2049/975] overflow-hidden rounded-2xl ring-1 ring-border">
                  <Image
                    src={img.src}
                    alt={i < gallery.length ? img.alt : ""}
                    aria-hidden={i >= gallery.length || undefined}
                    fill
                    sizes="(min-width: 1024px) 42vw, (min-width: 640px) 60vw, 85vw"
                    className="object-cover grayscale-[30%] transition-[filter,transform] duration-700 group-hover/img:scale-[1.03] group-hover/img:grayscale-0"
                  />
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </Reveal>
    </section>
  )
}
