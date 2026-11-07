"use client"

import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react"

import { BookButton } from "@/components/site/book-button"
import { Reveal } from "@/components/site/motion-primitives"
import { SectionHeading } from "@/components/site/section-heading"
import { Separator } from "@/components/ui/separator"
import { contacts } from "@/lib/data"

export function Contacts() {
  return (
    <section id="contacts" aria-labelledby="contacts-title" className="mx-auto w-full max-w-7xl px-5 py-28 sm:px-8 sm:py-40">
      <div className="grid gap-14 lg:grid-cols-2">
        <div className="flex flex-col gap-10">
          <SectionHeading id="contacts-title" index="05" kicker="Контакти" title="Будь в курсі" />
          <Reveal>
            <address className="flex flex-col gap-6 not-italic">
              <ContactRow icon={<MapPinIcon />} label="Адреса">
                м. {contacts.city}, {contacts.address}
              </ContactRow>
              <ContactRow icon={<ClockIcon />} label="Час роботи">
                <span className="tabular-nums">Щодня {contacts.hours}</span>
              </ContactRow>
              <ContactRow icon={<PhoneIcon />} label="Телефон">
                <span className="flex flex-col gap-1">
                  {contacts.phones.map((p) => (
                    <a key={p.href} href={p.href} className="tabular-nums underline-offset-4 hover:text-primary hover:underline">
                      {p.label}
                    </a>
                  ))}
                </span>
              </ContactRow>
              <ContactRow icon={<MailIcon />} label="Пошта">
                <a href={`mailto:${contacts.email}`} className="underline-offset-4 hover:text-primary hover:underline">
                  {contacts.email}
                </a>
              </ContactRow>
            </address>
          </Reveal>
          <Reveal className="flex flex-wrap items-center gap-6">
            <BookButton />
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {contacts.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal className="min-h-80 overflow-hidden rounded-2xl ring-1 ring-border">
          <iframe
            title={`Мапа: KURS Barbershop, ${contacts.address}`}
            src={contacts.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="size-full min-h-80 grayscale invert-[0.92] hue-rotate-180"
          />
        </Reveal>
      </div>
      <Separator className="mt-28" />
      <footer className="flex flex-col gap-3 pt-8 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>© KURS Barbershop, з 2020 року · Підпишись на нас. Будь в курсі.</p>
        <p>Навчання для барберів — деталі за телефоном.</p>
      </footer>
    </section>
  )
}

function ContactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span aria-hidden className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-primary [&_svg]:size-4">
        {icon}
      </span>
      <div className="flex flex-col gap-1">
        <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">{label}</span>
        <span className="text-lg">{children}</span>
      </div>
    </div>
  )
}
