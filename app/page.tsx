"use client"

import { useEffect, useRef, useState } from "react"

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const [hoveredWho, setHoveredWho] = useState<number | null>(null)
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @keyframes underline-draw {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .hero-eyebrow {
          opacity: ${loaded ? 1 : 0};
          transform: translateY(${loaded ? 0 : 12}px);
          transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s;
        }
        .hero-h1 {
          opacity: ${loaded ? 1 : 0};
          transform: translateY(${loaded ? 0 : 20}px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s;
        }
        .hero-body {
          opacity: ${loaded ? 1 : 0};
          transform: translateY(${loaded ? 0 : 16}px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s;
        }
        .hero-actions {
          opacity: ${loaded ? 1 : 0};
          transform: translateY(${loaded ? 0 : 12}px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s;
        }
        .red-line {
          position: absolute;
          bottom: 4px; left: 0;
          height: 4px;
          background: #C0392B;
          animation: ${loaded ? "underline-draw 0.8s cubic-bezier(0.16,1,0.3,1) 0.9s both" : "none"};
        }
        .step-row {
          transition: background 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .step-num {
          transition: color 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .step-title {
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .who-row {
          transition: background 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .who-title {
          transition: color 0.3s ease;
        }
        .btn-main {
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .btn-main:hover {
          background: #C0392B !important;
          transform: translateY(-1px);
        }
        .btn-main:active {
          transform: translateY(0px);
        }
        .btn-ghost-link {
          transition: color 0.2s ease, gap 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .btn-ghost-link:hover {
          color: #0E0C09 !important;
          gap: 10px;
        }
        .stat-cell {
          transition: background 0.3s ease;
        }
        .stat-cell:hover {
          background: rgba(255,255,255,0.04);
        }
        .nav-logo {
          transition: opacity 0.2s ease;
        }
        .nav-logo:hover { opacity: 0.6; }
        input:focus {
          border-color: rgba(255,255,255,0.3) !important;
          background: rgba(255,255,255,0.08) !important;
        }
        ::selection {
          background: #C0392B;
          color: #F5F1EA;
        }
      `}</style>

      <main style={{background:"var(--paper)",color:"var(--ink)",overflowX:"hidden"}}>

        {/* NAV */}
        <nav style={{
          display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"22px 48px",
          borderBottom:"1px solid var(--faint)",
          position:"sticky",top:0,
          background:"rgba(245,241,234,0.85)",
          backdropFilter:"blur(12px)",
          zIndex:100,
        }}>
          <div className="nav-logo" style={{fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:600,color:"var(--muted)"}}>
            Broke Founders
          </div>
          <a href="#join" className="btn-main" style={{
            fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",
            textTransform:"uppercase",fontWeight:600,
            color:"var(--paper)",background:"var(--ink)",
            padding:"12px 24px",textDecoration:"none",display:"inline-block",
          }}>
            Join the waitlist
          </a>
        </nav>

        {/* HERO */}
        <section style={{padding:"110px 48px 100px",maxWidth:"1100px"}}>
          <p className="hero-eyebrow" style={{
            fontFamily:"var(--font-sans)",fontSize:"10px",
            letterSpacing:"0.32em",textTransform:"uppercase",
            color:"#C0392B",marginBottom:"36px",fontWeight:600,
          }}>
            For builders who are almost there
          </p>
          <h1 className="hero-h1" style={{
            fontFamily:"var(--font-serif)",
            fontSize:"clamp(60px,11vw,130px)",
            lineHeight:0.93,
            letterSpacing:"-0.03em",
            marginBottom:"52px",
            fontWeight:900,
          }}>
            Your idea<br/>
            deserves<br/>
            <em style={{fontStyle:"italic",fontWeight:400,color:"rgba(14,12,9,0.3)"}}>the right</em><br/>
            <span style={{position:"relative",display:"inline-block"}}>
              team.
              <span className="red-line" style={{width:"100%"}}></span>
            </span>
          </h1>
          <p className="hero-body" style={{
            fontFamily:"var(--font-sans)",fontSize:"16px",lineHeight:1.85,
            color:"rgba(14,12,9,0.55)",maxWidth:"380px",
            marginBottom:"52px",fontWeight:400,
          }}>
            No salaries. No equity negotiation.<br/>
            Declare your scope. Build together.<br/>
            Split what it earns.
          </p>
          <div className="hero-actions" style={{display:"flex",alignItems:"center",gap:"36px"}}>
            <a href="#join" className="btn-main" style={{
              fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",
              textTransform:"uppercase",fontWeight:600,
              color:"var(--paper)",background:"var(--ink)",
              padding:"14px 28px",textDecoration:"none",display:"inline-block",
            }}>
              Join the waitlist
            </a>
            <a href="#how" className="btn-ghost-link" style={{
              fontFamily:"var(--font-sans)",fontSize:"11px",letterSpacing:"0.15em",
              textTransform:"uppercase",fontWeight:500,
              color:"rgba(14,12,9,0.4)",textDecoration:"none",
            }}>
              How it works <span>→</span>
            </a>
          </div>
        </section>

        {/* DARK STATS STRIP */}
        <section className="reveal" style={{background:"#0E0C09",display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
          {[
            ["$0","Capital required"],
            ["Time","The only currency"],
            ["Equal","Split at graduation"],
          ].map(([val,label],i) => (
            <div key={label} className="stat-cell" style={{
              padding:"52px 48px",
              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <span style={{
                fontFamily:"var(--font-serif)",
                fontSize:"54px",fontWeight: i===1 ? 400 : 900,
                fontStyle: i===1 ? "italic" : "normal",
                color:"#F5F1EA",display:"block",marginBottom:"12px",
                lineHeight:1,
              }}>{val}</span>
              <span style={{
                fontFamily:"var(--font-sans)",fontSize:"10px",
                letterSpacing:"0.22em",textTransform:"uppercase",
                color:"rgba(255,255,255,0.3)",fontWeight:500,
              }}>{label}</span>
            </div>
          ))}
        </section>

        {/* HOW IT WORKS */}
        <section id="how" style={{padding:"100px 48px",maxWidth:"880px"}}>
          <p className="reveal" style={{
            fontFamily:"var(--font-sans)",fontSize:"10px",
            letterSpacing:"0.32em",textTransform:"uppercase",
            color:"#C0392B",marginBottom:"72px",fontWeight:600,
          }}>
            The process
          </p>
          <div style={{borderTop:"1px solid var(--faint)"}}>
            {[
              ["01","Float","You have an idea and a skill. You hit a wall. You need one specific person to cross the finish line. Float a seed."],
              ["02","Define","Scope out what needs to be built. Declare what each person gets. Everyone signs before work begins. No ambiguity."],
              ["03","Build","Contributors join with their skills and free tools. Work happens on GitHub. Progress is real or it is not."],
              ["04","Ship","Product reaches real users. The seed graduates. Everyone who showed up owns their declared slice."],
            ].map(([num,title,desc],i) => (
              <div
                key={num}
                className={`reveal reveal-delay-${i % 3 + 1} step-row`}
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
                style={{
                  display:"grid",
                  gridTemplateColumns:"72px 180px 1fr",
                  gap:"0",
                  padding:"44px 0",
                  borderBottom:"1px solid var(--faint)",
                  alignItems:"start",
                  background: hoveredStep === i ? "rgba(14,12,9,0.025)" : "transparent",
                  marginLeft: hoveredStep === i ? "-48px" : "0",
                  paddingLeft: hoveredStep === i ? "48px" : "0",
                  transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <span className="step-num" style={{
                  fontFamily:"var(--font-sans)",fontSize:"11px",
                  color: hoveredStep === i ? "#C0392B" : "rgba(14,12,9,0.25)",
                  letterSpacing:"0.1em",fontWeight:600,paddingTop:"6px",
                  transform: hoveredStep === i ? "translateX(4px)" : "translateX(0)",
                }}>{num}</span>
                <span className="step-title" style={{
                  fontFamily:"var(--font-serif)",fontSize:"26px",fontWeight:700,
                  display:"block",paddingTop:"2px",
                  transform: hoveredStep === i ? "translateX(4px)" : "translateX(0)",
                  transition:"transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                }}>{title}</span>
                <p style={{
                  fontFamily:"var(--font-sans)",fontSize:"15px",
                  lineHeight:1.85,color:"rgba(14,12,9,0.55)",fontWeight:400,
                }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHO IT IS FOR */}
        <section style={{padding:"0 48px 100px",maxWidth:"880px"}}>
          <p className="reveal" style={{
            fontFamily:"var(--font-sans)",fontSize:"10px",
            letterSpacing:"0.32em",textTransform:"uppercase",
            color:"#C0392B",marginBottom:"72px",fontWeight:600,
          }}>
            Who this is for
          </p>
          <div style={{borderTop:"1px solid var(--faint)"}}>
            {[
              ["The builder who is 70% there","You have started. You have skills. You hit a wall you cannot climb alone. This is built for you."],
              ["The specialist with no project","You are a designer, developer, marketer, or writer with real skills and no outlet. Join a seed that needs exactly you."],
              ["The non-technical founder","You have the idea, the research, the domain knowledge. You just need builders who believe in the same thing."],
              ["The chronically almost-shipped","Your projects are almost done and never launched. A team with skin in the game changes that. We know. We are that person."],
            ].map(([title,desc],i) => (
              <div
                key={title}
                className={`reveal reveal-delay-${i % 3 + 1} who-row`}
                onMouseEnter={() => setHoveredWho(i)}
                onMouseLeave={() => setHoveredWho(null)}
                style={{
                  padding:"44px 0",
                  borderBottom:"1px solid var(--faint)",
                  transition:"background 0.3s cubic-bezier(0.16,1,0.3,1)",
                  background: hoveredWho === i ? "rgba(14,12,9,0.025)" : "transparent",
                  marginLeft: hoveredWho === i ? "-48px" : "0",
                  paddingLeft: hoveredWho === i ? "48px" : "0",
                }}
              >
                <h3 className="who-title" style={{
                  fontFamily:"var(--font-serif)",fontSize:"26px",fontWeight:700,
                  lineHeight:1.2,marginBottom:"14px",
                  color: hoveredWho === i ? "#0E0C09" : "rgba(14,12,9,0.85)",
                  transition:"color 0.3s ease",
                }}>{title}</h3>
                <p style={{
                  fontFamily:"var(--font-sans)",fontSize:"15px",
                  lineHeight:1.85,color:"rgba(14,12,9,0.55)",
                  fontWeight:400,maxWidth:"560px",
                }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WAITLIST */}
        <section id="join" style={{background:"#0E0C09",padding:"110px 48px"}}>
          <div style={{maxWidth:"880px",margin:"0 auto"}}>
            <p className="reveal" style={{
              fontFamily:"var(--font-sans)",fontSize:"10px",
              letterSpacing:"0.32em",textTransform:"uppercase",
              color:"#C0392B",marginBottom:"28px",fontWeight:600,
            }}>
              Join the waitlist
            </p>
            <h2 className="reveal reveal-delay-1" style={{
              fontFamily:"var(--font-serif)",
              fontSize:"clamp(44px,8vw,88px)",
              fontWeight:900,color:"#F5F1EA",
              lineHeight:0.95,letterSpacing:"-0.025em",
              marginBottom:"28px",
            }}>
              We are building<br/>
              <em style={{fontWeight:400,color:"rgba(245,241,234,0.28)"}}>this right now.</em>
            </h2>
            <p className="reveal reveal-delay-2" style={{
              fontFamily:"var(--font-sans)",fontSize:"15px",
              color:"rgba(245,241,234,0.4)",lineHeight:1.85,
              marginBottom:"52px",maxWidth:"340px",fontWeight:400,
            }}>
              Leave your email. We will reach out personally when your spot is ready. No newsletters. No noise.
            </p>
            <form
              className="reveal reveal-delay-3"
              style={{display:"flex",gap:"8px",maxWidth:"480px"}}
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const email = (form.elements.namedItem("email") as HTMLInputElement).value
                const btn = form.querySelector("button") as HTMLButtonElement
                btn.textContent = "Sending..."
                btn.disabled = true
                btn.style.opacity = "0.7"
                const res = await fetch("/api/waitlist",{
                  method:"POST",
                  headers:{"Content-Type":"application/json"},
                  body:JSON.stringify({email})
                })
                if(res.ok){
                  btn.textContent = "You are in ✓"
                  btn.style.background = "#C0392B"
                  btn.style.opacity = "1"
                  form.reset()
                } else {
                  btn.textContent = "Try again"
                  btn.style.opacity = "1"
                  btn.disabled = false
                }
              }}
            >
              <input
                name="email"
                type="email"
                placeholder="your@email.com"
                style={{
                  flex:1,
                  background:"rgba(255,255,255,0.06)",
                  border:"1px solid rgba(255,255,255,0.1)",
                  color:"#F5F1EA",
                  fontFamily:"var(--font-sans)",fontSize:"14px",
                  padding:"15px 18px",outline:"none",
                  transition:"border-color 0.2s ease, background 0.2s ease",
                }}
              />
              <button
                type="submit"
                className="btn-main"
                style={{
                  fontFamily:"var(--font-sans)",fontSize:"11px",
                  letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,
                  color:"#F5F1EA",background:"#0E0C09",
                  border:"1px solid rgba(255,255,255,0.15)",
                  padding:"15px 24px",cursor:"pointer",
                  whiteSpace:"nowrap",
                  transition:"background 0.3s ease, transform 0.2s ease",
                }}
              >
                Get early access
              </button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{
          padding:"28px 48px",
          display:"flex",alignItems:"center",justifyContent:"space-between",
          borderTop:"1px solid var(--faint)",
        }}>
          <span style={{
            fontFamily:"var(--font-sans)",fontSize:"10px",
            letterSpacing:"0.22em",textTransform:"uppercase",
            color:"rgba(14,12,9,0.35)",fontWeight:600,
          }}>
            Broke Founders
          </span>
          <span style={{
            fontFamily:"var(--font-sans)",fontSize:"11px",
            color:"rgba(14,12,9,0.35)",fontWeight:400,
          }}>
            Broke builders. Real products. Shared upside.
          </span>
        </footer>

      </main>
    </>
  )
}