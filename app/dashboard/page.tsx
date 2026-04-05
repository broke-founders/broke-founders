import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function Dashboard() {
  const session = await getSession()
  if (!session) redirect("/login")

  return (
    <main style={{minHeight:"100vh",background:"var(--paper)"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 48px",borderBottom:"1px solid var(--faint)"}}>
        <Link href="/" style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(14,12,9,0.35)",textDecoration:"none",fontWeight:600}}>
          Broke Founders
        </Link>
        <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
          <img src={session.github_avatar} alt="" width={28} height={28} style={{borderRadius:"50%"}}/>
          <span style={{fontFamily:"var(--font-sans)",fontSize:"12px",color:"rgba(14,12,9,0.5)"}}>
            {session.github_username}
          </span>
          <a href="/api/auth/logout" style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(14,12,9,0.35)",textDecoration:"none",fontWeight:600}}>
            Sign out
          </a>
        </div>
      </nav>

      <section style={{padding:"80px 48px",maxWidth:"900px"}}>
        <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.32em",textTransform:"uppercase",color:"#C0392B",marginBottom:"24px",fontWeight:600}}>
          Dashboard
        </p>
        <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(40px,6vw,64px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.03em",marginBottom:"48px"}}>
          Welcome,<br/>
          <em style={{fontWeight:400,color:"rgba(14,12,9,0.3)"}}>
            {session.name || session.github_username}.
          </em>
        </h1>

        <div style={{borderTop:"1px solid var(--faint)"}}>
          <div style={{padding:"40px 0",borderBottom:"1px solid var(--faint)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"48px",alignItems:"center"}}>
            <div>
              <h3 style={{fontFamily:"var(--font-serif)",fontSize:"22px",fontWeight:700,marginBottom:"10px"}}>Float a seed</h3>
              <p style={{fontFamily:"var(--font-sans)",fontSize:"14px",lineHeight:1.8,color:"rgba(14,12,9,0.5)"}}>Have an idea and a skill. Hit a wall. Float it and find who you need.</p>
            </div>
            <div>
              <a href="/seeds/new" style={{
                fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",
                textTransform:"uppercase",fontWeight:600,
                color:"#F5F1EA",background:"#0E0C09",
                padding:"13px 24px",textDecoration:"none",display:"inline-block",
              }}>
                Float a seed →
              </a>
            </div>
          </div>

          <div style={{padding:"40px 0",borderBottom:"1px solid var(--faint)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"48px",alignItems:"center"}}>
            <div>
              <h3 style={{fontFamily:"var(--font-serif)",fontSize:"22px",fontWeight:700,marginBottom:"10px"}}>Find a seed</h3>
              <p style={{fontFamily:"var(--font-sans)",fontSize:"14px",lineHeight:1.8,color:"rgba(14,12,9,0.5)"}}>Browse live seeds looking for your exact skill.</p>
            </div>
            <div>
              <a href="/seeds" style={{
                fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",
                textTransform:"uppercase",fontWeight:600,
                color:"#C0392B",
                padding:"13px 0",textDecoration:"none",display:"inline-block",
              }}>
                Browse seeds →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}