import { ApproveReject } from "./ApproveReject"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default async function Dashboard() {
  const session = await getSession()
  if (!session) redirect("/login")

  const { data: mySeeds } = await supabase
    .from("seeds")
    .select("id, title, slug, stage, created_at")
    .eq("originator_id", session.id)
    .order("created_at", { ascending: false })

  const { data: requests } = await supabase
    .from("node_requests")
    .select("*, nodes(role, slice), seeds(title, slug), users(username, avatar_url, name)")
    .in("seed_id", mySeeds?.map(s => s.id) || [])
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  return (
    <main style={{minHeight:"100vh",background:"var(--paper)"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 48px",borderBottom:"1px solid var(--faint)"}}>
        <Link href="/" style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(14,12,9,0.35)",textDecoration:"none",fontWeight:600}}>
          Broke Founders
        </Link>
        <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
          {session.github_avatar && <img src={session.github_avatar} alt="" width={28} height={28} style={{borderRadius:"50%"}}/>}
          <span style={{fontFamily:"var(--font-sans)",fontSize:"12px",color:"rgba(14,12,9,0.5)"}}>{session.github_username}</span>
          <a href="/api/auth/logout" style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(14,12,9,0.35)",textDecoration:"none",fontWeight:600}}>Sign out</a>
        </div>
      </nav>

      <section style={{padding:"64px 48px",maxWidth:"900px"}}>
        <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.32em",textTransform:"uppercase",color:"var(--red)",marginBottom:"20px",fontWeight:600}}>Dashboard</p>
        <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(36px,5vw,56px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.03em",marginBottom:"56px"}}>
          Welcome,<br/>
          <em style={{fontWeight:400,color:"rgba(14,12,9,0.3)"}}>{session.name || session.github_username}.</em>
        </h1>

        {/* Pending requests */}
        {requests && requests.length > 0 && (
          <div style={{marginBottom:"64px"}}>
            <p style={{fontFamily:"var(--font-sans)",fontSize:"9px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.4)",marginBottom:"24px",fontWeight:600}}>
              Pending requests — {requests.length}
            </p>
            <div style={{borderTop:"1px solid var(--faint)"}}>
              {requests.map((req: any) => (
                <div key={req.id} style={{padding:"24px 0",borderBottom:"1px solid var(--faint)",display:"grid",gridTemplateColumns:"1fr auto",gap:"24px",alignItems:"center"}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}>
                      {req.users?.avatar_url && <img src={req.users.avatar_url} alt="" width={24} height={24} style={{borderRadius:"50%"}}/>}
                      <span style={{fontFamily:"var(--font-sans)",fontSize:"13px",fontWeight:600}}>@{req.users?.username}</span>
                      <span style={{fontFamily:"var(--font-sans)",fontSize:"12px",color:"rgba(14,12,9,0.4)"}}>wants to join as</span>
                      <span style={{fontFamily:"var(--font-serif)",fontSize:"14px",fontWeight:700}}>{req.nodes?.role}</span>
                    </div>
                    <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.4)"}}>
                      {req.seeds?.title} · {req.nodes?.slice}% equity
                    </p>
                    {req.message && <p style={{fontFamily:"var(--font-sans)",fontSize:"12px",color:"rgba(14,12,9,0.55)",marginTop:"6px",fontStyle:"italic"}}>"{req.message}"</p>}
                  </div>
                  <ApproveReject requestId={req.id} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My seeds */}
        <div style={{marginBottom:"48px"}}>
          <p style={{fontFamily:"var(--font-sans)",fontSize:"9px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.4)",marginBottom:"24px",fontWeight:600}}>My seeds</p>
          {!mySeeds?.length ? (
            <p style={{fontFamily:"var(--font-sans)",fontSize:"13px",color:"rgba(14,12,9,0.3)"}}>No seeds yet.</p>
          ) : (
            <div style={{borderTop:"1px solid var(--faint)"}}>
              {mySeeds.map(seed => (
                <Link key={seed.id} href={`/seeds/${seed.slug}`} style={{textDecoration:"none",color:"inherit"}}>
                  <div style={{padding:"20px 0",borderBottom:"1px solid var(--faint)",display:"grid",gridTemplateColumns:"1fr auto",alignItems:"center"}}>
                    <div>
                      <span style={{fontFamily:"var(--font-serif)",fontSize:"18px",fontWeight:700,display:"block"}}>{seed.title}</span>
                      <span style={{fontFamily:"var(--font-sans)",fontSize:"9px",letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--red)",fontWeight:600}}>{seed.stage}</span>
                    </div>
                    <span style={{color:"rgba(14,12,9,0.2)"}}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{display:"flex",gap:"12px"}}>
          <Link href="/seeds/new" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background:"var(--ink)",padding:"13px 24px",textDecoration:"none"}}>Float a seed</Link>
          <Link href="/seeds" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"rgba(14,12,9,0.4)",border:"1px solid rgba(14,12,9,0.12)",padding:"13px 24px",textDecoration:"none"}}>Browse seeds</Link>
        </div>
      </section>
    </main>
  )
}