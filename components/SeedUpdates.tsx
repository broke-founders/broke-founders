"use client"

import { useEffect, useState } from "react"

type Update = {
  id: string
  content: string
  created_at: string
  users: { username: string; avatar_url: string } | null
}

export function SeedUpdates({ seedId, isOriginator, hasSigned = true }: { seedId: string; isOriginator: boolean; hasSigned?: boolean }) {
  const [updates, setUpdates] = useState<Update[]>([])
  const [input, setInput] = useState("")
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    fetch(`/api/seed-updates?seed_id=${seedId}`)
      .then(r => r.json())
      .then(d => setUpdates(d.updates || []))
  }, [seedId])

  async function post() {
    if (!input.trim() || posting) return
    setPosting(true)
    const res = await fetch("/api/seed-updates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed_id: seedId, content: input })
    })
    const data = await res.json()
    if (data.update) {
      setUpdates(prev => [data.update, ...prev])
      setInput("")
    }
    setPosting(false)
  }

  if (hasSigned === false) return (
    <div style={{marginTop:"64px",padding:"32px",border:"1px solid rgba(14,12,9,0.1)",textAlign:"center"}}>
      <p style={{fontFamily:"var(--font-sans)",fontSize:"12px",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(14,12,9,0.65)",fontWeight:600,marginBottom:"8px"}}>Build log locked</p>
      <p style={{fontFamily:"var(--font-sans)",fontSize:"14px",color:"rgba(14,12,9,0.6)",margin:0}}>Sign the agreement to unlock the workspace.</p>
    </div>
  )

  return (
    <div style={{marginTop:"64px"}}>
      <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",marginBottom:"24px",fontWeight:600}}>
        Build log
      </p>

      {isOriginator && (
        <div style={{marginBottom:"28px",display:"flex",gap:"8px"}}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Post a progress update..."
            onKeyDown={e => e.key === "Enter" && post()}
            style={{flex:1,background:"transparent",border:"1px solid rgba(14,12,9,0.15)",fontFamily:"var(--font-sans)",fontSize:"14px",padding:"11px 14px",outline:"none",color:"var(--ink)"}}
          />
          <button
            onClick={post}
            disabled={!input.trim()||posting}
            style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background:input.trim()?"var(--ink)":"rgba(14,12,9,0.2)",border:"none",padding:"11px 20px",cursor:input.trim()?"pointer":"not-allowed"}}
          >
            {posting ? "..." : "Post"}
          </button>
        </div>
      )}

      {updates.length === 0 && (
        <p style={{fontFamily:"var(--font-sans)",fontSize:"13px",color:"rgba(14,12,9,0.6)",padding:"16px 0"}}>No updates yet.</p>
      )}

      <div style={{borderTop:"1px solid rgba(14,12,9,0.08)"}}>
        {updates.map(u => (
          <div key={u.id} style={{padding:"20px 0",borderBottom:"1px solid rgba(14,12,9,0.07)",display:"flex",gap:"12px"}}>
            {u.users?.avatar_url
              ? <img src={u.users.avatar_url} alt="" width={28} height={28} style={{borderRadius:"50%",flexShrink:0,marginTop:2}}/>
              : <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(14,12,9,0.08)",flexShrink:0,marginTop:2}}/>
            }
            <div>
              <div style={{display:"flex",gap:"10px",alignItems:"baseline",marginBottom:"6px"}}>
                <span style={{fontFamily:"var(--font-sans)",fontSize:"12px",fontWeight:700,color:"rgba(14,12,9,0.8)"}}>@{u.users?.username}</span>
                <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",color:"rgba(14,12,9,0.55)"}}>{new Date(u.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</span>
              </div>
              <p style={{fontFamily:"var(--font-sans)",fontSize:"14px",lineHeight:1.75,color:"rgba(14,12,9,0.72)",margin:0}}>{u.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
