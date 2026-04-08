"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function BuilderProfile() {
  const params = useParams()
  const username = params.username as string
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/builders/${username}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [username])

  if (loading) return (
    <main style={{minHeight:"100vh",background:"var(--paper)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(14,12,9,0.5)"}}>Loading...</span>
    </main>
  )

  if (!data?.user) return (
    <main style={{minHeight:"100vh",background:"var(--paper)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{fontFamily:"var(--font-sans)",fontSize:"15px",color:"rgba(14,12,9,0.6)"}}>Builder not found.</span>
    </main>
  )

  const { user, seeds, nodes, score } = data

  return (
    <main style={{minHeight:"100vh",background:"var(--paper)"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 48px",borderBottom:"1px solid rgba(14,12,9,0.1)"}}>
        <Link href="/seeds" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(14,12,9,0.6)",textDecoration:"none",fontWeight:600}}>← Seeds</Link>
        <Link href="/dashboard" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(14,12,9,0.6)",textDecoration:"none",fontWeight:600}}>Dashboard</Link>
      </nav>

      <section style={{padding:"72px 48px 100px",maxWidth:"880px"}}>

        {/* Profile header */}
        <div style={{display:"flex",alignItems:"flex-start",gap:"24px",marginBottom:"64px",paddingBottom:"48px",borderBottom:"1px solid rgba(14,12,9,0.1)"}}>
          {user.avatar_url
            ? <img src={user.avatar_url} alt="" width={72} height={72} style={{borderRadius:"50%"}}/>
            : <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(14,12,9,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-sans)",fontSize:"24px",fontWeight:700,color:"rgba(14,12,9,0.4)"}}>{user.username?.[0]?.toUpperCase()}</div>
          }
          <div style={{flex:1}}>
            <p style={{fontFamily:"var(--font-sans)",fontSize:"12px",letterSpacing:"0.25em",textTransform:"uppercase",color:"var(--red)",marginBottom:"8px",fontWeight:600}}>Builder</p>
            <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(32px,5vw,52px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.02em",marginBottom:"8px"}}>{user.name || user.username}</h1>
            <p style={{fontFamily:"var(--font-sans)",fontSize:"13px",color:"rgba(14,12,9,0.55)"}}>@{user.username}</p>
          </div>
          <div style={{textAlign:"right"}}>
            <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(14,12,9,0.5)",marginBottom:"6px",fontWeight:600}}>Builder score</p>
            <p style={{fontFamily:"var(--font-serif)",fontSize:"48px",fontWeight:900,lineHeight:1,color:"rgba(14,12,9,0.9)"}}>{score}</p>
          </div>
        </div>

        {/* Seeds originated */}
        <div style={{marginBottom:"56px"}}>
          <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",marginBottom:"24px",fontWeight:600}}>
            Seeds originated — {seeds.length}
          </p>
          {seeds.length === 0 ? (
            <p style={{fontFamily:"var(--font-sans)",fontSize:"14px",color:"rgba(14,12,9,0.45)"}}>No seeds yet.</p>
          ) : (
            <div style={{borderTop:"1px solid rgba(14,12,9,0.1)"}}>
              {seeds.map((seed: any) => (
                <Link key={seed.id} href={`/seeds/${seed.slug}`} style={{textDecoration:"none",color:"inherit"}}>
                  <div style={{padding:"24px 0",borderBottom:"1px solid rgba(14,12,9,0.1)",display:"grid",gridTemplateColumns:"1fr auto",alignItems:"center"}}>
                    <div>
                      <span style={{fontFamily:"var(--font-serif)",fontSize:"20px",fontWeight:700,display:"block",marginBottom:"6px",color:"rgba(14,12,9,0.95)"}}>{seed.title}</span>
                      <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"var(--red)",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>{seed.stage}</span>
                    </div>
                    <span style={{color:"rgba(14,12,9,0.25)",fontSize:"18px"}}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Active nodes */}
        <div>
          <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",marginBottom:"24px",fontWeight:600}}>
            Active nodes — {nodes.length}
          </p>
          {nodes.length === 0 ? (
            <p style={{fontFamily:"var(--font-sans)",fontSize:"14px",color:"rgba(14,12,9,0.45)"}}>No active nodes.</p>
          ) : (
            <div style={{borderTop:"1px solid rgba(14,12,9,0.1)"}}>
              {nodes.map((node: any) => (
                <Link key={node.id} href={`/seeds/${node.seeds?.slug}`} style={{textDecoration:"none",color:"inherit"}}>
                  <div style={{padding:"24px 0",borderBottom:"1px solid rgba(14,12,9,0.1)",display:"grid",gridTemplateColumns:"1fr auto",alignItems:"center"}}>
                    <div>
                      <span style={{fontFamily:"var(--font-serif)",fontSize:"20px",fontWeight:700,display:"block",marginBottom:"6px",color:"rgba(14,12,9,0.95)"}}>{node.role}</span>
                      <span style={{fontFamily:"var(--font-sans)",fontSize:"12px",color:"rgba(14,12,9,0.6)"}}>on <strong>{node.seeds?.title}</strong> · {node.slice}% equity</span>
                    </div>
                    <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"rgba(61,186,122,0.9)",background:"rgba(61,186,122,0.1)",padding:"5px 10px",border:"1px solid rgba(61,186,122,0.3)"}}>active</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </section>
    </main>
  )
}