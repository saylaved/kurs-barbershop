"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { QuoteIcon, StarIcon } from "lucide-react"
import { useReducedMotion } from "motion/react"

import { BookButton } from "@/components/site/book-button"
import { RevealGroup, SpotlightSurface } from "@/components/site/motion-primitives"
import { SectionHeading } from "@/components/site/section-heading"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { barbers, type Barber } from "@/lib/data"
import { cn } from "@/lib/utils"

export function Team() {
  return (
    <section id="team" aria-labelledby="team-title" className="relative py-28 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklch,var(--primary)_8%,transparent),transparent)]"
      />
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="team-title" index="03" kicker="Наша команда" title="Майстри KURS" />
          <p className="max-w-md text-muted-foreground">
            Злагоджена команда: працюємо швидко, якісно, відповідаємо за результат. Кожна стрижка та гоління
            підкреслюють мужність силуету, форму голови і риси обличчя.
          </p>
        </div>
        <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {barbers.map((b) => (
            <SpotlightSurface key={b.id}>
              <BarberCard barber={b} />
            </SpotlightSurface>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

function BarberCard({ barber }: { barber: Barber }) {
  return (
    <Card className="h-full min-w-0 gap-5 bg-card/60 pt-0">
      {/* Photo placeholder — swap for <Image /> when real team photos are ready. */}
      <div className="relative">
        <Skeleton className="aspect-[4/5] w-full rounded-none rounded-t-xl" aria-hidden />
        <span className="sr-only">Фото {barber.name} незабаром</span>
        <Badge className="absolute top-4 left-4">{barber.role}</Badge>
      </div>
      <CardHeader className="gap-1">
        <CardTitle className="font-heading text-xl font-semibold tracking-tight uppercase">{barber.name}</CardTitle>
        <CardDescription>{barber.experience}</CardDescription>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {barber.specialties.map((s) => (
            <Badge key={s} variant="secondary">
              {s}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="mt-auto">
        <Reviews barber={barber} />
      </CardContent>
      <CardFooter className="border-t bg-transparent pt-5">
        <BookButton variant="outline" size="default" barberId={barber.id} className="relative z-10 h-10 w-full text-xs">
          До {barber.name}а
        </BookButton>
      </CardFooter>
    </Card>
  )
}

function Reviews({ barber }: { barber: Barber }) {
  const reduce = useReducedMotion()
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const plugins = React.useMemo(
    () => (reduce ? [] : [Autoplay({ delay: 5200, stopOnInteraction: false, stopOnMouseEnter: true })]),
    [reduce]
  )

  React.useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-muted/40 p-4">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, duration: 32 }}
        plugins={plugins}
        aria-label={`Відгуки про ${barber.name}а`}
      >
        <CarouselContent>
          {barber.reviews.map((r, i) => (
            <CarouselItem key={i}>
              <figure className="flex flex-col gap-3">
                <QuoteIcon aria-hidden className="size-4 text-primary" />
                <blockquote className="min-h-[4.5rem] text-sm leading-relaxed text-pretty">{r.text}</blockquote>
                <figcaption className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{r.author}</span>
                  <span className="flex items-center gap-0.5" aria-label={`Оцінка ${r.rating} з 5`}>
                    {Array.from({ length: r.rating }).map((_, s) => (
                      <StarIcon key={s} aria-hidden className="size-3 fill-primary text-primary" />
                    ))}
                  </span>
                </figcaption>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex gap-1.5">
        {barber.reviews.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => api?.scrollTo(i)}
            aria-label={`Відгук ${i + 1}`}
            aria-current={current === i || undefined}
            className="relative z-10 flex h-6 items-center rounded-full"
          >
            <span
              className={cn(
                "block h-1 rounded-full transition-[width,background-color] duration-500",
                current === i ? "w-6 bg-primary" : "w-2 bg-muted-foreground/40"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
