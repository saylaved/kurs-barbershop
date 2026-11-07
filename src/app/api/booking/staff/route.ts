import type { NextRequest } from "next/server"

import { getStaff } from "@/lib/altegio"
import { list, respond } from "../_respond"

export async function GET(req: NextRequest) {
  return respond(() => getStaff(list(req.nextUrl.searchParams, "services")))
}
