import { Reveal } from "@/components/site/motion-primitives"

export function SectionHeading({
  index,
  kicker,
  title,
  id,
}: {
  index: string
  kicker: string
  title: string
  id: string
}) {
  return (
    <Reveal as="header" className="flex flex-col gap-4">
      <p className="flex items-center gap-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
        <span className="font-heading text-primary tabular-nums">{index}</span>
        <span aria-hidden className="h-px w-10 bg-border" />
        {kicker}
      </p>
      <h2
        id={id}
        className="font-heading text-4xl leading-[0.95] font-semibold tracking-tight text-balance uppercase sm:text-6xl"
      >
        {title}
      </h2>
    </Reveal>
  )
}
