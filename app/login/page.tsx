import Link from "next/link"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await getSession()
  if (session) redirect("/dashboard")

  return (
    <main style={{minHeight:"100vh",background:"var(--paper)",display:"flex",flexDirection:"column",justifyContent:"center",padding:"48px"}}>
      <div style={{maxWidth:"480px"}}>

        <Link href="/" style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(14,12,9,0.55)",textDecoration:"none",display:"block",marginBottom:"64px",fontWeight:600}}>
          ← Broke Founders
        </Link>

        <p style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.32em",textTransform:"uppercase",color:"var(--red)",marginBottom:"24px",fontWeight:600}}>
          Welcome back
        </p>

        <h1 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(36px,6vw,56px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-0.03em",marginBottom:"16px"}}>
          Sign in to<br/>
          <em style={{fontWeight:400,color:"rgba(14,12,9,0.55)"}}>build together.</em>
        </h1>

        <p style={{fontFamily:"var(--font-sans)",fontSize:"14px",lineHeight:1.85,color:"rgba(14,12,9,0.7)",marginBottom:"48px",maxWidth:"340px"}}>
          GitHub is your identity on Broke Founders. Your commits are your proof of work.
        </p>

        <a href="/api/auth/login" style={{display:"inline-flex",alignItems:"center",gap:"12px",background:"var(--ink)",color:"var(--paper)",fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,padding:"16px 28px",textDecoration:"none"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Continue with GitHub
        </a>

      </div>
    </main>
  )
}