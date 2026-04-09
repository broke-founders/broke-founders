import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { WaitlistActions } from "./WaitlistActions"

const ADMIN_USERNAMES = ["horaizontech"]

export default async function AdminPage() {
  const session = await getSession()
  if (!session || !ADMIN_USERNAMES.includes(session.github_username)) {
    redirect("/dashboard")
  }

  const { data: seeds } = await supabase
    .from("seeds")
    .select("id, title, slug, stage, created_at, originator_id, users(username)")
    .order("created_at", { ascending: false })

  const { data: users } = await supabase
    .from("users")
    .select("id, username, name, avatar_url, created_at")
    .order("created_at", { ascending: false })

  const { data: nodes } = await supabase
    .from("nodes")
    .select("id, status")

  const { data: contributions } = await supabase
    .from("contributions")
    .select("id, action, points")

  const { data: messages } = await supabase
    .from("messages")
    .select("id")

  const { data: waitlist } = await supabase
    .from("waitlist")
    .select("id, email, skills_submitted, created_at")
    .order("created_at", { ascending: false })

  const { data: skills } = await supabase
    .from("skills")
    .select("email, category, subcategory, custom_skill, created_at")
    .order("created_at", { ascending: false })

  const stats = {
    total_seeds: seeds?.length || 0,
    sprouting: seeds?.filter(s => s.stage === "sprout").length || 0,
    graduated: seeds?.filter(s => s.stage === "grove").length || 0,
    fossilized: seeds?.filter(s => s.stage === "fossil").length || 0,
    total_users: users?.length || 0,
    active_nodes: nodes?.filter(n => n.status === "active").length || 0,
    open_nodes: nodes?.filter(n => n.status === "open").length || 0,
    total_contributions: contributions?.length || 0,
    total_points: contributions?.reduce((s, c) => s + (c.points || 0), 0) || 0,
    total_messages: messages?.length || 0,
    waitlist: waitlist?.length || 0,
    skills_submitted: waitlist?.filter(w => w.skills_submitted).length || 0,
  }

  const stageBadge = (stage: string) => {
    const colors: Record<string, string> = {
      sprout: "rgba(14,12,9,0.5)",
      shoot: "#4A90D9",
      grove: "#7BAE7F",
      listed: "#E8A020",
      fossil: "rgba(14,12,9,0.25)",
    }
    return (
      <span style={{fontFamily:"var(--font-sans)",fontSize:"9px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:colors[stage]||"rgba(14,12,9,0.4)",padding:"3px 8px",border:`1px solid ${colors[stage]||"rgba(14,12,9,0.12)"}`}}>
        {stage}
      </span>
    )
  }

  return (
    <main style={{minHeight:"100vh",background:"var(--paper)"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 48px",borderBottom:"1px solid rgba(14,12,9,0.1)"}}>
        <Link href="/dashboard" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",textDecoration:"none",fontWeight:600}}>← Dashboard</Link>
        <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--red)",fontWeight:700}}>Admin</span>
      </nav>

      <section style={{padding:"64px 48px",maxWidth:"1100px"}}>

        <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.32em",textTransform:"uppercase",color:"var(--red)",marginBottom:"16px",fontWeight:600}}>Super Admin</p>
        <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(36px,5vw,56px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.03em",marginBottom:"56px"}}>
          Platform overview.
        </h1>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"1px",background:"rgba(14,12,9,0.1)",marginBottom:"64px"}}>
          {[
            { label:"Total seeds", value: stats.total_seeds },
            { label:"Active", value: stats.sprouting },
            { label:"Graduated", value: stats.graduated },
            { label:"Fossilized", value: stats.fossilized },
            { label:"Total users", value: stats.total_users },
            { label:"Active nodes", value: stats.active_nodes },
            { label:"Open nodes", value: stats.open_nodes },
            { label:"Contributions", value: stats.total_contributions },
            { label:"Waitlist", value: stats.waitlist },
            { label:"Skills declared", value: stats.skills_submitted },
          ].map(stat => (
            <div key={stat.label} style={{background:"var(--paper)",padding:"28px 24px"}}>
              <span style={{fontFamily:"var(--font-serif)",fontSize:"36px",fontWeight:900,display:"block",marginBottom:"8px"}}>{stat.value}</span>
              <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(14,12,9,0.5)",fontWeight:600}}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Waitlist */}
        <div style={{marginBottom:"64px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"24px"}}>
            <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",fontWeight:600}}>
              Waitlist — {stats.waitlist} signups
            </p>
          </div>
          <div style={{borderTop:"1px solid rgba(14,12,9,0.1)"}}>
            {waitlist?.map(w => {
              const userSkills = skills?.filter(s => s.email === w.email) || []
              return (
                <div key={w.id} style={{padding:"20px 0",borderBottom:"1px solid rgba(14,12,9,0.07)",display:"grid",gridTemplateColumns:"1fr auto auto",gap:"24px",alignItems:"center"}}>
                  <div>
                    <span style={{fontFamily:"var(--font-sans)",fontSize:"14px",fontWeight:600,display:"block",marginBottom:"4px",color:"rgba(14,12,9,0.9)"}}>{w.email}</span>
                    <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginTop:"6px"}}>
                      {userSkills.map((s, i) => (
                        <span key={i} style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.1em",textTransform:"uppercase",border:"1px solid rgba(14,12,9,0.15)",padding:"3px 8px",color:"rgba(14,12,9,0.6)"}}>
                          {s.subcategory || s.custom_skill || s.category}
                        </span>
                      ))}
                      {userSkills.length === 0 && (
                        <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.35)",fontStyle:"italic"}}>No skills declared</span>
                      )}
                    </div>
                    <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",color:"rgba(14,12,9,0.35)",display:"block",marginTop:"4px"}}>
                      Signed up {new Date(w.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                    </span>
                  </div>
                  <span style={{fontFamily:"var(--font-sans)",fontSize:"9px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,padding:"4px 10px",border:`1px solid ${w.skills_submitted?"rgba(61,186,122,0.4)":"rgba(14,12,9,0.15)"}`,color:w.skills_submitted?"rgba(61,186,122,0.9)":"rgba(14,12,9,0.4)"}}>
                    {w.skills_submitted ? "Skills in" : "Pending"}
                  </span>
                  <WaitlistActions email={w.email} />
                </div>
              )
            })}
          </div>
        </div>

        {/* All seeds */}
        <div style={{marginBottom:"64px"}}>
          <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",marginBottom:"24px",fontWeight:600}}>
            All seeds — {stats.total_seeds}
          </p>
          <div style={{borderTop:"1px solid rgba(14,12,9,0.1)"}}>
            {seeds?.map(seed => (
              <div key={seed.id} style={{padding:"16px 0",borderBottom:"1px solid rgba(14,12,9,0.07)",display:"grid",gridTemplateColumns:"1fr auto auto",gap:"24px",alignItems:"center"}}>
                <div>
                  <Link href={`/seeds/${seed.slug}`} style={{fontFamily:"var(--font-serif)",fontSize:"17px",fontWeight:700,textDecoration:"none",color:"rgba(14,12,9,0.9)",display:"block",marginBottom:"4px"}}>{seed.title}</Link>
                  <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:"rgba(14,12,9,0.45)"}}>
                    by @{(seed.users as any)?.username} · {new Date(seed.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                  </span>
                </div>
                {stageBadge(seed.stage)}
                <Link href={`/seeds/${seed.slug}`} style={{color:"rgba(14,12,9,0.25)",textDecoration:"none",fontSize:"16px"}}>→</Link>
              </div>
            ))}
          </div>
        </div>

        {/* All users */}
        <div>
          <p style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",marginBottom:"24px",fontWeight:600}}>
            All builders — {stats.total_users}
          </p>
          <div style={{borderTop:"1px solid rgba(14,12,9,0.1)"}}>
            {users?.map(user => (
              <div key={user.id} style={{padding:"14px 0",borderBottom:"1px solid rgba(14,12,9,0.07)",display:"grid",gridTemplateColumns:"auto 1fr auto",gap:"14px",alignItems:"center"}}>
                {user.avatar_url
                  ? <img src={user.avatar_url} alt="" width={28} height={28} style={{borderRadius:"50%"}}/>
                  : <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(14,12,9,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-sans)",fontSize:"11px",fontWeight:700,color:"rgba(14,12,9,0.4)"}}>{user.username?.[0]?.toUpperCase()}</div>
                }
                <div>
                  <Link href={`/u/${user.username}`} style={{fontFamily:"var(--font-sans)",fontSize:"13px",fontWeight:700,textDecoration:"none",color:"rgba(14,12,9,0.85)",display:"block"}}>@{user.username}</Link>
                  <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",color:"rgba(14,12,9,0.4)"}}>Joined {new Date(user.created_at).toLocaleDateString("en-GB",{month:"short",year:"numeric"})}</span>
                </div>
                <Link href={`/u/${user.username}`} style={{color:"rgba(14,12,9,0.25)",textDecoration:"none",fontSize:"16px"}}>→</Link>
              </div>
            ))}
          </div>
        </div>

      </section>
    </main>
  )
}