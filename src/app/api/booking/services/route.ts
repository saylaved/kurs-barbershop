import type { NextRequest } from "next/server"

import { getServices } from "@/lib/altegio"
import { respond } from "../_respond"

export async function GET(req: NextRequest) {
  return respond(() => getServices(req.nextUrl.searchParams.get("staff") ?? ""))
}
