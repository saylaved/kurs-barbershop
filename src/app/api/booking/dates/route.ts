import type { NextRequest } from "next/server"

import { getDates } from "@/lib/altegio"
import { list, respond } from "../_respond"

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  return respond(() => getDates(p.get("staff") ?? "", list(p, "services")))
}
