import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"

async function getPayPalToken(): Promise<string> {
  const res = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  })
  const data = await res.json()
  return data.access_token
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const raw = cookieStore.get("bf_user")?.value
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = JSON.parse(raw)

  const { payment_id, payment_method, seed_id } = await req.json()
  if (!payment_id || !payment_method || !seed_id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  // Verify the seed belongs to this user
  const { data: seed } = await supabase
    .from("seeds")
    .select("id, paid")
    .eq("id", seed_id)
    .eq("originator_id", session.id)
    .single()

  if (!seed) return NextResponse.json({ error: "Seed not found" }, { status: 404 })
  if (seed.paid) return NextResponse.json({ success: true, already_paid: true })

  // --- PayPal verification ---
  if (payment_method === "paypal") {
    const token = await getPayPalToken()

    // Capture the order (idempotent — safe to call if already captured)
    const captureRes = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${payment_id}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const captureData = await captureRes.json()

    const status = captureData.status
    if (status !== "COMPLETED") {
      return NextResponse.json({ error: `PayPal order not completed: ${status}` }, { status: 402 })
    }

    // Confirm the purchase unit references our seed
    const refId = captureData.purchase_units?.[0]?.reference_id
    if (refId && refId !== seed_id) {
      return NextResponse.json({ error: "Order seed mismatch" }, { status: 400 })
    }
  }

  // --- Binance Pay verification ---
  if (payment_method === "binance") {
    // payment_id here is the prepayId or merchantTradeNo
    const { createHmac, randomBytes } = await import("crypto")
    const timestamp = Date.now()
    const nonce = randomBytes(16).toString("hex").toUpperCase()
    const body = { merchantTradeNo: payment_id }
    const bodyStr = JSON.stringify(body)
    const payload = `${timestamp}\n${nonce}\n${bodyStr}\n`
    const signature = createHmac("sha512", process.env.BINANCE_SECRET_KEY!)
      .update(payload)
      .digest("hex")
      .toUpperCase()

    const res = await fetch("https://bpay.binanceapi.com/binancepay/openapi/v2/order/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "BinancePay-Timestamp": String(timestamp),
        "BinancePay-Nonce": nonce,
        "BinancePay-Certificate-SN": process.env.BINANCE_API_KEY!,
        "BinancePay-Signature": signature,
      },
      body: bodyStr,
    })

    const data = await res.json()
    if (data.status !== "SUCCESS" || data.data?.status !== "PAID") {
      return NextResponse.json({ paid: false })
    }
  }

  // Mark seed as paid
  await supabase
    .from("seeds")
    .update({ paid: true, payment_method })
    .eq("id", seed_id)

  return NextResponse.json({ success: true })
}
