"use client"

import { useEffect, useState } from "react"

type Commit = {
  sha: string
  message: string
  author: string
  date: string
  url: string
}

export function CommitLog({ seedSlug }: { seedSlug: string }) {
  const [commits, setCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/seeds/${seedSlug}/commits`)
      .then(r => r.json())
      .then(d => {
        const mapped = (d.commits || []).map((c: any) => ({
          sha: (c.meta?.sha || c.id || "").slice(0, 7),
          message: (c.meta?.message || "").slice(0, 72),
          author: c.meta?.author || (c.users as any)?.username || "unknown",
          date: c.meta?.date || c.created_at,
          url: c.meta?.url || "",
        }))
        setCommits(mapped)
        setLoading(false)
      })
  }, [seedSlug])

  if (loading) return null
  if (commits.length === 0) return null

  return (
    <div style={{ marginTop: "48px" }}>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(14,12,9,0.55)", marginBottom: "20px", fontWeight: 600 }}>
        Recent commits
      </p>

      <div style={{ borderTop: "1px solid rgba(14,12,9,0.08)" }}>
        {commits.map(c => (
          <div key={c.sha} style={{ padding: "14px 0", borderBottom: "1px solid rgba(14,12,9,0.06)", display: "flex", alignItems: "baseline", gap: "12px" }}>
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.08em", color: "var(--red)", textDecoration: "none", flexShrink: 0, fontWeight: 600 }}
            >
              {c.sha}
            </a>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(14,12,9,0.75)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {c.message}
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(14,12,9,0.35)", flexShrink: 0 }}>
              {c.author} · {new Date(c.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
