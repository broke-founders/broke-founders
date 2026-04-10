"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Message = {
  id: string
  content: string
  created_at: string
  seed_id: string | null
  users: { username: string; avatar_url: string; name: string } | null
}

export function Chat({ seedId, title, hasSigned = true }: { seedId?: string; title?: string; hasSigned?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/messages${seedId ? `?seed_id=${seedId}` : ""}`)
      .then(r => r.json())
      .then(data => {
        setMessages(data.messages || [])
        setLoading(false)
      })
  }, [seedId])

  useEffect(() => {
    const channel = supabase
      .channel(seedId ? `seed-${seedId}` : "global")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: seedId ? `seed_id=eq.${seedId}` : "seed_id=is.null",
      }, async (payload) => {
        const { data } = await supabase
          .from("messages")
          .select("*, users(username, avatar_url, name)")
          .eq("id", payload.new.id)
          .single()
        if (data) setMessages(prev => [...prev, data])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [seedId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function send() {
    if (!input.trim() || sending) return
    setSending(true)
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input, seed_id: seedId || null })
    })
    setInput("")
    setSending(false)
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  if (hasSigned === false) return (
    <div style={{border:"1px solid rgba(14,12,9,0.1)",padding:"32px",textAlign:"center",height:"180px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <p style={{fontFamily:"var(--font-sans)",fontSize:"12px",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(14,12,9,0.65)",fontWeight:600,marginBottom:"8px"}}>Chat locked</p>
      <p style={{fontFamily:"var(--font-sans)",fontSize:"14px",color:"rgba(14,12,9,0.6)",margin:0}}>Sign the agreement to unlock the workspace.</p>
    </div>
  )

  return (
    <div style={{display:"flex",flexDirection:"column",height:"520px",border:"1px solid rgba(14,12,9,0.1)",background:"var(--paper)",maxWidth:"100%",minWidth:0}}>

      {/* Header */}
      <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(14,12,9,0.1)",display:"flex",alignItems:"center",gap:"10px"}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:"rgba(61,186,122,0.8)"}}></div>
        <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(14,12,9,0.6)",fontWeight:600}}>
          {title || "Global feed"}
        </span>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"20px",display:"flex",flexDirection:"column",gap:"16px"}}>
        {loading && (
          <p style={{fontFamily:"var(--font-sans)",fontSize:"12px",color:"rgba(14,12,9,0.55)",textAlign:"center"}}>Loading...</p>
        )}
        {!loading && messages.length === 0 && (
          <p style={{fontFamily:"var(--font-sans)",fontSize:"13px",color:"rgba(14,12,9,0.55)",textAlign:"center",marginTop:"40px"}}>
            No messages yet. Start the conversation.
          </p>
        )}
        {messages.map(msg => (
          <div key={msg.id} style={{display:"flex",gap:"10px",alignItems:"flex-start"}}>
            {msg.users?.avatar_url
              ? <img src={msg.users.avatar_url} alt="" width={28} height={28} style={{borderRadius:"50%",flexShrink:0,marginTop:2}}/>
              : <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(14,12,9,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-sans)",fontSize:"11px",fontWeight:700,color:"rgba(14,12,9,0.7)",flexShrink:0,marginTop:2}}>{msg.users?.username?.[0]?.toUpperCase()||"?"}</div>
            }
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"baseline",gap:"8px",marginBottom:"4px"}}>
                <span style={{fontFamily:"var(--font-sans)",fontSize:"12px",fontWeight:700,color:"rgba(14,12,9,0.85)"}}>@{msg.users?.username||"unknown"}</span>
                <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",color:"rgba(14,12,9,0.55)"}}>
                  {new Date(msg.created_at).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}
                </span>
              </div>
              <p style={{fontFamily:"var(--font-sans)",fontSize:"14px",lineHeight:1.7,color:"rgba(14,12,9,0.8)",margin:0,wordBreak:"break-word"}}>{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{padding:"16px 20px",borderTop:"1px solid rgba(14,12,9,0.1)",display:"flex",gap:"8px",flexWrap:"wrap"}}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Say something... (Enter to send)"
          style={{flex:1,background:"transparent",border:"1px solid rgba(14,12,9,0.15)",fontFamily:"var(--font-sans)",fontSize:"14px",padding:"10px 14px",outline:"none",color:"var(--ink)"}}
        />
        <button
          onClick={send}
          disabled={!input.trim()||sending}
          style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background:input.trim()?"var(--ink)":"rgba(14,12,9,0.2)",border:"none",padding:"10px 20px",cursor:input.trim()?"pointer":"not-allowed"}}>
          Send
        </button>
      </div>
    </div>
  )
}