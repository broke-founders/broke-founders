"use client"

import { useEffect, useRef, useState } from "react"

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const [hoveredWho, setHoveredWho] = useState<number | null>(null)
  const [formStatus, setFormStatus] = useState<"idle"|"loading"|"done"|"error">("idle")
  const [email, setEmail] = useState("")

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible")
      }),
      { threshold: 0.12 }
    )
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || formStatus === "loading") return
    setFormStatus("loading")
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
    if (res.ok) { setFormStatus("done"); setEmail("") }
    else setFormStatus("error")
  }

  const s = "cubic-bezier(0.16,1,0.3,1)"

  return (
    <>
      <style>{`
        @keyframes underline-draw { from{width:0} to{width:100%} }
        .hero-eyebrow{opacity:${loaded?1:0};transform:translateY(${loaded?0:12}px);transition:opacity 0.6s ${s} 0.05s,transform 0.6s ${s} 0.05s;}
        .hero-h1{opacity:${loaded?1:0};transform:translateY(${loaded?0:20}px);transition:opacity 0.8s ${s} 0.15s,transform 0.8s ${s} 0.15s;}
        .hero-body{opacity:${loaded?1:0};transform:translateY(${loaded?0:16}px);transition:opacity 0.8s ${s} 0.28s,transform 0.8s ${s} 0.28s;}
        .hero-actions{opacity:${loaded?1:0};transform:translateY(${loaded?0:12}px);transition:opacity 0.8s ${s} 0.42s,transform 0.8s ${s} 0.42s;}
        .red-line{position:absolute;bottom:2px;left:0;height:4px;background:#C0392B;animation:${loaded?"underline-draw 0.9s "+s+" 0.85s both":"none"};}
        .stat-cell{transition:background 0.3s ${s};}
        .stat-cell:hover{background:rgba(255,255,255,0.05);}
        .btn-join{position:relative;overflow:hidden;transition:background 0.25s ${s},transform 0.18s ${s};}
        .btn-join:hover{background:#C0392B!important;transform:translateY(-1px);}
        .btn-join:active{transform:scale(0.97);}
        .ghost-link{display:inline-flex;align-items:center;gap:6px;transition:color 0.2s ${s},gap 0.25s ${s};}
        .ghost-link:hover{color:#0E0C09!important;gap:12px;}
        .nav-logo{transition:opacity 0.2s ease;}
        .nav-logo:hover{opacity:0.55;}
        .nav-link{transition:color 0.2s ease;}
        .nav-link:hover{color:rgba(14,12,9,0.9)!important;}
        .waitlist-input:focus{border-color:rgba(255,255,255,0.35)!important;background:rgba(255,255,255,0.09)!important;}
        .step-row{transition:all 0.35s ${s};}
        .who-row{transition:all 0.35s ${s};}
        .reveal{opacity:0;transform:translateY(20px);transition:opacity 0.7s ${s},transform 0.7s ${s};}
        .reveal.visible{opacity:1;transform:translateY(0);}
        .reveal-delay-1{transition-delay:0.1s;}
        .reveal-delay-2{transition-delay:0.2s;}
        .reveal-delay-3{transition-delay:0.3s;}
        @media(max-width:768px){
          .stats-grid{grid-template-columns:1fr 1fr!important;}
          .step-row{grid-template-columns:48px 1fr!important;gap:0 8px!important;}
          .step-desc{grid-column:2!important;}
          .waitlist-form{flex-direction:column!important;}
          .footer-inner{flex-direction:column!important;gap:12px!important;text-align:center!important;}
          .hero-section{padding:clamp(56px,8vw,100px) clamp(20px,5vw,48px)!important;}
          .process-section{padding:clamp(56px,8vw,100px) clamp(20px,5vw,48px)!important;}
          .who-section{padding:0 clamp(20px,5vw,48px) clamp(56px,8vw,100px)!important;}
          .waitlist-section{padding:clamp(56px,8vw,100px) clamp(20px,5vw,48px)!important;}
        }
        @media(max-width:480px){
          .stats-grid{grid-template-columns:1fr!important;}
          .stat-cell{border-right:none!important;border-bottom:1px solid rgba(255,255,255,0.06);}
        }
      `}</style>

      <main style={{background:"var(--paper)",color:"var(--ink)",overflowX:"hidden"}}>

        {/* NAV */}
        <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px clamp(20px,4vw,48px)",borderBottom:"1px solid rgba(14,12,9,0.08)",position:"sticky",top:0,background:"rgba(245,241,234,0.92)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",zIndex:100}}>
          <div className="nav-logo" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:600,color:"rgba(14,12,9,0.5)"}}>
            Broke Founders
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"clamp(16px,3vw,28px)"}}>
            <a href="#how" className="nav-link" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:500,color:"rgba(14,12,9,0.45)",textDecoration:"none",display:"none"}}>
              How it works
            </a>
            <a href="/login" className="nav-link" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:500,color:"rgba(14,12,9,0.45)",textDecoration:"none"}}>
              Sign in
            </a>
            <a href="#join" className="btn-join" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background:"var(--ink)",padding:"11px clamp(16px,2vw,22px)",textDecoration:"none",display:"inline-block"}}>
              Join waitlist
            </a>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero-section" style={{padding:"clamp(72px,10vw,120px) clamp(20px,5vw,48px) clamp(72px,10vw,100px)",maxWidth:"1100px"}}>
          <p className="hero-eyebrow" style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.35em",textTransform:"uppercase",color:"var(--red)",marginBottom:"32px",fontWeight:700}}>
            For builders who are almost there
          </p>
          <h1 className="hero-h1" style={{fontFamily:"var(--font-serif)",fontSize:"clamp(52px,10vw,128px)",lineHeight:0.92,letterSpacing:"-0.03em",marginBottom:"48px",fontWeight:900}}>
            Your idea<br/>
            deserves<br/>
            <em style={{fontStyle:"italic",fontWeight:400,color:"rgba(14,12,9,0.25)"}}>the right</em><br/>
            <span style={{position:"relative",display:"inline-block"}}>
              team.
              <span className="red-line" style={{width:"100%"}}></span>
            </span>
          </h1>
          <p className="hero-body" style={{fontFamily:"var(--font-sans)",fontSize:"clamp(15px,1.8vw,17px)",lineHeight:1.85,color:"rgba(14,12,9,0.62)",maxWidth:"360px",marginBottom:"48px",fontWeight:400}}>
            No salaries. No equity negotiation.<br/>
            Declare your scope. Build together.<br/>
            Split what it earns.
          </p>
          <div className="hero-actions" style={{display:"flex",alignItems:"center",gap:"clamp(20px,3vw,36px)",flexWrap:"wrap"}}>
            <a href="#join" className="btn-join" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"var(--paper)",background:"var(--ink)",padding:"14px clamp(20px,2.5vw,30px)",textDecoration:"none",display:"inline-block"}}>
              Join the waitlist
            </a>
            <a href="#how" className="ghost-link" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:500,color:"rgba(14,12,9,0.4)",textDecoration:"none"}}>
              How it works <span>→</span>
            </a>
          </div>
        </section>

        {/* STATS */}
        <div className="reveal" style={{background:"var(--ink)"}}>
          <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
            {[
              ["$0","Capital required"],
              ["Time","The only currency"],
              ["Equal","Split at graduation"],
            ].map(([val,label],i) => (
              <div key={label} className="stat-cell" style={{padding:"clamp(36px,6vw,56px) clamp(20px,4vw,48px)",borderRight:i<2?"1px solid rgba(255,255,255,0.06)":"none"}}>
                <span style={{fontFamily:"var(--font-serif)",fontSize:"clamp(32px,5vw,54px)",fontWeight:val==="Time"?400:900,fontStyle:val==="Time"?"italic":"normal",color:"#F5F1EA",display:"block",marginBottom:"10px",lineHeight:1}}>{val}</span>
                <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",fontWeight:500}}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section id="how" className="process-section" style={{padding:"clamp(72px,10vw,100px) clamp(20px,5vw,48px)",maxWidth:"880px"}}>
          <p className="reveal" style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.35em",textTransform:"uppercase",color:"var(--red)",marginBottom:"64px",fontWeight:700}}>
            The process
          </p>
          <div style={{borderTop:"1px solid rgba(14,12,9,0.08)"}}>
            {[
              ["01","Float","You have an idea and a skill. You hit a wall. You need one specific person to cross the finish line. Float a seed."],
              ["02","Define","Scope out what needs to be built. Declare what each person gets. Everyone signs before work begins. No ambiguity."],
              ["03","Build","Contributors join with their skills and free tools. Work happens on GitHub. Progress is real or it is not."],
              ["04","Ship","Product reaches real users. The seed graduates. Everyone who showed up owns their declared slice."],
            ].map(([num,title,desc],i) => (
              <div
                key={num}
                className={`reveal reveal-delay-${(i%3)+1} step-row`}
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
                style={{
                  display:"grid",
                  gridTemplateColumns:"64px 160px 1fr",
                  padding:"clamp(28px,4vw,44px) 0",
                  borderBottom:"1px solid rgba(14,12,9,0.08)",
                  alignItems:"start",
                  background:hoveredStep===i?"rgba(14,12,9,0.022)":"transparent",
                  marginLeft:hoveredStep===i?`clamp(-20px,-4vw,-48px)`:"0",
                  paddingLeft:hoveredStep===i?`clamp(20px,4vw,48px)`:"0",
                }}
              >
                <span style={{fontFamily:"var(--font-sans)",fontSize:"11px",color:hoveredStep===i?"var(--red)":"rgba(14,12,9,0.22)",letterSpacing:"0.12em",fontWeight:600,paddingTop:"4px",transition:`color 0.3s ${s},transform 0.3s ${s}`,transform:hoveredStep===i?"translateX(3px)":"translateX(0)",display:"inline-block"}}>{num}</span>
                <span style={{fontFamily:"var(--font-serif)",fontSize:"clamp(18px,2.5vw,26px)",fontWeight:700,display:"block",transition:`transform 0.35s ${s}`,transform:hoveredStep===i?"translateX(3px)":"translateX(0)"}}>{title}</span>
                <p className="step-desc" style={{fontFamily:"var(--font-sans)",fontSize:"clamp(13px,1.6vw,15px)",lineHeight:1.85,color:"rgba(14,12,9,0.62)",fontWeight:400}}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHO IT IS FOR */}
        <section className="who-section" style={{padding:"0 clamp(20px,5vw,48px) clamp(72px,10vw,100px)",maxWidth:"880px"}}>
          <p className="reveal" style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.35em",textTransform:"uppercase",color:"var(--red)",marginBottom:"64px",fontWeight:700}}>
            Who this is for
          </p>
          <div style={{borderTop:"1px solid rgba(14,12,9,0.08)"}}>
            {[
              ["The builder who is 70% there","You have started. You have skills. You hit a wall you cannot climb alone. This is built for you."],
              ["The specialist with no project","You are a designer, developer, marketer, or writer with real skills and no outlet. Join a seed that needs exactly you."],
              ["The non-technical founder","You have the idea, the research, the domain knowledge. You just need builders who believe in the same thing."],
              ["The chronically almost-shipped","Your projects are almost done and never launched. A team with skin in the game changes that. We know. We are that person."],
            ].map(([title,desc],i) => (
              <div
                key={title}
                className={`reveal reveal-delay-${(i%3)+1} who-row`}
                onMouseEnter={() => setHoveredWho(i)}
                onMouseLeave={() => setHoveredWho(null)}
                style={{
                  padding:"clamp(28px,4vw,44px) 0",
                  borderBottom:"1px solid rgba(14,12,9,0.08)",
                  background:hoveredWho===i?"rgba(14,12,9,0.022)":"transparent",
                  marginLeft:hoveredWho===i?`clamp(-20px,-4vw,-48px)`:"0",
                  paddingLeft:hoveredWho===i?`clamp(20px,4vw,48px)`:"0",
                }}
              >
                <h3 style={{fontFamily:"var(--font-serif)",fontSize:"clamp(19px,2.8vw,26px)",fontWeight:700,lineHeight:1.2,marginBottom:"12px",color:hoveredWho===i?"var(--ink)":"rgba(14,12,9,0.88)",transition:`color 0.3s ${s}`}}>{title}</h3>
                <p style={{fontFamily:"var(--font-sans)",fontSize:"clamp(13px,1.6vw,15px)",lineHeight:1.85,color:"rgba(14,12,9,0.62)",fontWeight:400,maxWidth:"560px"}}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WAITLIST */}
        <section id="join" className="waitlist-section" style={{background:"var(--ink)",padding:"clamp(72px,10vw,112px) clamp(20px,5vw,48px)"}}>
          <div style={{maxWidth:"760px"}}>
            <p className="reveal" style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.35em",textTransform:"uppercase",color:"var(--red)",marginBottom:"24px",fontWeight:700}}>
              Join the waitlist
            </p>
            <h2 className="reveal reveal-delay-1" style={{fontFamily:"var(--font-serif)",fontSize:"clamp(38px,7.5vw,88px)",fontWeight:900,color:"#F5F1EA",lineHeight:0.94,letterSpacing:"-0.025em",marginBottom:"24px"}}>
              We are building<br/>
              <em style={{fontWeight:400,color:"rgba(245,241,234,0.22)"}}>this right now.</em>
            </h2>
            <p className="reveal reveal-delay-2" style={{fontFamily:"var(--font-sans)",fontSize:"clamp(14px,1.7vw,16px)",color:"rgba(245,241,234,0.42)",lineHeight:1.85,marginBottom:"48px",maxWidth:"320px",fontWeight:400}}>
              Leave your email. We will reach out personally when your spot is ready. No newsletters. No noise.
            </p>
            {formStatus === "done" ? (
              <div style={{fontFamily:"var(--font-serif)",fontSize:"clamp(20px,3vw,28px)",color:"#F5F1EA",fontWeight:700}}>
                You are on the list. <em style={{fontWeight:400,color:"rgba(245,241,234,0.35)"}}>Check your inbox.</em>
              </div>
            ) : (
              <form className="reveal reveal-delay-3 waitlist-form" style={{display:"flex",gap:"8px",maxWidth:"480px"}} onSubmit={handleSubmit}>
                <input
                  className="waitlist-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#F5F1EA",fontFamily:"var(--font-sans)",fontSize:"14px",padding:"14px 18px",outline:"none",transition:"border-color 0.2s ease,background 0.2s ease",minWidth:0}}
                />
                <button
                  type="submit"
                  className="btn-join"
                  disabled={formStatus==="loading"}
                  style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,color:"#F5F1EA",background:"var(--ink)",border:"1px solid rgba(255,255,255,0.15)",padding:"14px clamp(16px,2vw,22px)",cursor:"pointer",whiteSpace:"nowrap",opacity:formStatus==="loading"?0.6:1}}
                >
                  {formStatus==="loading" ? "Sending..." : formStatus==="error" ? "Try again" : "Get early access"}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{padding:"clamp(20px,3vw,28px) clamp(20px,4vw,48px)",borderTop:"1px solid rgba(14,12,9,0.08)"}}>
          <div className="footer-inner" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"16px"}}>
            <span style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(14,12,9,0.4)",fontWeight:600}}>Broke Founders</span>
            <span style={{fontFamily:"var(--font-sans)",fontSize:"12px",color:"rgba(14,12,9,0.4)",fontWeight:400}}>Broke builders. Real products. Shared upside.</span>
            <a href="/login" style={{fontFamily:"var(--font-sans)",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(14,12,9,0.35)",textDecoration:"none",fontWeight:600,transition:"color 0.2s ease"}}
              onMouseEnter={e=>(e.currentTarget.style.color="rgba(14,12,9,0.8)")}
              onMouseLeave={e=>(e.currentTarget.style.color="rgba(14,12,9,0.35)")}>
              Sign in →
            </a>
            <a href="/worth-building" className="nav-link" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:500,color:"rgba(14,12,9,0.45)",textDecoration:"none"}}>
            Worth building
            </a>
          </div>
        </footer>

      </main>
    </>
  )
}