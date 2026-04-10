"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function ApproveReject({ requestId }: { requestId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function act(action: "approved" | "rejected") {
    setLoading(true)
    await fetch("/api/nodes/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: requestId, action })
    })
    router.refresh()
  }

  return (
    <div style={{display:"flex",gap:"8px"}}>
      <button onClick={() => act("approved")} disabled={loading} style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background:"var(--ink)",border:"none",padding:"8px 16px",cursor:"pointer"}}>
        Approve
      </button>
      <button onClick={() => act("rejected")} disabled={loading} style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"rgba(14,12,9,0.7)",background:"transparent",border:"1px solid rgba(14,12,9,0.12)",padding:"8px 16px",cursor:"pointer"}}>
        Reject
      </button>
    </div>
  )
}