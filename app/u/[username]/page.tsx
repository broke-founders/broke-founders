"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

const ACTION_LABELS: Record<string, string> = {
  seed_created: "Floated a seed",
  node_joined: "Joined a node",
  node_completed: "Completed a node",
  node_dropped: "Left a node",
  seed_graduated: "Shipped a product",
  seed_fossilized: "Seed archived",
}

const ACTION_POINTS: Record<string, number> = {
  seed_created: 10,
  node_joined: 5,
  node_completed: 20,
  seed_graduated: 50,
}

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

  const { user, seeds, nodes, contributions, achievements, score, level } = data

  return (
    <main style={{minHeight:"100vh",background:"var(--paper)"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 48px",borderBottom:"1px solid rgba(14,12,9,0.1)"}}>
        <Link href="/seeds" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(14,12,9,0.6)",textDecoration:"none",fontWeight:600}}>← Seeds</Link>
        <Link href="/dashboard" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(14,12,9,0.6)",textDecoration:"none",fontWeight:600}}>Dashboard</Link>
      </nav>

      <section style={{padding:"72px 48px 100px",maxWidth:"880px"}}>

        {/* Profile header */}
        <div style={{display:"flex",alignItems:"flex-start",gap:"24px",marginBottom:"48px",paddingBottom:"48px",borderBottom:"1px solid rgba(14,12,9,0.1)"}}>
          {user.avatar_url
            ? <img src={user.avatar_url} alt="" width={80} height={80} style={{borderRadius:"50%"}}/>
            : <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(14,12,9,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-sans)",fontSize:"28px",fontWeight:700,color:"rgba(14,12,9,0.4)"}}>{user.username?.[0]?.toUpperCase()}</div>
          }
          <div style={{flex:1}}>
            <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.25em",textTransform:"uppercase",color:"var(--red)",marginBottom:"8px",fontWeight:600}}>Builder</p>
            <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(32px,5vw,52px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.02em",marginBottom:"8px"}}>{user.name || user.username}</h1>
            <p style={{fontFamily:"var(--font-sans)",fontSize:"13px",color:"rgba(14,12,9,0.55)"}}>@{user.username}</p>
            <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.4)",marginTop:"6px"}}>
              Member since {new Date(user.created_at).toLocaleDateString("en-GB",{month:"long",year:"numeric"})}
            </p>
          </div>
          <div style={{textAlign:"right",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"16px"}}>
            <div>
              <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"6px",fontWeight:600,color:level?.color||"rgba(14,12,9,0.5)"}}>{level?.title}</p>
              <p style={{fontFamily:"var(--font-serif)",fontSize:"52px",fontWeight:900,lineHeight:1,color:"rgba(14,12,9,0.9)"}}>{score}</p>
              <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",color:"rgba(14,12,9,0.4)",marginTop:"4px"}}>points</p>
            </div>
            <Link href={`/messages/${username}`} className="btn btn-outline" style={{fontSize:"11px",padding:"10px 20px"}}>
              Message
            </Link>
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div style={{marginBottom:"56px"}}>
            <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",marginBottom:"20px",fontWeight:600}}>
              Achievements — {achievements.length}
            </p>
            <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
              {achievements.map((a: any) => (
                <div key={a.achievement} style={{padding:"8px 16px",border:"1px solid rgba(14,12,9,0.12)",fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.7)",fontWeight:600}}>
                  {a.achievement}
                </div>
              ))}
            </div>
          </div>
        )}

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
                  <div style={{padding:"20px 0",borderBottom:"1px solid rgba(14,12,9,0.1)",display:"grid",gridTemplateColumns:"1fr auto",alignItems:"center"}}>
                    <div>
                      <span style={{fontFamily:"var(--font-serif)",fontSize:"20px",fontWeight:700,display:"block",marginBottom:"4px",color:"rgba(14,12,9,0.95)"}}>{seed.title}</span>
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
        {nodes.length > 0 && (
          <div style={{marginBottom:"56px"}}>
            <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",marginBottom:"24px",fontWeight:600}}>
              Active nodes — {nodes.length}
            </p>
            <div style={{borderTop:"1px solid rgba(14,12,9,0.1)"}}>
              {nodes.map((node: any) => (
                <Link key={node.id} href={`/seeds/${node.seeds?.slug}`} style={{textDecoration:"none",color:"inherit"}}>
                  <div style={{padding:"20px 0",borderBottom:"1px solid rgba(14,12,9,0.1)",display:"grid",gridTemplateColumns:"1fr auto",alignItems:"center"}}>
                    <div>
                      <span style={{fontFamily:"var(--font-serif)",fontSize:"20px",fontWeight:700,display:"block",marginBottom:"4px",color:"rgba(14,12,9,0.95)"}}>{node.role}</span>
                      <span style={{fontFamily:"var(--font-sans)",fontSize:"12px",color:"rgba(14,12,9,0.6)"}}>on <strong>{node.seeds?.title}</strong> · {node.slice}% equity</span>
                    </div>
                    <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"rgba(61,186,122,0.9)",background:"rgba(61,186,122,0.1)",padding:"5px 10px",border:"1px solid rgba(61,186,122,0.3)"}}>active</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Contribution timeline */}
        {contributions.length > 0 && (
          <div>
            <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",marginBottom:"24px",fontWeight:600}}>
              Contribution history
            </p>
            <div style={{borderTop:"1px solid rgba(14,12,9,0.1)"}}>
              {contributions.map((c: any) => (
                <div key={c.id} style={{padding:"16px 0",borderBottom:"1px solid rgba(14,12,9,0.07)",display:"grid",gridTemplateColumns:"1fr auto",alignItems:"center",gap:"16px"}}>
                  <div>
                    <span style={{fontFamily:"var(--font-sans)",fontSize:"13px",fontWeight:600,color:"rgba(14,12,9,0.8)",display:"block",marginBottom:"3px"}}>
                      {ACTION_LABELS[c.action] || c.action}
                      {c.seeds?.title && <span style={{fontWeight:400,color:"rgba(14,12,9,0.5)"}}> — {c.seeds.title}</span>}
                    </span>
                    <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.4)"}}>
                      {new Date(c.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                    </span>
                  </div>
                  {ACTION_POINTS[c.action] > 0 && (
                    <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",fontWeight:700,color:"rgba(14,12,9,0.6)"}}>+{ACTION_POINTS[c.action]} pts</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </section>
    </main>
  )
}