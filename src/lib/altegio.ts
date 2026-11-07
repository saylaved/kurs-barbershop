import "server-only"

import { barbers, contacts, services as demoServices } from "@/lib/data"
import {
  ANY_STAFF,
  type BookingMode,
  type BookingRequest,
  type BookingService,
  type BookingSlot,
  type BookingStaff,
} from "@/lib/booking-types"

/**
 * Altegio online-booking client (public "book_*" endpoints, partner token only).
 * Docs: https://developer.alteg.io/api — Authorization: Bearer <partner_token>.
 *
 * Without ALTEGIO_PARTNER_TOKEN the module runs in demo mode: the same contract
 * is served from src/lib/data.ts with generated availability, and bookings are
 * not sent anywhere.
 */

const API_URL = (process.env.ALTEGIO_API_URL ?? "https://api.alteg.io/api/v1").replace(/\/$/, "")
const COMPANY_ID = process.env.ALTEGIO_COMPANY_ID ?? "368784"
const TOKEN = process.env.ALTEGIO_PARTNER_TOKEN
const TIME_ZONE = "Europe/Kyiv"

export const mode: BookingMode = TOKEN ? "live" : "demo"

export class BookingError extends Error {
  constructor(
    message: string,
    public status = 502
  ) {
    super(message)
  }
}

type AltegioEnvelope<T> = { success: boolean; data: T; meta?: { message?: string } | unknown[] }

async function altegio<T>(path: string, init?: { method?: "GET" | "POST"; query?: URLSearchParams; body?: unknown }) {
  const url = `${API_URL}/${path}${init?.query?.size ? `?${init.query}` : ""}`
  let res: Response
  try {
    res = await fetch(url, {
      method: init?.method ?? "GET",
      headers: {
        Accept: "application/vnd.api.v2+json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: init?.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    throw new BookingError("Сервіс запису тимчасово недоступний. Спробуйте ще раз або зателефонуйте нам.")
  }
  const json = (await res.json().catch(() => null)) as AltegioEnvelope<T> | null
  if (!res.ok || !json?.success) {
    const meta = json?.meta
    const message = meta && !Array.isArray(meta) && typeof meta.message === "string" ? meta.message : undefined
    console.error(`[altegio] ${init?.method ?? "GET"} ${path} → ${res.status} ${message ?? ""}`)
    throw new BookingError(
      message ?? "Не вдалося отримати дані запису. Спробуйте ще раз або зателефонуйте нам.",
      res.status === 422 ? 422 : 502
    )
  }
  return json.data
}

function staffParam(id: string) {
  return id === ANY_STAFF || id === "" ? "0" : id
}

function withServices(q: URLSearchParams, ids: string[]) {
  for (const id of ids) q.append("service_ids[]", id)
  return q
}

function formatDuration(minutes: number) {
  if (!minutes) return "—"
  if (minutes < 60) return `${minutes} хвилин`
  const h = minutes / 60
  return Number.isInteger(h) ? `${h} ${h === 1 ? "година" : "години"}` : `${String(h).replace(".", ",")} години`
}

/** "Now" in Kyiv as calendar date + minutes since midnight, independent of the server's TZ. */
function kyivNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00"
  return { date: `${get("year")}-${get("month")}-${get("day")}`, minutes: Number(get("hour")) * 60 + Number(get("minute")) }
}

// ───────────────────────────── Staff ─────────────────────────────

type AltegioStaff = {
  id: number
  name: string
  specialization?: string
  avatar?: string
  avatar_big?: string
  bookable?: boolean
  hidden?: number
}

export async function getStaff(serviceIds: string[] = []): Promise<BookingStaff[]> {
  if (mode === "demo") {
    return barbers.map((b) => ({ id: b.id, name: b.name, meta: `${b.role} · ${b.experience}` }))
  }
  const data = await altegio<AltegioStaff[]>(`book_staff/${COMPANY_ID}`, {
    query: withServices(new URLSearchParams(), serviceIds),
  })
  return data
    .filter((s) => s.bookable !== false && !s.hidden)
    .map((s) => ({
      id: String(s.id),
      name: s.name,
      meta: s.specialization ?? "Барбер",
      avatar: s.avatar_big || s.avatar || undefined,
    }))
}

// ──────────────────────────── Services ───────────────────────────

type AltegioService = {
  id: number
  title: string
  price_min?: number
  price_max?: number
  seance_length?: number
  active?: number
}

export async function getServices(staffId: string): Promise<BookingService[]> {
  if (mode === "demo") {
    return demoServices.map((s) => ({
      id: s.id,
      title: s.title,
      duration: s.duration,
      minutes: s.minutes,
      priceFrom: s.priceFrom,
      priceTo: s.priceTo,
    }))
  }
  const q = new URLSearchParams()
  if (staffParam(staffId) !== "0") q.set("staff_id", staffParam(staffId))
  const data = await altegio<{ services: AltegioService[] }>(`book_services/${COMPANY_ID}`, { query: q })
  return (data.services ?? [])
    .filter((s) => s.active !== 0)
    .map((s) => {
      const minutes = Math.round((s.seance_length ?? 0) / 60)
      const from = s.price_min ?? 0
      return {
        id: String(s.id),
        title: s.title,
        duration: formatDuration(minutes),
        minutes,
        priceFrom: from,
        priceTo: Math.max(from, s.price_max ?? from),
      }
    })
}

// ───────────────────────────── Dates ─────────────────────────────

const HORIZON_DAYS = 30

export async function getDates(staffId: string, serviceIds: string[]): Promise<string[]> {
  if (mode === "demo") {
    const start = new Date(`${kyivNow().date}T12:00:00Z`)
    return Array.from({ length: HORIZON_DAYS + 1 }, (_, i) => {
      const d = new Date(start)
      d.setUTCDate(d.getUTCDate() + i)
      return d.toISOString().slice(0, 10)
    })
  }
  const q = withServices(new URLSearchParams(), serviceIds)
  if (staffParam(staffId) !== "0") q.set("staff_id", staffParam(staffId))
  const data = await altegio<{ booking_dates?: string[] }>(`book_dates/${COMPANY_ID}`, { query: q })
  return data.booking_dates ?? []
}

// ───────────────────────────── Times ─────────────────────────────

type AltegioTime = { time: string; datetime: string; seance_length?: number }

export async function getTimes(staffId: string, serviceIds: string[], date: string): Promise<BookingSlot[]> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new BookingError("Некоректна дата.", 400)
  if (mode === "demo") return demoTimes(staffId, date)
  const data = await altegio<AltegioTime[]>(`book_times/${COMPANY_ID}/${staffParam(staffId)}/${date}`, {
    query: withServices(new URLSearchParams(), serviceIds),
  })
  return data.map((t) => ({ time: t.time, datetime: t.datetime }))
}

/** Half-hour grid in working hours with a deterministic "busy" pattern. */
function demoTimes(staffId: string, date: string): BookingSlot[] {
  const now = kyivNow()
  const seed = Number(date.slice(8, 10)) + staffId.length
  const slots: BookingSlot[] = []
  for (let h = contacts.openHour; h < contacts.closeHour; h++) {
    for (const m of [0, 30]) {
      const past = date === now.date && h * 60 + m <= now.minutes
      const busy = (h * 2 + m / 30 + seed) % 5 === 0
      if (past || busy) continue
      const time = `${String(h).padStart(2, "0")}:${m ? "30" : "00"}`
      slots.push({ time, datetime: `${date}T${time}:00` })
    }
  }
  return slots
}

// ───────────────────────────── Record ────────────────────────────

export function validateBooking(input: unknown): BookingRequest {
  const b = (input ?? {}) as Partial<BookingRequest>
  const name = typeof b.name === "string" ? b.name.trim() : ""
  const phone = typeof b.phone === "string" ? b.phone.replace(/\D/g, "") : ""
  const serviceIds = Array.isArray(b.serviceIds) ? b.serviceIds.filter((s) => typeof s === "string") : []
  if (name.length < 2 || name.length > 80) throw new BookingError("Вкажіть ім’я.", 400)
  if (phone.length < 10 || phone.length > 13) throw new BookingError("Перевірте номер телефону.", 400)
  if (!serviceIds.length) throw new BookingError("Оберіть хоча б одну послугу.", 400)
  if (typeof b.datetime !== "string" || !b.datetime) throw new BookingError("Оберіть дату й час.", 400)
  return { staffId: typeof b.staffId === "string" ? b.staffId : ANY_STAFF, serviceIds, datetime: b.datetime, name, phone }
}

export async function createRecord(req: BookingRequest): Promise<{ recordId: string | null }> {
  if (mode === "demo") return { recordId: null }
  // Ukrainian numbers entered as 0XXXXXXXXX → 380XXXXXXXXX
  const phone = req.phone.length === 10 && req.phone.startsWith("0") ? `38${req.phone}` : req.phone
  const data = await altegio<{ id: number; record_id: number }[]>(`book_record/${COMPANY_ID}`, {
    method: "POST",
    body: {
      phone,
      fullname: req.name,
      email: "",
      comment: "Запис із сайту",
      appointments: [
        {
          id: 1,
          services: req.serviceIds.map(Number),
          staff_id: Number(staffParam(req.staffId)),
          datetime: req.datetime,
        },
      ],
    },
  })
  return { recordId: data?.[0]?.record_id != null ? String(data[0].record_id) : null }
}
