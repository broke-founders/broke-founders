"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Conversation = {
  partner: { id: string; username: string; avatar_url: string; name: string } | null
  latest: { content: string; created_at: string; sender_id: string; read: boolean }
  unread: number
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/direct-messages")
      .then(r => r.json())
      .then(d => {
        setConversations(d.conversations || [])
        setLoading(false)
      })
  }, [])

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 48px", borderBottom: "1px solid rgba(14,12,9,0.08)", position: "sticky", top: 0, background: "rgba(245,241,234,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <Link href="/seeds" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(14,12,9,0.72)", textDecoration: "none", fontWeight: 600 }}>← Seeds</Link>
        <Link href="/dashboard" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(14,12,9,0.72)", textDecoration: "none", fontWeight: 600 }}>Dashboard</Link>
      </nav>

      <section style={{ padding: "72px 48px 100px", maxWidth: "640px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px,6vw,64px)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "48px" }}>Messages</h1>

        {loading && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(14,12,9,0.6)" }}>Loading…</p>
        )}

        {!loading && conversations.length === 0 && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "rgba(14,12,9,0.65)", lineHeight: 1.8 }}>
            No conversations yet. Visit a builder's profile to send a message.
          </p>
        )}

        {!loading && conversations.length > 0 && (
          <div style={{ borderTop: "1px solid rgba(14,12,9,0.08)" }}>
            {conversations.map((c, i) => (
              <Link key={i} href={`/messages/${c.partner?.username}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <div style={{ padding: "20px 0", borderBottom: "1px solid rgba(14,12,9,0.07)", display: "flex", alignItems: "center", gap: "14px" }}>
                  {c.partner?.avatar_url
                    ? <img src={c.partner.avatar_url} alt="" width={40} height={40} style={{ borderRadius: "50%", flexShrink: 0 }} />
                    : <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(14,12,9,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 700, color: "rgba(14,12,9,0.7)", flexShrink: 0 }}>{c.partner?.username?.[0]?.toUpperCase() || "?"}</div>
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: c.unread > 0 ? 700 : 500, color: "rgba(14,12,9,0.9)" }}>@{c.partner?.username}</span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(14,12,9,0.55)", flexShrink: 0, marginLeft: "12px" }}>
                        {new Date(c.latest.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: c.unread > 0 ? "rgba(14,12,9,0.75)" : "rgba(14,12,9,0.4)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.latest.content}
                    </p>
                  </div>
                  {c.unread > 0 && (
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 700, color: "var(--paper)", background: "var(--red)", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {c.unread}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
