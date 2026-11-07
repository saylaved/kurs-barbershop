import { connection } from "next/server"

import { BookingError, mode } from "@/lib/altegio"

const noStore = { "Cache-Control": "no-store" }

export async function respond<T>(work: () => Promise<T>) {
  await connection()
  try {
    const data = await work()
    return Response.json({ mode, data }, { headers: noStore })
  } catch (e) {
    const err = e instanceof BookingError ? e : new BookingError("Щось пішло не так. Спробуйте ще раз.", 500)
    if (!(e instanceof BookingError)) console.error(e)
    return Response.json({ mode, error: err.message }, { status: err.status, headers: noStore })
  }
}

export function list(params: URLSearchParams, key: string) {
  return params
    .getAll(key)
    .flatMap((v) => v.split(","))
    .map((v) => v.trim())
    .filter(Boolean)
}
