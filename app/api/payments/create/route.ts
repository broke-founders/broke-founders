import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import { createHmac, randomBytes } from "crypto"

const SEED_PRICE_USD = "5.00"

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

  const { seed_id, method } = await req.json()
  if (!seed_id || !method) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  // Verify seed belongs to this user
  const { data: seed } = await supabase
    .from("seeds")
    .select("id, title")
    .eq("id", seed_id)
    .eq("originator_id", session.id)
    .single()

  if (!seed) return NextResponse.json({ error: "Seed not found" }, { status: 404 })

  // --- PayPal ---
  if (method === "paypal") {
    const token = await getPayPalToken()
    const res = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          reference_id: seed_id,
          description: `Broke Founders — ${seed.title}`,
          amount: { currency_code: "USD", value: SEED_PRICE_USD },
        }],
        application_context: {
          brand_name: "Broke Founders",
          user_action: "PAY_NOW",
        },
      }),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.message || "PayPal error" }, { status: 502 })
    return NextResponse.json({ order_id: data.id })
  }

  // --- Binance Pay ---
  if (method === "binance") {
    const timestamp = Date.now()
    const nonce = randomBytes(16).toString("hex").toUpperCase()
    const merchantTradeNo = `BF-${seed_id.slice(0, 8)}-${timestamp}`

    const body = {
      env: { terminalType: "WEB" },
      merchantTradeNo,
      orderAmount: SEED_PRICE_USD,
      currency: "USDT",
      goods: {
        goodsType: "02",
        goodsCategory: "Z000",
        referenceGoodsId: seed_id,
        goodsName: `Broke Founders — ${seed.title}`,
        goodsDetail: "Seed creation fee",
      },
      returnUrl: `${process.env.NEXT_PUBLIC_URL}/seeds/new?seed_id=${seed_id}&payment=binance`,
      cancelUrl: `${process.env.NEXT_PUBLIC_URL}/seeds/new`,
    }

    const bodyStr = JSON.stringify(body)
    const payload = `${timestamp}\n${nonce}\n${bodyStr}\n`
    const signature = createHmac("sha512", process.env.BINANCE_SECRET_KEY!)
      .update(payload)
      .digest("hex")
      .toUpperCase()

    const res = await fetch("https://bpay.binanceapi.com/binancepay/openapi/v2/order", {
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
    if (data.status !== "SUCCESS") {
      return NextResponse.json({ error: data.errorMessage || "Binance Pay error" }, { status: 502 })
    }

    return NextResponse.json({
      checkout_url: data.data.checkoutUrl,
      prepay_id: data.data.prepayId,
      merchant_trade_no: merchantTradeNo,
    })
  }

  return NextResponse.json({ error: "Unknown payment method" }, { status: 400 })
}
