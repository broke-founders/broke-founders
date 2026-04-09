"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Message = {
  id: string
  content: string
  created_at: string
  sender_id: string
  sender: { username: string; avatar_url: string } | null
}

type OtherUser = {
  id: string
  username: string
  avatar_url: string
  name: string
}

export default function ConversationPage() {
  const params = useParams()
  const username = params.username as string
  const [messages, setMessages] = useState<Message[]>([])
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null)
  const [myId, setMyId] = useState("")
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/direct-messages?with=${username}`)
      .then(r => r.json())
      .then(d => {
        setMessages(d.messages || [])
        setOtherUser(d.otherUser || null)
        setMyId(d.myId || "")
        setLoading(false)
      })
  }, [username])

  // Realtime — listen for incoming messages in this thread
  useEffect(() => {
    if (!myId || !otherUser?.id) return

    const channel = supabase
      .channel(`dm-${myId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "direct_messages",
        filter: `receiver_id=eq.${myId}`,
      }, async (payload) => {
        if (payload.new.sender_id !== otherUser.id) return
        const { data } = await supabase
          .from("direct_messages")
          .select("*, sender:users!sender_id(username, avatar_url)")
          .eq("id", payload.new.id)
          .single()
        if (data) setMessages(prev => [...prev, data as Message])
        await supabase.from("direct_messages").update({ read: true }).eq("id", payload.new.id)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [myId, otherUser?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function send() {
    if (!input.trim() || sending) return
    setSending(true)
    const res = await fetch("/api/direct-messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: username, content: input }),
    })
    const data = await res.json()
    if (data.message) {
      setMessages(prev => [...prev, data.message as Message])
      setInput("")
    }
    setSending(false)
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 48px", borderBottom: "1px solid rgba(14,12,9,0.08)", position: "sticky", top: 0, background: "rgba(245,241,234,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <Link href="/messages" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(14,12,9,0.72)", textDecoration: "none", fontWeight: 600 }}>← Messages</Link>
        {otherUser && (
          <Link href={`/u/${otherUser.username}`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            {otherUser.avatar_url
              ? <img src={otherUser.avatar_url} alt="" width={28} height={28} style={{ borderRadius: "50%" }} />
              : <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(14,12,9,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 700, color: "rgba(14,12,9,0.5)" }}>{otherUser.username?.[0]?.toUpperCase()}</div>
            }
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "rgba(14,12,9,0.85)" }}>@{otherUser.username}</span>
          </Link>
        )}
        <div style={{ width: 80 }} />
      </nav>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 48px", maxWidth: "720px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        {loading && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(14,12,9,0.4)", textAlign: "center", marginTop: "40px" }}>Loading…</p>
        )}
        {!loading && messages.length === 0 && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "rgba(14,12,9,0.4)", textAlign: "center", marginTop: "60px", lineHeight: 1.8 }}>
            No messages yet. Send the first one.
          </p>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_id === myId
          return (
            <div key={msg.id} style={{ display: "flex", gap: "10px", alignItems: "flex-start", flexDirection: isMe ? "row-reverse" : "row" }}>
              {!isMe && (
                msg.sender?.avatar_url
                  ? <img src={msg.sender.avatar_url} alt="" width={28} height={28} style={{ borderRadius: "50%", flexShrink: 0, marginTop: 2 }} />
                  : <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(14,12,9,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 700, color: "rgba(14,12,9,0.5)", flexShrink: 0, marginTop: 2 }}>{msg.sender?.username?.[0]?.toUpperCase() || "?"}</div>
              )}
              <div style={{ maxWidth: "68%" }}>
                <div style={{ padding: "12px 16px", background: isMe ? "var(--ink)" : "rgba(14,12,9,0.06)" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", lineHeight: 1.7, margin: 0, wordBreak: "break-word", color: isMe ? "var(--paper)" : "rgba(14,12,9,0.85)" }}>{msg.content}</p>
                </div>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "rgba(14,12,9,0.3)", display: "block", marginTop: "4px", textAlign: isMe ? "right" : "left" }}>
                  {new Date(msg.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: "1px solid rgba(14,12,9,0.08)", padding: "16px 48px", background: "rgba(245,241,234,0.95)", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", gap: "8px" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Send a message…"
            style={{ flex: 1, background: "transparent", border: "1px solid rgba(14,12,9,0.15)", fontFamily: "var(--font-sans)", fontSize: "14px", padding: "12px 16px", outline: "none", color: "var(--ink)" }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || sending}
            style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: "var(--paper)", background: input.trim() ? "var(--ink)" : "rgba(14,12,9,0.2)", border: "none", padding: "12px 24px", cursor: input.trim() ? "pointer" : "not-allowed" }}
          >
            {sending ? "…" : "Send"}
          </button>
        </div>
      </div>
    </main>
  )
}
