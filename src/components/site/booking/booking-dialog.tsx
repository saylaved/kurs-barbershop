"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { uk } from "react-day-picker/locale"
import { format, parseISO } from "date-fns"
import { uk as ukDate } from "date-fns/locale"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  PhoneIcon,
  RotateCwIcon,
  ScissorsIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { TapButton } from "@/components/site/motion-primitives"
import { qs, useApi } from "@/components/site/booking/use-api"
import {
  ANY_STAFF,
  type ApiResult,
  type BookingService,
  type BookingSlot,
  type BookingStaff,
} from "@/lib/booking-types"
import { contacts, formatPrice, services as siteServices } from "@/lib/data"
import { fadeInUp, slide, springHover, stagger } from "@/lib/motion"
import { cn } from "@/lib/utils"

const STEPS = ["Барбер", "Послуги", "Дата і час", "Контакти"] as const

type FormState = {
  staffId: string
  serviceIds: string[]
  date?: string // yyyy-MM-dd
  slot?: BookingSlot
  name: string
  phone: string
}

const toDay = (d: Date) => format(d, "yyyy-MM-dd")

function isValidPhone(v: string) {
  const digits = v.replace(/\D/g, "")
  return digits.length >= 10 && digits.length <= 13
}

/** Section cards use site ids ("classic"); live Altegio ids are numeric — match by title. */
function resolvePreset(presetId: string | undefined, list: BookingService[] | undefined) {
  if (!presetId || !list) return []
  if (list.some((s) => s.id === presetId)) return [presetId]
  const title = siteServices.find((s) => s.id === presetId)?.title.toLowerCase()
  const match = title && list.find((s) => s.title.toLowerCase().includes(title))
  return match ? [match.id] : []
}

export function BookingDialog({
  open,
  onOpenChange,
  preset,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  preset: { barberId?: string; serviceId?: string }
}) {
  const [step, setStep] = React.useState(0)
  const [direction, setDirection] = React.useState(1)
  const [status, setStatus] = React.useState<"idle" | "submitting" | "done">("idle")
  const [submitError, setSubmitError] = React.useState<string>()
  const [touched, setTouched] = React.useState(false)
  const [form, setForm] = React.useState<FormState>({
    staffId: preset.barberId ?? "",
    serviceIds: [],
    name: "",
    phone: "",
  })
  const [presetApplied, setPresetApplied] = React.useState(!preset.serviceId)

  // Data is fetched only once the dialog is opened.
  const staff = useApi<BookingStaff[]>(open ? "/api/booking/staff" : null)
  const services = useApi<BookingService[]>(
    open && form.staffId ? `/api/booking/services${qs({ staff: form.staffId })}` : null
  )
  const mode = staff.mode ?? services.mode

  // Preselect the service the visitor clicked on ("Обрати") once the list arrives.
  if (!presetApplied && services.data) {
    setPresetApplied(true)
    const ids = resolvePreset(preset.serviceId, services.data)
    if (ids.length) setForm((f) => ({ ...f, serviceIds: ids }))
  }

  // A preset barber id that the provider doesn't know (placeholder team cards) → "any".
  const staffList = staff.data
  const knownStaff = !form.staffId || form.staffId === ANY_STAFF || staffList?.some((s) => s.id === form.staffId)
  if (staffList && !knownStaff) setForm((f) => ({ ...f, staffId: ANY_STAFF }))

  const chosen = (services.data ?? []).filter((s) => form.serviceIds.includes(s.id))
  const totalFrom = chosen.reduce((a, s) => a + s.priceFrom, 0)
  const totalTo = chosen.reduce((a, s) => a + s.priceTo, 0)
  const totalMinutes = chosen.reduce((a, s) => a + s.minutes, 0)
  const staffName =
    form.staffId === ANY_STAFF ? "Будь-який вільний майстер" : (staffList?.find((s) => s.id === form.staffId)?.name ?? "")

  const canContinue = [
    form.staffId !== "",
    chosen.length > 0,
    Boolean(form.date && form.slot),
    form.name.trim().length >= 2 && isValidPhone(form.phone),
  ][step]

  function go(to: number) {
    setDirection(to > step ? 1 : -1)
    setStep(to)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!canContinue || !form.slot) return
    setStatus("submitting")
    setSubmitError(undefined)
    try {
      const res = await fetch("/api/booking/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: form.staffId,
          serviceIds: form.serviceIds,
          datetime: form.slot.datetime,
          name: form.name,
          phone: form.phone,
        }),
      })
      const json = (await res.json()) as ApiResult<{ recordId: string | null }>
      if ("error" in json) throw new Error(json.error)
      setStatus("done")
    } catch (err) {
      setSubmitError((err as Error).message || "Не вдалося записатись. Спробуйте ще раз.")
      setStatus("idle")
    }
  }

  const nameError = touched && form.name.trim().length < 2
  const phoneError = touched && !isValidPhone(form.phone)
  const total = chosen.length ? `${formatPrice(totalFrom)} – ${formatPrice(totalTo)}` : ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92dvh,52rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {status === "done" ? (
          <Success staffName={staffName} slot={form.slot} total={total} demo={mode === "demo"} />
        ) : (
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col" noValidate>
            <DialogHeader className="gap-4 border-b p-6 pb-5">
              <div className="flex flex-col gap-1.5 pr-8">
                <DialogTitle className="font-heading text-xl font-semibold tracking-tight uppercase">
                  Запис до барбера
                </DialogTitle>
                <DialogDescription>
                  Крок {step + 1} з {STEPS.length}: {STEPS[step]}
                  {mode === "demo" && " · демо-режим"}
                </DialogDescription>
              </div>
              <Stepper step={step} />
            </DialogHeader>

            <div className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="p-6"
                >
                  {step === 0 && (
                    <BarberStep
                      query={staff}
                      value={form.staffId}
                      onChange={(staffId) =>
                        setForm((f) => ({ ...f, staffId, serviceIds: f.serviceIds, date: undefined, slot: undefined }))
                      }
                    />
                  )}
                  {step === 1 && (
                    <ServiceStep
                      query={services}
                      value={form.serviceIds}
                      onChange={(serviceIds) => setForm((f) => ({ ...f, serviceIds, date: undefined, slot: undefined }))}
                    />
                  )}
                  {step === 2 && (
                    <DateTimeStep
                      staffId={form.staffId}
                      serviceIds={form.serviceIds}
                      date={form.date}
                      slot={form.slot}
                      onDate={(date) => setForm((f) => ({ ...f, date, slot: undefined }))}
                      onSlot={(slot) => setForm((f) => ({ ...f, slot }))}
                    />
                  )}
                  {step === 3 && (
                    <ContactStep
                      name={form.name}
                      phone={form.phone}
                      nameError={nameError}
                      phoneError={phoneError}
                      submitError={submitError}
                      onName={(name) => setForm((f) => ({ ...f, name }))}
                      onPhone={(phone) => setForm((f) => ({ ...f, phone: phone.replace(/[^\d+]/g, "") }))}
                      summary={{
                        barber: staffName,
                        services: chosen.map((s) => s.title).join(", "),
                        when: form.slot ? formatSlot(form.slot) : "",
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <DialogFooter className="mx-0 mb-0 items-center gap-3 p-4 sm:justify-between sm:px-6">
              <div aria-live="polite" className="flex flex-col text-left">
                <span className="text-xs text-muted-foreground">Орієнтовна вартість</span>
                <span className="font-heading text-lg font-semibold tabular-nums">{total || "—"}</span>
                {totalMinutes > 0 && (
                  <span className="text-xs text-muted-foreground tabular-nums">≈ {totalMinutes} хв</span>
                )}
              </div>
              <div className="flex gap-2">
                {step > 0 && (
                  <TapButton type="button" variant="ghost" size="lg" onClick={() => go(step - 1)}>
                    <ArrowLeftIcon data-icon="inline-start" />
                    Назад
                  </TapButton>
                )}
                {step < STEPS.length - 1 ? (
                  // Distinct keys: reusing one DOM node would flip type="button"→"submit"
                  // mid-click and submit the form straight from step 3.
                  <TapButton
                    key="next"
                    type="button"
                    size="lg"
                    className="px-5"
                    disabled={!canContinue}
                    onClick={() => go(step + 1)}
                  >
                    Далі
                    <ArrowRightIcon data-icon="inline-end" />
                  </TapButton>
                ) : (
                  <TapButton key="submit" type="submit" size="lg" className="px-5" disabled={status === "submitting"}>
                    {status === "submitting" ? (
                      <Spinner data-icon="inline-start" />
                    ) : (
                      <CheckIcon data-icon="inline-start" />
                    )}
                    {status === "submitting" ? "Записуємо…" : "Записатись"}
                  </TapButton>
                )}
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function formatSlot(slot: BookingSlot) {
  const d = parseISO(slot.datetime)
  return `${format(d, "d MMMM, EEEEEE", { locale: ukDate })} о ${slot.time}`
}

type Query<T> = ReturnType<typeof useApi<T>>

function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlertIcon />
        </EmptyMedia>
        <EmptyTitle>Не вдалося завантажити</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button type="button" variant="outline" onClick={onRetry}>
          <RotateCwIcon data-icon="inline-start" />
          Спробувати ще
        </Button>
        <Button asChild variant="ghost">
          <a href={contacts.phones[0].href}>
            <PhoneIcon data-icon="inline-start" />
            Зателефонувати
          </a>
        </Button>
      </EmptyContent>
    </Empty>
  )
}

function ListSkeleton({ rows, className }: { rows: number; className?: string }) {
  return (
    <div className={cn("grid gap-3", className)} aria-busy="true" aria-label="Завантаження…">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-[4.5rem] rounded-xl" />
      ))}
    </div>
  )
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Етапи запису">
      {STEPS.map((label, i) => (
        <li key={label} className="flex flex-col gap-2" aria-current={i === step ? "step" : undefined}>
          <span className="relative h-1 overflow-hidden rounded-full bg-muted">
            <motion.span
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
              initial={false}
              animate={{ width: i <= step ? "100%" : "0%" }}
              transition={springHover}
            />
          </span>
          <span className={cn("hidden text-xs sm:block", i <= step ? "text-foreground" : "text-muted-foreground")}>
            {label}
          </span>
        </li>
      ))}
    </ol>
  )
}

function BarberStep({
  query,
  value,
  onChange,
}: {
  query: Query<BookingStaff[]>
  value: string
  onChange: (v: string) => void
}) {
  if (query.error) return <LoadError message={query.error} onRetry={query.retry} />
  if (!query.data) return <ListSkeleton rows={4} className="sm:grid-cols-2" />

  const options = [
    ...query.data,
    { id: ANY_STAFF, name: "Будь-хто", meta: "Найближчий вільний майстер", avatar: undefined },
  ]
  return (
    <FieldSet>
      <FieldLegend className="sr-only">Оберіть барбера</FieldLegend>
      <RadioGroup value={value} onValueChange={onChange} className="grid gap-3 sm:grid-cols-2">
        <motion.div className="contents" variants={stagger(0.06)} initial="hidden" animate="visible">
          {options.map((o) => (
            <motion.div key={o.id} variants={fadeInUp} whileHover={{ y: -3 }} transition={springHover}>
              <FieldLabel htmlFor={`barber-${o.id}`} className="h-full cursor-pointer">
                <Field orientation="horizontal" className="items-center">
                  {o.id === ANY_STAFF ? (
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                      <ScissorsIcon />
                    </span>
                  ) : o.avatar ? (
                    <Avatar className="size-12">
                      <AvatarImage src={o.avatar} alt="" />
                      <AvatarFallback>{o.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Skeleton className="size-12 shrink-0 rounded-full" aria-hidden />
                  )}
                  <FieldContent>
                    <FieldTitle className="text-base">{o.name}</FieldTitle>
                    <FieldDescription>{o.meta}</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value={o.id} id={`barber-${o.id}`} />
                </Field>
              </FieldLabel>
            </motion.div>
          ))}
        </motion.div>
      </RadioGroup>
    </FieldSet>
  )
}

function ServiceStep({
  query,
  value,
  onChange,
}: {
  query: Query<BookingService[]>
  value: string[]
  onChange: (v: string[]) => void
}) {
  if (query.error) return <LoadError message={query.error} onRetry={query.retry} />
  if (!query.data) return <ListSkeleton rows={6} />
  if (!query.data.length)
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>Немає доступних послуг</EmptyTitle>
          <EmptyDescription>У цього майстра зараз немає онлайн-запису. Оберіть іншого барбера.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )

  return (
    <FieldSet>
      <FieldLegend className="sr-only">Оберіть послуги</FieldLegend>
      <FieldDescription className="mb-1">Можна обрати кілька послуг — вартість порахуємо автоматично.</FieldDescription>
      <motion.div className="flex flex-col gap-3" variants={stagger(0.05)} initial="hidden" animate="visible">
        {query.data.map((s) => (
          <motion.div key={s.id} variants={fadeInUp}>
            <FieldLabel htmlFor={`service-${s.id}`} className="cursor-pointer">
              <Field orientation="horizontal">
                <Checkbox
                  id={`service-${s.id}`}
                  checked={value.includes(s.id)}
                  onCheckedChange={(c) => onChange(c ? [...value, s.id] : value.filter((v) => v !== s.id))}
                />
                <FieldContent>
                  <FieldTitle className="text-base">{s.title}</FieldTitle>
                  <FieldDescription className="flex items-center gap-1.5">
                    <ClockIcon aria-hidden className="size-3.5" />
                    {s.duration}
                  </FieldDescription>
                </FieldContent>
                <span className="font-heading text-sm font-semibold whitespace-nowrap text-primary tabular-nums">
                  {s.priceFrom === s.priceTo
                    ? formatPrice(s.priceFrom)
                    : `${formatPrice(s.priceFrom)} – ${formatPrice(s.priceTo)}`}
                </span>
              </Field>
            </FieldLabel>
          </motion.div>
        ))}
      </motion.div>
    </FieldSet>
  )
}

function DateTimeStep({
  staffId,
  serviceIds,
  date,
  slot,
  onDate,
  onSlot,
}: {
  staffId: string
  serviceIds: string[]
  date?: string
  slot?: BookingSlot
  onDate: (d?: string) => void
  onSlot: (s: BookingSlot) => void
}) {
  const params = { staff: staffId, services: serviceIds }
  const dates = useApi<string[]>(`/api/booking/dates${qs(params)}`)
  const times = useApi<BookingSlot[]>(date ? `/api/booking/times${qs({ ...params, date })}` : null)

  if (dates.error) return <LoadError message={dates.error} onRetry={dates.retry} />

  const available = new Set(dates.data ?? [])
  const sorted = [...available].sort()
  const first = sorted[0] ? parseISO(sorted[0]) : undefined
  const last = sorted.at(-1) ? parseISO(sorted.at(-1)!) : undefined

  return (
    <div className="grid gap-6 md:grid-cols-[auto_1fr]">
      <FieldSet>
        <FieldLegend variant="label">Дата</FieldLegend>
        {!dates.data ? (
          <Skeleton className="h-[19rem] w-[17.5rem] rounded-xl" aria-label="Завантаження…" />
        ) : (
          <Calendar
            mode="single"
            locale={uk}
            selected={date ? parseISO(date) : undefined}
            onSelect={(d) => onDate(d ? toDay(d) : undefined)}
            disabled={(d) => !available.has(toDay(d))}
            startMonth={first}
            endMonth={last}
            defaultMonth={date ? parseISO(date) : first}
            className="rounded-xl border [--cell-size:--spacing(9)]"
          />
        )}
        {dates.data && !available.size && (
          <FieldDescription>Найближчим часом вільних дат немає — зателефонуйте нам.</FieldDescription>
        )}
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label">Час</FieldLegend>
        {times.error ? (
          <LoadError message={times.error} onRetry={times.retry} />
        ) : !date || !times.data ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3" aria-busy={Boolean(date)}>
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-9" />
            ))}
            {!date && <FieldDescription className="col-span-full">Спершу оберіть дату.</FieldDescription>}
          </div>
        ) : times.data.length === 0 ? (
          <FieldDescription>На цей день вільних місць немає — оберіть іншу дату.</FieldDescription>
        ) : (
          <motion.div key={date} variants={stagger(0.015)} initial="hidden" animate="visible">
            <ToggleGroup
              type="single"
              variant="outline"
              spacing={2}
              value={slot?.datetime ?? ""}
              onValueChange={(v) => {
                const s = times.data?.find((t) => t.datetime === v)
                if (s) onSlot(s)
              }}
              aria-label="Вільний час"
              className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-3"
            >
              {times.data.map((s) => (
                <motion.div key={s.datetime} variants={fadeInUp} className="contents">
                  <ToggleGroupItem
                    value={s.datetime}
                    className="h-9 w-full tabular-nums data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    {s.time}
                  </ToggleGroupItem>
                </motion.div>
              ))}
            </ToggleGroup>
          </motion.div>
        )}
      </FieldSet>
    </div>
  )
}

function ContactStep({
  name,
  phone,
  nameError,
  phoneError,
  submitError,
  onName,
  onPhone,
  summary,
}: {
  name: string
  phone: string
  nameError: boolean
  phoneError: boolean
  submitError?: string
  onName: (v: string) => void
  onPhone: (v: string) => void
  summary: { barber: string; services: string; when: string }
}) {
  return (
    <motion.div className="flex flex-col gap-6" variants={stagger(0.09)} initial="hidden" animate="visible">
      <FieldGroup>
        <motion.div variants={fadeInUp}>
          <Field data-invalid={nameError || undefined}>
            <FieldLabel htmlFor="booking-name">Ім’я</FieldLabel>
            <Input
              id="booking-name"
              name="name"
              autoComplete="given-name"
              placeholder="Як до вас звертатись…"
              value={name}
              onChange={(e) => onName(e.target.value)}
              aria-invalid={nameError || undefined}
              className="h-11"
              autoFocus
            />
            {nameError && <FieldError>Вкажіть ім’я — щонайменше 2 літери.</FieldError>}
          </Field>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Field data-invalid={phoneError || undefined}>
            <FieldLabel htmlFor="booking-phone">Телефон</FieldLabel>
            <Input
              id="booking-phone"
              name="tel"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+380 00 000 00 00"
              value={phone}
              onChange={(e) => onPhone(e.target.value)}
              aria-invalid={phoneError || undefined}
              className="h-11 tabular-nums"
              spellCheck={false}
            />
            {phoneError ? (
              <FieldError>Перевірте номер: 10–13 цифр, наприклад +380 93 616 42 22.</FieldError>
            ) : (
              <FieldDescription>Надішлемо підтвердження та нагадаємо про візит.</FieldDescription>
            )}
          </Field>
        </motion.div>
      </FieldGroup>
      <motion.dl variants={fadeInUp} className="grid gap-3 rounded-xl border bg-muted/40 p-4 text-sm sm:grid-cols-3">
        <SummaryItem term="Майстер" value={summary.barber} />
        <SummaryItem term="Коли" value={summary.when} />
        <SummaryItem term="Послуги" value={summary.services} />
      </motion.dl>
      {submitError && (
        <p role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <TriangleAlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
          {submitError}
        </p>
      )}
    </motion.div>
  )
}

function SummaryItem({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{term}</dt>
      <dd className="font-medium break-words">{value}</dd>
    </div>
  )
}

function Success({
  staffName,
  slot,
  total,
  demo,
}: {
  staffName: string
  slot?: BookingSlot
  total: string
  demo: boolean
}) {
  return (
    <motion.div
      className="flex flex-col items-center gap-5 px-6 py-12 text-center"
      variants={stagger(0.1)}
      initial="hidden"
      animate="visible"
    >
      <motion.span
        variants={fadeInUp}
        className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <CheckIcon className="size-8" />
      </motion.span>
      <motion.div variants={fadeInUp} className="flex flex-col gap-2">
        <DialogTitle className="font-heading text-2xl font-semibold uppercase">
          {demo ? "Демо-запис готовий" : "Ви записані"}
        </DialogTitle>
        <DialogDescription className="text-base text-balance">
          {staffName}
          {slot ? ` чекає на вас ${formatSlot(slot)}.` : "."}
          {total && ` Орієнтовна вартість: ${total}.`}
          {demo && " Це демонстрація — запис нікуди не надіслано."}
        </DialogDescription>
      </motion.div>
      <motion.p variants={fadeInUp} className="text-sm text-muted-foreground">
        {contacts.address} · {contacts.hours}
      </motion.p>
      <motion.div variants={fadeInUp}>
        <DialogClose asChild>
          <Button size="lg" className="px-6">
            Чудово
          </Button>
        </DialogClose>
      </motion.div>
    </motion.div>
  )
}
