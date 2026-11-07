"use client"

import { ClockIcon } from "lucide-react"

import { BookButton } from "@/components/site/book-button"
import { RevealGroup, SpotlightSurface } from "@/components/site/motion-primitives"
import { SectionHeading } from "@/components/site/section-heading"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRange, services } from "@/lib/data"

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="mx-auto w-full max-w-7xl px-5 py-28 sm:px-8 sm:py-40"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading id="services-title" index="02" kicker="Послуги" title="Ціни без сюрпризів" />
        <p className="max-w-sm text-muted-foreground">
          Вартість залежить від рівня майстра та складності. Миття голови — вже в ціні чоловічої стрижки.
        </p>
      </div>

      <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <SpotlightSurface key={s.id}>
            <Card className="h-full gap-6 bg-card/60 py-7 [--card-spacing:--spacing(7)]">
              <CardHeader className="gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-heading text-xs text-muted-foreground tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Badge variant="outline" className="gap-1 text-muted-foreground">
                    <ClockIcon data-icon="inline-start" />
                    {s.duration}
                  </Badge>
                </div>
                <CardTitle className="font-heading text-xl font-semibold tracking-tight uppercase">
                  {s.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed text-pretty">{s.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <p className="font-heading text-3xl font-semibold text-primary tabular-nums">
                  {formatRange(s.priceFrom, s.priceTo)}
                </p>
              </CardContent>
              <CardFooter className="border-t bg-transparent pt-6">
                <BookButton
                  variant="outline"
                  size="default"
                  serviceId={s.id}
                  className="relative z-10 h-10 w-full text-xs"
                >
                  Обрати
                </BookButton>
              </CardFooter>
            </Card>
          </SpotlightSurface>
        ))}
      </RevealGroup>
    </section>
  )
}
