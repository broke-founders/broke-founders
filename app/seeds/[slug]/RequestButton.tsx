"use client"

import { useState } from "react"

export function RequestButton({ nodeId, seedId }: { nodeId: string, seedId: string }) {
  const [status, setStatus] = useState<"idle"|"loading"|"done"|"error">("idle")
  const [message, setMessage] = useState("")
  const [open, setOpen] = useState(false)

  async function submit() {
    setStatus("loading")
    const res = await fetch("/api/nodes/request", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ node_id: nodeId, seed_id: seedId, message })
    })
    setStatus(res.ok ? "done" : "error")
  }

  if (status === "done") return (
    <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"var(--red)",marginTop:"12px",fontWeight:600}}>Request sent. The originator will reach out.</p>
  )

  return (
    <div style={{marginTop:"12px"}}>
      {!open ? (
        <button onClick={() => setOpen(true)} style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background:"var(--ink)",border:"none",padding:"10px 20px",cursor:"pointer"}}>
          Request this node →
        </button>
      ) : (
        <div>
          <textarea
            placeholder="Why are you the right person for this? (optional)"
            value={message}
            onChange={e => setMessage(e.target.value)}
            style={{width:"100%",maxWidth:"480px",background:"transparent",border:"1px solid rgba(14,12,9,0.12)",fontFamily:"var(--font-sans)",fontSize:"13px",padding:"10px 12px",outline:"none",resize:"none",height:"80px",marginBottom:"8px",display:"block"}}
          />
          <div style={{display:"flex",gap:"8px"}}>
            <button onClick={submit} disabled={status==="loading"} style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background:"var(--ink)",border:"none",padding:"10px 20px",cursor:"pointer"}}>
              {status==="loading" ? "Sending..." : "Send request →"}
            </button>
            <button onClick={() => setOpen(false)} style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"rgba(14,12,9,0.6)",background:"transparent",border:"1px solid rgba(14,12,9,0.12)",padding:"10px 20px",cursor:"pointer"}}>
              Cancel
            </button>
          </div>
          {status === "error" && <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"var(--red)",marginTop:"8px"}}>Something went wrong. Try again.</p>}
        </div>
      )}
    </div>
  )
}