"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { MobileNav } from "@/components/MobileNav"
import { Suspense } from "react"

const SKILLS = [
  "Frontend", "Backend", "Full Stack", "UI/UX", "Design",
  "DevOps", "Marketing", "Growth", "Copywriting", "SEO",
  "Mobile", "Data", "AI/ML", "Product", "Sales",
]

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "open_nodes", label: "Most nodes open" },
  { value: "activity", label: "Recent activity" },
]

function SeedsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [seeds, setSeeds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get("q") || "")
  const [stage, setStage] = useState(searchParams.get("stage") || "all")
  const [skill, setSkill] = useState(searchParams.get("skill") || "")
  const [sort, setSort] = useState(searchParams.get("sort") || "newest")

  const fetchSeeds = useCallback(async (sk: string, so: string) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (sk) params.set("skill", sk)
    if (so) params.set("sort", so)
    const res = await fetch(`/api/seeds/all?${params}`)
    const data = await res.json()
    setSeeds(data.seeds || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSeeds(skill, sort)
  }, [skill, sort, fetchSeeds])

  // Sync state changes to URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("q", search)
    if (stage !== "all") params.set("stage", stage)
    if (skill) params.set("skill", skill)
    if (sort !== "newest") params.set("sort", sort)
    const qs = params.toString()
    router.replace(qs ? `?${qs}` : "/seeds", { scroll: false })
  }, [search, stage, skill, sort, router])

  const filtered = seeds.filter(s => {
    if (stage !== "all" && s.stage !== stage) return false
    if (search) {
      const q = search.toLowerCase()
      if (!s.title?.toLowerCase().includes(q) && !s.problem?.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 48px", borderBottom: "1px solid var(--faint)" }}>
        <Link href="/dashboard" style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(14,12,9,0.35)", textDecoration: "none", fontWeight: 600 }}>← Dashboard</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/builders" className="desktop-nav-links" style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: "rgba(14,12,9,0.55)", textDecoration: "none" }}>Find builders</Link>
          <Link href="/seeds/new" className="desktop-nav-links" style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: "var(--paper)", background: "var(--ink)", padding: "10px 20px", textDecoration: "none" }}>Float a seed</Link>
          <MobileNav />
        </div>
      </nav>

      <section style={{ padding: "64px 48px", maxWidth: "880px" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--red)", marginBottom: "20px", fontWeight: 600 }}>Live seeds</p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px,5vw,56px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: "40px" }}>
          Find your<br /><em style={{ fontWeight: 400, color: "rgba(14,12,9,0.3)" }}>next build.</em>
        </h1>

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search seeds by title or problem..."
          style={{ width: "100%", background: "transparent", border: "1px solid rgba(14,12,9,0.15)", fontFamily: "var(--font-sans)", fontSize: "14px", padding: "13px 16px", outline: "none", color: "var(--ink)", marginBottom: "20px", display: "block" }}
        />

        {/* Filters row */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "48px", alignItems: "center" }}>
          {/* Stage filter */}
          {["all", "sprout", "shoot", "grove"].map(f => (
            <button key={f} onClick={() => setStage(f)} style={{ fontFamily: "var(--font-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "8px 16px", border: "1px solid rgba(14,12,9,0.12)", background: stage === f ? "var(--ink)" : "transparent", color: stage === f ? "var(--paper)" : "rgba(14,12,9,0.4)", cursor: "pointer", fontWeight: 600 }}>{f}</button>
          ))}

          <div style={{ width: "1px", height: "28px", background: "rgba(14,12,9,0.1)", margin: "0 4px" }} />

          {/* Skill filter */}
          <select
            value={skill}
            onChange={e => setSkill(e.target.value)}
            style={{ fontFamily: "var(--font-sans)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 14px", border: "1px solid rgba(14,12,9,0.12)", background: skill ? "var(--ink)" : "transparent", color: skill ? "var(--paper)" : "rgba(14,12,9,0.4)", cursor: "pointer", fontWeight: 600, outline: "none", appearance: "none" as const }}
          >
            <option value="">All skills</option>
            {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <div style={{ width: "1px", height: "28px", background: "rgba(14,12,9,0.1)", margin: "0 4px" }} />

          {/* Sort */}
          {SORTS.map(s => (
            <button key={s.value} onClick={() => setSort(s.value)} style={{ fontFamily: "var(--font-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "8px 16px", border: "1px solid rgba(14,12,9,0.12)", background: sort === s.value ? "rgba(14,12,9,0.06)" : "transparent", color: sort === s.value ? "var(--ink)" : "rgba(14,12,9,0.4)", cursor: "pointer", fontWeight: 600 }}>{s.label}</button>
          ))}
        </div>

        {loading && <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(14,12,9,0.3)" }}>Loading...</p>}
        {!loading && filtered.length === 0 && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(14,12,9,0.3)" }}>No seeds match. <Link href="/seeds/new" style={{ color: "var(--ink)" }}>Float the first one.</Link></p>
        )}

        <div style={{ borderTop: "1px solid var(--faint)" }}>
          {filtered.map(seed => (
            <Link key={seed.id} href={`/seeds/${seed.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ padding: "32px 0", borderBottom: "1px solid var(--faint)", display: "grid", gridTemplateColumns: "1fr auto", gap: "24px", alignItems: "start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--red)", fontWeight: 600 }}>{seed.stage}</span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "9px", color: "rgba(14,12,9,0.3)" }}>{new Date(seed.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                  </div>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 700, marginBottom: "8px", lineHeight: 1.2 }}>{seed.title}</h2>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", lineHeight: 1.7, color: "rgba(14,12,9,0.5)", maxWidth: "520px" }}>{seed.problem?.slice(0, 120)}{seed.problem?.length > 120 ? "..." : ""}</p>
                  {seed.open_nodes > 0 && (
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "var(--red)", marginTop: "10px", fontWeight: 600, letterSpacing: "0.1em" }}>{seed.open_nodes} open {seed.open_nodes === 1 ? "node" : "nodes"}</p>
                  )}
                </div>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "18px", color: "rgba(14,12,9,0.2)" }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default function SeedsPage() {
  return (
    <Suspense>
      <SeedsContent />
    </Suspense>
  )
}
