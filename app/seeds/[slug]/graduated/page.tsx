"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function GraduatedPage() {
  const params = useParams()
  const slug = params.slug as string
  const [seed, setSeed] = useState<any>(null)
  const [nodes, setNodes] = useState<any[]>([])
  const [contributors, setContributors] = useState<Record<string, any>>({})
  const [originator, setOriginator] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/seeds/${slug}`)
      .then(r => r.json())
      .then(async data => {
        const s = data.seed
        const n = data.nodes || []
        setSeed(s)
        setNodes(n)
        setOriginator(s.users)

        // Fetch contributor user details for each active node
        const ids = n.filter((nd: any) => nd.contributor_id).map((nd: any) => nd.contributor_id)
        if (ids.length) {
          const res = await fetch(`/api/builders/batch?ids=${ids.join(",")}`)
          if (res.ok) {
            const d = await res.json()
            setContributors(d.users || {})
          }
        }
        setLoading(false)
      })
  }, [slug])

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "#0E0C09", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,241,234,0.3)" }}>Loading…</span>
    </main>
  )

  if (!seed || seed.stage !== "grove") return (
    <main style={{ minHeight: "100vh", background: "#0E0C09", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "rgba(245,241,234,0.4)", marginBottom: "20px" }}>
          This seed has not graduated yet.
        </p>
        <Link href={`/seeds/${slug}`} style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,241,234,0.5)", textDecoration: "none", fontWeight: 600 }}>
          ← Back to seed
        </Link>
      </div>
    </main>
  )

  const totalNodeSlices = nodes.reduce((s: number, n: any) => s + n.slice, 0)

  return (
    <main style={{ minHeight: "100vh", background: "#0E0C09", color: "#F5F1EA" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 48px", borderBottom: "1px solid rgba(245,241,234,0.07)", position: "sticky", top: 0, background: "rgba(14,12,9,0.9)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <Link href={`/seeds/${slug}`} style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,241,234,0.45)", textDecoration: "none", fontWeight: 600 }}>← Seed</Link>
        <Link href="/seeds" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,241,234,0.45)", textDecoration: "none", fontWeight: 600 }}>Seeds</Link>
      </nav>

      <section style={{ padding: "80px 48px 120px", maxWidth: "880px" }}>

        {/* Badge */}
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C0392B", fontWeight: 700, marginBottom: "20px" }}>
          Graduated · Grove
        </p>

        {/* Title */}
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(48px,8vw,96px)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: "32px", color: "#F5F1EA" }}>
          {seed.title}
        </h1>

        {/* Problem */}
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "18px", lineHeight: 1.85, color: "rgba(245,241,234,0.5)", maxWidth: "580px", marginBottom: "72px" }}>
          {seed.problem.split("\n")[0]}
        </p>

        {/* Graduation threshold */}
        {seed.graduation_threshold && (
          <div style={{ marginBottom: "72px", paddingBottom: "72px", borderBottom: "1px solid rgba(245,241,234,0.07)" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,241,234,0.3)", fontWeight: 600, marginBottom: "12px" }}>Graduated when</p>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 700, color: "#F5F1EA", lineHeight: 1.2 }}>{seed.graduation_threshold}</p>
          </div>
        )}

        {/* Equity bar */}
        <div style={{ marginBottom: "72px" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,241,234,0.3)", fontWeight: 600, marginBottom: "16px" }}>Equity breakdown</p>
          <div style={{ height: "8px", background: "rgba(245,241,234,0.06)", display: "flex", overflow: "hidden", marginBottom: "12px" }}>
            <div style={{ height: "100%", width: `${seed.originator_stake}%`, background: "#F5F1EA" }} />
            <div style={{ height: "100%", width: `${totalNodeSlices}%`, background: "rgba(245,241,234,0.3)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(245,241,234,0.4)" }}>
            <span>Originator: <strong style={{ color: "#F5F1EA" }}>{seed.originator_stake}%</strong></span>
            <span>Nodes: <strong style={{ color: "#F5F1EA" }}>{totalNodeSlices}%</strong></span>
            <span>Unallocated: <strong style={{ color: "#F5F1EA" }}>{100 - seed.originator_stake - totalNodeSlices}%</strong></span>
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: "72px" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,241,234,0.3)", fontWeight: 600, marginBottom: "32px" }}>
            The team — {1 + nodes.filter((n: any) => n.contributor_id).length} members
          </p>

          <div style={{ borderTop: "1px solid rgba(245,241,234,0.07)" }}>
            {/* Originator */}
            <div style={{ padding: "28px 0", borderBottom: "1px solid rgba(245,241,234,0.07)", display: "flex", alignItems: "center", gap: "16px" }}>
              {originator?.github_avatar || seed.users?.avatar_url
                ? <img src={originator?.github_avatar || seed.users?.avatar_url} alt="" width={44} height={44} style={{ borderRadius: "50%", flexShrink: 0 }} />
                : <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(245,241,234,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 700, color: "rgba(245,241,234,0.4)", flexShrink: 0 }}>{originator?.github_username?.[0]?.toUpperCase() || "?"}</div>
              }
              <div style={{ flex: 1 }}>
                <Link href={`/u/${originator?.github_username}`} style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 700, color: "#F5F1EA", textDecoration: "none", display: "block", marginBottom: "3px" }}>@{originator?.github_username}</Link>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(245,241,234,0.35)" }}>Originator</span>
              </div>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 700, color: "#C0392B" }}>{seed.originator_stake}%</span>
            </div>

            {/* Contributors */}
            {nodes.filter((n: any) => n.status === "active" && n.contributor_id).map((node: any) => {
              const user = contributors[node.contributor_id]
              return (
                <div key={node.id} style={{ padding: "28px 0", borderBottom: "1px solid rgba(245,241,234,0.07)", display: "flex", alignItems: "center", gap: "16px" }}>
                  {user?.avatar_url
                    ? <img src={user.avatar_url} alt="" width={44} height={44} style={{ borderRadius: "50%", flexShrink: 0 }} />
                    : <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(245,241,234,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 700, color: "rgba(245,241,234,0.4)", flexShrink: 0 }}>{node.role?.[0]?.toUpperCase() || "?"}</div>
                  }
                  <div style={{ flex: 1 }}>
                    {user
                      ? <Link href={`/u/${user.username}`} style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 700, color: "#F5F1EA", textDecoration: "none", display: "block", marginBottom: "3px" }}>@{user.username}</Link>
                      : <span style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 700, color: "#F5F1EA", display: "block", marginBottom: "3px" }}>{node.role}</span>
                    }
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(245,241,234,0.35)" }}>{node.role}</span>
                    {node.milestone && <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(245,241,234,0.25)", display: "block", marginTop: "2px" }}>{node.milestone}</span>}
                  </div>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 700, color: "#C0392B" }}>{node.slice}%</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer link */}
        {seed.github_repo && (
          <a href={seed.github_repo.startsWith("http") ? seed.github_repo : `https://${seed.github_repo}`} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: "rgba(245,241,234,0.35)", textDecoration: "none", borderBottom: "1px solid rgba(245,241,234,0.15)", paddingBottom: "2px" }}>
            View repository →
          </a>
        )}
      </section>
    </main>
  )
}
