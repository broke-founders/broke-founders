"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MobileNav } from "@/components/MobileNav"

export default function SeedsPage() {
  const [seeds, setSeeds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetch("/api/seeds/all")
      .then(r => r.json())
      .then(data => {
        setSeeds(data.seeds || [])
        setLoading(false)
      })
  }, [])

  const filtered = filter === "all" ? seeds : seeds.filter(s => s.stage === filter)

  return (
    <main style={{minHeight:"100vh",background:"var(--paper)"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 48px",borderBottom:"1px solid var(--faint)"}}>
        <Link href="/dashboard" style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(14,12,9,0.35)",textDecoration:"none",fontWeight:600}}>← Dashboard</Link>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <Link href="/seeds/new" className="desktop-nav-links" style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background:"var(--ink)",padding:"10px 20px",textDecoration:"none"}}>Float a seed</Link>
          <MobileNav />
        </div>
      </nav>

      <section style={{padding:"64px 48px",maxWidth:"880px"}}>
        <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.32em",textTransform:"uppercase",color:"var(--red)",marginBottom:"20px",fontWeight:600}}>Live seeds</p>
        <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(36px,5vw,56px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.03em",marginBottom:"40px"}}>
          Find your<br/><em style={{fontWeight:400,color:"rgba(14,12,9,0.3)"}}>next build.</em>
        </h1>

        <div style={{display:"flex",gap:"4px",marginBottom:"48px"}}>
          {["all","sprout","shoot","grove"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{fontFamily:"var(--font-sans)",fontSize:"9px",letterSpacing:"0.2em",textTransform:"uppercase",padding:"8px 16px",border:"1px solid rgba(14,12,9,0.12)",background:filter===f?"var(--ink)":"transparent",color:filter===f?"var(--paper)":"rgba(14,12,9,0.4)",cursor:"pointer",fontWeight:600}}>{f}</button>
          ))}
        </div>

        {loading && <p style={{fontFamily:"var(--font-sans)",fontSize:"13px",color:"rgba(14,12,9,0.3)"}}>Loading...</p>}
        {!loading && filtered.length === 0 && (
          <p style={{fontFamily:"var(--font-sans)",fontSize:"13px",color:"rgba(14,12,9,0.3)"}}>No seeds yet. <Link href="/seeds/new" style={{color:"var(--ink)"}}>Float the first one.</Link></p>
        )}

        <div style={{borderTop:"1px solid var(--faint)"}}>
          {filtered.map(seed => (
            <Link key={seed.id} href={`/seeds/${seed.slug}`} style={{textDecoration:"none",color:"inherit"}}>
              <div style={{padding:"32px 0",borderBottom:"1px solid var(--faint)",display:"grid",gridTemplateColumns:"1fr auto",gap:"24px",alignItems:"start"}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}>
                    <span style={{fontFamily:"var(--font-sans)",fontSize:"9px",letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--red)",fontWeight:600}}>{seed.stage}</span>
                    <span style={{fontFamily:"var(--font-sans)",fontSize:"9px",color:"rgba(14,12,9,0.3)"}}>{new Date(seed.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</span>
                  </div>
                  <h2 style={{fontFamily:"var(--font-serif)",fontSize:"24px",fontWeight:700,marginBottom:"8px",lineHeight:1.2}}>{seed.title}</h2>
                  <p style={{fontFamily:"var(--font-sans)",fontSize:"13px",lineHeight:1.7,color:"rgba(14,12,9,0.5)",maxWidth:"520px"}}>{seed.problem?.slice(0,120)}{seed.problem?.length > 120 ? "..." : ""}</p>
                  {seed.open_nodes > 0 && (
                    <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",color:"var(--red)",marginTop:"10px",fontWeight:600,letterSpacing:"0.1em"}}>{seed.open_nodes} open {seed.open_nodes === 1 ? "node" : "nodes"}</p>
                  )}
                </div>
                <span style={{fontFamily:"var(--font-sans)",fontSize:"18px",color:"rgba(14,12,9,0.2)"}}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}