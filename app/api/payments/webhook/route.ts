import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createHmac } from "crypto"

export async function POST(req: Request) {
  const timestamp = req.headers.get("BinancePay-Timestamp") || req.headers.get("binancepay-timestamp")
  const nonce = req.headers.get("BinancePay-Nonce") || req.headers.get("binancepay-nonce")
  const signature = req.headers.get("BinancePay-Signature") || req.headers.get("binancepay-signature")

  if (!timestamp || !nonce || !signature) {
    return NextResponse.json({ error: "Missing headers" }, { status: 400 })
  }

  const body = await req.text()
  const payload = `${timestamp}\n${nonce}\n${body}\n`
  const expected = createHmac("sha512", process.env.BINANCE_SECRET_KEY!)
    .update(payload)
    .digest("hex")
    .toUpperCase()

  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let event: any
  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  // Only handle TRADE_SUCCESS events
  if (event.bizType !== "PAY" || event.bizStatus !== "PAY_SUCCESS") {
    return NextResponse.json({ returnCode: "SUCCESS", returnMessage: "skipped" })
  }

  const merchantTradeNo: string = event.data?.merchantTradeNo || ""

  // merchantTradeNo format: BF-{seed_id_first8}-{timestamp}
  // Find the seed by matching the prefix
  const parts = merchantTradeNo.split("-")
  if (parts.length < 2) return NextResponse.json({ returnCode: "SUCCESS", returnMessage: "no seed" })

  const seedPrefix = parts[1] // first 8 chars of seed_id

  const { data: seeds } = await supabase
    .from("seeds")
    .select("id")
    .ilike("id", `${seedPrefix}%`)
    .limit(1)

  const seed = seeds?.[0]
  if (!seed) return NextResponse.json({ returnCode: "SUCCESS", returnMessage: "seed not found" })

  await supabase
    .from("seeds")
    .update({ paid: true, payment_method: "binance" })
    .eq("id", seed.id)

  // Binance expects this exact response to acknowledge the webhook
  return NextResponse.json({ returnCode: "SUCCESS", returnMessage: null })
}
