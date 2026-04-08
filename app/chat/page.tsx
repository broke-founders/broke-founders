import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Chat } from "@/components/Chat"

export default async function ChatPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  return (
    <main style={{minHeight:"100vh",background:"var(--paper)"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 48px",borderBottom:"1px solid rgba(14,12,9,0.1)"}}>
        <Link href="/dashboard" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",textDecoration:"none",fontWeight:600}}>← Dashboard</Link>
        <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",fontWeight:600}}>Global Feed</span>
      </nav>

      <section style={{padding:"64px 48px",maxWidth:"720px"}}>
        <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.32em",textTransform:"uppercase",color:"var(--red)",marginBottom:"16px",fontWeight:600}}>Community</p>
        <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(36px,5vw,52px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.03em",marginBottom:"12px"}}>
          Builder feed.
        </h1>
        <p style={{fontFamily:"var(--font-sans)",fontSize:"15px",color:"rgba(14,12,9,0.6)",marginBottom:"40px",lineHeight:1.8}}>
          All builders. One room. No noise.
        </p>
        <Chat />
      </section>
    </main>
  )
}