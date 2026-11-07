import type { NextRequest } from "next/server"

import { getTimes } from "@/lib/altegio"
import { list, respond } from "../_respond"

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  return respond(() => getTimes(p.get("staff") ?? "", list(p, "services"), p.get("date") ?? ""))
}
