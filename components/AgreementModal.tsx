"use client"

import { useEffect, useState } from "react"

type AgreementData = {
  available: boolean
  text: string
  contentHash: string
  signers: { user_id: string; signed_at: string }[]
  currentUserSigned: boolean
  isContributor: boolean
}

export function AgreementModal({ seedSlug, onClose }: { seedSlug: string; onClose: () => void }) {
  const [data, setData] = useState<AgreementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(false)
  const [error, setError] = useState("")

  async function load() {
    const res = await fetch(`/api/seeds/${seedSlug}/agreement`)
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  useEffect(() => { load() }, [seedSlug])

  async function sign() {
    if (!data) return
    setSigning(true)
    setError("")
    const res = await fetch(`/api/seeds/${seedSlug}/agreement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content_hash: data.contentHash }),
    })
    if (res.ok) {
      setLoading(true)
      await load()
    } else {
      const j = await res.json()
      setError(j.error || "Failed to sign")
    }
    setSigning(false)
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: "fixed", inset: 0, background: "rgba(14,12,9,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
    >
      <div style={{ background: "var(--paper)", border: "1px solid rgba(14,12,9,0.12)", width: "100%", maxWidth: "640px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 28px", borderBottom: "1px solid rgba(14,12,9,0.08)" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>Seed Agreement</h2>
          <button
            onClick={onClose}
            style={{ fontFamily: "var(--font-sans)", fontSize: "18px", background: "transparent", border: "none", color: "rgba(14,12,9,0.4)", cursor: "pointer", lineHeight: 1, padding: "4px" }}
          >×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          {loading && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(14,12,9,0.45)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Loading…</p>
          )}

          {!loading && data && !data.available && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "rgba(14,12,9,0.6)", lineHeight: 1.8 }}>
              The agreement is not available yet — all nodes must be filled before it can be signed.
            </p>
          )}

          {!loading && data?.available && (
            <>
              {/* Agreement text */}
              <pre style={{ fontFamily: "var(--font-sans)", fontSize: "13px", lineHeight: 1.85, color: "rgba(14,12,9,0.75)", whiteSpace: "pre-wrap", background: "rgba(14,12,9,0.03)", padding: "20px", marginBottom: "28px", overflowX: "hidden" }}>
                {data.text}
              </pre>

              {/* Signers */}
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(14,12,9,0.55)", fontWeight: 600, marginBottom: "12px" }}>
                  Signatures — {data.signers.length} signed
                </p>
                {data.signers.length === 0 && (
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(14,12,9,0.4)" }}>No signatures yet.</p>
                )}
                {data.signers.map(s => (
                  <div key={s.user_id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: "1px solid rgba(14,12,9,0.06)" }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(61,186,122,1)", fontWeight: 600 }}>✓</span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(14,12,9,0.55)", fontStyle: "italic" }}>
                      Signed {new Date(s.signed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Hash */}
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "rgba(14,12,9,0.3)", letterSpacing: "0.05em", wordBreak: "break-all" }}>
                Content hash: {data.contentHash}
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && data?.available && (
          <div style={{ padding: "20px 28px", borderTop: "1px solid rgba(14,12,9,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            {error && <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--red)" }}>{error}</span>}

            {!data.isContributor && !error && (
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(14,12,9,0.45)" }}>You are not a contributor on this seed.</span>
            )}

            {data.isContributor && data.currentUserSigned && !error && (
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(61,186,122,0.9)", fontWeight: 600 }}>✓ You have signed this agreement</span>
            )}

            <div style={{ display: "flex", gap: "12px", marginLeft: "auto" }}>
              <button onClick={onClose} className="btn btn-ghost" style={{ padding: "12px 0" }}>Close</button>
              {data.isContributor && !data.currentUserSigned && (
                <button
                  onClick={sign}
                  disabled={signing}
                  className="btn btn-primary"
                  style={{ opacity: signing ? 0.6 : 1 }}
                >
                  {signing ? "Signing…" : "Sign Agreement"}
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && (!data || !data.available) && (
          <div style={{ padding: "20px 28px", borderTop: "1px solid rgba(14,12,9,0.08)", display: "flex", justifyContent: "flex-end" }}>
            <button onClick={onClose} className="btn btn-ghost" style={{ padding: "12px 0" }}>Close</button>
          </div>
        )}
      </div>
    </div>
  )
}
