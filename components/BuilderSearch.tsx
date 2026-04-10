"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

type Builder = {
  id: string
  username: string
  name: string
  avatar_url: string | null
  score: number
  level: { title: string; color: string }
  topSkill: string | null
  skills: string[]
  seedsCount: number
}

export function BuilderSearch({ builders }: { builders: Builder[] }) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return builders
    return builders.filter(b =>
      b.username.toLowerCase().includes(q) ||
      b.name?.toLowerCase().includes(q) ||
      b.skills.some(s => s.toLowerCase().includes(q))
    )
  }, [query, builders])

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search by name or skill..."
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "transparent",
          border: "1px solid rgba(14,12,9,0.15)",
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          padding: "13px 16px",
          outline: "none",
          color: "var(--ink)",
          marginBottom: "48px",
          display: "block",
        }}
      />

      {filtered.length === 0 && (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "rgba(14,12,9,0.6)" }}>
          No builders match that search.
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1px", background: "rgba(14,12,9,0.08)" }}>
        {filtered.map(b => (
          <Link key={b.id} href={`/u/${b.username}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ background: "var(--paper)", padding: "28px 24px", transition: "background 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(14,12,9,0.025)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--paper)")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                {b.avatar_url
                  ? <img src={b.avatar_url} alt="" width={44} height={44} style={{ borderRadius: "50%", flexShrink: 0 }} />
                  : <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(14,12,9,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 700, color: "rgba(14,12,9,0.6)", flexShrink: 0 }}>{b.username?.[0]?.toUpperCase()}</div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "17px", fontWeight: 700, color: "rgba(14,12,9,0.9)", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name || b.username}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(14,12,9,0.65)" }}>@{b.username}</p>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: b.level?.color || "rgba(14,12,9,0.45)" }}>
                  {b.level?.title}
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(14,12,9,0.7)" }}>
                  {b.score} pts
                </span>
              </div>

              {b.topSkill && (
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", border: "1px solid rgba(14,12,9,0.1)", padding: "4px 10px", color: "rgba(14,12,9,0.6)", display: "inline-block", marginBottom: "12px" }}>
                  {b.topSkill}
                </p>
              )}

              <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(14,12,9,0.6)", marginTop: "4px" }}>
                {b.seedsCount} {b.seedsCount === 1 ? "seed" : "seeds"} originated
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
