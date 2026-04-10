"use client"

import { useEffect, useRef, useState } from "react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"

type Props = {
  seedId: string
  onSuccess: () => void
  onCancel: () => void
}

function BinancePay({ seedId, onSuccess }: { seedId: string; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [polling, setPolling] = useState(false)
  const [error, setError] = useState("")
  const [tradeNo, setTradeNo] = useState("")
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function startBinance() {
    setLoading(true)
    setError("")
    const res = await fetch("/api/payments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed_id: seedId, method: "binance" }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || "Failed to create order"); setLoading(false); return }

    setTradeNo(data.merchant_trade_no)
    window.open(data.checkout_url, "_blank", "noopener")
    setLoading(false)
    setPolling(true)
  }

  useEffect(() => {
    if (!polling || !tradeNo) return

    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/payments/status?seed_id=${seedId}`)
      const data = await res.json()
      if (data.paid) {
        clearInterval(pollRef.current!)
        setPolling(false)
        onSuccess()
      }
    }, 3000)

    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [polling, tradeNo, seedId, onSuccess])

  return (
    <div>
      <button
        onClick={startBinance}
        disabled={loading || polling}
        style={{
          width: "100%",
          background: polling ? "rgba(14,12,9,0.06)" : "var(--ink)",
          color: polling ? "rgba(14,12,9,0.5)" : "var(--paper)",
          border: polling ? "1px solid rgba(14,12,9,0.15)" : "none",
          fontFamily: "var(--font-sans)",
          fontSize: "11px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontWeight: 600,
          padding: "14px 24px",
          cursor: loading || polling ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {/* Binance logo mark */}
        <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
          <path d="M16 4l3.1 3.1L11.2 15l-3.1-3.1L16 4zM4 16l3.1-3.1 3.1 3.1-3.1 3.1L4 16zM16 28l-3.1-3.1 7.9-7.9 3.1 3.1L16 28zM28 16l-3.1 3.1-3.1-3.1 3.1-3.1L28 16zM16 12.9l3.1 3.1-3.1 3.1-3.1-3.1L16 12.9z"/>
        </svg>
        {loading ? "Opening Binance Pay…" : polling ? "Waiting for payment…" : "Pay with Binance Pay"}
      </button>
      {polling && (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(14,12,9,0.65)", marginTop: "10px", textAlign: "center" }}>
          Complete payment in the Binance tab. This page will update automatically.
        </p>
      )}
      {error && (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--red)", marginTop: "8px" }}>{error}</p>
      )}
    </div>
  )
}

export function PaymentGate({ seedId, onSuccess, onCancel }: Props) {
  const [paypalError, setPaypalError] = useState("")

  async function createPayPalOrder() {
    const res = await fetch("/api/payments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed_id: seedId, method: "paypal" }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Failed to create order")
    return data.order_id
  }

  async function onPayPalApprove(data: { orderID: string }) {
    const res = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_id: data.orderID, payment_method: "paypal", seed_id: seedId }),
    })
    const json = await res.json()
    if (json.success || json.already_paid) {
      onSuccess()
    } else {
      setPaypalError(json.error || "Payment verification failed")
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(14,12,9,0.65)",
      zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
    }}>
      <div style={{
        background: "var(--paper)", border: "1px solid rgba(14,12,9,0.12)",
        width: "100%", maxWidth: "560px",
      }}>
        {/* Header */}
        <div style={{ padding: "28px 32px", borderBottom: "1px solid rgba(14,12,9,0.08)" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--red)", fontWeight: 600, marginBottom: "8px" }}>
            Seed fee
          </p>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "8px" }}>
            Float this seed — $5
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "rgba(14,12,9,0.55)", lineHeight: 1.7 }}>
            Your first seed is free. Each additional seed requires a one-time fee. Choose your payment method.
          </p>
        </div>

        {/* Payment options */}
        <div style={{ padding: "28px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

            {/* PayPal */}
            <div style={{ borderTop: "2px solid var(--ink)", paddingTop: "16px" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(14,12,9,0.55)", fontWeight: 600, marginBottom: "16px" }}>
                PayPal
              </p>
              <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, currency: "USD" }}>
                <PayPalButtons
                  style={{ layout: "vertical", color: "black", shape: "rect", label: "pay", height: 44 }}
                  createOrder={createPayPalOrder}
                  onApprove={onPayPalApprove}
                  onError={() => setPaypalError("PayPal error. Please try again.")}
                />
              </PayPalScriptProvider>
              {paypalError && (
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--red)", marginTop: "8px" }}>{paypalError}</p>
              )}
            </div>

            {/* Binance Pay */}
            <div style={{ borderTop: "2px solid var(--ink)", paddingTop: "16px" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(14,12,9,0.55)", fontWeight: 600, marginBottom: "16px" }}>
                Crypto (USDT)
              </p>
              <BinancePay seedId={seedId} onSuccess={onSuccess} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 32px 28px", display: "flex", justifyContent: "flex-start" }}>
          <button
            onClick={onCancel}
            style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: "rgba(14,12,9,0.4)", background: "transparent", border: "none", cursor: "pointer", padding: "4px 0" }}
          >
            ← Cancel and go back
          </button>
        </div>
      </div>
    </div>
  )
}
