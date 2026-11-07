import { createRecord, validateBooking } from "@/lib/altegio"
import { respond } from "../_respond"

export async function POST(req: Request) {
  return respond(async () => createRecord(validateBooking(await req.json().catch(() => null))))
}
