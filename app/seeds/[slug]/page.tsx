"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { RequestButton } from "./RequestButton"

export default function SeedPage() {
  const params = useParams()
  const slug = params.slug as string
  const [seed, setSeed] = useState<any>(null)
  const [nodes, setNodes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/seeds/${slug}`)
      .then(r => r.json())
      .then(data => {
        setSeed(data.seed)
        setNodes(data.nodes)
        setLoading(false)
      })
  }, [slug])

  if (loading) return (
    <main style={{minHeight:"100vh",background:"var(--paper)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(14,12,9,0.3)"}}>Loading...</span>
    </main>
  )

  if (!seed) return (
    <main style={{minHeight:"100vh",background:"var(--paper)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{fontFamily:"var(--font-sans)",fontSize:"14px",color:"rgba(14,12,9,0.4)"}}>Seed not found.</span>
    </main>
  )

  const totalNodeSlices = nodes.reduce((s: number, n: any) => s + n.slice, 0)

  return (
    <main style={{minHeight:"100vh",background:"var(--paper)"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 48px",borderBottom:"1px solid var(--faint)"}}>
        <Link href="/seeds" style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(14,12,9,0.35)",textDecoration:"none",fontWeight:600}}>← Seeds</Link>
        <Link href="/dashboard" style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(14,12,9,0.35)",textDecoration:"none",fontWeight:600}}>Dashboard</Link>
      </nav>

      <section style={{padding:"64px 48px",maxWidth:"880px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px"}}>
          <span style={{fontFamily:"var(--font-sans)",fontSize:"9px",letterSpacing:"0.25em",textTransform:"uppercase",color:"var(--red)",fontWeight:600}}>{seed.stage}</span>
          <span style={{fontFamily:"var(--font-sans)",fontSize:"9px",color:"rgba(14,12,9,0.3)"}}>{new Date(seed.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</span>
        </div>

        <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(40px,6vw,68px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.03em",marginBottom:"28px"}}>{seed.title}</h1>
        <p style={{fontFamily:"var(--font-sans)",fontSize:"15px",lineHeight:1.9,color:"rgba(14,12,9,0.55)",maxWidth:"600px",marginBottom:"48px"}}>{seed.problem}</p>

        <div style={{display:"flex",alignItems:"center",gap:"12px",padding:"20px 0",borderTop:"1px solid var(--faint)",borderBottom:"1px solid var(--faint)",marginBottom:"48px"}}>
          {seed.users?.avatar_url && <img src={seed.users.avatar_url} alt="" width={32} height={32} style={{borderRadius:"50%"}}/>}
          <div>
            <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",fontWeight:600,display:"block"}}>{seed.users?.name || seed.users?.username}</span>
            <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",color:"rgba(14,12,9,0.4)"}}>Originator · {seed.originator_stake}% stake</span>
          </div>
          {seed.graduation_threshold && (
            <div style={{marginLeft:"auto",fontFamily:"var(--font-sans)",fontSize:"10px",color:"rgba(14,12,9,0.4)",textAlign:"right"}}>
              <span style={{display:"block",fontWeight:600,color:"rgba(14,12,9,0.6)"}}>Graduates when</span>
              {seed.graduation_threshold}
            </div>
          )}
        </div>

        <div style={{marginBottom:"48px"}}>
          <p style={{fontFamily:"var(--font-sans)",fontSize:"9px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.4)",marginBottom:"12px",fontWeight:600}}>Equity breakdown</p>
          <div style={{height:"8px",background:"rgba(14,12,9,0.06)",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${seed.originator_stake}%`,background:"var(--ink)"}}></div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--font-sans)",fontSize:"10px",color:"rgba(14,12,9,0.4)",marginTop:"8px"}}>
            <span>Originator: {seed.originator_stake}%</span>
            <span>Nodes: {totalNodeSlices}%</span>
          </div>
        </div>

        <p style={{fontFamily:"var(--font-sans)",fontSize:"9px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.4)",marginBottom:"24px",fontWeight:600}}>Open nodes</p>

        <div style={{borderTop:"1px solid var(--faint)"}}>
          {nodes.map((node: any) => (
            <div key={node.id} style={{padding:"32px 0",borderBottom:"1px solid var(--faint)"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"12px"}}>
                <div>
                  <span style={{fontFamily:"var(--font-serif)",fontSize:"22px",fontWeight:700,display:"block",marginBottom:"4px"}}>{node.role}</span>
                  <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",color:"var(--red)",fontWeight:600,letterSpacing:"0.1em"}}>{node.slice}% equity · ~{node.hours_estimate}hrs</span>
                </div>
                <span style={{fontFamily:"var(--font-sans)",fontSize:"9px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--ink)",background:"rgba(14,12,9,0.06)",padding:"6px 12px"}}>{node.status}</span>
              </div>
              {node.description && <p style={{fontFamily:"var(--font-sans)",fontSize:"13px",lineHeight:1.8,color:"rgba(14,12,9,0.55)",marginBottom:"12px",maxWidth:"520px"}}>{node.description}</p>}
              {node.milestone && <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.4)",marginBottom:"12px"}}>Milestone: {node.milestone}</p>}
              {node.skills_needed?.length > 0 && (
                <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>
                  {node.skills_needed.map((s: string) => (
                    <span key={s} style={{fontFamily:"var(--font-sans)",fontSize:"9px",letterSpacing:"0.12em",textTransform:"uppercase",border:"1px solid rgba(14,12,9,0.12)",padding:"4px 8px",color:"rgba(14,12,9,0.5)"}}>{s}</span>
                  ))}
                </div>
              )}
              {node.status === "open" && (
                <RequestButton nodeId={node.id} seedId={seed.id} />
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}