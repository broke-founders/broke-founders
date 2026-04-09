"use client"

import { useState } from "react"

export function WaitlistActions({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle")

  async function sendInvite() {
    setStatus("sending")
    const res = await fetch("/api/admin/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
    setStatus(res.ok ? "sent" : "error")
  }

  if (status === "sent") return (
    <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",color:"rgba(61,186,122,0.9)",fontWeight:600}}>Sent ✓</span>
  )

  return (
    <button
      onClick={sendInvite}
      disabled={status === "sending"}
      style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background:"var(--ink)",border:"none",padding:"8px 14px",cursor:"pointer",opacity:status==="sending"?0.6:1,whiteSpace:"nowrap"}}
    >
      {status === "sending" ? "Sending..." : status === "error" ? "Retry" : "Send invite"}
    </button>
  )
}