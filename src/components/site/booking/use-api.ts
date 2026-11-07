"use client"

import * as React from "react"

import type { ApiResult, BookingMode } from "@/lib/booking-types"

type State<T> = { key: string; data?: T; error?: string; mode?: BookingMode }

/**
 * Minimal GET hook for the booking API. `url === null` skips the request.
 * Loading is derived (state belongs to a different URL) so no setState runs
 * synchronously inside the effect.
 */
export function useApi<T>(url: string | null) {
  const [nonce, setNonce] = React.useState(0)
  const key = url ? `${url}#${nonce}` : ""
  const [state, setState] = React.useState<State<T>>({ key: "" })

  React.useEffect(() => {
    if (!url) return
    const ctrl = new AbortController()
    fetch(url, { signal: ctrl.signal, cache: "no-store" })
      .then(async (res) => {
        const json = (await res.json()) as ApiResult<T>
        if ("error" in json) setState({ key, error: json.error, mode: json.mode })
        else setState({ key, data: json.data, mode: json.mode })
      })
      .catch((e: unknown) => {
        if ((e as Error)?.name === "AbortError") return
        setState({ key, error: "Немає з’єднання. Перевірте інтернет і спробуйте ще раз." })
      })
    return () => ctrl.abort()
  }, [url, key])

  const current = state.key === key && key !== ""
  return {
    data: current ? state.data : undefined,
    error: current ? state.error : undefined,
    mode: state.mode,
    loading: Boolean(url) && !current,
    retry: () => setNonce((n) => n + 1),
  }
}

export function qs(params: Record<string, string | string[] | undefined>) {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) {
      if (v.length) q.set(k, v.join(","))
    } else if (v) q.set(k, v)
  }
  const s = q.toString()
  return s ? `?${s}` : ""
}
